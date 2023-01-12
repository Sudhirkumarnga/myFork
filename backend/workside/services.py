import base64
import datetime
import calendar
from datetime import date
from django.forms import model_to_dict
from django.core.files.base import ContentFile
from dateutil.relativedelta import relativedelta
from push_notification.services import create_notification
from workside import models
from workside.tasks import event_publishing_reminder_task, event_start_notification_task
from business.models import (
    Business, Employee, Attendance
)

def convert_file_from_bse64_to_blob(file):
    data = ContentFile(base64.b64decode(file), name='file.jpg')
    return data


def create_worksite(user, data):
    worksite = models.WorkSite.objects.create(
        **data['worksite_information'],
        **data['contact_person'],
        show_dtails=data['show_dtails'],
        business=Business.objects.get(user=user),
    )
    if data.__contains__("logo") and data['logo'] is not None:
        worksite.logo = convert_file_from_bse64_to_blob(data['logo'])

    if data.__contains__("instruction_video") and data['instruction_video'] is not None:
        worksite.instruction_video = convert_file_from_bse64_to_blob(data['instruction_video'])

    worksite.save()
    return worksite


def update_worksite(user, data, instance):
    worksite = models.WorkSite.objects.filter(id=instance.id)
    worksite.update(
        **data['worksite_information'],
        **data['contact_person'],
        business=Business.objects.get(user=user)
    )
    worksite = models.WorkSite.objects.get(id=instance.id)
    if data.__contains__("show_dtails"):
        worksite.show_dtails = data['show_dtails']
    if data.__contains__("logo") and data['logo'] is not None:
        worksite.logo = convert_file_from_bse64_to_blob(data['logo'])
    if data.__contains__("instruction_video") and data['instruction_video'] is not None:
        worksite.instruction_video = convert_file_from_bse64_to_blob(data['instruction_video'])
    if data.__contains__("logo") and data['logo'] is None:
        worksite.logo = data['logo']
    if data.__contains__("instruction_video") and data['instruction_video'] is None:
        worksite.instruction_video = data['instruction_video']

    worksite.save()


def create_task(validated_data):
    task = models.Task.objects.create(
        worksite=validated_data['worksite'],
        name=validated_data['name'],
        description=validated_data['description'],
        notes=validated_data['notes'],
        criticality=validated_data['criticality'],
        frequency_of_task=validated_data['frequency_of_task']
    )
    for key, val in validated_data['files'].items():
        models.TaskAttachments.objects.create(task=task, file=convert_file_from_bse64_to_blob(val))
    return task


def create_task_attachment(validated_data, request):
    task_attachment = models.TaskAttachments.objects.create(
        task=validated_data['task'],
        file=convert_file_from_bse64_to_blob(request.data['file'])
    )
    return task_attachment


def update_serializer_data(serializer_data):
    for data in serializer_data:
        try:
            data['file'] = models.TaskAttachments.objects.get(id=data['id']).file.url
        except Exception:
            data['file'] = None
    return serializer_data


def calculate_reminder_date(event_id, publishing_reminder, start_time):
    if publishing_reminder == "ONE_DAY":
        reminder_date = start_time - datetime.timedelta(days=1)
        event_publishing_reminder_task.apply_async((event_id, reminder_date), eta=reminder_date)
    if publishing_reminder == "TWO_DAYS":
        reminder_date = start_time - datetime.timedelta(days=2)
    if publishing_reminder == "ONE_WEEK":
        reminder_date = start_time - datetime.timedelta(days=7)
    if publishing_reminder == "TWO_WEEKS":
        reminder_date = start_time - datetime.timedelta(days=14)
    if publishing_reminder == "ONE_MONTH":
        reminder_date = start_time - datetime.timedelta(days=30)
    return reminder_date


def get_filtered_queryset(request, queryset):
    month = request.query_params.get('month', None)
    year = request.query_params.get('year', None)
    week_view = request.query_params.get('week_view', None)
    day_view = request.query_params.get('day_view', None)
    month_view = request.query_params.get('month_view', None)

    if month:
        queryset = queryset.filter(start_time__month=month)

    if year:
        queryset = queryset.filter(start_time__year=year)

    if week_view:
        week_day = datetime.datetime.now().isocalendar()[2]
        start_date = datetime.datetime.now() - datetime.timedelta(days=week_day)
        dates = [str((start_date + datetime.timedelta(days=i)).date()) for i in range(7)]
        queryset = queryset.filter(start_time__range=[dates[0], dates[-1]])

    if day_view:
        today_date = datetime.datetime.now()
        queryset = queryset.filter(start_time__date=today_date)

    if month_view:
        month = datetime.datetime.now().month
        year = datetime.datetime.now().year
        number_of_days = calendar.monthrange(year, month)[1]
        first_date = date(year, month, 1)
        last_date = date(year, month, number_of_days)
        queryset = queryset.filter(start_time__range=[first_date, last_date])

    return queryset


def send_notification_to_employees(employees):
    for employee in employees:
        create_notification({
            "name": "Event Assigned",
            "description": "You have Assigned new Event",
            "user": employee.user
        }
        )


def send_event_reminder_to_employees(start_time, employees, worksite_id):
    event_start_notification_task.apply_async((start_time, employees, worksite_id), eta=start_time)


def send_notify_to_employees(employees, worksite):
    employees = Employee.objects.filter(id__in=employees)
    for employee in employees:
        create_notification({
            "name": "Event Update",
            "description": f'{worksite.name} event is update plz Check it out',
            "user": employee.user
        }
        )

def get_total_hours(request):
    all_attendance = Attendance.objects.filter(employee__user=request.user, status="CLOCK_OUT")
    attendance_hours = 0
    if all_attendance.exists():
        for attendance in all_attendance:
            attendance_hours += attendance.total_hours
    return attendance_hours

def create_events_according_to_frequency(event, employees, selected_tasks):
    try:
        from workside.models import Event
        start_dates = get_dates(event.start_time.date(),event.frequency_end_date, event.frequency)
        end_dates = get_dates(event.end_time.date(),event.frequency_end_date, event.frequency)
        for start_date, end_date in zip(start_dates, end_dates):
            new_event = Event.objects.create(
                parent=event,
                start_time=event.start_time.replace(year=start_date.year, month=start_date.month, day=start_date.day),
                end_time=event.end_time.replace(year=end_date.year, month=end_date.month, day=end_date.day),
                worksite=event.worksite,
                frequency=event.frequency,
                description=event.description,
                notes=event.notes,
                reminder=event.reminder,
                schedule_inspection=event.schedule_inspection,
                event_status=event.event_status,
                publishing_reminder=event.publishing_reminder,
                reminder_date=event.reminder_date,
                notify=event.notify,
                color=event.color
            )
            new_event.employees.set(employees)
            new_event.selected_tasks.set(selected_tasks)
    except Exception as e:
        print(e)


def get_dates(start_date, end_date, frequency):
    dates = []
    if frequency == "DAILY":
        while start_date < end_date:
            start_date += datetime.timedelta(days=1)
            dates.append(start_date)    
    elif frequency == "WEEKLY":
        while start_date < end_date:
            start_date += datetime.timedelta(weeks=1)
            if not start_date.year > end_date.year:
                dates.append(start_date)
    elif frequency == "MONTHLY":
        while start_date.month < end_date.month:
            start_date += relativedelta(months=1)
            dates.append(start_date)
    elif frequency == "YEARLY":
        while start_date.year < end_date.year:
            start_date += relativedelta(years=1)
            dates.append(start_date)
    
    return dates
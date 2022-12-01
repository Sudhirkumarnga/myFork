import base64
import datetime
import calendar
from datetime import date
from django.core.files.base import ContentFile

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

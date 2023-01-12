from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from workside.models import *
from workside.services import (
    create_worksite,
    update_worksite,
    create_task,
    create_task_attachment,
    send_event_reminder_to_employees,
    send_notify_to_employees,
    send_notification_to_employees
)
from business.models import Attendance
from django.utils.translation import ugettext_lazy as _
from django.db.models import Q


class TaskSerializerforWorksite(ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'name')


class WorksitePersonalInformationSerializer(ModelSerializer):
    class Meta:
        model = WorkSite
        exclude = (
            'contact_person_name', 'contact_phone_number',
            'id', 'business', 'show_dtails', 'logo',
            'instruction_video', 'is_active'
        )


class WorkSiteContactPersonSerializer(ModelSerializer):
    class Meta:
        model = WorkSite
        fields = ('contact_person_name', 'contact_phone_number')


class WorksiteSerializer(ModelSerializer):
    personal_information = serializers.SerializerMethodField()
    contact_person = serializers.SerializerMethodField()
    tasks = serializers.SerializerMethodField()

    class Meta:
        model = WorkSite
        fields = (
            'id', 'business', 'personal_information', 'contact_person', 'is_active', 'show_dtails', 'tasks', 'location',
            'longitude', 'latitude')

    def to_representation(self, data):
        data = super(WorksiteSerializer, self).to_representation(data)
        worksite = WorkSite.objects.get(id=data['id'])
        data['logo'] = worksite.logo.url if worksite.logo else None
        data['instruction_video'] = worksite.instruction_video.url if worksite.instruction_video else None
        return data

    @staticmethod
    def get_personal_information(obj):
        return WorksitePersonalInformationSerializer(
            obj,
            many=False
        ).data

    @staticmethod
    def get_contact_person(obj):
        return WorkSiteContactPersonSerializer(
            obj,
            many=False
        ).data

    @staticmethod
    def get_tasks(obj):
        return TaskSerializerforWorksite(
            Task.objects.filter(worksite=obj),
            many=True
        ).data

    def create(self, validated_data):
        request = self.context['request']
        worksite = create_worksite(request.user, request.data)
        return worksite

    def update(self, instance, validated_data):
        request = self.context['request']
        worksite = update_worksite(request.user, request.data, instance)
        return WorkSite.objects.get(id=instance.id)


class TaskSerializer(ModelSerializer):
    files = serializers.DictField(child=serializers.CharField(allow_null=True), write_only=True, required=False)
    task_media = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Task
        fields = (
            'id', 'worksite', 'name', 'description', 'notes', 'criticality', 'frequency_of_task', 'files', 'task_media')

    @staticmethod
    def get_task_media(obj):
        return TaskAttachmentSerializer(
            TaskAttachments.objects.filter(task=obj),
            many=True
        ).data

    def create(self, validated_data):
        task = create_task(validated_data)
        return task


class FrequencyTaskSerializer(ModelSerializer):
    every_time = serializers.SerializerMethodField()
    weekly = serializers.SerializerMethodField()
    semi_weekly = serializers.SerializerMethodField()
    monthly = serializers.SerializerMethodField()
    quarterly = serializers.SerializerMethodField()
    semi_annually = serializers.SerializerMethodField()
    custom = serializers.SerializerMethodField()

    class Meta:
        model = Business
        fields = ("every_time", "weekly", "semi_weekly", "monthly", "quarterly", "semi_annually", "custom")

    @staticmethod
    def get_every_time(obj):
        return TaskSerializer(
            Task.objects.filter(worksite__business=obj, frequency_of_task="EVERY_TIME"),
            many=True
        ).data

    @staticmethod
    def get_weekly(obj):
        return TaskSerializer(
            Task.objects.filter(worksite__business=obj, frequency_of_task="WEEKLY"),
            many=True
        ).data

    @staticmethod
    def get_semi_weekly(obj):
        return TaskSerializer(
            Task.objects.filter(worksite__business=obj, frequency_of_task="SEMI_WEEKLY"),
            many=True
        ).data

    @staticmethod
    def get_monthly(obj):
        return TaskSerializer(
            Task.objects.filter(worksite__business=obj, frequency_of_task="MONTHLY"),
            many=True
        ).data

    @staticmethod
    def get_quarterly(obj):
        return TaskSerializer(
            Task.objects.filter(worksite__business=obj, frequency_of_task="QUARTERLY"),
            many=True
        ).data

    @staticmethod
    def get_semi_annually(obj):
        return TaskSerializer(
            Task.objects.filter(worksite__business=obj, frequency_of_task="SEMI_ANNUALLY"),
            many=True
        ).data

    @staticmethod
    def get_custom(obj):
        return TaskSerializer(
            Task.objects.filter(worksite__business=obj, frequency_of_task="CUSTOM"),
            many=True
        ).data


class TaskAttachmentSerializer(ModelSerializer):
    class Meta:
        model = TaskAttachments
        fields = ('id', 'task', 'file')

    def create(self, validated_data):
        request = self.context['request']
        task_attachment = create_task_attachment(validated_data, request)
        return task_attachment


class EventSerializer(ModelSerializer):
    tasks = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = (
            "id", "worksite", "start_time", "end_time",
            "frequency", "description", "notes", "reminder",
            "schedule_inspection", "event_status", "employees", "frequency_end_date",
            "publishing_reminder", "tasks", "selected_tasks", "notify"
        )

    def validate(self, data):
        request = self.context['request']
        if self.instance:
            event = Event.objects.filter(
                ~Q(id=self.instance.id),
                start_time__lte=data['start_time'],
                end_time__gte=data['end_time'],
                worksite=data['worksite']
                # worksite__business__user=request.user
            )
        else:
            event = Event.objects.filter(
                start_time__lte=data['start_time'],
                end_time__gte=data['end_time'],
                worksite=data['worksite']
                # worksite__business__user=request.user
            )
        if event.exists():
            raise serializers.ValidationError(
                {"start time & end time": _(
                    "Event is already created between these time range for this worksite."
                )
                }
            )

        return data

    @staticmethod
    def get_tasks(obj):
        return FrequencyTaskSerializer(
            obj.worksite.business,
            many=False
        ).data

    def create(self, validated_data):
        employees = validated_data['employees']
        selected_tasks = validated_data['selected_tasks']
        del validated_data['employees']
        del validated_data['selected_tasks']
        event = Event.objects.create(**validated_data)
        event.parent = event
        event.save()
        event.employees.set(
            employees
        )
        event.selected_tasks.set(
            selected_tasks
        )
        if event.notify:
            send_notify_to_employees(
                [employee.id for employee in event.employees.all()],
                event.worksite
            )
        if event.event_status == "PUBLISHED":
            send_event_reminder_to_employees(
                event.start_time,
                [employee.id for employee in event.employees.all()],
                event.worksite.id
            )
            create_events_according_to_frequency(
                event, 
                employees, 
                selected_tasks
            )
        return event

    def update(self, instance, validated_data):
        if validated_data.__contains__('employees'):
            Event.objects.get(id=instance.id).employees.set(
                validated_data['employees']
            )
            del validated_data['employees']

        if validated_data.__contains__('selected_tasks'):
            Event.objects.get(id=instance.id).selected_tasks.set(
                validated_data['selected_tasks']
            )
            del validated_data['selected_tasks']

        if validated_data.__contains__('notify'):
            if validated_data['notify']:
                send_notify_to_employees(
                    [employee.id for employee in Event.objects.get(id=instance.id).employees.all()],
                    Event.objects.get(id=instance.id).worksite
                )

        if validated_data.__contains__('event_status'):
            if validated_data['event_status'] == "PUBLISHED":
                send_event_reminder_to_employees(
                    Event.objects.get(id=instance.id).start_time,
                    [employee.id for employee in Event.objects.get(id=instance.id).employees.all()],
                    Event.objects.get(id=instance.id).worksite.id
                )

        Event.objects.filter(id=instance.id).update(
            **validated_data
        )
        return Event.objects.get(id=instance.id)


class SchedularSerializer(ModelSerializer):
    worksite_name = serializers.CharField(read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'worksite_name', 'employees', 'selected_tasks', 'start_time', 'end_time', 'event_status', 'color')
        depth = 2

    def to_representation(self, data):
        data = super(SchedularSerializer, self).to_representation(data)
        event = Event.objects.get(id=data['id'])
        data['worksite_name'] = event.worksite.name if event.worksite.name else None
        data['logo'] = event.worksite.business.profile_image.url if event.worksite.business.profile_image else None
        data['color'] = "#{}".format(data['color'])
        return data


class WorksiteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id',)

    def to_representation(self, data):
        data = super(WorksiteListSerializer, self).to_representation(data)
        event = Event.objects.get(id=data['id'])
        data['worksite_name'] = event.worksite.name if event.worksite.name else None
        data['location'] = event.worksite.location if event.worksite.location else None
        data['logo'] = event.worksite.business.profile_image.url if event.worksite.business.profile_image else None
        return data


class EventAssignedEmployeeSerializer(serializers.ModelSerializer):
    employee = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ('employee',)

    @staticmethod
    def get_employee(obj):
        return EmployeeSerializer(
            obj.employees.all(),
            many=True
        ).data


class AttendanceWorksiteSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()

    # assigned_employee = serializers.SerializerMethodField()

    class Meta:
        model = WorkSite
        fields = ('id', 'name', 'location', 'notes', 'instruction_video', 'tasks')

    @staticmethod
    def get_tasks(obj):
        return TaskSerializerforWorksite(
            Task.objects.filter(worksite=obj),
            many=True
        ).data

    # @staticmethod
    # def get_assigned_employee(obj):
    #     queryset = Event.objects.filter(worksite=obj).first()
    #     return EventAssignedEmployeeSerializer(
    #         queryset,
    #         many=False
    #     ).data['employee']


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'profile_image', 'mobile')

    def to_representation(self, data):
        data = super(EmployeeSerializer, self).to_representation(data)
        data['name'] = Employee.objects.get(id=data['id']).user.get_full_name()
        return data


class AttendanceActiveEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ('employee',)

    def to_representation(self, data):
        data = super(AttendanceActiveEmployeeSerializer, self).to_representation(data)
        employees = []
        attendances = Attendance.objects.filter(event__employees__in=[data['employee']], status='CLOCK_IN')
        if attendances.exists():
            employees.append(EmployeeSerializer(attendances.last().employee).data)
        data['employee'] = employees
        return data


class AttendanceEventSerializer(serializers.ModelSerializer):
    worksite = serializers.SerializerMethodField()
    # active_employees = serializers.SerializerMethodField()
    # total_hours = serializers.SerializerMethodField()
    assigned_employees = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ('id', 'worksite', 'assigned_employees')

    def to_representation(self, data):
        request = self.context['request']
        data = super(AttendanceEventSerializer, self).to_representation(data)
        attendance = Attendance.objects.filter(employee__user=request.user, event__id=data['id'])
        worksite = WorkSite.objects.filter(id=data['worksite']['id'])
        data['schedule_shift_start_time'] = self.instance.start_time
        data['schedule_shift_end_time'] = self.instance.end_time
        data['logo'] = worksite.first().logo.url if worksite.first().logo else None
        if attendance.exists():
            if attendance.first().status == 'CLOCK_IN':
                data['status'] = "CLOCK_OUT"
                data['clock_in_time'] = attendance.first().clock_in_time
            else:
                data['status'] = "CLOCK_IN"
        else:
            data['status'] = "CLOCK_IN"
        return data

    @staticmethod
    def get_worksite(obj):
        try:
            return AttendanceWorksiteSerializer(
                obj.worksite,
                many=False
            ).data
        except Exception as e:
            print(e)

    @staticmethod
    def get_assigned_employees(obj):
        return EmployeeSerializer(
            obj.employees.all(),
            many=True
        ).data

    # def get_active_employees(self, obj):
    #     request = self.context['request']
    #     employees = Employee.objects.filter(business__user=request.user, is_owner=False)
    #     data = EmployeeSerializer(
    #         employees,
    #         many=True
    #     ).data
    #     return data

    # attendance = Attendance.objects.filter(event=obj)
    # if attendance.exists():
    #     employees = AttendanceActiveEmployeeSerializer(
    #         attendance.first(),
    #         many=False
    #     ).data['employee']
    #     for employee in employees:
    #         employee['worksite'] = obj.worksite.name
    #     return employees
    # else:
    #     return []

    # def get_total_hours(self, obj):
    #     request = self.context['request']
    #     all_attendance = Attendance.objects.filter(employee__user=request.user, status="CLOCK_OUT")
    #     attendance_hours = 0
    #     if all_attendance.exists():
    #         for attendance in all_attendance:
    #             attendance_hours += attendance.total_hours
    #     return attendance_hours

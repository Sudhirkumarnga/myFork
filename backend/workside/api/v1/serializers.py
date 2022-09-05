from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from workside.models import *
from workside.services import (
    create_worksite,
    update_worksite,
    create_task,
    create_task_attachment
)
from business.models import Attendance
from django.utils.translation import ugettext_lazy as _


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
        fields = ('id', 'business', 'personal_information', 'contact_person', 'is_active', 'show_dtails', 'tasks')

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
        fields = ('id', 'task')

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
            "schedule_inspection", "event_status", "employees",
            "publishing_reminder", "tasks", "selected_tasks"
        )

    def validate(self, data):
        request = self.context['request']
        event = Event.objects.filter(
            start_time__lte= data['start_time'],
            end_time__gte= data['end_time'],
            worksite__business__user=request.user
        )
        if event.exists():
            raise serializers.ValidationError(_("Event is already created between these time range."))
        return data

    @staticmethod
    def get_tasks(obj):
        return FrequencyTaskSerializer(
            obj.worksite.business,
            many=False
        ).data


class SchedularSerializer(ModelSerializer):
    worksite_name = serializers.CharField(read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'worksite_name', 'start_time', 'end_time')

    def to_representation(self, data):
        data = super(SchedularSerializer, self).to_representation(data)
        data['worksite_name'] = Event.objects.get(id=data['id']).worksite.name
        data['logo'] = Event.objects.get(id=data['id']).worksite.business.profile_image.url
        return data


class WorksiteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id',)

    def to_representation(self, data):
        data = super(WorksiteListSerializer, self).to_representation(data)
        data['worksite_name'] = Event.objects.get(id=data['id']).worksite.name
        data['location'] = Event.objects.get(id=data['id']).worksite.location
        data['logo'] = Event.objects.get(id=data['id']).worksite.business.profile_image.url
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
    assigned_employee = serializers.SerializerMethodField()

    class Meta:
        model = WorkSite
        fields = ('id', 'name', 'location', 'notes', 'instruction_video', 'tasks', 'assigned_employee')

    @staticmethod
    def get_tasks(obj):
        return TaskSerializerforWorksite(
            Task.objects.filter(worksite=obj),
            many=True
        ).data

    @staticmethod
    def get_assigned_employee(obj):
        queryset = Event.objects.filter(worksite=obj).first()
        return EventAssignedEmployeeSerializer(
            queryset,
            many=False
        ).data['employee']


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'profile_image',)

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
            for attendance in attendances:
                employees.append(EmployeeSerializer(attendance.employee).data)
        data['employee'] = employees
        return data


class AttendanceEventSerializer(serializers.ModelSerializer):
    worksite = serializers.SerializerMethodField()
    active_employees = serializers.SerializerMethodField()
    total_hours = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ('id', 'worksite', 'active_employees', 'total_hours')

    def to_representation(self, data):
        request = self.context['request']
        data = super(AttendanceEventSerializer, self).to_representation(data)
        attendance = Attendance.objects.filter(employee__user=request.user, event__id=data['id'])
        if attendance.exists():
            if attendance.first().status == 'CLOCK_IN':
                data['status'] = "CLOCK_OUT"
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
    def get_active_employees(obj):
        attendance = Attendance.objects.filter(event=obj)
        if attendance.exists():
            return AttendanceActiveEmployeeSerializer(
                attendance.first(),
                many=False
            ).data['employee']
        else:
            return []

    def get_total_hours(self, obj):
        request = self.context['request']
        all_attendance = Attendance.objects.filter(employee__user=request.user, status="CLOCK_OUT")
        if all_attendance.exists():
            attendance_hours = 0
            for attendance in all_attendance:
                attendance_hours += attendance.clock_out_time - attendance.clock_in_time
        else:
            attendance_hours = 0
        return attendance_hours

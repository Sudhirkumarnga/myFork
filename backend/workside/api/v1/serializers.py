from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from workside.models import *
from workside.services import (
    create_worksite,
    update_worksite,
    create_task,
    create_task_attachment
)


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

    def get_personal_information(self, obj):
        return WorksitePersonalInformationSerializer(
            obj,
            many=False
        ).data

    def get_contact_person(self, obj):
        return WorkSiteContactPersonSerializer(
            obj,
            many=False
        ).data

    def get_tasks(self, obj):
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

    def get_task_media(self, obj):
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

    def get_every_time(self, obj):
        return TaskSerializer(
            Task.objects.filter(worksite__business=obj, frequency_of_task="EVERY_TIME"),
            many=True
        ).data

    def get_weekly(self, obj):
        return TaskSerializer(
            Task.objects.filter(worksite__business=obj, frequency_of_task="WEEKLY"),
            many=True
        ).data

    def get_semi_weekly(self, obj):
        return TaskSerializer(
            Task.objects.filter(worksite__business=obj, frequency_of_task="SEMI_WEEKLY"),
            many=True
        ).data

    def get_monthly(self, obj):
        return TaskSerializer(
            Task.objects.filter(worksite__business=obj, frequency_of_task="MONTHLY"),
            many=True
        ).data

    def get_quarterly(self, obj):
        return TaskSerializer(
            Task.objects.filter(worksite__business=obj, frequency_of_task="QUARTERLY"),
            many=True
        ).data

    def get_semi_annually(self, obj):
        return TaskSerializer(
            Task.objects.filter(worksite__business=obj, frequency_of_task="SEMI_ANNUALLY"),
            many=True
        ).data

    def get_custom(self, obj):
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
        task_attachement = create_task_attachment(validated_data, request)
        return task_attachement


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

    def get_tasks(self, obj):
        return FrequencyTaskSerializer(
            obj.worksite.business,
            many=False
        ).data


class SchedularSerializer(ModelSerializer):
    worksite_name = serializers.CharField(read_only=True)
    class Meta:
        model = Event
        fields = ('id','worksite_name','start_time','end_time')

    def to_representation(self, data):
        data = super(SchedularSerializer, self).to_representation(data)
        data['worksite_name'] = Event.objects.get(id=data['id']).worksite.name
        return data
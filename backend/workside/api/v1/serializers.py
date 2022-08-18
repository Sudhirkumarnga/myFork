from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from business.models import Business, Employee, BusinessAddress, Country, City
from workside.models import *
from workside.services import (
    create_worksite,
    update_worksite,
    create_task,
    create_task_attachement
)

class TaskSerializerforWorksite(ModelSerializer):
    class Meta:
        model = Task
        fields = ('id','name')


class WorksitePersonalInformationSerializer(ModelSerializer):
    class Meta:
        model = WorkSite
        exclude = (
            'contact_person_name','contact_phone_number',
            'id','business','show_dtails','logo',
            'instruction_video','is_active'
        )

class WorkSiteContactPersonSerializer(ModelSerializer):
     class Meta:
        model = WorkSite
        fields = ('contact_person_name','contact_phone_number')

class WorksiteSerializer(ModelSerializer):
    personal_information = serializers.SerializerMethodField()
    contact_person = serializers.SerializerMethodField()
    tasks = serializers.SerializerMethodField()

    class Meta:
        model = WorkSite
        fields = ('id','business','personal_information', 'contact_person','is_active','show_dtails','tasks')
    
    def get_personal_information(self,obj):
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
    files = serializers.DictField(child = serializers.CharField(allow_null=True), write_only=True, required=False)
    task_media = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Task
        fields = ('id','worksite','name','description','notes','priority','frequency_of_task','files','task_media')

    def get_task_media(self,obj):
        return TaskAttachmentSerializer(
            TaskAttachments.objects.filter(task=obj),
            many=True
        ).data
    
    def create(self, validated_data):
        task = create_task(validated_data)
        return task


class TaskAttachmentSerializer(ModelSerializer):
    class Meta:
        model = TaskAttachments
        fields = "__all__"
    
    def create(self, validated_data):
        task_attachement = create_task_attachement(validated_data)
        return task_attachement
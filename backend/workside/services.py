import base64
import datetime
from django.core.files.base import ContentFile
from workside import models
from workside.tasks import event_publishing_reminder_task
from business.models import (
    Business
)


def convert_file_from_bse64_to_blob(file):
    data = ContentFile(base64.b64decode(file), name='file.jpg')
    return data


def create_worksite(user, data):
    worksite = models.WorkSite.objects.create(
        **data['worksite_information'],
        **data['contact_person'],
        show_dtails=data['show_dtails'],
        logo=convert_file_from_bse64_to_blob(data['logo']),
        instruction_video=convert_file_from_bse64_to_blob(data['instruction_video']),
        business=Business.objects.get(user=user),
    )
    return worksite


def update_worksite(user, data, instance):
    worksite = models.WorkSite.objects.filter(id=instance.id)
    worksite.update(
        **data['worksite_information'],
        **data['contact_person'],
        business=Business.objects.get(user=user)
    )
    worksite = models.WorkSite.objects.get(id=instance.id)
    if 'show_dtails' in data:
        worksite.show_dtails = data['show_dtails']
    if 'logo' in data:
        worksite.logo = convert_file_from_bse64_to_blob(data['logo'])
    if 'instruction_video' in data:
        worksite.instruction_video = convert_file_from_bse64_to_blob(data['instruction_video'])
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
        event_publishing_reminder_task.apply_async((event_id,reminder_date), eta=reminder_date)
    if publishing_reminder == "TWO_DAYS":
        reminder_date = start_time - datetime.timedelta(days=2)
    if publishing_reminder == "ONE_WEEK":
        reminder_date = start_time - datetime.timedelta(days=7)
    if publishing_reminder == "TWO_WEEKS":
        reminder_date = start_time - datetime.timedelta(days=14)
    if publishing_reminder == "ONE_MONTH":
        reminder_date = start_time - datetime.timedelta(days=30)
    return reminder_date

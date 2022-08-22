import base64
from django.core.files.base import ContentFile
from workside.models import (
    WorkSite,
    Task,
    TaskAttachments
)
from business.models import (
    Business
)


def convert_file_from_bse64_to_blob(file):
    imgstr = file.split(';base64,')
    data = ContentFile(base64.b64decode(file), name='file.jpg')
    return data


def create_worksite(user, data):
    worksite = WorkSite.objects.create(
        **data['worksite_information'],
        **data['contact_person'],
        show_dtails=data['show_dtails'],
        logo=convert_file_from_bse64_to_blob(data['logo']),
        instruction_video=convert_file_from_bse64_to_blob(data['instruction_video']),
        business=Business.objects.get(user=user),
    )
    return worksite


def update_worksite(user, data, instance):
    worksite = WorkSite.objects.filter(id=instance.id)
    worksite.update(
        **data['worksite_information'],
        **data['contact_person'],
        show_dtails=data['show_dtails'],
        logo=convert_file_from_bse64_to_blob(data['logo']),
        instruction_video=convert_file_from_bse64_to_blob(data['instruction_video']),
        business=Business.objects.get(user=user)
    )


def create_task(validated_data):
    task = Task.objects.create(
        worksite=validated_data['worksite'],
        name=validated_data['name'],
        description=validated_data['description'],
        notes=validated_data['notes'],
        criticality=validated_data['criticality'],
        frequency_of_task=validated_data['frequency_of_task']
    )
    for key, val in validated_data['files'].items():
        TaskAttachments.objects.create(task=task, file=convert_file_from_bse64_to_blob(val))
    return task


def create_task_attachment(validated_data, request):
    task_attachment = TaskAttachments.objects.create(
        task=validated_data['task'],
        file=convert_file_from_bse64_to_blob(request.data['file'])
    )
    return task_attachment


def update_serializer_data(serializer_data):
    for data in serializer_data:
        try:
            data['file'] = TaskAttachments.objects.get(id=data['id']).file.url
        except Exception:
            data['file'] = None
    return serializer_data

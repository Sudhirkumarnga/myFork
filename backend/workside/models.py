from django.db import models
from django.utils.translation import gettext_lazy as _

from business.models import Business
from home.models import TimeStampedModel
from workside.enums import Weekday, Priority, Frequency


def business_directory_path(instance, filename):
    return 'business/{}/{}/{}'.format(instance.business.id, instance.name, filename)

class WorkSide(TimeStampedModel):
    name = models.CharField(_("WorkSide Name"), blank=True, null=True, max_length=255)
    location = models.CharField(_("WorkSide Location"), max_length=255)
    description = models.TextField(_("WorkSide Description"), blank=True, null=True)
    notes = models.TextField(_("WorkSide Description"), blank=True, null=True)
    monthly_rates = models.CharField(_("WorkSide Monthly Rates"), max_length=10)
    clear_frequency_by_day =  models.CharField(_("WorkSide Monthly Rates"), max_length=10, choices=Weekday.choices(), null=True, blank=True)
    desired_time = models.CharField(_("WorkSide Desired Time"), max_length=10)
    number_of_workers_needed = models.CharField(_("WorkSide Num Of Workers Needed"), max_length=10, blank=True, null=True)
    supplies_needed = models.CharField(_("WorkSide Supplier Needed"), max_length=10, blank=True, null=True)
    contact_person_name = models.CharField(_("Contact Person Name"), max_length=10, blank=True, null=True)
    contact_phone_number = models.CharField(_("Contact Person Number"), max_length=10, blank=True, null=True)
    logo = models.FileField(_('Worksidet Logo'), upload_to=business_directory_path, null=True, blank=True)
    business = models.ForeignKey(Business, on_delete=models.CASCADE, null=True, blank=True)
    instruction_video = models.FileField(_('Profile Picture'), upload_to=business_directory_path, null=True, blank=True)
    show_dtails = models.BooleanField(default=False) 
    is_active = models.BooleanField(default=True)


    class Meta:
        verbose_name = "Workside"
        verbose_name_plural = "Worksides"

    def __str__(self):
        return f'{self.name}'

def workside_task_attachments_file_path(instance, filename):
    return 'business/{}/{}/{}/{}'.format(instance.business.id, instance.workside.name,instance.id, filename)


class Task(TimeStampedModel):
    name = models.CharField(_("Task Name"), blank=True, null=True, max_length=255)
    description = models.TextField(_("Task Description"), blank=True, null=True)
    notes = models.TextField(_("Task Notes"), blank=True, null=True)
    priority =  models.CharField(_("Task Critically"), max_length=10, choices=Priority.choices(), null=True, blank=True)
    frequency_of_task = models.CharField(_("Frequency Of Task"), max_length=10, choices=Frequency.choices(), null=True, blank=True)
    workside = models.ForeignKey(WorkSide, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        verbose_name = "Task"
        verbose_name_plural = "Tasks"

    def __str__(self):
        return f'{self.name}'

class TaskAttachments(TimeStampedModel):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True)
    file = models.FileField(_('Task attachments'), upload_to=workside_task_attachments_file_path, null=True, blank=True)

    class Meta:
        verbose_name = "Task Attachment"
        verbose_name_plural = "Task Attachments"

    def __str__(self):
        return f'{self.task.name}'


# class Event(TimeStampedModel):
#     name = models.CharField(_("WorkSide Name"), blank=True, null=True, max_length=255)
#     description = models.TextField(_("WorkSide Description"), blank=True, null=True)
#     notes = models.TextField(_("WorkSide Description"), blank=True, null=True)
#     start_time = models.DateTimeField()
#     end_time = models.DateTimeField()
#
#
#     class Meta:
#         verbose_name = "Event"
#         verbose_name_plural = "Events"
#
#     def __str__(self):
#         return f'{self.name}'
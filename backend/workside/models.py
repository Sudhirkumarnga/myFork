from django.db import models
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from business.models import Business
from home.models import TimeStampedModel
from phonenumber_field.modelfields import PhoneNumberField
from business.models import Employee
from workside.enums import (
    Weekday,
    Priority,
    Frequency,
    EventFrequency,
    EventStatus,
    EventPublishingReminder
)
from workside.services import (
    calculate_reminder_date, send_event_reminder_to_employees, send_notify_to_employees
)
from django.db.models.signals import m2m_changed, post_save


def business_directory_path(instance, filename):
    return 'business/{}/{}/{}'.format(instance.business.id, instance.name, filename)


class WorkSite(TimeStampedModel):
    name = models.CharField(_("WorkSide Name"), blank=True, null=True, max_length=255)
    location = models.CharField(_("WorkSide Location"), max_length=255, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    description = models.TextField(_("WorkSide Description"), blank=True, null=True)
    notes = models.TextField(_("WorkSide Notes"), blank=True, null=True)
    monthly_rates = models.CharField(_("WorkSide Monthly Rates"), max_length=10, blank=True, null=True)
    clear_frequency_by_day = models.CharField(_("WorkSide Monthly Rates"), max_length=10, choices=Weekday.choices(),
                                              null=True, blank=True)
    desired_time = models.TimeField(null=True, blank=True)
    number_of_workers_needed = models.IntegerField(_("WorkSide Num Of Workers Needed"), blank=True, null=True)
    supplies_needed = models.IntegerField(_("WorkSide Supplier Needed"), blank=True, null=True)
    contact_person_name = models.CharField(_("Contact Person Name"), max_length=10, blank=True, null=True)
    contact_phone_number = PhoneNumberField(null=True, blank=True)
    logo = models.FileField(_('Worksidet Logo'), upload_to=business_directory_path, null=True, blank=True)
    business = models.ForeignKey(Business, on_delete=models.CASCADE, null=True, blank=True)
    instruction_video = models.FileField(_('Profile Picture'), upload_to=business_directory_path, null=True, blank=True)
    show_dtails = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Worksite"
        verbose_name_plural = "Worksites"

    def __str__(self):
        return f'{self.name}'


def workside_task_attachments_file_path(instance, filename):
    return 'business/{}/{}/{}/{}'.format(instance.task.worksite.business.id, instance.task.worksite.name, instance.id,
                                         filename)


class Task(TimeStampedModel):
    name = models.CharField(_("Task Name"), blank=True, null=True, max_length=255)
    description = models.TextField(_("Task Description"), blank=True, null=True)
    notes = models.TextField(_("Task Notes"), blank=True, null=True)
    criticality = models.CharField(_("Task Critically"), max_length=200, choices=Priority.choices(), null=True,
                                   blank=True)
    frequency_of_task = models.CharField(_("Frequency Of Task"), max_length=200, choices=Frequency.choices(), null=True,
                                         blank=True)
    worksite = models.ForeignKey(WorkSite, on_delete=models.CASCADE, null=True, blank=True)

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


class Event(TimeStampedModel):
    worksite = models.ForeignKey(WorkSite, on_delete=models.CASCADE, null=True, blank=True)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    frequency = models.CharField(_("Frequency Of Event"), max_length=200, choices=EventFrequency.choices(), null=True,
                                 blank=True)
    description = models.TextField(_("WorkSide Description"), blank=True, null=True)
    notes = models.TextField(_("WorkSide Description"), blank=True, null=True)
    reminder = models.BooleanField(_("Reminder for Travel Time"), default=False)
    schedule_inspection = models.BooleanField(_("Schedule Inspection"), default=False)
    employees = models.ManyToManyField(Employee)
    selected_tasks = models.ManyToManyField(Task)
    event_status = models.CharField(
        _("Event Status"),
        max_length=200,
        choices=EventStatus.choices(),
        null=True, blank=True
    )
    publishing_reminder = models.CharField(
        _("Reminder for publishing draft event"),
        max_length=200,
        choices=EventPublishingReminder.choices(),
        null=True, blank=True
    )
    reminder_date = models.DateField(null=True, blank=True)
    notify = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Event"
        verbose_name_plural = "Events"

    def __str__(self):
        return f'{self.worksite}'

    def save(self, *args, **kwargs):
        super(Event, self).save(*args, **kwargs)
        if self.event_status == "DRAFT":
            self.reminder_date = calculate_reminder_date(
                self.id,
                self.publishing_reminder,
                self.start_time
            )
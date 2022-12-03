from home.models import TimeStampedModel
from django.db import models
from django.utils.translation import gettext_lazy as _
from workside.models import WorkSite, Task
from reports.constants import TaskFeedback


def inspection_report_media(instance, filename):
    print(instance.report)
    return 'business/{}/{}/{}/{}'.format(instance.report.worksite.business.id, instance.report.name, instance.id,
                                         filename)


class InspectionReport(TimeStampedModel):
    name = models.CharField(_("Inspection Report Name"), blank=True, null=True, max_length=255)
    worksite = models.ForeignKey(WorkSite, on_delete=models.CASCADE, null=True, blank=True)
    tasks = models.ManyToManyField(Task)

    class Meta:
        verbose_name = "Inspection Report"
        verbose_name_plural = "Inspection Reports"

    def __str__(self):
        return f'{self.name}'


class InspectionReportMedia(TimeStampedModel):
    report = models.ForeignKey(InspectionReport, on_delete=models.CASCADE, null=True, blank=True)
    file = models.FileField(_('Report attachments'), upload_to=inspection_report_media, null=True, blank=True)

    class Meta:
        verbose_name = "Inspection Report Media"
        verbose_name_plural = "Inspection Report Medias"

    def __str__(self):
        return f'{self.report.name}'


class TaskFeedback(TimeStampedModel):
    report = models.ForeignKey(InspectionReport, on_delete=models.CASCADE, null=True, blank=True)
    tasks = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True)
    feedback = models.CharField(
        _("Task Feedback"),
        max_length=200,
        choices=TaskFeedback.choices(),
        null=True, blank=True
    )

    class Meta:
        verbose_name = "Task Feedback"
        verbose_name_plural = "Tasks Feedbacks"

    def __str__(self):
        return f'{self.report.name}'

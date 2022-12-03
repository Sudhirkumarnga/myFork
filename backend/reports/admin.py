from django.contrib import admin
from reports.models import InspectionReport, InspectionReportMedia, TaskFeedback

# Register your models here.
admin.site.register(InspectionReport)
admin.site.register(InspectionReportMedia)
admin.site.register(TaskFeedback)
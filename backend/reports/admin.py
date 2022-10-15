from django.contrib import admin
from reports.models import InspectionReport, InspectionArea, InspectionReportMedia

# Register your models here.
admin.site.register(InspectionReport)
admin.site.register(InspectionArea)
admin.site.register(InspectionReportMedia)
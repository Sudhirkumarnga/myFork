from django.urls import path
from reports.api.v1.views import PayrollReport
urlpatterns = [
    path('payroll-reports/',PayrollReport.as_view(),name='payroll-reports')
]
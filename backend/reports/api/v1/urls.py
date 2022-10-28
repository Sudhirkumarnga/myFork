from django.urls import path, include
from rest_framework.routers import DefaultRouter
from reports.api.v1.views import PayrollReport, GetWorksitesView, GetWorksitesTasksView, InspectionReportView, \
    TaskFeedbackView, LocationVarianceReport, ScheduleVarianceReport

router = DefaultRouter()

router.register("inspection-report", InspectionReportView, basename="inspection-report")
router.register("task-feedback", TaskFeedbackView, basename="task-feedback")


urlpatterns = [
    path('get_worksites/',GetWorksitesView.as_view(),name='get_worksites'),
    path('get_worksites_tasks/',GetWorksitesTasksView.as_view(),name='get_worksites_tasks'),
    path('payroll-reports/',PayrollReport.as_view(),name='payroll-reports'),
    path('locationvariance-reports/', LocationVarianceReport.as_view(), name='location-variance-reports'),
    path('schedulevariance-reports/', ScheduleVarianceReport.as_view(), name='schedule-variance-reports'),



]+ router.urls
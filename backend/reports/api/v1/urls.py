from django.urls import path, include
from rest_framework.routers import DefaultRouter
from reports.api.v1.views import PayrollReport, GetWorksitesView, GetWorksitesTasksView, InspectionReportView, TaskFeedbackView

router = DefaultRouter()

router.register("inspection-report", InspectionReportView, basename="inspection-report")
router.register("task-feedback", TaskFeedbackView, basename="task-feedback")


urlpatterns = [
    path('get_worksites/',GetWorksitesView.as_view(),name='get_worksites'),
    path('get_worksites_tasks/',GetWorksitesTasksView.as_view(),name='get_worksites_tasks'),
    path('payroll-reports/',PayrollReport.as_view(),name='payroll-reports')

]+ router.urls
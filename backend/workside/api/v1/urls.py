from django.urls import path, include
from rest_framework.routers import DefaultRouter
from workside.api.v1.views import (
    WorkSiteViewSet,
    TaskViewSet,
    TaskAttachmentViewSet,
    EventView,
    SchedularView,
    WorksiteListView,
    UpcomingShiftView,
)

router = DefaultRouter()

router.register("task", TaskViewSet, basename="task")
router.register("task_attachement", TaskAttachmentViewSet, basename="task_attachement")
router.register("worksite", WorkSiteViewSet, basename="worksite")
router.register("event", EventView, basename="event")


urlpatterns = [
    path("schedular/", SchedularView.as_view(), name='schedular'),
    path("worksites/", WorksiteListView.as_view(), name='worksites'),
    path("upcoming_shift/", UpcomingShiftView.as_view(), name='upcoming_shift'),
] + router.urls
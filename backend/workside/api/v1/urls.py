from django.urls import path, include
from rest_framework.routers import DefaultRouter
from workside.api.v1.views import WorkSiteViewSet, TaskViewSet, TaskAttachmentViewSet

router = DefaultRouter()

router.register("task", TaskViewSet, basename="task")
router.register("task_attachement", TaskAttachmentViewSet, basename="task_attachement")

router.register("worksite", WorkSiteViewSet, basename="worksite")

urlpatterns = [

] + router.urls
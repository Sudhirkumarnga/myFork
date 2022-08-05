from django.urls import path, include
from rest_framework.routers import DefaultRouter
from workside.views import WorkSideViewSet, TaskViewSet

router = DefaultRouter()

router.register("task", TaskViewSet, basename="task")
router.register("workside", WorkSideViewSet, basename="workside")

urlpatterns = [

] + router.urls
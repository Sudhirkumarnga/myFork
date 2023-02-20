from django.urls import path, include
from rest_framework.routers import DefaultRouter
from admin_panel.api.v1.views import UserViewset, FeedbackViewset, SubscriptionPlanViewset

router = DefaultRouter()

router.register("admin/users", UserViewset, basename="user")
router.register("admin/feedbacks", FeedbackViewset, basename="feedback")
router.register("admin/plans", SubscriptionPlanViewset, basename="plans")


urlpatterns = [

] + router.urls

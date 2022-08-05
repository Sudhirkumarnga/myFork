from django.urls import path,include
from rest_framework import routers
from modules.subscription import views

router = routers.DefaultRouter()
router.register('subscription', views.SubscriptionModelViewSet)
router.register('user-subscription', views.UserSubscriptionModelViewSet,basename='user-subscription')

urlpatterns = [
    #path('', include(router.urls)),

]+router.urls
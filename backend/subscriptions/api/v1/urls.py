from django.urls import path,include
from rest_framework import routers
from subscriptions.api.v1.views import (
    SubscriptionPlanViewSet,
    UserSubscriptionViewSet,
    SubscriptionDetailViewSet
) 

router = routers.DefaultRouter()
router.register('subscription-plans', SubscriptionPlanViewSet, basename='subscription-plans')
router.register('user-subscription', UserSubscriptionViewSet,basename='user-subscription')
router.register('subscription-details', SubscriptionDetailViewSet,basename='subscription-details')

urlpatterns = [
    path('', include(router.urls)),

]
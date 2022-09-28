from django.urls import path,include
from rest_framework import routers
from subscriptions.api.v1.views import (
    SubscriptionPlanViewSet,
    # UserSubscriptionViewSet,
    # SubscriptionDetailViewSet,
    PaymentView,
    create_payement_method
) 

router = routers.DefaultRouter()
router.register('subscription-plans', SubscriptionPlanViewSet, basename='subscription-plans')
# router.register('user-subscription', UserSubscriptionViewSet,basename='user-subscription')
# router.register('subscription-details', SubscriptionDetailViewSet,basename='subscription-details')

urlpatterns = [
    path('', include(router.urls)),
    path('payment/process/', PaymentView.as_view(), name='process_payment'),
    path('payment/create_payment_method/', create_payement_method.as_view(), name='create_payment_method')
]
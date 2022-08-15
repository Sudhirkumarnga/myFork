from rest_framework.permissions import IsAuthenticated,IsAdminUser
from smart_workhorse_33965.permissions import IsOrganizationAdmin
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets
from subscriptions.api.v1.serializers import (
    SubscriptionPlanSerializer,
    SubscriptionDetailsSerializer,
    UserSubscriptionSerializer
) 

from subscriptions.models import (
    SubscriptionPlan,
    SubscriptionDetails,
    UsersSubscription
)


class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]
    serializer_class = SubscriptionPlanSerializer
    queryset = SubscriptionPlan.objects.all()
    http_method_names = ['get','post']


class SubscriptionDetailViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]
    serializer_class = SubscriptionDetailsSerializer
    queryset = SubscriptionDetails.objects.filter()
    http_method_names = ['get']

    def get_queryset(self):
        queryset = self.queryset
        subscription_id = self.request.query_params.get('subscription_id', None)
        if subscription_id:
            queryset = queryset.filter(subscription_plan__id=subscription_id)
        return queryset
        

class UserSubscriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]
    serializer_class = UserSubscriptionSerializer
    http_method_names = ['get', 'post']

    def get_queryset(self):
        return UserSubscription.objects.filter(user=self.request.user)
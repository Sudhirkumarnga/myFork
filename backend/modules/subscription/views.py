from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets
from modules.subscription.serializers import SubscriptionSerializer,UserSubscriptionSerializer
from modules.subscription.models import SubscriptionPlan,OrganizationSubscription

class SubscriptionModelViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = SubscriptionSerializer
    queryset = SubscriptionPlan.objects.all()
    
    def get_permissions(self):
        if self.request.method == "GET":
            return []
        else:
            return [IsAdminUser()]

class UserSubscriptionModelViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserSubscriptionSerializer
    http_method_names = ['get',]

    def get_queryset(self):
        return OrganizationSubscription.objects.filter(user=self.request.user)
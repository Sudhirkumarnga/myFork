from business.models import Feedback
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response

from push_notification.services import create_notification
from smart_workhorse_33965.permissions import IsOrganizationAdmin, IsActiveSubscription, IsSuperUser
from rest_framework.permissions import IsAuthenticated
from smart_workhorse_33965.response import SmartWorkHorseResponse, SmartWorkHorseStatus
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from users.models import User
from  admin_panel.api.v1.serializers import DjStripeProductSerializer, UserSerializer, FeedbackSerializer
from djstripe.models import Plan, Product
import stripe



class UserViewset(ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [
        IsAuthenticated,
        IsSuperUser
    ]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["role", "is_active", "is_superuser"]
    search_fields = ["email", "first_name", "last_name", "email", "phone"]
    pagination_class = None


class FeedbackViewset(ModelViewSet):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [
        IsAuthenticated,
        IsSuperUser
    ]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["is_read", "created_at"]
    search_fields = ["title", "email", "title"]
    pagination_class = None


class SubscriptionPlanViewset(ModelViewSet):
    serializer_class = DjStripeProductSerializer
    queryset = Product.objects.all()
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [
        IsAuthenticated,
        IsSuperUser
    ]
    pagination_class = None

    def get_serializer_context(self):
        context = super(SubscriptionPlanViewset, self).get_serializer_context()
        context.update({"request": self.request})
        return context
    
    def perform_destroy(self, instance):
        stripe.Product.delete(instance.id)
        instance.delete()
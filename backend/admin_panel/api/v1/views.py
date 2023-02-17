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
from  admin_panel.api.v1.serializers import UserSerializer, FeedbackSerializer



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
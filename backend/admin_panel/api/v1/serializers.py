from business.models import Feedback
from rest_framework.serializers import ModelSerializer
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from users.models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'first_name', 
            'last_name', 
            'phone', 
            'gender', 
            'date_of_birth', 
            "role", 
            "is_active",
            "is_superuser"
        ]


class FeedbackSerializer(ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'



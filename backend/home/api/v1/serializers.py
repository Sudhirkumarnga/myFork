from django.contrib.auth import get_user_model
from django.http import HttpRequest
from django.utils.translation import ugettext_lazy as _
from allauth.account import app_settings as allauth_settings
from allauth.account.forms import ResetPasswordForm
from allauth.utils import email_address_exists, generate_unique_username
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from rest_framework import serializers
from rest_auth.serializers import PasswordResetSerializer
from business.models import (
    Business,
    BusinessAddress
)
from home.services import(
    create_business_and_business_address,
    create_organization_employee,
    create_employee
) 

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    is_read_terms = serializers.BooleanField(write_only=True)
    employee_types = serializers.CharField(write_only=True, required=False)
    business_code = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password', 'phone', 'business_code', 'employee_types', 'is_read_terms')
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {
                    'input_type': 'password'
                }
            },
            'email': {
                'required': True,
                'allow_blank': False,
            }
        }

    def _get_request(self):
        request = self.context.get('request')
        if request and not isinstance(request, HttpRequest) and hasattr(request, '_request'):
            request = request._request
        return request

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def create(self, validated_data):
        user = User(
            email=validated_data.get('email'),
            name=validated_data.get('name'),
            username=generate_unique_username([
                validated_data.get('name'),
                validated_data.get('email'),
                'user'
            ]),
            is_read_terms = validated_data.get('is_read_terms'),
        )
        user.set_password(validated_data.get('password'))
        user.save()
        request = self._get_request()
        setup_user_email(request, user, [])
        
        if validated_data.__contains__("business_code"):
            business = Business.objects.filter(
                business_code=validated_data['business_code']
            )
            if business.exists():
                create_organization_employee(user, business, validated_data)
            else:
                raise serializers.ValidationError(_("Invalid Origanization Code"))
        else:
            business = create_business_and_business_address(user,validated_data)
            employee = create_employee(business,user,validated_data)
        return user

    def save(self, request=None):
        """rest_auth passes request so we must override to accept it"""
        return super().save()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name']


class PasswordSerializer(PasswordResetSerializer):
    """Custom serializer for rest_auth to solve reset password error"""
    password_reset_form_class = ResetPasswordForm
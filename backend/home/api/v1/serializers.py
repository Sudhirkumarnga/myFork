home/api/v1/urls.pyfrom django.contrib.auth import get_user_model
from django.http import HttpRequest
from django.utils.translation import ugettext_lazy as _
from allauth.account import app_settings as allauth_settings
from allauth.account.forms import ResetPasswordForm
from allauth.utils import email_address_exists, generate_unique_username
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from rest_framework import serializers
from rest_auth.serializers import PasswordResetSerializer
from users.models import User_OTP
from business.models import (
    Business,
    BusinessAddress
)
from home.services import(
    create_business_and_business_address,
    create_organization_employee,
    create_employee,
    generate_user_otp
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

    def validate(self, data):
        if data.__contains__('business_code'):
            business = Business.objects.filter(
                business_code=data['business_code']
            )
            if business.exists():
                return data
            else:
                raise serializers.ValidationError(_("Invalid Origanization Code"))
        return data

    def create(self, validated_data):

        if validated_data.__contains__('business_code'):
            user = User(
                email=validated_data.get('email'),
                name=validated_data.get('name'),
                username=generate_unique_username([
                    validated_data.get('name'),
                    validated_data.get('email'),
                    'user'
                ]),
                phone = validated_data.get('phone'),
                is_read_terms = validated_data.get('is_read_terms'),
                role = 'Employee'
            )
        else:
            user = User(
                email=validated_data.get('email'),
                name=validated_data.get('name'),
                username=generate_unique_username([
                    validated_data.get('name'),
                    validated_data.get('email'),
                    'user'
                ]),
                is_read_terms = validated_data.get('is_read_terms'),
                role = 'Organization Admin'
            )
        user.set_password(validated_data.get('password'))
        user.save()
        request = self._get_request()
        setup_user_email(request, user, [])
        generate_user_otp(user)
        
        if validated_data.__contains__("business_code"):
            create_organization_employee(user, validated_data)
        else:
            business = create_business_and_business_address(user,validated_data)
            employee = create_employee(business,user,validated_data)
        return user

    def save(self, request=None):
        """rest_auth passes request so we must override to accept it"""
        return super().save()


class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password1 = serializers.CharField(max_length=128)
    new_password2 = serializers.CharField(max_length=128)
    otp = serializers.CharField(max_length=6)

    def validate(self, attrs):
        if attrs['new_password1'] != attrs['new_password2']:
            raise serializers.ValidationError(_("password1 and password2 didn't match"))
        if not User_OTP.objects.filter(otp=attrs['otp'], is_expire=False).exists():
            raise serializers.ValidationError(_("OTP is invalide or Expired"))
        return attrs

    def save(self, validated_data):
        user = User_OTP.objects.get(otp=validated_data['otp']).user
        user.set_password(validated_data['new_password1'])
        user.save()
        return user
        


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'phone', 'role', 'is_read_terms']


class PasswordSerializer(PasswordResetSerializer):
    """Custom serializer for rest_auth to solve reset password error"""
    password_reset_form_class = ResetPasswordForm
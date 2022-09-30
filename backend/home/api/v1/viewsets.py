from smart_workhorse_33965.response import SmartWorkHorseResponse, SmartWorkHorseStatus
from rest_framework.permissions import IsAuthenticated, AllowAny
from allauth.account import app_settings as allauth_settings
from rest_framework.viewsets import ModelViewSet, ViewSet
from django.utils.translation import ugettext_lazy as _
from rest_auth.registration.views import RegisterView
from rest_auth.serializers import LoginSerializer
from allauth.account.models import EmailAddress
from rest_framework.response import Response
from rest_framework.views import APIView
from users.models import User_OTP, User
from rest_auth.models import TokenModel
from rest_auth.views import LoginView
from django.conf import settings
from rest_framework import status

from rest_auth.app_settings import (
    TokenSerializer, 
    UserDetailsSerializer, 
    LoginSerializer,
    create_token
)
from home.api.v1.serializers import(
    SignupSerializer,
    UserSerializer, 
    PasswordResetConfirmSerializer
) 

from home.services import (
    send_account_confirmation_email, 
    sent_password_reset_email, 
    generate_user_otp, send_new_otp
) 


class SignupViewSet(RegisterView):

    def perform_create(self, serializer):
        user = serializer.save(self.request)
        if getattr(settings, 'REST_USE_JWT', False):
            self.token = jwt_encode(user)
        else:
            create_token(self.token_model, user, serializer)

        if allauth_settings.EMAIL_VERIFICATION == 'mandatory':
            otp = User_OTP.objects.get(user=user).otp
            send_account_confirmation_email(
                user,
                otp
            )

        return user

class ValidateOTPView(APIView):
    
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            email = self.request.data.get('email', None)
            otp = self.request.data.get('otp', None)
            user_otp = User_OTP.objects.filter(
                user__email=email,
                otp=otp,
                is_expire=False
            )
            if user_otp:
                user_otp.update(is_expire=True)
                email_address = EmailAddress.objects.get(user__email=email)
                email_address.verified = True
                email_address.save()
                token = TokenModel.objects.get(user__email=email)
                return Response(
                        SmartWorkHorseResponse.get_response(
                            success=True,
                            message="Your Account has been verified.",
                            status=SmartWorkHorseStatus.Success.value,
                            response={
                                "token":token.key,
                                "user_role": token.user.role
                            }
                        ),
                        status=status.HTTP_200_OK,
                        headers={},
                    )
            else:
                return Response(
                    {"detail": _("OTP is Invalid or Expired")},
                    status=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong in validation OTP",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )

class LoginViewSet(LoginView):
    
    def get_response(self):
        serializer_class = self.get_response_serializer()

        if getattr(settings, 'REST_USE_JWT', False):
            data = {
                'user': self.user,
                'token': self.token
            }
            serializer = serializer_class(instance=data,
                                          context={'request': self.request})
        else:
            serializer = serializer_class(instance=self.token,
                                          context={'request': self.request})

        serializer_data = serializer.data
        serializer_data['user'] = UserSerializer(self.request.user, many=False).data
        response = Response(serializer_data, status=status.HTTP_200_OK)
        if getattr(settings, 'REST_USE_JWT', False):
            from rest_framework_jwt.settings import api_settings as jwt_settings
            if jwt_settings.JWT_AUTH_COOKIE:
                from datetime import datetime
                expiration = (datetime.utcnow() + jwt_settings.JWT_EXPIRATION_DELTA)
                response.set_cookie(jwt_settings.JWT_AUTH_COOKIE,
                                    self.token,
                                    expires=expiration,
                                    httponly=True)
        return response

class PasswordResetView(APIView):

    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        email = self.request.data.get('email', None)
        user = User.objects.filter(email=email)
        if user.exists():
            user = user.first()
            otp = generate_user_otp(user)
            sent_password_reset_email(user,otp)
            return Response(
                {"detail": _("Password reset e-mail has been sent.")},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"detail": _("Email Does not exists")},
                status=status.HTTP_200_OK
            )

class PasswordResetConfirmView(APIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(request.data)
        return Response(
            {"detail": _("Password has been reset with the new password.")}
        )

class RegenrateOTPView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        email = self.request.data.get('email', None)
        user = User.objects.filter(email=email)
        if user.exists():
            user = user.first()
            otp = generate_user_otp(user)
            send_new_otp(user,otp)
            return Response(
                {"detail": _("OTP has been sent to your email address.")},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"detail": _("Email Does not exists, Plz enter correct email")},
                status=status.HTTP_200_OK
            )

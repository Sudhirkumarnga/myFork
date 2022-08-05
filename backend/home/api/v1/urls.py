from django.urls import path, include
from rest_framework.routers import DefaultRouter

from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet,
)
from allauth.account.views import confirm_email

router = DefaultRouter()
# router.register("signup", SignupViewSet, basename="signup")
# router.register("login", LoginViewSet, basename="login")

urlpatterns = [
    path("", include(router.urls)),
    path("auth/", include("rest_auth.urls")),
    path("users/", include("users.urls", namespace="users")),
    # Override email confirm to use allauth's HTML view instead of rest_auth's API view
    path("auth/signup/account-confirm-email/<str:key>/", confirm_email),
    path("auth/signup/", include("rest_auth.registration.urls")),
    path("", include("business.api.v1.urls")),
    path("", include("workside.api.v1.urls")),
]
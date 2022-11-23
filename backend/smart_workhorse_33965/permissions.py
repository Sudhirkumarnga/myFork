from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.permissions import BasePermission
from business.models import Business, Employee


class CustomForbidden(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = "Business Subscription currently is not active."


class IsActiveSubscription(BasePermission):
    def has_permission(self, request, view):
        if request.user.role == "Organization Admin":
            business = Business.objects.get(user=request.user)
            if not business.subscription or business.subscription.status != "active":
                raise CustomForbidden
            else:
                return bool(request.user.is_authenticated)

        if request.user.role == "Employee":
            employee = Employee.objects.get(user=request.user)
            if not employee.business.subscription or employee.business.subscription.status != "active":
                raise CustomForbidden
            else:
                return bool(request.user.is_authenticated)


class IsOrganizationAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user.role == 'Organization Admin' and request.user.is_authenticated)

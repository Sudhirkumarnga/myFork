from rest_framework.permissions import BasePermission


class IsOrganizationAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user.role == 'Organization Admin' and request.user.is_authenticated)

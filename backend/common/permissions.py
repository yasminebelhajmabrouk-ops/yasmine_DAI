from rest_framework.permissions import BasePermission


class HasAllowedRole(BasePermission):
    allowed_roles = []

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        if user.is_superuser:
            return True

        user_groups = set(user.groups.values_list("name", flat=True))
        return bool(user_groups.intersection(set(self.allowed_roles)))


class IsAnesthesist(HasAllowedRole):
    allowed_roles = ["ANESTHESIST", "ADMIN"]


class IsIADE(HasAllowedRole):
    allowed_roles = ["IADE", "ADMIN"]


class IsSSPI(HasAllowedRole):
    allowed_roles = ["SSPI", "ADMIN"]


class IsClinicalStaff(HasAllowedRole):
    allowed_roles = ["ANESTHESIST", "IADE", "SSPI", "ADMIN"]
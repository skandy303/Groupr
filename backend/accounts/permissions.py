from rest_framework.permissions import BasePermission


class IsProfessor(BasePermission):
    """
    Allows access only to professor users.
    """

    message = "Must be a professor"

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.is_professor
        )


class IsStudent(BasePermission):
    """
    Allows access only to student users.
    """

    message = "Must be a student"

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.is_student
        )

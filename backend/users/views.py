from rest_framework import generics, permissions
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from http import HTTPMethod
import logging

from .models import User
from .serializers import UserSerializer


logger = logging.getLogger(__name__)


class IsCurrentUser(permissions.BasePermission):
    """
    Object-level permission to only allow only the relevant user to edit its details.
    """

    def has_object_permission(self, request, view, user_object: User):
        return user_object == request.user


@permission_classes([permissions.IsAuthenticated & IsCurrentUser])
class UserRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    """
    Get full information about a user or update it.
    Usage: /api/users/user/<remote_id>
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "remote_id"

    def get_object(self):
        if self.request.method:
            user, created = User.objects.get_or_create(
                remote_id=self.kwargs.get(self.lookup_field)
            )
            return user
        else:
            return super(UserRetrieveUpdateView, self).get_object()

    def patch(self, request, *args, **kwargs):
        logger.debug(
            f"User update - patch request data: {request.data}"
        )
        return super().patch(request, *args, **kwargs)


@permission_classes([permissions.IsAuthenticated & IsCurrentUser])
class UserDeleteView(generics.DestroyAPIView):
    """
    Delete a user.
    Usage: /api/users/user/<remote_id>/delete
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "remote_id"

    def delete(self, request, *args, **kwargs):
        logger.debug(
            f"User delete request - {self.get_object()}"
        )
        return super().delete(request, *args, **kwargs)

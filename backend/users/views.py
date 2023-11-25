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
        return user_object.remote_id.replace("|", ".") == str(request.user)


@permission_classes([IsCurrentUser])
class UserRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    """
    Get full information about a user or update it.
    Usage: /api/users/user/<remote_id>
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "remote_id"

    # TODO: Create if doesn't exists

    def get_object(self):
        if self.request.method == HTTPMethod.PATCH:
            user, created = User.objects.get_or_create(
                remote_id=self.kwargs.get(self.lookup_field)
            )
            return user
        else:
            return super(UserRetrieveUpdateView, self).get_object()

    def patch(self, request, *args, **kwargs):
        logger.debug(
            f"User's saved doctors update - patch request data: {request.data}"
        )
        return super().patch(request, *args, **kwargs)

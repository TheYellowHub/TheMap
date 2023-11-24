from rest_framework import generics, permissions
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import UserSerializer


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

    # def patch(self, request, *args, **kwargs):
    #     logger.debug(f"Doctor update - patch request data: {request.data}")
    #     return super().patch(request, *args, **kwargs)

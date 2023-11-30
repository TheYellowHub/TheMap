"""
Doctor review model related APIs
"""

from rest_framework import generics, permissions
from rest_framework.decorators import permission_classes
from django_filters import MultipleChoiceFilter, rest_framework as filters
import logging

from users.models import User
from users.auth import IsAdmin
from ..models.review import DoctorReview
from ..serializers.review import (
    DoctorReviewCreateSerializer,
    DoctorReviewReadSerializer,
    DoctorReviewUpdateSerializer,
)


logger = logging.getLogger(__name__)


class IsStatusAllowed(permissions.BasePermission):
    """
    Allow user to use only specific statuses.
    """

    def has_permission(self, request, view):
        new_status = request.data.get("status")
        permission = not new_status or new_status in DoctorReview.USER_ALLOWED_STATUSES
        print("IsStatusAllowed", "has_permission", permission)
        return permission

    def has_object_permission(self, request, view, review_object: DoctorReview):
        new_status = request.data.get("status")
        current_status = review_object.status
        permission = (
            not new_status and current_status in DoctorReview.USER_ALLOWED_STATUSES
        ) or (new_status and new_status in DoctorReview.USER_ALLOWED_STATUSES)
        print("IsStatusAllowed", "has_object_permission", permission)
        return permission


class IsCurrentUser(permissions.BasePermission):
    """
    Object-level permission to only allow only the relevant user to edit its details.
    """

    def has_permission(self, request, view):
        new_user_id = request.data.get("added_by")
        new_user = User.objects.filter(id=new_user_id).first()
        permission = new_user == request.user
        print(
            "IsCurrentUser", "has_permission", permission, new_user, str(request.user)
        )
        return permission

    def has_object_permission(self, request, view, review_object: DoctorReview):
        review_user: User = review_object.added_by
        permission = review_user == request.user
        print("IsCurrentUser", "has_object_permission", permission)
        return permission


class DoctorReviewFilter(filters.FilterSet):
    """
    Filter options for DoctorReviewListView
    """

    status = MultipleChoiceFilter(choices=DoctorReview.STATUS, lookup_expr="iexact")
    added_by = filters.CharFilter(lookup_expr="iexact")

    class Meta:
        model = DoctorReview
        fields = (
            "status",
            "doctor__id",
            "added_by__remote_id",
        )


class DoctorReviewListView(generics.ListAPIView):
    """
    Get list of doctors with thies basic info, matching the search criteria.
    Usage:
        /api/doctors/review/list
        /api/doctors/doctor/list?doctor__id=11
        /api/doctors/doctor/list?added_by__remote_id=username
        /api/doctors/doctor/list?&status=pending_approval
    """

    queryset = DoctorReview.objects.all()
    serializer_class = DoctorReviewReadSerializer
    filterset_class = DoctorReviewFilter


PERMISSION_CLASSES = [
    permissions.IsAuthenticated & (IsAdmin | (IsCurrentUser & IsStatusAllowed))
]


@permission_classes(PERMISSION_CLASSES)
class DoctorReviewCreateView(generics.CreateAPIView):
    """
    Add a doctor review.
    Usage: /api/doctors/review/create
    """

    queryset = DoctorReview.objects.all()
    serializer_class = DoctorReviewCreateSerializer
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):
        logger.debug(f"Doctor review addition - post request data: {request.data}")
        return super().post(request, *args, **kwargs)


@permission_classes(PERMISSION_CLASSES)
class DoctorReviewUpdateView(generics.UpdateAPIView):
    """
    Update a doctor review.
    Usage: /api/doctors/review/<pk>/update
    """

    queryset = DoctorReview.objects.all()
    serializer_class = DoctorReviewUpdateSerializer
    http_method_names = ["patch"]

    def patch(self, request, *args, **kwargs):
        logger.debug(f"Doctor review update - patch request data: {request.data}")
        return super().patch(request, *args, **kwargs)

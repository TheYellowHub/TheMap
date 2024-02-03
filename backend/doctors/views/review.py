"""
Doctor review model related APIs
"""

from rest_framework import generics, permissions
from rest_framework.decorators import permission_classes
from django_filters import MultipleChoiceFilter, rest_framework as filters
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
import logging

from users.auth import IsAdmin
from ..models.review import DoctorReview
from ..serializers.review import (
    DoctorReviewCreateSerializer,
    DoctorReviewReadSerializer,
    DoctorReviewUpdateSerializer,
)


logger = logging.getLogger(__name__)


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
        /api/doctors/review/list?doctor__id=11
        /api/doctors/review/list?added_by__remote_id=username
        /api/doctors/review/list?&status=pending_approval
    """

    queryset = DoctorReview.objects.all()
    serializer_class = DoctorReviewReadSerializer
    filterset_class = DoctorReviewFilter

    @method_decorator(cache_page(timeout=None))
    def get(self, *args, **kwargs):
        return super().get(*args, **kwargs)


PERMISSION_CLASSES = [
    permissions.IsAuthenticated & (IsAdmin | (DoctorReview.getPermissionClasses().IsCurrentUser & DoctorReview.getPermissionClasses().IsStatusAllowed))
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

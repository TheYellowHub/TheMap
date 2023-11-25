"""
Doctor review model related APIs
"""

from rest_framework import generics
from django_filters import rest_framework as filters
import logging

from users.auth import ADMIN_SCOPE, requires_scope
from ..models.review import DoctorReview
from ..serializers.review import DoctorReviewReadSerializer, DoctorReviewWriteSerializer


logger = logging.getLogger(__name__)


class DoctorReviewFilter(filters.FilterSet):
    """
    Filter options for DoctorReviewListView
    """

    status = filters.CharFilter(lookup_expr="iexact")
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


# TODO: is auth
# @requires_scope(ADMIN_SCOPE)
class DoctorReviewCreateView(generics.CreateAPIView):
    """
    Add a doctor review.
    Usage: /api/doctors/review/create
    """

    queryset = DoctorReview.objects.all()
    serializer_class = DoctorReviewWriteSerializer

    def post(self, request, *args, **kwargs):
        logger.debug(f"Doctor review addition - post request data: {request.data}")
        return super().post(request, *args, **kwargs)


# TODO: is auth, owner / admin
# @requires_scope(ADMIN_SCOPE)
class DoctorReviewUpdateView(generics.UpdateAPIView):
    """
    Update a doctor review.
    Usage: /api/doctors/review/<pk>/update
    """

    queryset = DoctorReview.objects.all()
    serializer_class = DoctorReviewWriteSerializer

    def patch(self, request, *args, **kwargs):
        logger.debug(f"Doctor review update - patch request data: {request.data}")
        return super().patch(request, *args, **kwargs)

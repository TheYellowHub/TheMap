"""
Doctor model related APIs
"""

from rest_framework import generics
from django_filters import MultipleChoiceFilter, rest_framework as filters
import logging

from users.auth import ADMIN_SCOPE, requires_scope
from ..models.doctor import Doctor
from ..serializers.doctor import DoctorSerializer


logger = logging.getLogger(__name__)


class DoctorFilter(filters.FilterSet):
    """
    Filter options for DoctorListView
    """

    full_name = filters.CharFilter(field_name="full_name", lookup_expr="icontains")
    status = MultipleChoiceFilter(choices=Doctor.STATUS, lookup_expr="iexact")

    class Meta:
        model = Doctor
        fields = (
            "id",
            "status",
            "category",
            "specialities",
        )


class DoctorListView(generics.ListAPIView):
    """
    Get list of doctors with thier info, matching the search criteria.
    Usage:
        /api/doctors/doctor/list
        /api/doctors/doctor/list?category=1&category=2&specialities=1&status=1
        /api/doctors/doctor/list?full_name=jesi
        /api/doctors/doctor/list?id=49
        /api/doctors/doctor/list?&status=pending_approval
    """

    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    filterset_class = DoctorFilter


@requires_scope(ADMIN_SCOPE)
class DoctorUpdateView(generics.UpdateAPIView):
    """
    Update a doctor basic info.
    Usage: /api/doctors/doctor/<pk>/update
    """

    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

    def patch(self, request, *args, **kwargs):
        logger.debug(f"Doctor update - patch request data: {request.data}")
        return super().patch(request, *args, **kwargs)


# TODO: change once we would like to allow users to add doctors, but also handle status permissions
@requires_scope(ADMIN_SCOPE)
class DoctorCreateView(generics.CreateAPIView):
    """
    Add a doctor.
    Usage: /api/doctors/doctor/create
    """

    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

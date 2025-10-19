"""
Doctor model related APIs
"""

from rest_framework import generics
from django_filters import MultipleChoiceFilter, rest_framework as filters
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
import logging

from users.auth import ADMIN_SCOPE, requires_scope
from ..models.doctor import Doctor
from ..serializers.doctor import DoctorSerializer


logger = logging.getLogger(__name__)


class DoctorQuerysetMixin:
    def get_queryset(self):
        return Doctor.objects.select_related(
            'category',
            'added_by'
        ).prefetch_related(
            'specialities',
            'doctorlocation_set',
            'doctorreview_set'
        )


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


class DoctorListView(DoctorQuerysetMixin, generics.ListAPIView):
    """
    Get list of doctors with thier info, matching the search criteria.
    Usage:
        /api/doctors/doctor/list
        /api/doctors/doctor/list?category=1&category=2&specialities=1&status=1
        /api/doctors/doctor/list?full_name=jesi
        /api/doctors/doctor/list?id=49
        /api/doctors/doctor/list?&status=pending_approval
    """

    serializer_class = DoctorSerializer
    filterset_class = DoctorFilter
    
    @method_decorator(cache_page(timeout=None))
    def get(self, *args, **kwargs):
        return super().get(*args, **kwargs)


@requires_scope(ADMIN_SCOPE)
class DoctorUpdateView(DoctorQuerysetMixin, generics.UpdateAPIView):
    """
    Update a doctor basic info.
    Usage: /api/doctors/doctor/<pk>/update
    """

    serializer_class = DoctorSerializer

    def patch(self, request, *args, **kwargs):
        logger.debug(f"Doctor update - patch request data: {request.data}")
        return super().patch(request, *args, **kwargs)


# TODO: change once we would like to allow users to add doctors, but also handle status permissions
@requires_scope(ADMIN_SCOPE)
class DoctorCreateView(DoctorQuerysetMixin, generics.CreateAPIView):
    """
    Add a doctor.
    Usage: /api/doctors/doctor/create
    """

    serializer_class = DoctorSerializer

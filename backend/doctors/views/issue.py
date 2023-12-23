"""
Doctor issue model related APIs
"""

from rest_framework import generics, permissions
from rest_framework.decorators import permission_classes
from django_filters import MultipleChoiceFilter, rest_framework as filters
import logging

from users.auth import IsAdmin
from ..models.issue import DoctorIssue
from ..serializers.issue import (
    DoctorIssueCreateSerializer,
    DoctorIssueReadSerializer,
    DoctorIssueUpdateSerializer,
)


logger = logging.getLogger(__name__)


class DoctorIssueFilter(filters.FilterSet):
    """
    Filter options for DoctorIssueListView
    """

    status = MultipleChoiceFilter(choices=DoctorIssue.STATUS, lookup_expr="iexact")
    added_by = filters.CharFilter(lookup_expr="iexact")

    class Meta:
        model = DoctorIssue
        fields = (
            "status",
            "doctor__id",
            "added_by__remote_id",
        )


class DoctorIssueListView(generics.ListAPIView):
    """
    Get list of doctors with thies basic info, matching the search criteria.
    Usage:
        /api/doctors/issue/list
        /api/doctors/issue/list?doctor__id=11
        /api/doctors/issue/list?added_by__remote_id=username
        /api/doctors/issue/list?&status=pending
    """

    queryset = DoctorIssue.objects.all()
    serializer_class = DoctorIssueReadSerializer
    filterset_class = DoctorIssueFilter


PERMISSION_CLASSES = [
    permissions.IsAuthenticated & (IsAdmin | (DoctorIssue.getPermissionClasses().IsCurrentUser & DoctorIssue.getPermissionClasses().IsStatusAllowed))
]


@permission_classes(PERMISSION_CLASSES)
class DoctorIssueCreateView(generics.CreateAPIView):
    """
    Add a doctor issue.
    Usage: /api/doctors/issue/create
    """

    queryset = DoctorIssue.objects.all()
    serializer_class = DoctorIssueCreateSerializer
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):
        logger.debug(f"Doctor issue addition - post request data: {request.data}")
        return super().post(request, *args, **kwargs)


@permission_classes(PERMISSION_CLASSES)
class DoctorIssueUpdateView(generics.UpdateAPIView):
    """
    Update a doctor issue.
    Usage: /api/doctors/issue/<pk>/update
    """

    queryset = DoctorIssue.objects.all()
    serializer_class = DoctorIssueUpdateSerializer
    http_method_names = ["patch"]

    def patch(self, request, *args, **kwargs):
        logger.debug(f"Doctor issue update - patch request data: {request.data}")
        return super().patch(request, *args, **kwargs)

"""
Doctor category model related APIs
"""

from rest_framework import generics
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny

from users.auth import ADMIN_SCOPE, requires_scope
from ..models.doctorCategory import DoctorCategory
from ..serializers.doctorCategory import DoctorCategorySerializer


@permission_classes([AllowAny])
class DoctorCategoryListView(generics.ListAPIView):
    """
    Get list of available categories
    """

    queryset = DoctorCategory.objects.all()
    serializer_class = DoctorCategorySerializer


@requires_scope(ADMIN_SCOPE)
class DoctorCategoryCreateView(generics.CreateAPIView):
    """
    Create a category
    """

    queryset = DoctorCategory.objects.all()
    serializer_class = DoctorCategorySerializer


@requires_scope(ADMIN_SCOPE)
class DoctorCategoryUpdateView(generics.UpdateAPIView):
    """
    Update a category
    """

    queryset = DoctorCategory.objects.all()
    serializer_class = DoctorCategorySerializer

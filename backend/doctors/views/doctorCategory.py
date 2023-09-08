"""
Doctor category model related APIs
"""

from rest_framework import generics

from ..models.doctorCategory import DoctorCategory
from ..serializers.doctorCategory import DoctorCategorySerializer


class DoctorCategoryListView(generics.ListAPIView):
    """
    Get list of available categories
    """

    queryset = DoctorCategory.objects.all()
    serializer_class = DoctorCategorySerializer


class DoctorCategoryCreateView(generics.CreateAPIView):
    """
    Create a category
    """

    queryset = DoctorCategory.objects.all()
    serializer_class = DoctorCategorySerializer


class DoctorCategoryUpdateView(generics.UpdateAPIView):
    """
    Update a category
    """

    queryset = DoctorCategory.objects.all()
    serializer_class = DoctorCategorySerializer

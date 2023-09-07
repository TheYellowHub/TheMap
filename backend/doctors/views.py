"""
Doctors app views:
- List of doctors
- Doctor details
"""

from rest_framework import generics

from . import models
from . import serializers


class DoctorListView(generics.ListAPIView):
    """
    Get list of doctors, matching the search criteria.
    Usage: /api/doctors/info/<pk>
    """

    queryset = models.Doctor.objects.all()
    serializer_class = serializers.DoctorSerializer
    filterset_fields = [
        "status",
        "full_name",
        "categories",
        "specialities",
    ]  # TODO: create filterset classes and make it works


class DoctorInfoView(generics.RetrieveAPIView):
    """
    Get full information about a doctor.
    Usage: /api/doctors/info/<pk>
    """

    queryset = models.Doctor.objects.all()
    serializer_class = serializers.DoctorSerializer

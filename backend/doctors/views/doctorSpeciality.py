"""
Doctor speciality model related APIs
"""

from rest_framework import generics

from ..models.doctorSpeciality import DoctorSpeciality
from ..serializers.doctorSpeciality import DoctorSpecialitySerializer


class DoctorSpecialityListView(generics.ListAPIView):
    """
    Get list of available specialities
    """

    queryset = DoctorSpeciality.objects.all()
    serializer_class = DoctorSpecialitySerializer


class DoctorSpecialityCreateView(generics.CreateAPIView):
    """
    Create a speciality
    """

    queryset = DoctorSpeciality.objects.all()
    serializer_class = DoctorSpecialitySerializer


class DoctorSpecialityUpdateView(generics.UpdateAPIView):
    """
    Update a speciality
    """

    queryset = DoctorSpeciality.objects.all()
    serializer_class = DoctorSpecialitySerializer

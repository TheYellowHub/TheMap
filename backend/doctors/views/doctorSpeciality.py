"""
Doctor speciality model related APIs
"""

from rest_framework import generics

from users.auth import ADMIN_SCOPE, requires_scope
from ..models.doctorSpeciality import DoctorSpeciality
from ..serializers.doctorSpeciality import DoctorSpecialitySerializer


class DoctorSpecialityListView(generics.ListAPIView):
    """
    Get list of available specialities
    """

    queryset = DoctorSpeciality.objects.all()
    serializer_class = DoctorSpecialitySerializer


@requires_scope(ADMIN_SCOPE)
class DoctorSpecialityCreateView(generics.CreateAPIView):
    """
    Create a speciality
    """

    queryset = DoctorSpeciality.objects.all()
    serializer_class = DoctorSpecialitySerializer


@requires_scope(ADMIN_SCOPE)
class DoctorSpecialityUpdateView(generics.UpdateAPIView):
    """
    Update a speciality
    """

    queryset = DoctorSpeciality.objects.all()
    serializer_class = DoctorSpecialitySerializer

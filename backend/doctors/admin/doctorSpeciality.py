from django.contrib import admin

from ..models.doctorSpeciality import DoctorSpeciality


@admin.register(DoctorSpeciality)
class DoctorSpecialityAdmin(admin.ModelAdmin):
    """
    Admin page for DoctorSpeciality model
    """

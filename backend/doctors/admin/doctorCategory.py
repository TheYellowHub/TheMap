from django.contrib import admin

from ..models.doctorCategory import DoctorCategory


@admin.register(DoctorCategory)
class DoctorCategoryAdmin(admin.ModelAdmin):
    """
    Admin page for DoctorCategory model
    """

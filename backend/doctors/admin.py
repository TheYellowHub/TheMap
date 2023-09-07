from django.contrib import admin

from . import models


@admin.register(models.DoctorCategory)
class DoctorCategoryAdmin(admin.ModelAdmin):
    """
    Admin page for DoctorCategory model
    """


@admin.register(models.DoctorSpeciality)
class DoctorSpecialityAdmin(admin.ModelAdmin):
    """
    Admin page for DoctorSpeciality model
    """


@admin.register(models.Doctor)
class DoctorAdmin(admin.ModelAdmin):
    """
    Admin page for Doctor model
    """

    save_as = True

    list_display = ["id", "full_name", "added_at", "updated_at", "status"]
    list_filter = ["added_at", "updated_at", "status"]
    # TODO: actions etc

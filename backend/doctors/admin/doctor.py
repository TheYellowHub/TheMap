from django.contrib import admin

from ..models.doctor import Doctor


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    """
    Admin page for Doctor model
    """

    save_as = True

    list_display = ["id", "full_name", "added_at", "updated_at", "status"]
    list_filter = ["added_at", "updated_at", "status"]

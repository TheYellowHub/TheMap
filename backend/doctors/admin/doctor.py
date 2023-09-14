from django.contrib import admin

from ..models.doctor import Doctor, DoctorLocation


class DoctorLocationAdminInline(admin.TabularInline):
    """
    Doctor locations will be show within the doctor model
    """

    model = DoctorLocation


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    """
    Admin page for Doctor model
    """

    save_as = True

    inlines = (DoctorLocationAdminInline,)

    list_display = ["id", "full_name", "added_at", "updated_at", "status"]
    list_filter = ["added_at", "updated_at", "status"]

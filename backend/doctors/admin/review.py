from django.contrib import admin

from ..models.review import DoctorReview


@admin.register(DoctorReview)
class DoctorReviewAdmin(admin.ModelAdmin):
    """
    Admin page for DoctorReview model
    """

    save_as = True

    list_display = ["doctor", "added_by", "added_at", "updated_at", "status"]
    list_filter = ["added_at", "updated_at", "status"]

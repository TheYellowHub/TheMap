from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """
    Admin page for User model
    """

    list_display = ["id", "remote_id"]

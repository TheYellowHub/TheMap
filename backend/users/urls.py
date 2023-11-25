"""
Doctors app URLs
"""

from django.urls import path

from .views import *


urlpatterns = [
    path(
        "user/<str:remote_id>",
        UserRetrieveUpdateView.as_view(),
        name="retrieve-update-user",
    ),
]

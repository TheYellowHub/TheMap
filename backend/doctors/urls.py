"""
Doctors app URLs
"""

from django.urls import path

from . import views


urlpatterns = [
    path("list", views.DoctorListView.as_view()),
    path("info/<int:pk>", views.DoctorInfoView.as_view()),
]

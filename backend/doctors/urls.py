"""
Doctors app URLs
"""

from django.urls import path

from .views.doctorCategory import (
    DoctorCategoryListView,
    DoctorCategoryCreateView,
    DoctorCategoryUpdateView,
)

from .views.doctorSpeciality import (
    DoctorSpecialityListView,
    DoctorSpecialityCreateView,
    DoctorSpecialityUpdateView,
)

from .views.doctor import (
    DoctorListView,
    DoctorCreateView,
    DoctorUpdateView,
    DoctorInfoView,
)


urlpatterns = [
    path("category/list", DoctorCategoryListView.as_view()),
    path("category/create", DoctorCategoryCreateView.as_view()),
    path("category/<int:pk>/update", DoctorCategoryUpdateView.as_view()),
    path("speciality/list", DoctorSpecialityListView.as_view()),
    path("speciality/create", DoctorSpecialityCreateView.as_view()),
    path("speciality/<int:pk>/update", DoctorSpecialityUpdateView.as_view()),
    path("doctor/list", DoctorListView.as_view()),
    path("doctor/create", DoctorCreateView.as_view()),
    path("doctor/<int:pk>/update", DoctorUpdateView.as_view()),
    path("doctor/<int:pk>", DoctorInfoView.as_view()),
]

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
    # Doctor category
    path("category/list", DoctorCategoryListView.as_view(), name="list-categories"),
    path("category/create", DoctorCategoryCreateView.as_view(), name="create-category"),
    path(
        "category/<int:pk>/update",
        DoctorCategoryUpdateView.as_view(),
        name="update-category",
    ),
    # Doctor speciality
    path(
        "speciality/list", DoctorSpecialityListView.as_view(), name="list-specialities"
    ),
    path(
        "speciality/create",
        DoctorSpecialityCreateView.as_view(),
        name="create-speciality",
    ),
    path(
        "speciality/<int:pk>/update",
        DoctorSpecialityUpdateView.as_view(),
        name="update-speciality",
    ),
    # Doctors
    path("doctor/list", DoctorListView.as_view(), name="list-doctors"),
    path("doctor/create", DoctorCreateView.as_view(), name="create-doctor"),
    path("doctor/<int:pk>/update", DoctorUpdateView.as_view(), name="update-doctor"),
    path("doctor/<int:pk>", DoctorInfoView.as_view(), name="retrieve-doctor"),
]

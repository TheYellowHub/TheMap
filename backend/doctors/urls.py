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
)

from .views.review import (
    DoctorReviewListView,
    DoctorReviewCreateView,
    DoctorReviewUpdateView,
)

from .views.issue import (
    DoctorIssueListView,
    DoctorIssueCreateView,
    DoctorIssueUpdateView,
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
    # Doctor's reviews
    path("review/list", DoctorReviewListView.as_view(), name="list-doctors-review"),
    path(
        "review/create", DoctorReviewCreateView.as_view(), name="create-doctor-review"
    ),
    path(
        "review/<int:pk>/update",
        DoctorReviewUpdateView.as_view(),
        name="update-doctor-review",
    ),
    # Doctor's issues
    path("issue/list", DoctorIssueListView.as_view(), name="list-doctors-issue"),
    path(
        "issue/create", DoctorIssueCreateView.as_view(), name="create-doctor-issue"
    ),
    path(
        "issue/<int:pk>/update",
        DoctorIssueUpdateView.as_view(),
        name="update-doctor-issue",
    ),
]

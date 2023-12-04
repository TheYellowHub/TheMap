"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from rest_framework.schemas import get_schema_view
from django.conf import settings


urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api/schema/",
        get_schema_view(title="TheMapAPI", version="1.0"),
        name="openapi-schema",
    ),
    path(
        "api/swagger/",
        TemplateView.as_view(
            template_name="swagger-ui.html",
            extra_context={"schema_url": "openapi-schema"},
        ),
        name="swagger-ui",
    ),
    path("api/auth/", include("rest_framework.urls")),
    path("api/doctors/", include("doctors.urls")),
    path("api/users/", include("users.urls")),
]

if settings.FRONTEND_DIR:
    urlpatterns.append(
        re_path("", TemplateView.as_view(template_name="index.html")),
    )

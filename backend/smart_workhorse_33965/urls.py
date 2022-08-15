"""smart_workhorse_33965 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.api import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.api'))
"""

from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic.base import TemplateView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('tinymce/', include('tinymce.urls')),
    path("", include("home.urls")),
    path("api/v1/", include("modules.urls")),
    path("accounts/", include("allauth.urls")),
    path("api/v1/", include("home.api.v1.urls")),
    path("admin/", admin.site.urls),
]

admin.site.site_header = "Smart Workhorse"
admin.site.site_title = "Smart Workhorse Admin Portal"
admin.site.index_title = "Smart Workhorse Admin"

# swagger
api_info = openapi.Info(
    title="Smart Workhorse API",
    default_version="v1",
    description="API documentation for Smart Workhorse App",
)

schema_view = get_schema_view(
    api_info,
    public=True,
    permission_classes=(permissions.IsAuthenticated,),
)

urlpatterns += [
    path("api-docs/", schema_view.with_ui("swagger", cache_timeout=0), name="api_docs")
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


urlpatterns += [path("", TemplateView.as_view(template_name='index.html'))]
urlpatterns += [re_path(r"^(?:.*)/?$",
                TemplateView.as_view(template_name='index.html'))]
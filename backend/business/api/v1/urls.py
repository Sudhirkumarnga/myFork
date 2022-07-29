from django.urls import path, include
from rest_framework.routers import DefaultRouter
from business.views import BusinessViewset, EmployeeViewset, CityListApiView, CountryListApiView


router = DefaultRouter()

router.register("employee", EmployeeViewset, basename="employee")
router.register("business", BusinessViewset, basename="employee")

urlpatterns = [
    path('city/', CityListApiView.as_view(), name='city_list'),
    path('country/', CountryListApiView.as_view(), name='country_list'),

] + router.urls

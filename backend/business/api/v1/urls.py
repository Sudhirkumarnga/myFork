from django.urls import path, include
from rest_framework.routers import DefaultRouter
from business.api.v1.views import (
    EmployeeViewset,
    CityListApiView,
    CountryListApiView,
    ProfileView,
    RegionListAPIView,
    LeaveRequestView,
    AttendanceView,
    EarningsView,
    AttendanceFeedbackView, DeleteAccountView
)


router = DefaultRouter()

router.register("employee", EmployeeViewset, basename="employee")
router.register("leave_request", LeaveRequestView, basename="leave_request")

# router.register("profile", ProfileViewset, basename="profile")

urlpatterns = [
    path('city/', CityListApiView.as_view(), name='city_list'),
    path('country/', CountryListApiView.as_view(), name='country_list'),
    path('state/', RegionListAPIView.as_view(), name='state_list'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('attendance/', AttendanceView.as_view(), name='attendance'),
    path('attendance_feedback/', AttendanceFeedbackView.as_view(), name='attendance_feedback'),
    path('earnings/', EarningsView.as_view(), name='earnings'),
    path('delete_account/', DeleteAccountView.as_view(), name='delete_account')

] + router.urls

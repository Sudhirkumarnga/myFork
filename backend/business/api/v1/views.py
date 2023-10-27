from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response

from push_notification.services import create_notification
from smart_workhorse_33965.permissions import IsOrganizationAdmin, IsActiveSubscription
from rest_framework.permissions import IsAuthenticated
from smart_workhorse_33965.response import SmartWorkHorseResponse, SmartWorkHorseStatus
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from users.models import User
from business.services import convert_image_from_bse64_to_blob, send_clock_in_notification_to_employee, \
    send_clock_in_notification_to_business_owner, get_total_amount, send_clock_out_notification_to_business_owner
from business.models import Employee, Country, City, Region, LeaveRequest, Attendance, Business, Feedback
from business.api.v1.serializers import (
    BusinessAdminProfileSerializer,
    BusinessEmployeeProfileSerializer,
    EmployeeSerializer,
    CountrySerializer,
    CitySerializer,
    LightEmployeeSerializer,
    RegionSerializer,
    LeaveRequestSerializer,
    AttendanceSerializer,
    EarningSerializer, AttendanceFeedbackSerializer, EmployeeEarningSerializer, FeedbackSerializer
)

from business.services import (
    update_profile,
    get_payroll_hours
)
from workside.models import Event
import phonenumbers
from phonenumbers import carrier
from phonenumbers.phonenumberutil import number_type


class CountryListApiView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CountrySerializer
    queryset = Country.objects.filter()
    http_method_names = ['get']


class CityListApiView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CitySerializer
    queryset = City.objects.filter()
    http_method_names = ['get']

    def paginate_queryset(self, queryset, view=None):
        return None
    
    def get_queryset(self):
        search = self.request.query_params.get('search', None)
        if search is not None and len(search) >= 3:
            queryset = self.queryset.filter(name__startswith=search)[:10]
        else:
            queryset = self.queryset[:10]
        return queryset

class RegionListAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RegionSerializer
    queryset = Region.objects.filter()
    http_method_names = ['get']

    def paginate_queryset(self, queryset, view=None):
        return None
    
    def get_queryset(self):
        search = self.request.query_params.get('search', None)
        if search is not None and len(search) >= 3:
            queryset = self.queryset.filter(name__startswith=search)[:10]
        else:
            queryset = self.queryset[:10]
        return queryset

class EmployeeViewset(ModelViewSet):
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.filter()
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [
        IsAuthenticated,
        IsActiveSubscription
    ]

    def get_queryset(self):
        if self.request.user.role == "Organization Admin":
            queryset = self.queryset.filter(business__user=self.request.user, is_owner=False)
        if self.request.user.role == "Employee":
            queryset = self.queryset.filter(business__employee__user=self.request.user)
        return queryset

    def get_serializer_context(self):
        context = super(EmployeeViewset, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_serializer_class(self):
        pagination = self.request.query_params.get("pagination", None)
        if pagination == "False":
            return LightEmployeeSerializer
        return EmployeeSerializer

    def paginate_queryset(self, queryset, view=None):
        pagination = self.request.query_params.get("pagination", None)
        if pagination == "False":
            return None
        return self.paginator.paginate_queryset(queryset, self.request, view=self)

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="Employee Data Successfully returned.",
                    status=SmartWorkHorseStatus.Success.value,
                    response=serializer.data
                ),
                status=status.HTTP_200_OK,
                headers={},
            )
        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong in employee data.",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())

            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="Employees Data Successfully returned.",
                    status=SmartWorkHorseStatus.Success.value,
                    response=serializer.data
                ),
                status=status.HTTP_200_OK,
                headers={},
            )
        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong in employees data.",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )

    @staticmethod
    def phone_number_validation(number):
        ph = carrier._is_mobile(number_type(phonenumbers.parse(number)))
        return ph

    def create(self, request, *args, **kwargs):
        try:
            if "contact" in request.data:
                if "mobile" in request.data["contact"]:
                    request.data["contact"]["mobile"] = request.data["contact"]["mobile"].replace("+", "").replace("-", "")
                    request.data["contact"]["mobile"] = "+" + format(int(request.data["contact"]["mobile"][:-1]), ",").replace(",", "-") + request.data["contact"]["mobile"][-1]
                    if not self.phone_number_validation(request.data["contact"]["mobile"]):
                        return Response({"error": "Phone number is not correct"}, status=status.HTTP_400_BAD_REQUEST)
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="Employee Successfully Created.",
                    status=SmartWorkHorseStatus.Success.value,
                    response=serializer.data
                ),
                status=status.HTTP_201_CREATED,
                headers={},
            )
        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong in creating employee",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update(self, request, *args, **kwargs):
        try:
            if "contact" in request.data:
                if "mobile" in request.data["contact"]:
                    request.data["contact"]["mobile"] = request.data["contact"]["mobile"].replace("+", "").replace("-", "")
                    request.data["contact"]["mobile"] = "+" + format(int(request.data["contact"]["mobile"][:-1]), ",").replace(",", "-") + request.data["contact"]["mobile"][-1]
                    if not self.phone_number_validation(request.data["contact"]["mobile"]):
                        return Response({"error": "Phone number is not correct"}, status=status.HTTP_400_BAD_REQUEST)
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="Employee Successfully Updated.",
                    status=SmartWorkHorseStatus.Success.value,
                    response=serializer.data
                ),
                status=status.HTTP_200_OK,
                headers={},
            )
        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong in updating employee",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )


class ProfileView(APIView):
    queryset = User.objects.filter()
    http_method_names = ['get', 'post']
    permission_classes = [IsAuthenticated]

    def get(self, request,):
        try:
            queryset = self.queryset.filter(id=self.request.user.id).first()
            if queryset.role == 'Organization Admin':
                serializer = BusinessAdminProfileSerializer(queryset, many=False)
            if queryset.role == 'Employee':
                serializer = BusinessEmployeeProfileSerializer(queryset, many=False)
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="Profile Data Successfully returned.",
                    status=SmartWorkHorseStatus.Success.value,
                    response=serializer.data
                ),
                status=status.HTTP_201_CREATED,
                headers={},
            )
        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong in creating profile",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request):
        try:
            update_profile(
                self.request.user,
                request.data
            )
            queryset = self.queryset.filter(id=self.request.user.id).first()
            if queryset.role == 'Organization Admin':
                serializer = BusinessAdminProfileSerializer(queryset, many=False)
            if queryset.role == 'Employee':
                serializer = BusinessEmployeeProfileSerializer(queryset, many=False)

            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="Profile Successfully Created.",
                    status=SmartWorkHorseStatus.Success.value,
                    response=serializer.data
                ),
                status=status.HTTP_201_CREATED,
                headers={},
            )
        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong in creating profile",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )


class LeaveRequestView(ModelViewSet):
    permission_classes = [IsAuthenticated, IsActiveSubscription]
    serializer_class = LeaveRequestSerializer
    queryset = LeaveRequest.objects.filter()
    http_method_names = ['get', 'post', 'put']
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['request_type', 'status', 'from_date', 'to_date', 'employee']

    def get_serializer_context(self):
        context = super(LeaveRequestView, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_queryset(self):
        if self.request.user.role == 'Employee':
            queryset = self.queryset.filter(employee__user=self.request.user)
        else:
            queryset = self.queryset.filter(employee__business__user=self.request.user)
        return queryset


class AttendanceView(APIView):
    permission_classes = [IsAuthenticated, IsActiveSubscription]
    queryset = Attendance.objects.filter()

    def get(self, request):
        if request.user.role == "Organization Admin":
            queryset = self.queryset.filter(
                event__worksite__business__user=request.user
            )
            status = self.request.query_params.get('status', None)
            if status:
                queryset = queryset.filter(is_approved=status)
        serializer = AttendanceSerializer(
            queryset,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = AttendanceSerializer(
            data=request.data, many=False,
            context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            send_clock_in_notification_to_business_owner(request)
            send_clock_in_notification_to_employee(request)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        try:
            data = request.data
            attendance_id = self.request.query_params.get('attendance_id', None)
            if attendance_id:
                queryset = self.queryset.filter(id=attendance_id).first()
            else:
                queryset = self.queryset.filter(event__id=request.data['event']).last()

            if 'feedback_media' in data:
                data['feedback_media'] = convert_image_from_bse64_to_blob(data['feedback_media'])
            if 'notes_media' in data:
                data['notes_media'] = convert_image_from_bse64_to_blob(data['notes_media'])

            serializer = AttendanceSerializer(
                queryset,
                data=request.data,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                send_clock_out_notification_to_business_owner(request)
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong.",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )


class AttendanceViewV2(APIView):
    permission_classes = [IsAuthenticated, IsActiveSubscription]
    queryset = Attendance.objects.filter()

    def post(self, request, *args, **kwargs):
        serializer = AttendanceSerializer(
            data=request.data, many=False,
            context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            send_clock_in_notification_to_business_owner(request)
            send_clock_in_notification_to_employee(request)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        try:
            data = request.data
            attendance_id = self.request.query_params.get('attendance_id', None)
            if attendance_id:
                queryset = self.queryset.filter(id=attendance_id).first()
            else:
                queryset = self.queryset.filter(event__id=request.data['event']).last()

            if 'feedback_media' in data:
                data['feedback_media'] = convert_image_from_bse64_to_blob(data['feedback_media'])
            if 'notes_media' in data:
                data['notes_media'] = convert_image_from_bse64_to_blob(data['notes_media'])

            serializer = AttendanceSerializer(
                queryset,
                data=request.data,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                send_clock_out_notification_to_business_owner(request)
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong.",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )




class AttendanceFeedbackView(APIView):
    permission_classes = [IsAuthenticated, IsActiveSubscription]
    queryset = Attendance.objects.filter()

    def put(self, request):
        try:
            attendance_id = self.request.query_params.get('attendance_id', None)
            if attendance_id:
                queryset = self.queryset.filter(id=attendance_id).first()
            else:
                queryset = self.queryset.filter(event__id=request.data['event']).last()

            serializer = AttendanceFeedbackSerializer(
                queryset,
                data=request.data,
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong in updating employee",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )


class EarningsView(APIView):
    queryset = Attendance.objects.filter()
    permission_classes = [IsAuthenticated, IsActiveSubscription]

    def get(self, request):
        date = self.request.query_params.get('date', None)
        month = self.request.query_params.get('month', None)
        year = self.request.query_params.get('year', None)
        from_date = self.request.query_params.get('from', None)
        to_date = self.request.query_params.get('to', None)
        employees = self.request.query_params.getlist('employee', None)

        if request.user.role == "Organization Admin":

            queryset = self.queryset.filter(
                employee__business__user=request.user.id,
                status="CLOCK_OUT"
            )
            if employees:                
                queryset = queryset.filter(employee_id__in=employees)

            if date:
                queryset = queryset.filter(updated_at__day=date)
            if month:
                queryset = queryset.filter(updated_at__month=month)
            if year:
                queryset = queryset.filter(updated_at__year=year)

            if from_date:
                queryset = queryset.filter(updated_at__date__gte=from_date)
            if to_date:
                queryset = queryset.filter(updated_at__date__lte=to_date)

            serializer = EarningSerializer(
                queryset.first(),
                many=False,
                context={
                    'request': request,
                    'queryset': queryset,
                    'employees': [attendance.employee for attendance in queryset.distinct("employee")] 
                }
            )
            data = serializer.data
            if data:
                data['payroll_hours'] = get_payroll_hours(data)

        if request.user.role == "Employee":
            queryset = self.queryset.filter(
                employee__user=request.user.id,
                status="CLOCK_OUT"
            )

            if date:
                queryset = queryset.filter(updated_at__day=date)
            if month:
                queryset = queryset.filter(updated_at__month=month)
            if year:
                queryset = queryset.filter(updated_at__year=year)

            if from_date:
                queryset = queryset.filter(updated_at__date__gte=from_date)
            if to_date:
                queryset = queryset.filter(updated_at__date__lte=to_date)

            data = EmployeeEarningSerializer(
                queryset.first(),
                many=False,
                context={'request': request, 'queryset': queryset}
            ).data

            if data:
                data['total_earned'] = get_total_amount(data)

        return Response(data, status=status.HTTP_200_OK)


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated, IsActiveSubscription]

    def delete(self, request, *args, **kwargs):
        # self.request.user.delete()
        User.objects.filter(id=request.user.id).delete()
        return Response({"msg": "User deleted successfully"}, status=status.HTTP_200_OK)


class FeedbackView(APIView):
    permission_classes = [IsAuthenticated, IsActiveSubscription]
    queryset = Feedback.objects.filter()

    def get(self, request):

        serializer = FeedbackSerializer(
            self.queryset.filter(user=self.request.user),
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = FeedbackSerializer(
            data=request.data, many=False,
            context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

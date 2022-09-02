from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from smart_workhorse_33965.permissions import IsOrganizationAdmin
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from smart_workhorse_33965.response import SmartWorkHorseResponse, SmartWorkHorseStatus
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from users.models import User
from business.models import Employee, Country, City, Region, LeaveRequest
from business.api.v1.serializers import (
    BusinessAdminProfileSerializer,
    BusinessEmployeeProfileSerializer,
    EmployeeSerializer,
    CountrySerializer,
    CitySerializer,
    RegionSerializer,
    LeaveRequestSerializer
)

from business.services import (
    update_profile
)


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


class RegionListAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RegionSerializer
    queryset = Region.objects.filter()
    http_method_names = ['get']


class EmployeeViewset(ModelViewSet):
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.filter(is_owner=False)
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [
        IsAuthenticated,
        IsOrganizationAdmin
    ]

    def get_queryset(self):
        queryset = self.queryset.filter(business__user=self.request.user)
        return queryset

    def get_serializer_context(self):
        context = super(EmployeeViewset, self).get_serializer_context()
        context.update({"request": self.request})
        return context

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

    def create(self, request, *args, **kwargs):
        try:
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

    def get(self, request, format=None):
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
    permission_classes = [IsAuthenticated]
    serializer_class = LeaveRequestSerializer
    queryset = LeaveRequest.objects.filter()
    http_method_names = ['get', 'post', 'put']
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['request_type','status', 'from_date', 'to_date', 'employee']

    def get_serializer_context(self):
        context = super(LeaveRequestView, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_queryset(self):
        if self.request.user.role == 'Employee':
            queryset = self.queryset.filter(employee__user=self.request.user)
        else:
            queryset = self.queryset.filter(employee__business__user=self.request.user)
        return  queryset

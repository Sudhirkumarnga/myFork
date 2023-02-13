import json

from rest_framework import status
from rest_framework.response import Response

from business.models import Attendance
from smart_workhorse_33965.response import SmartWorkHorseResponse, SmartWorkHorseStatus
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from smart_workhorse_33965.permissions import IsOrganizationAdmin, IsActiveSubscription
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.db.models import Q
from workside.models import *
from workside.api.v1.serializers import (
    AttendaceTimesSerializer,
    WorksiteSerializer,
    TaskSerializer,
    TaskAttachmentSerializer,
    FrequencyTaskSerializer,
    EventSerializer,
    SchedularSerializer,
    WorksiteListSerializer,
    AttendanceEventSerializer, EmployeeSerializer
)
from workside.services import (
    update_serializer_data,
    get_filtered_queryset, 
    send_notification_to_employees, 
    send_event_reminder_to_employees,
    get_total_hours
)
from datetime import datetime
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend


class WorkSiteViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin, IsActiveSubscription]
    serializer_class = WorksiteSerializer
    queryset = WorkSite.objects.filter()
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_serializer_context(self):
        context = super(WorkSiteViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_queryset(self):
        queryset = self.queryset.filter(business__user=self.request.user)
        return queryset

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            serializer_data = serializer.data
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="WorkSite Successfully Created.",
                    status=SmartWorkHorseStatus.Success.value,
                    response=serializer_data
                ),
                status=status.HTTP_201_CREATED,
                headers={},
            )
        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong in creating WorkSite",
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
                    message="WorkSite Successfully Updated.",
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
                    message="Something went wrong in updating WorkSite.",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )


class TaskViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsActiveSubscription]
    serializer_class = TaskSerializer
    queryset = Task.objects.filter()
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['worksite']

    def get_queryset(self):
        queryset = self.queryset.filter(worksite__business__user=self.request.user)
        return queryset
    
    def get_serializer_context(self):
        context = super(TaskViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    @action(detail=False, methods=["GET"])
    def task_by_frequency(self, request, *args, **kwargs):
        # try:
        business = Business.objects.get(user=self.request.user)
        serializer = FrequencyTaskSerializer(business, many=False)

        return Response(
            SmartWorkHorseResponse.get_response(
                success=True,
                message="Task Attachement Data Successfully returned.",
                status=SmartWorkHorseStatus.Success.value,
                response=serializer.data
            ),
            status=status.HTTP_200_OK,
            headers={},
        )


class TaskAttachmentViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin, IsActiveSubscription]
    serializer_class = TaskAttachmentSerializer
    queryset = TaskAttachments.objects.filter()
    http_method_names = ['get', 'post', 'delete']

    def get_serializer_context(self):
        context = super(TaskAttachmentViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            serializer_data = serializer.data
            try:
                serializer_data['file'] = instance.file.url
            except:
                serializer_data['file'] = None
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="Task Attachment Data Successfully returned.",
                    status=SmartWorkHorseStatus.Success.value,
                    response=serializer_data
                ),
                status=status.HTTP_200_OK,
                headers={},
            )
        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong in Task Attachment data.",
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
                serializer_data = update_serializer_data(serializer.data)
                return self.get_paginated_response(serializer_data)

            serializer = self.get_serializer(queryset, many=True)
            serializer_data = update_serializer_data(serializer.data)
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="Task Attachment Data Successfully returned.",
                    status=SmartWorkHorseStatus.Success.value,
                    response=serializer_data
                ),
                status=status.HTTP_200_OK,
                headers={},
            )
        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong in Task Attachment data.",
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
            queryset = TaskAttachments.objects.get(id=serializer.data['id'])
            serializer_data = serializer.data
            serializer_data['file'] = queryset.file.url
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="Task Attachment Successfully Created.",
                    status=SmartWorkHorseStatus.Success.value,
                    response=serializer_data
                ),
                status=status.HTTP_201_CREATED,
                headers={},
            )
        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong in creating Task Attachment",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )


class EventView(ModelViewSet):
    queryset = Event.objects.filter()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsOrganizationAdmin, IsActiveSubscription]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        queryset = self.queryset.filter(worksite__business__user=self.request.user)
        return queryset

    def get_serializer_context(self):
        context = super(EventView, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            send_notification_to_employees(
                Employee.objects.filter(
                    id__in=request.data['employees']
                )
            )
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="Event Successfully Created.",
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
                    message="Something went wrong in creating Event.",
                    status=SmartWorkHorseStatus.Error.value,
                    error=serializer.errors,
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["POST"])
    def delete_events(self, request, *args, **kwargs):
        try:
            event_id = request.data.get('event')
            this_and_following_event = request.data.get('this_and_following_event')
            all_events = request.data.get('all_events')

            if event_id and this_and_following_event:
                event = Event.objects.filter(id=event_id)
                if event.exists():
                    events = Event.objects.filter(parent=event.first().parent, start_time__gte=event.first().start_time)
                    for event in events:
                        event.delete()
            
            elif all_events:
                events = Event.objects.filter(worksite__business__user=request.user)
                for event in events:
                    event.delete()
            
            elif event_id:
                event = Event.objects.filter(id=event_id)
                if event.exists():
                    event.first().delete()

            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="All Event's successfully deleted.",
                    status=SmartWorkHorseStatus.Success.value,
                ),
                status=status.HTTP_201_CREATED,
                headers={},
            )

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
        
    @action(detail=False, methods=["POST"])
    def publish_all_events(self, request, *args, **kwargs):
        try:
            events = Event.objects.filter(worksite__business__user=request.user, event_status="DRAFT")
            for event in events:
                send_event_reminder_to_employees(
                event.start_time,
                [employee.id for employee in event.employees.all()],
                event.worksite.id
            )
            create_events_according_to_frequency(
                event, 
                [employee.id for employee in event.employees.all()], 
                [task.id for task in event.selected_tasks.all()]
            )
            event.event_status = "PUBLISHED"
            event.save()
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="All Drafted Event's successfully published.",
                    status=SmartWorkHorseStatus.Success.value,
                ),
                status=status.HTTP_201_CREATED,
                headers={},
            )

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

class SchedularView(APIView):
    queryset = Event.objects.filter()
    permission_classes = [IsAuthenticated, IsActiveSubscription]
    http_method_names = ['get', 'post', 'put', 'patch']

    def get(self, request):
        try:
            if self.request.user.role == "Organization Admin":
                queryset = self.queryset.filter(worksite__business__user=self.request.user)
            else:
                queryset = self.queryset.filter(
                    employees__id=Employee.objects.get(user=self.request.user).id
                )
            queryset = get_filtered_queryset(request, queryset)
            serializer = SchedularSerializer(
                queryset,
                many=True,
                context={'request': request}
            )
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="All Schedules successfully returned.",
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
                    message="Something went wrong.",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request):
        try:
            queryset = self.queryset.filter(
                id__in=request.data['events']
            )
            for event in queryset:
                event.event_status = "PUBLISHED"
                event.save()

            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="All Schedules successfully Published.",
                    status=SmartWorkHorseStatus.Success.value,
                ),
                status=status.HTTP_201_CREATED,
                headers={},
            )
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


class WorksiteListView(APIView):
    queryset = Event.objects.filter()
    permission_classes = [IsAuthenticated, IsActiveSubscription]
    http_method_names = ['get']

    def get(self, request):
        try:
            employee = Employee.objects.filter(user=self.request.user)
            queryset = self.queryset.filter(employees__in=employee)
            serializer = WorksiteListSerializer(queryset, many=True)
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="All Worksites successfully returned.",
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
                    message="Something went wrong.",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )


class UpcomingShiftView(APIView):
    queryset = Event.objects.filter()
    permission_classes = [IsAuthenticated, IsActiveSubscription]

    def get(self, request):
        employee = Employee.objects.filter(user=self.request.user)
        queryset = self.queryset.filter(
            ~Q(event_status='DRAFT'),
            end_time__gte=datetime.now(),
            employees__in=employee,
        ).order_by('start_time')
        if queryset.exists():
            attendance = Attendance.objects.filter(
                event=queryset.first(),
                employee__user=request.user,
                status="CLOCK_OUT"
            )
            if not attendance.exists():
                serializer_data = AttendanceEventSerializer(
                    queryset.first(),
                    many=False,
                    context={'request': request}
                ).data
            else:
                serializer_data = {}
        else:
            serializer_data = {}
        serializer_data['active_employees'] = EmployeeSerializer(
            Employee.objects.filter(
                business=Employee.objects.get(
                    user=request.user
                ).business
            ),
            many=True
        ).data
        serializer_data['total_hours'] = get_total_hours(request)
        return Response(serializer_data)



class UpcomingShiftViewV2(APIView):
    queryset = Event.objects.filter()
    permission_classes = [IsAuthenticated, IsActiveSubscription]

    def get(self, request):
        employee = Employee.objects.filter(user=self.request.user)
        queryset = self.queryset.filter(
            ~Q(event_status='DRAFT'),
            end_time__gte=datetime.now(),
            employees__in=employee,
        ).order_by('start_time')
        if queryset.exists():
            attendance = Attendance.objects.filter(
                event=queryset.first(),
                employee__user=request.user,
                is_shift_completed=True
            )
            if not attendance.exists():
                serializer_data = AttendanceEventSerializer(
                    queryset.first(),
                    many=False,
                    context={'request': request}
                ).data
            else:
                serializer_data = {}
        else:
            serializer_data = {}
        return Response(serializer_data)

    def finalize_response(self, request, response, *args, **kwargs):
        response.data['active_employees'] = EmployeeSerializer(
        Employee.objects.filter(
            business=Employee.objects.get(
                user=request.user
            ).business
        ),
            many=True
        ).data
        response.data['total_hours'] = get_total_hours(request)
        return super().finalize_response(request, response, *args, **kwargs)


class GetAttendaceTimes(APIView):
    permission_classes = [IsAuthenticated, IsActiveSubscription]

    def get(self, request):
        queryset = Attendance.objects.filter(
            employee__user=request.user,
            event__id=request.query_params.get("event", None)
        )
        serializer = AttendaceTimesSerializer(
            queryset,
            many=True
        )
        return Response(serializer.data)
    
    def put(self, request):
        for shift in request.data.get('shifts'):
            attendance = Attendance.objects.filter(
                id=shift.get('id'),
                event__id=request.data.get("event")
            )
            if attendance.exists():
                attendance = attendance.first()
                attendance.clock_in_time=datetime.strptime(shift['clock_in_time'], '%Y-%m-%d %H:%M:%S')
                attendance.clock_out_time=datetime.strptime(shift['clock_out_time'], '%Y-%m-%d %H:%M:%S')
                attendance.save()

        serializer = AttendaceTimesSerializer(
            Attendance.objects.filter(
                employee__user=request.user,
                event__id=request.data.get('event')
            ),
            many=True
        )
        return Response(serializer.data)
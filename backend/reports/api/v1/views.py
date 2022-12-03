from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from business.models import Attendance
from reports.api.v1.serializers import PayrollReportSerializer, WorksiteSerializer, TaskSerializer, \
    InspectionReportSerializer, TaskFeedbackSerializer, LocationVarianceReportSerializer, \
    ScheduleVarianceReportSerializer
from smart_workhorse_33965.permissions import IsOrganizationAdmin, IsActiveSubscription
from smart_workhorse_33965.response import SmartWorkHorseResponse, SmartWorkHorseStatus
from workside.models import WorkSite, Task
from reports.models import InspectionReport, TaskFeedback


class PayrollReport(APIView):
    queryset = Attendance.objects.filter()
    permission_classes = [IsAuthenticated, IsOrganizationAdmin, IsActiveSubscription]
    http_method_names = ['get']

    def get(self, request):
        try:
            queryset = self.queryset.filter(employee__business__user=self.request.user)
            employee = self.request.query_params.get('employee', None)
            from_date = self.request.query_params.get('from', None)
            to_date = self.request.query_params.get('to', None)
            if employee:
                queryset = queryset.filter(
                    employee_id=employee
                )
            if from_date:
                queryset = queryset.filter(
                    updated_at__date__gte=from_date
                )
            if to_date:
                queryset = queryset.filter(
                    updated_at__date__lte=to_date
                )
            serializer = PayrollReportSerializer(
                queryset,
                many=True
            )
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="Payroll reports successfully returned.",
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
                    message="Something went wrong in Payroll reports.",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )


class GetWorksitesView(APIView):
    queryset = WorkSite.objects.filter()
    permission_classes = [IsAuthenticated, IsOrganizationAdmin, IsActiveSubscription]
    http_method_names = ['get']

    def get(self, request):
        try:
            queryset = self.queryset.filter(business__user=self.request.user)
            serializer = WorksiteSerializer(
                queryset,
                many=True
            )
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="All worksites successfully returned",
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


class GetWorksitesTasksView(APIView):
    queryset = Task.objects.filter()
    permission_classes = [IsAuthenticated, IsOrganizationAdmin, IsActiveSubscription]
    http_method_names = ['get']

    def get(self, request):
        try:
            worksite = self.request.query_params.get('worksite_id', None)
            queryset = self.queryset.filter(worksite=worksite)
            serializer = TaskSerializer(
                queryset,
                many=True
            )
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="All Tasks successfully returned",
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


class InspectionReportView(ModelViewSet):
    permission_classes = [IsAuthenticated, IsActiveSubscription]
    serializer_class = InspectionReportSerializer
    queryset = InspectionReport.objects.filter()
    http_method_names = ['get', 'post']

    def get_serializer_context(self):
        context = super(InspectionReportView, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_queryset(self):
        from_date = self.request.query_params.get('from', None)
        to_date = self.request.query_params.get('to', None)
        queryset = self.queryset.filter(worksite__business__user=self.request.user)
        if from_date:
            queryset = queryset.filter(
                updated_at__date__gte=from_date
            )
        if to_date:
            queryset = queryset.filter(
                updated_at__date__lte=to_date
            )
        return queryset


class TaskFeedbackView(APIView):
    queryset = TaskFeedback.objects.filter()
    permission_classes = [IsAuthenticated, IsActiveSubscription]
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        task_feedback = TaskFeedback.objects.filter(
            report_id=request.data['report']
        )
        if task_feedback.exists():
            task_feedback = task_feedback.first()
            task_feedback.task__id = request.data['tasks']
            task_feedback.feedback = request.data['feedback']
            task_feedback.save()

            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="Task Response Successfully created.",
                    status=SmartWorkHorseStatus.Success.value,
                    response=TaskFeedbackSerializer(
                        task_feedback,
                        many=False
                    ).data
                ),
                status=status.HTTP_201_CREATED,
                headers={},
            )
        return Response(status=status.HTTP_404_NOT_FOUND)


class LocationVarianceReport(APIView):
    queryset = Attendance.objects.filter()
    permission_classes = [IsAuthenticated, IsOrganizationAdmin, IsActiveSubscription]
    http_method_names = ['get']

    def get(self, request):
        try:
            queryset = self.queryset.filter(employee__business__user=self.request.user)
            employee = self.request.query_params.get('employee', None)
            from_date = self.request.query_params.get('from', None)
            to_date = self.request.query_params.get('to', None)
            if employee:
                queryset = queryset.filter(
                    employee_id=employee
                )
            if from_date:
                queryset = queryset.filter(
                    updated_at__date__gte=from_date
                )
            if to_date:
                queryset = queryset.filter(
                    updated_at__date__lte=to_date
                )
            serializer = LocationVarianceReportSerializer(
                queryset,
                many=True
            )
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="Location Variance reports successfully returned.",
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
                    message="Something went wrong in Payroll reports.",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )


class ScheduleVarianceReport(APIView):
    queryset = Attendance.objects.filter()
    permission_classes = [IsAuthenticated, IsOrganizationAdmin, IsActiveSubscription]
    http_method_names = ['get']

    def get(self, request):
        try:
            queryset = self.queryset.filter(employee__business__user=self.request.user)
            employee = self.request.query_params.get('employee', None)
            from_date = self.request.query_params.get('from', None)
            to_date = self.request.query_params.get('to', None)
            if employee:
                queryset = queryset.filter(
                    employee_id=employee
                )
            if from_date:
                queryset = queryset.filter(
                    updated_at__date__gte=from_date
                )
            if to_date:
                queryset = queryset.filter(
                    updated_at__date__lte=to_date
                )
            serializer = ScheduleVarianceReportSerializer(
                queryset,
                many=True
            )
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="Schedule Variance reports successfully returned.",
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
                    message="Something went wrong in Payroll reports.",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from business.models import Attendance
from reports.api.v1.serializers import PayrollReportSerializer
from smart_workhorse_33965.permissions import IsOrganizationAdmin
from smart_workhorse_33965.response import SmartWorkHorseResponse, SmartWorkHorseStatus


class PayrollReport(APIView):
    queryset = Attendance.objects.filter()
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]
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
                    date__date__gte=from_date
                )
            if to_date:
                queryset = queryset.filter(
                    date__lte=to_date
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

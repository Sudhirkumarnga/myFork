from rest_framework.serializers import ModelSerializer
from business.models import Attendance


class PayrollReportSerializer(ModelSerializer):
    class Meta:
        model = Attendance
        fields = ('employee', 'total_hours', 'earnings', 'updated_at')

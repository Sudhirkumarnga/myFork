from rest_framework.serializers import ModelSerializer
from business.models import Attendance
from reports.models import InspectionReport, InspectionArea, InspectionReportMedia, TaskFeedback
from workside.models import WorkSite, Task
from business.services import convert_image_from_bse64_to_blob


class PayrollReportSerializer(ModelSerializer):
    class Meta:
        model = Attendance
        fields = ('employee', 'total_hours', 'earnings', 'updated_at')


class WorksiteSerializer(ModelSerializer):
    class Meta:
        model = WorkSite
        fields = ('id', 'name',)


class TaskSerializer(ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'name',)


class InspectionAreaSerializer(ModelSerializer):
    class Meta:
        model = InspectionArea
        exclude = ('report', 'created_at', 'updated_at',)


class InspectionReportMediaSerializer(ModelSerializer):
    class Meta:
        model = InspectionReportMedia
        exclude = ('report', 'created_at', 'updated_at',)


class InspectionReportSerializer(ModelSerializer):
    class Meta:
        model = InspectionReport
        fields = ('id', 'name', 'worksite')

    def to_representation(self, data):
        data = super(InspectionReportSerializer, self).to_representation(data)
        data['worksite'] = data['worksite']
        data['areas'] = InspectionAreaSerializer(
            InspectionArea.objects.filter(report_id=data['id']),
            many=True
        ).data
        data['media'] = InspectionReportMediaSerializer(
            InspectionReportMedia.objects.filter(report_id=data['id']),
            many=True
        ).data
        return data

    def create(self, validated_data):
        request = self.context['request']
        data = request.data
        report = InspectionReport.objects.create(
            name=data['name'],
            worksite=WorkSite.objects.get(id=data['worksite'])
        )

        for area in data['areas']:
            inspection_area = InspectionArea.objects.create(
                report=report,
                area_name=area['area_name']
            )
            for task in area['tasks']:
                inspection_area.tasks.add(task)

        if data.__contains__('media'):
            for file in data['media']:
                InspectionReportMedia.objects.create(
                    report=report,
                    file=convert_image_from_bse64_to_blob(file['file'])
                )
        return report


class TaskFeedbackSerializer(ModelSerializer):
    class Meta:
        model = TaskFeedback
        exclude = ('created_at', 'updated_at',)

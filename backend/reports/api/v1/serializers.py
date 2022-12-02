from rest_framework.serializers import ModelSerializer
from business.models import Attendance, Employee
from reports.models import InspectionReport, InspectionArea, InspectionReportMedia, TaskFeedback
from reports.services import calculate_distance_deviation
from workside.models import WorkSite, Task, Event
from business.services import convert_image_from_bse64_to_blob


class LocationVarianceReportSerializer(ModelSerializer):
    class Meta:
        model = Attendance
        fields = ('event', 'clock_in_time', 'employee', 'location', 'latitude', 'longitude', 'created_at')

    def to_representation(self, data):
        data = super(LocationVarianceReportSerializer, self).to_representation(data)
        event = Event.objects.get(id=data['event'])
        data['clockin'] = data['clock_in_time']
        data['employee'] = Employee.objects.get(id=data['employee']).user.get_full_name()
        data['worksite'] = event.worksite.name
        data['actual_time'] = event.start_time
        data['worksite_location'] = event.worksite.location
        data['actual_location'] = data['location']
        data['distance_deviation'] = calculate_distance_deviation(data, event.worksite)
        del data['clock_in_time']
        del data['latitude']
        del data['longitude']
        del data['event']
        del data['location']
        return data


class ScheduleVarianceReportSerializer(ModelSerializer):
    class Meta:
        model = Attendance
        fields = ('id', 'event', 'created_at', 'employee', 'clock_in_time')

    def to_representation(self, data):
        data = super(ScheduleVarianceReportSerializer, self).to_representation(data)
        event = Event.objects.get(id=data['event'])
        attendance = Attendance.objects.get(id=data['id'])
        data['employee'] = Employee.objects.get(id=data['employee']).user.get_full_name()
        data['worksite'] = event.worksite.name
        data['actual_time'] = event.start_time
        data['edited_time'] = data['clock_in_time']
        data['scheduled_shift_duration'] = (event.end_time - event.start_time) // 60
        try:
            data['actual_shift_duration'] = (attendance.clock_out_time - attendance.clock_in_time) // 60
            data['variance'] = data['scheduled_shift_duration'] - data['actual_shift_duration']
        except:
            data['actual_shift_duration'] = None
            data['variance'] = None
        del data['event']
        return data


class PayrollReportSerializer(ModelSerializer):
    class Meta:
        model = Attendance
        fields = ('employee', 'total_hours', 'earnings', 'updated_at',)
        depth = 2


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
        depth = 1


class InspectionReportMediaSerializer(ModelSerializer):
    class Meta:
        model = InspectionReportMedia
        exclude = ('report', 'created_at', 'updated_at',)


class InspectionReportSerializer(ModelSerializer):
    class Meta:
        model = InspectionReport
        fields = ('id', 'name', 'worksite', 'created_at',)
        depth = 1

    def to_representation(self, data):
        data = super(InspectionReportSerializer, self).to_representation(data)
        request = self.context['request']
        data['inspector'] = request.user.get_full_name()
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

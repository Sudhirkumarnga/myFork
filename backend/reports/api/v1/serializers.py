from rest_framework.serializers import ModelSerializer
from business.models import Attendance, Employee
from reports.models import InspectionReport, InspectionReportMedia, TaskFeedback
from reports.services import calculate_distance_deviation, get_stats
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
        fields = ('id', 'employee', 'total_hours', 'earnings', 'updated_at',)
        depth = 1

    def to_representation(self, data):
        data = super(PayrollReportSerializer, self).to_representation(data)
        data['employee']['name'] = Employee.objects.get(id=data['employee']['id']).user.get_full_name()
        return data

class WorksiteSerializer(ModelSerializer):
    class Meta:
        model = WorkSite
        fields = ('id', 'name',)


class TaskSerializer(ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'name',)


class InspectionReportMediaSerializer(ModelSerializer):
    class Meta:
        model = InspectionReportMedia
        exclude = ('report', 'created_at', 'updated_at',)


class InspectionReportSerializer(ModelSerializer):
    class Meta:
        model = InspectionReport
        fields = ('id', 'name', 'worksite', 'tasks', 'created_at',)

    def to_representation(self, data):
        data = super(InspectionReportSerializer, self).to_representation(data)
        data['worksite'] = WorksiteSerializer(
            WorkSite.objects.get(id=data['worksite'])
        ).data
        data['tasks'] = TaskFeedbackSerializer(
            TaskFeedback.objects.filter(report_id=data['id']),
            many=True
        ).data
        data['media'] = InspectionReportMediaSerializer(
            InspectionReportMedia.objects.filter(report_id=data['id']),
            many=True
        ).data
        data['stats'] = get_stats(data['tasks'])
        return data

    def create(self, validated_data):
        request = self.context['request']
        data = request.data
        report = InspectionReport.objects.create(
            name=validated_data['name'],
            worksite=validated_data['worksite'],
        )
        report.tasks.set(validated_data['tasks'])
        for task in validated_data["tasks"]:
            TaskFeedback.objects.create(
                report=report,
                tasks=task
            )
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
        exclude = ('created_at', 'updated_at', 'report',)

    def to_representation(self, data):
        data = super(TaskFeedbackSerializer, self).to_representation(data)
        task = Task.objects.get(id=data['tasks'])
        data['id'] = task.id
        data['tasks'] = task.name
        return data

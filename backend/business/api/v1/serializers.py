import base64

from django.core.files.base import ContentFile
from rest_framework.serializers import ModelSerializer
from django_countries.serializers import CountryFieldMixin
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers

from home.services import get_remaining_employee_limit, update_subscription
from users.models import User
from datetime import datetime
from workside.models import Event
from business.models import (
    Business,
    Employee,
    BusinessAddress,
    Country,
    City,
    Region,
    Region,
    EmergencyContact,
    Attendance,
    LeaveRequest, Feedback, FeedbackMedia
)

from business.services import (
    create_user_for_employee,
    create_employee,
    send_email_to_employee,
    update_user_for_employee,
    update_employee, create_feedback
)
import phonenumbers
from phonenumbers import carrier
from phonenumbers.phonenumberutil import number_type
from django.core.exceptions import ValidationError


def convert_image_from_bse64_to_blob(image):
    data = ContentFile(base64.b64decode(image), name='file.jpg')
    return data


class CountrySerializer(ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"


class CitySerializer(ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'region']
        depth=1

class RegionSerializer(ModelSerializer):
    class Meta:
        model = Region
        fields = "__all__"


class BusinessAddressSerializer(CountryFieldMixin, ModelSerializer):
    class Meta:
        model = BusinessAddress
        exclude = ['id', 'created_at', 'updated_at', 'business']

    def to_representation(self, data):
        data = super(BusinessAddressSerializer, self).to_representation(data)
        data['city_name'] = City.objects.get(id=data['city']).name if data['city'] is not None else None
        data['state_name'] = Region.objects.get(id=data['state']).name if data['state'] is not None else None
        return data


class BusinessSerializer(ModelSerializer):
    class Meta:
        model = Business
        fields = ['name', 'business_code', 'pay_frequency', 'profile_image']


class EmployeePersonalInformationSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'gender', 'date_of_birth']


class EmployeeAddressInformationSerializer(ModelSerializer):
    class Meta:
        model = Employee
        fields = ['address_line_one', 'address_line_two', 'city', 'state']
    
    def to_representation(self, data):
        data = super(EmployeeAddressInformationSerializer, self).to_representation(data)
        data['city_name'] = City.objects.get(id=data['city']).name if data['city'] is not None else None
        data['state_name'] = Region.objects.get(id=data['state']).name if data['state'] is not None else None
        return data


class EmployeeWorkInformationSerializer(ModelSerializer):
    class Meta:
        model = Employee
        fields = ['position', 'hourly_rate']


class EmployeeContactSerializer(CountryFieldMixin, ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'phone']


class LightEmployeeSerializer(ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'user']

    def to_representation(self, data):
        data = super(LightEmployeeSerializer, self).to_representation(data)
        data['name'] = User.objects.get(id=data['user']).get_full_name()
        del data['user']
        return data

class EmployeeSerializer(ModelSerializer):
    personal_information = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()
    address_information = serializers.SerializerMethodField()
    work_information = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['id', 'is_owner', 'personal_information', 'contact', 'address_information', 'work_information']

    def to_representation(self, data):
        data = super(EmployeeSerializer, self).to_representation(data)
        data['user_id'] = Employee.objects.get(
            id=data['id']
        ).user.id
        return data

    @staticmethod
    def get_personal_information(obj):
        data = EmployeePersonalInformationSerializer(obj.user, many=False).data
        try:
            data['profile_image'] = obj.profile_image.url
        except Exception:
            data['profile_image'] = None
        return data

    @staticmethod
    def get_contact(obj):
        data = EmployeeContactSerializer(
            obj.user,
            many=False
        ).data
        data['mobile'] = str(obj.mobile)
        return data

    @staticmethod
    def get_address_information(obj):
        return EmployeeAddressInformationSerializer(
            obj, many=False
        ).data

    @staticmethod
    def get_work_information(obj):
        return EmployeeWorkInformationSerializer(
            obj,
            many=False
        ).data

    @staticmethod
    def phone_number_validation(number):
        ph = carrier._is_mobile(number_type(phonenumbers.parse(number)))
        return ph

    def create(self, validated_data):
        request = self.context['request']
        if "contact" in request.data:
            if "mobile" in request.data["contact"]:
                request.data["contact"]["mobile"] = request.data["contact"]["mobile"].replace("+", "").replace("-", "")
                request.data["contact"]["mobile"] = "+" + format(int(request.data["contact"]["mobile"][:-1]), ",").replace(",", "-") + request.data["contact"]["mobile"][-1]
                if not self.phone_number_validation(request.data["contact"]["mobile"]):
                    raise ValidationError("mobile number is not correct")
        business = Business.objects.get(user=request.user)
        if not business.subscription:
            raise serializers.ValidationError(
                {"subscription": _("Plz Active You subscription in order to create Employee.")}
            )
        count = get_remaining_employee_limit(business)
        if count < 1:
            raise serializers.ValidationError(
                _("Employee account limit exceeds, plz contact to Business Administrator"))
        employee_user, password = create_user_for_employee(request.data)
        employee = create_employee(employee_user, request.data, request.user)
        send_email_to_employee(employee_user, password)
        update_subscription(business.business_code)
        return employee

    def update(self, instance, validated_data):
        request = self.context['request']
        if "contact" in request.data:
            if "mobile" in request.data["contact"]:
                request.data["contact"]["mobile"] = request.data["contact"]["mobile"].replace("+", "").replace("-", "")
                request.data["contact"]["mobile"] = "+" + format(int(request.data["contact"]["mobile"][:-1]), ",").replace(",", "-") + request.data["contact"]["mobile"][-1]
                if not self.phone_number_validation(request.data["contact"]["mobile"]):
                    raise ValidationError("mobile number is not correct")
        employee_user, password = update_user_for_employee(request.data, instance)
        employee = update_employee(employee_user, request.data)
        send_email_to_employee(employee_user, password)
        return employee


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'phone', 'gender', 'date_of_birth']


class EmergencyContactSerializer(ModelSerializer):
    class Meta:
        model = EmergencyContact
        exclude = ['employee', 'id', 'is_active', 'created_at', 'updated_at']


class BusinessAdminProfileSerializer(ModelSerializer):
    business_information = serializers.SerializerMethodField(read_only=True)
    personal_information = serializers.SerializerMethodField(read_only=True)
    business_address = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['business_information', 'personal_information', 'business_address']

    @staticmethod
    def get_business_information(obj):
        return BusinessSerializer(
            Business.objects.get(user=obj),
            many=False
        ).data

    @staticmethod
    def get_personal_information(obj):
        return UserSerializer(
            obj,
            many=False
        ).data

    @staticmethod
    def get_business_address(obj):
        return BusinessAddressSerializer(
            BusinessAddress.objects.get(business__user=obj),
            many=False
        ).data


class BusinessEmployeeProfileSerializer(ModelSerializer):
    personal_information = serializers.SerializerMethodField(read_only=True)
    emergency_contact = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['personal_information', 'emergency_contact']

    @staticmethod
    def get_personal_information(obj):
        employee = Employee.objects.get(user=obj)
        data = UserSerializer(
            obj,
            many=False
        ).data
        data['profile_image'] = employee.profile_image.url if employee.profile_image else None
        return data

    @staticmethod
    def get_emergency_contact(obj):
        return EmergencyContactSerializer(
            EmergencyContact.objects.get(employee__user=obj),
            many=False
        ).data


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def update(self, instance, validated_data):
        request = self.context['request']
        User.objects.filter(id=self.request.user.id).update(**request.data['personal_information'])
        if request.user.role == 'Organization Admin':
            Business.objects.filter(user=self.request.user).update(**request.data['business_information'])
            BusinessAddress.objects.filter(user=self.request.user).update(**request.data('business_address'))
        else:
            EmergencyContact.objects.filter(employee__user=request.user).update(**request.data['emergency_contact'])
        return request.user


class LeaveRequestSerializer(ModelSerializer):
    class Meta:
        model = LeaveRequest
        exclude = ('updated_at',)

    def to_representation(self, data):
        data = super(LeaveRequestSerializer, self).to_representation(data)
        request = self.context['request']
        if request.user.role == "Organization Admin":
            data['Employee_name'] = Employee.objects.get(id=data['employee']).user.get_full_name()
            del data['employee']
        return data

    def create(self, validated_data):
        request = self.context['request']
        validated_data['employee'] = Employee.objects.get(user=request.user)
        leave_request = LeaveRequest.objects.create(
            **validated_data
        )
        return leave_request


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        exclude = ('updated_at',)

    def to_representation(self, data):
        data = super(AttendanceSerializer, self).to_representation(data)
        request = self.context['request']
        if request.user.role != "Organization Admin":
            del data['created_at']
        return data

    def validate(self, data):
        request = self.context['request']
        if not request.user.role == "Organization Admin":
            if data['status'].__contains__('CLOCK_IN'):
                event = Event.objects.filter(
                    start_time__lte=datetime.now(),
                    end_time__gte=datetime.now(),
                    employees__in=[Employee.objects.get(user=request.user).id]
                )
                if not event.exists():
                    raise serializers.ValidationError(_("Event Time not started or you're not allowed to clockin."))

        # if request.method == "POST":
        #     attendance = Attendance.objects.filter(
        #         event=data['event'],
        #         employee__user=request.user
        #     )
        #     if attendance.exists():
        #         raise serializers.ValidationError(
        #             {"event": _(
        #                 "You already attend this event."
        #             )
        #             }
        #         )
        if request.method in ["PUT", "PATCH"]:
            if all(key in data for key in ('clock_in_time', 'clock_out_time')):
                if data['clock_out_time'] <= data['clock_in_time']:
                    raise serializers.ValidationError({"clock_out_time": _("Clock out time should be greater than clock in time.")})
        return data

    def create(self, validated_data):
        request = self.context['request']
        validated_data['employee'] = Employee.objects.get(user=request.user)
        validated_data['clock_in_time'] = datetime.now()
        validated_data['worksite_name'] = validated_data['event'].worksite.name
        attendance = Attendance.objects.create(
            **validated_data
        )
        return attendance


class AttendanceFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ('id', 'attendance_feedback',)


class EarningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ()

    def to_representation(self, data):
        data = super(EarningSerializer, self).to_representation(data)
        queryset = self.context['queryset']
        employees = self.context['employees']
        employees_list = []
        for employee in employees:
            attendances = Attendance.objects.filter(employee=employee)
            dict = {}
            dict['employee_hours'], dict['employee_earnings'] = 0, 0
            for attendance in attendances:
                dict['employee_hours'] += attendance.total_hours
                dict['employee_earnings'] += attendance.earnings
            dict['employee_hourly_rate'] = attendances.first().employee.hourly_rate
            dict['created_at'] = attendances.first().created_at
            dict['employee_name'] = attendances.first().employee.user.get_full_name()
            dict['employee_id'] = attendances.first().employee.id
            dict['employee_image'] = attendances.first().employee.profile_image.url if attendance.employee.profile_image else None
            dict['employee_position'] = attendances.first().employee.position
            employees_list.append(dict)
        data['employees'] = employees_list
        data['date'] = queryset.first().updated_at.date()
        return data

class EmployeeEarningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ()

    def to_representation(self, data):
        data = super(EmployeeEarningSerializer, self).to_representation(data)
        attendances = self.context['queryset']
        worksites = []
        for attendance in attendances:
            worksite = {
                'worksite': attendance.worksite_name,
                'amount_clocked': attendance.total_hours,
                'earned': attendance.earnings,
                'created_at': attendance.updated_at.date()
            }
            worksites.append(worksite)
        data['worksites'] = worksites
        if attendances.first():
            data['date'] = attendances.first().updated_at.date()
        return data


class FeedbackSerializer(serializers.ModelSerializer):
    files = serializers.DictField(child=serializers.CharField(allow_null=True), write_only=True, required=False)
    feedback_media = serializers.SerializerMethodField("get_feedback_media", read_only=True)

    class Meta:
        model = Feedback
        fields = (
            "id", "email", "message", "user", "files",
            "feedback_media"
        )

    @staticmethod
    def get_feedback_media(obj):
        return FeedbackMediaSerializer(
            FeedbackMedia.objects.filter(feedback=obj),
            many=True
        ).data

    def create(self, validated_data):
        request = self.context['request']
        feedback = create_feedback(validated_data, request)
        return feedback


class FeedbackMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackMedia
        fields = ('id', 'file')

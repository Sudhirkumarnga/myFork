from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from users.models import User
from business.models import Business, Employee, BusinessAddress, Country, City, EmergencyContact


class CountrySerializer(ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"

class CitySerializer(ModelSerializer):
    class Meta:
        model = City
        fields = "__all__"

class BusinessAddressSerializer(ModelSerializer):
    class Meta:
        model = BusinessAddress
        exclude = ['id','created_at', 'updated_at', 'business']


class BusinessSerializer(ModelSerializer):

    class Meta:
        model = Business
        fields = ['name', 'pay_frequency', 'profile_image']


class EmployeeSerializer(ModelSerializer):
    class Meta:
        model = Employee
        fields = "__all__"


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone', 'date_of_birth']

class EmergencyContactSerializer(ModelSerializer):
    class Meta:
        model = EmergencyContact
        exclude = ['employee','id','is_active', 'created_at', 'updated_at']

class BusinessAdminProfileSerializer(ModelSerializer):
    business_information = serializers.SerializerMethodField(read_only=True)
    personal_information = serializers.SerializerMethodField(read_only=True)
    business_address = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = User
        fields = ['business_information', 'personal_information', 'business_address']
    
    def get_business_information(self, obj):
        return BusinessSerializer(
            Business.objects.get(user=obj),
            many=False
        ).data
    
    def get_personal_information(self, obj):
        return UserSerializer(
            obj,
            many=False
        ).data
    
    def get_business_address(self, obj):
        return BusinessAddressSerializer(
            BusinessAddress.objects.get(business__user=obj),
            many=False
        ).data

class BusinessEmployeeProfileSerializer(ModelSerializer):
    business_information = serializers.SerializerMethodField(read_only=True)
    personal_information = serializers.SerializerMethodField(read_only=True)
    emergency_contact = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = User
        fields = ['business_information', 'personal_information', 'emergency_contact']
    
    def get_business_information(self, obj):
        return BusinessSerializer(
            Employee.objects.get(user=obj).business,
            many=False
        ).data
    
    def get_personal_information(self, obj):
        return UserSerializer(
            obj,
            many=False
        ).data
    
    def get_emergency_contact(self, obj):
        return EmergencyContactSerializer(
            EmergencyContact.objects.get(employee__user=obj),
            many=False
        ).data


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = User
        feilds = '__all__'
    
    # def create(self, validated_data):
    #     request = self.context['request']
    #     user = request.user
    #     user = create_user_for_employee(validated_data)
    #     del validated_data['first_name']
    #     del validated_data['last_name']
    #     del validated_data['email']
    #     validated_data['user'] = user
    #     employee = Employee.objects.create(
    #         **validated_data
    #     )
    #     return employee

    # def update(self, instance, validated_data):
    #     request = self.context['request']
    #     business_id = request.parser_context['kwargs']['pk']
    #     business = Business.objects.filter(id=business_id)
    #     documents = BusinessDocument.objects.filter(business=business.first())
    #     bank_account = BankAccount.objects.filter(business=business.first())
    #     update_business_profile(request.data['profile'], business.first())
    #     documents.update(**request.data['documents'])
    #     bank_account.update(**request.data['bank_account'])
    #     return Business.objects.get(id=business_id)

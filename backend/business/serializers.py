from rest_framework.serializers import ModelSerializer

from business.models import Business, Employee, BusinessAddress, Country, City


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
        model = Business
        fields = "__all__"


class BusinessSerializer(ModelSerializer):
    business_address = BusinessAddressSerializer()

    class Meta:
        model = Business
        exclude = ['created_at', 'updated_at']


class EmployeeSerializer(ModelSerializer):
    class Meta:
        model = Employee
        fields = "__all__"

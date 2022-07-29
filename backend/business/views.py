from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView

from business.models import Employee, Business, Country, City
from business.serializers import BusinessSerializer, EmployeeSerializer, CountrySerializer, CitySerializer

class CountryListApiView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CountrySerializer
    queryset = Country.objects.filter()
    http_method_names = ['get']

class CityListApiView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CitySerializer
    queryset = City.objects.filter()

class BusinessViewset(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BusinessSerializer
    queryset = Business.objects.filter()
    http_method_names = ['get','post','patch']


class EmployeeViewset(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.filter()
    http_method_names = ['get', 'post', 'patch']
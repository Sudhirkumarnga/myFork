from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from users.models import User
from business.models import Employee, Business, Country, City
from business.api.v1.serializers import (
    BusinessSerializer,
    ProfileSerializer,
    BusinessAdminProfileSerializer,
    BusinessEmployeeProfileSerializer,
    EmployeeSerializer, 
    CountrySerializer, 
    CitySerializer
) 

class CountryListApiView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CountrySerializer
    queryset = Country.objects.filter()
    http_method_names = ['get']

class CityListApiView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CitySerializer
    queryset = City.objects.filter()

class ProfileViewset(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    http_method_names = ['get']
    
    def get_queryset(self):
        queryset = User.objects.filter(id=self.request.user.id)
        return queryset   

    def get_serializer_class(self):
        if self.action == 'list':
            if self.request.user.role == 'Organization Admin':
                return BusinessAdminProfileSerializer
            if self.request.user.role == 'Employee':
                return BusinessEmployeeProfileSerializer
        if self.action == 'retrieve':
            if self.request.user.role == 'Organization Admin':
                return BusinessAdminProfileSerializer
            if self.request.user.role == 'Employee':
                return BusinessEmployeeProfileSerializer
        return ProfileSerializer()

    def get_serializer_context(self):
        context = super(ProfileViewset, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset.first())
        return Response(serializer.data)

class EmployeeViewset(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.filter()
    http_method_names = ['get', 'post', 'patch']
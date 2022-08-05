from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from workside.models import *
from workside.serializers import WorksideSerializer, TaskSerializer, TaskAttachmentSerializer

class WorkSideViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = WorksideSerializer
    queryset = WorkSide.objects.filter()
    http_method_names = ['get','post','patch', 'delete']


class TaskViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer
    queryset = Task.objects.filter()
    http_method_names = ['get','post','patch', 'delete']
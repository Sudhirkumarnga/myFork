from django.shortcuts import render
from rest_framework import status

from rest_framework.response import Response
from smart_workhorse_33965.response import SmartWorkHorseResponse, SmartWorkHorseStatus
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from smart_workhorse_33965.permissions import IsOrganizationAdmin
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from workside.models import *
from workside.api.v1.serializers import WorksiteSerializer, TaskSerializer, TaskAttachmentSerializer

class WorkSiteViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]
    serializer_class = WorksiteSerializer
    queryset = WorkSite.objects.filter()
    http_method_names = ['get','post', 'put', 'patch', 'delete']

    def get_serializer_context(self):
        context = super(WorkSiteViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            queryset = WorkSite.objects.get(id=serializer.data['id'])
            serializer_data = serializer.data
            serializer_data['log'] = queryset.logo.url
            serializer_data['instruction_video'] = queryset.instruction_video.url
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="WorkSite Successfully Created.",
                    status=SmartWorkHorseStatus.Success.value,
                    response=serializer_data
                ),
                status=status.HTTP_201_CREATED,
                headers={},
            )
        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong in creating WorkSite",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            return Response(
                SmartWorkHorseResponse.get_response(
                    success=True,
                    message="WorkSite Successfully Updated.",
                    status=SmartWorkHorseStatus.Success.value,
                    response=serializer.data
                ),
                status=status.HTTP_200_OK,
                headers={},
            )
        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong in updating WorkSite.",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )


class TaskViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]
    serializer_class = TaskSerializer
    queryset = Task.objects.filter()
    http_method_names = ['get','post', 'put', 'patch', 'delete']

class TaskAttachmentViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]
    serializer_class = TaskAttachmentSerializer
    queryset = TaskAttachments.objects.filter()
    http_method_names = ['get','post','delete']

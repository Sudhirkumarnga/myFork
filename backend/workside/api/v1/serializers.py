from rest_framework.serializers import ModelSerializer

from business.models import Business, Employee, BusinessAddress, Country, City
from workside.models import *



class WorksideSerializer(ModelSerializer):
    class Meta:
        model = WorkSide
        fields = "__all__"

class TaskSerializer(ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"


class TaskAttachmentSerializer(ModelSerializer):
    class Meta:
        model = TaskAttachments
        fields = "__all__"
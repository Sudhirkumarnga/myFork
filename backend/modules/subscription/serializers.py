from rest_framework import serializers
from modules.subscription import models

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SubscriptionPlan
        fields = '__all__'

class UserSubscriptionSerializer(serializers.ModelSerializer):
    subscription = SubscriptionSerializer()

    class Meta:
        model = models.OrganizationSubscription
        fields = '__all__'
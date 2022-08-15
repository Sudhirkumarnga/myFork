from rest_framework import serializers
from subscriptions.models import (
    SubscriptionPlan,
    SubscriptionDetails,
    UsersSubscription
)

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        exclude = ('created_at', 'updated_at')


class SubscriptionDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionDetails
        exclude = ('created_at', 'updated_at')


class UserSubscriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = UsersSubscription
        exclude = ('created_at', 'updated_at')


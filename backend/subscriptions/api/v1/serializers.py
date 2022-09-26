from rest_framework import serializers
from subscriptions.models import (
    Payment
)
from djstripe.models import Product, Price, Plan


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ("id", "description", "amount", "currency", "interval", "product")
        depth = 1


class PlanPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = ('currency', 'unit_amount')


class PaymentSerializer(serializers.ModelSerializer):
    """
    A custom serializer to handle Order Payments
    """

    class Meta:
        model = Payment
        fields = '__all__'
        # depth = 3


# class SubscriptionDetailsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SubscriptionDetails
#         exclude = ('created_at', 'updated_at')
#
#
# class UserSubscriptionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UsersSubscription
#         exclude = ('created_at', 'updated_at')

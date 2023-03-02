from business.models import Business, Employee, Feedback
from rest_framework.serializers import ModelSerializer
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from users.models import User
from djstripe.models import Plan, Product, Price
import stripe
from smart_workhorse_33965.settings import STRIPE_LIVE_MODE, STRIPE_TEST_SECRET_KEY, STRIPE_LIVE_SECRET_KEY
import time

stripe.api_key = STRIPE_LIVE_SECRET_KEY if STRIPE_LIVE_MODE else STRIPE_TEST_SECRET_KEY


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'first_name', 
            'last_name', 
            'phone', 
            'gender', 
            'date_of_birth', 
            "role", 
            "is_active",
            "is_superuser"
        ]

    def to_representation(self, data):
        data = super(UserSerializer, self).to_representation(data)
        if data["role"] == "Employee":
            employee = Employee.objects.filter(user__id=data['id'])
            data['profile_image'] = employee.first().profile_image.url if employee and employee.first().profile_image else None
        if data["role"] == "Organization Admin":
            business = Business.objects.filter(user__id=data['id'])
            data['profile_image'] = business.first().profile_image.url if business and business.first().profile_image else None
        return data

class FeedbackSerializer(ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'

    def to_representation(self, data):
        data = super(FeedbackSerializer, self).to_representation(data)
        if data['user']:
            user=User.objects.get(id=data['user'])
            if data["role"] == "Employee":
                employee = Employee.objects.filter(user=user)
                data['profile_image'] = employee.first().profile_image.url if employee and employee.first().profile_image else None
                data['username'] = user.username
            if data["role"] == "Organization Admin":
                business = Business.objects.filter(user=user)
                data['profile_image'] = business.first().profile_image.url if business and business.first().profile_image else None
                data['username'] = user.username
        return data

class DjStripeProductPriceSerializer(ModelSerializer):
    class Meta:
        model = Price
        fields = '__all__'
    


class DjStripeProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        extra_kwargs = {
            "id": {"required": False},
            "type": {"required": False}
        }

    def to_representation(self, data):
        data = super(DjStripeProductSerializer, self).to_representation(data)
        data['price'] = DjStripeProductPriceSerializer(
            Price.objects.filter(product__id=data['id']),
            many=True
        ).data
        return data
    
    def create(self, validated_data):
        request = self.context['request']
        product = stripe.Product.create(
            name = validated_data['name'],
            description = validated_data['description'],
            type=validated_data['type'],
            active=validated_data['active'],
            metadata=validated_data['metadata']
        )
        stripe.Price.create(
            product=product.id,
            unit_amount=request.data.get("price")*100,
            active=validated_data['active'],
            currency="usd",
            recurring={"interval": "month"},
        )
        time.sleep(3)
        return Product.objects.get(id=product.id)

    def update(self, instance, validated_data):
        request = self.context['request']
        stripe.Product.modify(
           instance.id,
           **validated_data 
        )
        return Product.objects.get(id=instance.id)
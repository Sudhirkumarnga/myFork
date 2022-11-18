from rest_framework.permissions import IsAuthenticated

from business.models import Business
from smart_workhorse_33965.permissions import IsOrganizationAdmin
from rest_framework import viewsets
from subscriptions.api.v1.serializers import (
    SubscriptionPlanSerializer
)
from rest_framework import status
from rest_framework.response import Response
from djstripe.models import Product, Price, Plan, Customer, Subscription
import stripe
import djstripe
from django.db import transaction
from rest_framework.views import APIView
from decimal import Decimal
from smart_workhorse_33965.settings import STRIPE_LIVE_MODE, STRIPE_TEST_SECRET_KEY, STRIPE_LIVE_SECRET_KEY
from smart_workhorse_33965.response import SmartWorkHorseResponse, SmartWorkHorseStatus

if STRIPE_LIVE_MODE:
    stripe.api_key = STRIPE_LIVE_SECRET_KEY
else:
    stripe.api_key = STRIPE_TEST_SECRET_KEY


class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]
    serializer_class = SubscriptionPlanSerializer
    queryset = Plan.objects.all()
    http_method_names = ['get', 'post']


class PaymentView(APIView):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]

    @transaction.atomic
    def post(self, request):
        try:
            business = Business.objects.get(user=request.user)
            payment_method = request.data.get('payment_method')
            plan = Plan.objects.get(
                id=request.data.get('plan_id')
            )
            payment_method = stripe.PaymentMethod.retrieve(payment_method)
            customer = stripe.Customer.create(
                email=request.user.email,
                payment_method=payment_method,
                invoice_settings={
                    'default_payment_method': payment_method,
                },
            )
            djstripe_customer = djstripe.models.Customer.sync_from_stripe_data(customer)
            djstripe_customer.subscribe(items=[{"plan": plan}])
            djstripe_customer.add_payment_method(payment_method)
            subscription = stripe.Subscription.create(
                customer=customer.id,
                metadata=plan.product.metadata,
                items=[
                    {
                        'plan': plan.id,
                    },
                ],
                expand=['latest_invoice.payment_intent'],
            )
            subscription.metadata['remaining_employees'] = subscription.metadata['allowed_employees']
            subscription.save()
            djstripe_subscription = djstripe.models.Subscription.sync_from_stripe_data(subscription)

            business.customer = djstripe_customer
            business.subscription = djstripe_subscription
            business.save()
            payment_method = stripe.PaymentMethod.attach(payment_method, customer=customer)
            djstripe.models.PaymentMethod.sync_from_stripe_data(payment_method)
            payment_intent = stripe.PaymentIntent.create(
                customer=customer.id,
                payment_method=payment_method,
                currency='usd',
                amount=int(Decimal(plan.amount) * 100),
                confirm=True
            )
            djstripe.models.PaymentIntent.sync_from_stripe_data(payment_intent)
            return Response(
                {
                    'customer': customer,
                    'subscription': subscription
                }
            )

        except Exception as e:
            return Response(
                SmartWorkHorseResponse.get_response(
                    success=False,
                    message="Something went wrong during transaction",
                    status=SmartWorkHorseStatus.Error.value,
                    error={str(e)},
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )


class create_payement_method(APIView):
    permission_classes = [IsAuthenticated, IsOrganizationAdmin]

    def post(self, request):
        payment_method = request.data.get('payment_method')
        payment_method = stripe.PaymentMethod.create(
            type=payment_method.get('type'),
            card={
                "number": payment_method.get('card').get('number'),
                "exp_month": payment_method.get('card').get('exp_month'),
                "exp_year": payment_method.get('card').get('exp_year'),
                "cvc": payment_method.get('card').get('cvc'),
            },
        )
        return Response(
            {
                'payment_method': payment_method,
            }
        )

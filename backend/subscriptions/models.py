from django.db import models
from django.db.models.fields import CharField
from users.models import User
from home.models import TimeStampedModel
from django.utils import timezone
from datetime import date, timedelta
from django.db import models
from tinymce.models import HTMLField
from subscriptions.enums import SubscriptionPeriod
from djstripe.models import Customer, Subscription
from djstripe.models import Product, Price
from djstripe.models import PaymentIntent


class SubscriptionPlan(TimeStampedModel):
    name = models.CharField(max_length=255)
    price = models.FloatField()
    discount = models.FloatField()
    period = models.CharField(
        max_length=200,
        choices=SubscriptionPeriod.choices(),
        default=SubscriptionPeriod.YEARLY,
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = "Subscription Plan"
        verbose_name_plural = "Subscriptions Plans"

    def __str__(self) -> str:
        return f'{self.name} | {str(self.price)}'


class SubscriptionDetails(TimeStampedModel):
    subscription_plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE, null=True, blank=True)
    text = HTMLField()

    class Meta:
        verbose_name = "Subscription Detail"
        verbose_name_plural = "Subscription Details"

    def __str__(self) -> str:
        return self.subscription_plan.name


class UsersSubscription(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(null=True, blank=True)
    expiry = models.DateTimeField(null=True, blank=True)
    subscription_plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Users Subscription"
        verbose_name_plural = "Users Subscriptions"

    def __str__(self) -> str:
        return f'{self.user.email} | {self.subscription_plan.name}'

    def save(self, *args, **kwargs):
        if self.subscription_plan.period == "MONTHLY":
            self.date = timezone.now()
            self.expiry = timezone.now() + timedelta(days=30)
        if self.subscription_plan.period == "YEARLY":
            self.date = timezone.now()
            self.expiry = timezone.now() + timedelta(days=365)
        super(UsersSubscription, self).save(*args, **kwargs)


class Payment(TimeStampedModel):
    order = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, related_name='payments')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='payments')
    amount = models.DecimalField(max_digits=7, decimal_places=2)
    payment_intent = models.ForeignKey(PaymentIntent, on_delete=models.SET_NULL, null=True)

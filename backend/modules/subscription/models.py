from django.db import models
from django.db.models.fields import CharField
from users.models import User
from business.models import Business


class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=255)
    price = models.FloatField()
    discount = models.FloatField()
    period = models.CharField(max_length=50,default='Month')

    def __str__(self) -> str:
        return self.name + ' | ' + str(self.price)



class OrganizationSubscription(models.Model):
    business = models.ForeignKey(Business,on_delete=models.CASCADE)
    date = models.DateTimeField()
    expiry = models.DateTimeField()
    subscription = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.business.name + ' | ' + self.subscription.name
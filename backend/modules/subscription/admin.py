from django.contrib import admin
from modules.subscription import models

admin.site.register(models.SubscriptionPlan)
admin.site.register(models.OrganizationSubscription)
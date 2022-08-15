from django.contrib import admin
from subscriptions.models import(
    SubscriptionPlan,
    SubscriptionDetails,
    UsersSubscription
)

admin.site.register(SubscriptionPlan)
admin.site.register(SubscriptionDetails)
admin.site.register(UsersSubscription)
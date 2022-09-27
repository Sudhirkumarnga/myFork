from django.contrib import admin
from django.core.management import call_command
from djstripe.models import Customer
from django.contrib.admin.helpers import ACTION_CHECKBOX_NAME

from djstripe.admin import CustomerHasSourceListFilter, CustomerSubscriptionStatusListFilter, \
    SubscriptionInline, TaxIdInline, StripeModelAdmin


admin.site.unregister(Customer)

@admin.register(Customer)
class CustomersAdmin(StripeModelAdmin):
    actions = ['sync_customers_and_plans']
    list_display = (
        "deleted",
        "subscriber",
        "email",
        "currency",
        "default_source",
        "coupon",
        "balance",
    )
    list_select_related = ("subscriber", "default_source", "coupon")
    list_filter = (
        CustomerHasSourceListFilter,
        CustomerSubscriptionStatusListFilter,
        "deleted",
    )
    search_fields = ("email", "description", "deleted")
    inlines = (SubscriptionInline, TaxIdInline)

    def sync_customers_and_plans(self, request, queryset):
        call_command('djstripe_init_customers')
        call_command('djstripe_sync_plans_from_stripe')

    def changelist_view(self, request, extra_context=None):
        post = request.POST.copy()
        if ACTION_CHECKBOX_NAME not in post:
            post.update({ACTION_CHECKBOX_NAME: None})
            request._set_post(post)
        return super(CustomersAdmin, self).changelist_view(request, extra_context)


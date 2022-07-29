from django.contrib import admin
from business.models import Business, Employee, BusinessAddress

# Register your models here.
admin.site.register(Business)
admin.site.register(Employee)
admin.site.register(BusinessAddress)
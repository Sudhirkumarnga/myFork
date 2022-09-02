from django.contrib import admin
from business.models import Business, Employee, BusinessAddress, Attendance, LeaveRequest

# Register your models here.
admin.site.register(Business)
admin.site.register(Employee)
admin.site.register(BusinessAddress)
admin.site.register(Attendance)
admin.site.register(LeaveRequest)

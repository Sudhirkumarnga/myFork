from django.contrib import admin

from business.models import Business, Employee, BusinessAddress, Attendance, LeaveRequest, EmergencyContact, Feedback, FeedbackMedia

# Register your models here.
admin.site.register(BusinessAddress)
admin.site.register(LeaveRequest)
admin.site.register(EmergencyContact)
admin.site.register(Feedback)
admin.site.register(FeedbackMedia)


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_filter = ["is_active"]
    search_fields = [
        "user__email",
        "name",
        "business_code",
    ]
    list_display = [
        "name",
        "user", 
        "pay_frequency", 
        "business_code", 
        "subscription", 
        "is_active", 
    ]


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_filter = ["is_active"]
    search_fields = [
        "user__email",
        "business__user__email",
    ]
    list_display = [
        "user", 
        "business",
        "mobile", 
        "position", 
        "hourly_rate", 
        "is_active", 
        "is_owner",
        "is_active"
    ]


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_filter = ["clock_in_time", "clock_out_time", "status", "is_shift_completed"]
    search_fields = [
        "employee__user__email",
        "worksite_name",
    ]
    list_display = [
        "employee", 
        "hourly_rate", 
        "event", 
        "worksite_name", 
        "clock_in_time", 
        "clock_out_time", 
        "total_hours", 
        "earnings", 
        "is_shift_completed"
    ]
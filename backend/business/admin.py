from django.contrib import admin

from business.models import Business, Employee, BusinessAddress, Attendance, LeaveRequest, EmergencyContact, Feedback, FeedbackMedia

# Register your models here.
admin.site.register(Business)
admin.site.register(Employee)
admin.site.register(BusinessAddress)
admin.site.register(LeaveRequest)
admin.site.register(EmergencyContact)
admin.site.register(Feedback)
admin.site.register(FeedbackMedia)


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
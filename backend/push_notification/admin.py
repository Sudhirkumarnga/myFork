from django.contrib import admin
from push_notification.models import *

# Register your models here.

admin.site.register(Template)
admin.site.register(PushNotificationGroup)
admin.site.register(NotificationSchedular)
admin.site.register(Notification)

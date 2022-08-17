from django.contrib import admin
from workside.models import WorkSite, Task, TaskAttachments

# Register your models here.
admin.site.register(WorkSite)
admin.site.register(Task)
admin.site.register(TaskAttachments)
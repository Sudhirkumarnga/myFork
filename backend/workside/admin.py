from django.contrib import admin
from workside.models import WorkSide, Task, TaskAttachments

# Register your models here.
admin.site.register(WorkSide)
admin.site.register(Task)
admin.site.register(TaskAttachments)
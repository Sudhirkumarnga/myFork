from smart_workhorse_33965.celery import app
from workside import models
from django.core.mail import send_mail
from smart_workhorse_33965.settings import EMAIL_HOST_USER


@app.task(name="event_publishing_reminder_task")
def event_publishing_reminder_task(event_id, reminder_date):
    event = models.Event.objects.filter(id=event_id)
    if event.exists():
        event = event.first()
        if event.event_status == "DRAFT":
            send_mail(
                'Event Publish Reminder',
                f'your worksite {event.worksite.name} event is schedule to published on this date:{event.start_time}',
                EMAIL_HOST_USER,
                [event.worksite.business.user.email],
                fail_silently=False,
            )

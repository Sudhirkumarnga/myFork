from django.db.models.signals import post_save,pre_delete, pre_save
from django.dispatch import receiver
from business.models import Feedback
from django.core.mail import send_mail
from push_notification.services import create_notification
from smart_workhorse_33965.settings import DEFAULT_FROM_EMAIL



@receiver(pre_save, sender=Feedback)
def on_change(sender, instance: Feedback, **kwargs):
    if instance.id is None: # new object will be created
        pass
    else:
        previous = sender.objects.get(id=instance.id)
        if previous.reply != instance.reply:
            send_mail(
                "Feedback Response",
                instance.reply,
                DEFAULT_FROM_EMAIL,
                [instance.email],
                fail_silently=False,
            )
            create_notification({
                "name": "Feedback Response",
                "description": instance.reply,
                "user": instance.user
            }
        )
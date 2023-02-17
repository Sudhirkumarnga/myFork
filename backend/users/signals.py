from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import User
from allauth.account.models import EmailAddress

@receiver(post_save, sender=User)
def create_user_email_instance(sender, instance, created, **kwargs):
    if created:
        email_address, created = EmailAddress.objects.get_or_create(
            user=instance, 
            email=instance.email, 
            verified=True, 
            primary=True
        )

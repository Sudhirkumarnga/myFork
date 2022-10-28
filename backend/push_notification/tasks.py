from django.conf import settings
from push_notification import services

from celery import shared_task,current_task
from push_notification import models
import celery


#FIREBASE_PUSH_NOTIFICATION = settings.FIREBASE_PUSH_NOTIFICATION


@shared_task(name='tasks.send_notification')
def send_notification(instance):
    #if FIREBASE_PUSH_NOTIFICATION:
    services.send_notification_firebase(instance)
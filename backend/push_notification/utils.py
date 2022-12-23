from fcm_django.models import FCMDevice
import requests
from requests.structures import CaseInsensitiveDict
from smart_workhorse_33965.settings import FCM_SERVER_KEY

def delete_device(user_id):
    return FCMDevice.objects.filter(user=user_id).delete()


def activate_device(user_id):
    return FCMDevice.objects.filter(user=user_id).update(active=True)


def send_notification(user, title, message, notification, data = {}):
    url = "https://fcm.googleapis.com/fcm/send"
    headers = CaseInsensitiveDict()
    headers["Accept"] = "application/json"
    headers["Authorization"] = "key={}".format(FCM_SERVER_KEY)
    headers["Content-Type"] = "application/json"
    try:
        notif_id = str(notification)
        if user.registration_id:
            payload = {
                    'to': user.registration_id,
                    'notification': {
                        "title": title,
                        "text": message
                    },
                    'data': {
                        "notif_id": notif_id,
                    }
                }
            resp = requests.post(url, headers=headers, json=payload)
    except:
        pass
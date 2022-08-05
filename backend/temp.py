from twilio.rest import Client


account_sid = "AGi8DgnxfLmfRpV52swENuuo1cVkEP4r5q"
auth_token = "830e190d3f256ce62d0d1469c566d146"
client = Client(account_sid, auth_token)
# message = client.messages.create(body="Join Earth's mightiest heroes. Like Kevin Bacon.",
#                                  from_='+19788782267',
#                                  to='+923432783698')

#
# client = Client(account_sid, auth_token)

service = client.verify.v2.services.create(
                                        friendly_name='My First Verify Service'
                                    )

print(service.sid)
#
# print(message.sid)

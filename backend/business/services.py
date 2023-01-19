from django.core.mail import send_mail
from allauth.utils import email_address_exists, generate_unique_username
from allauth.account.models import EmailAddress
from push_notification.services import create_notification
from smart_workhorse_33965.settings import EMAIL_HOST_USER
from users.models import User
import base64
from django.core.files.base import ContentFile
from business.models import (
    Business,
    Employee,
    City,
    Region,
    EmergencyContact,
    BusinessAddress, Feedback, FeedbackMedia,

)
from workside.models import Event, Task


def convert_image_from_bse64_to_blob(image):
    data = ContentFile(base64.b64decode(image), name='file.jpg')
    return data


def update_profile(user, data):
    User.objects.filter(id=user.id).update(**data['personal_information'])
    if user.role == 'Organization Admin':
        business = Business.objects.get(user=user)
        if 'profile_image' in data['business_information']:
            business.profile_image = convert_image_from_bse64_to_blob(data['business_information']['profile_image'])
        business.pay_frequency = data['business_information']['pay_frequency'] if 'pay_frequency' in data['business_information'] else "default to every two weeks"
        business.name = data['business_information']['name']
        business.save()
        BusinessAddress.objects.filter(business__user=user).update(**data['business_address'])
    else:
        EmergencyContact.objects.filter(employee__user=user).update(**data['emergency_contact'])


def create_user_for_employee(data):
    password = User.objects.make_random_password()
    user = User(
        first_name=data['personal_information']['first_name'],
        last_name=data['personal_information']['last_name'],
        date_of_birth=data['personal_information']['date_of_birth'],
        email=data['contact']['email'],
        role="Employee",
        is_read_terms=True,
        gender=data['personal_information']['gender'] if 'gender' in data['personal_information'] else None,
        phone=data['contact']['phone'] if 'phone' in data['contact'] else None,
        username=generate_unique_username([
            data['personal_information']['first_name'],
            data['contact']['email'],
            'user'
        ]),
    )
    user.set_password(password)
    user.save()
    EmailAddress.objects.create(
        email=data['contact']['email'],
        user=user,
        primary=True,
        verified=True
    )
    return user, password


def update_user_for_employee(data, instance):
    password = User.objects.make_random_password()
    user = User.objects.get(id=instance.user.id)

    if 'personal_information' in data:
        if 'first_name' in data['personal_information']:
            user.first_name = data['personal_information']['first_name']
        if 'last_name' in data['personal_information']:
            user.last_name = data['personal_information']['last_name']
        if 'gender' in data['personal_information']:
            user.gender = data['personal_information']['gender']
        if 'date_of_birth' in data['personal_information']:
            user.date_of_birth = data['personal_information']['date_of_birth']

    if 'contact' in data:
        if 'email' in data['contact']:
            user.email = data['contact']['email']
        if 'phone' in data['contact']:
            user.phone = data['contact']['phone']

    user.set_password(password)
    user.save()
    return user, password


def create_employee(user, data, business_user):
    business=Business.objects.get(user=business_user)
    employee = Employee.objects.create(
        user=user,
        business=business,
        profile_image = convert_image_from_bse64_to_blob(data['personal_information']['profile_image']) if 'profile_image' in data['personal_information'] else None,
        mobile=data['contact']['mobile'],
        address_line_one=data['address_information']['address_line_one'],
        city=City.objects.get(id=data['address_information']['city']),
        state=Region.objects.get(id=data['address_information']['state']),
        address_line_two=data['address_information']['address_line_two'] if 'address_line_two' in data['address_information'] else None,
        position=data['work_information']['position'] if 'position' in data['work_information'] else business.employe_types,
        hourly_rate=data['work_information']['hourly_rate'] if 'hourly_rate' in data['work_information'] else 0
    )
    EmergencyContact.objects.create(
        employee=employee
    )
    return employee


def update_employee(employee_user, data):
    employee = Employee.objects.get(user=employee_user)

    if 'personal_information' in data:
        if 'profile_image' in data['personal_information']:
            employee.profile_image = convert_image_from_bse64_to_blob(data['personal_information']['profile_image'])

    if 'contact' in data:
        if 'mobile' in data['contact']:
            employee.mobile = data['contact']['mobile']

    if 'address_information' in data:
        if 'address_line_one' in data['address_information']:
            employee.address_line_one = data['address_information']['address_line_one']
        if 'address_line_two' in data['address_information']:
            employee.address_line_two = data['address_information']['address_line_two']
        
        if 'city' in data['address_information'] and data['address_information']['city'] is not None:
            employee.city = City.objects.get(id=data['address_information']['city'])
        
        if 'city' in data['address_information'] and data['address_information']['city'] is None:
            employee.city = None

        if 'state' in data['address_information'] and  data['address_information']['state'] is not None:
            employee.state = Region.objects.get(id=data['address_information']['state'])
        if 'state' in data['address_information'] and  data['address_information']['state'] is None:
            employee.state = None        

    if 'work_information' in data:
        if 'position' in data['work_information']:
            employee.position = data['work_information']['position']
        if 'hourly_rate' in data['work_information']:
            employee.hourly_rate = data['work_information']['hourly_rate']

    employee.save()
    return employee


def send_email_to_employee(user, password):
    send_mail(
        "Smart WorkHorse Login Credentials",
        f"Your Login credentials are:\nEmail: {user.email}\nPassword: {password}",
        EMAIL_HOST_USER,
        [user.email],
        fail_silently=False,
    )


def get_payroll_hours(serializer_data):
    payroll_hours = 0
    for data in serializer_data['employees']:
        payroll_hours += data['employee_hours']
    return payroll_hours


def send_clock_in_notification_to_business_owner(request):
    event = Event.objects.get(id=request.data['event'])
    create_notification({
        "name": "Event Clock In",
        "description": f"{request.user.get_full_name()} clock In in worksite {event.worksite.name}",
        "user": event.worksite.business.user
    }
    )


def send_clock_out_notification_to_business_owner(request):
    event = Event.objects.get(id=request.data['event'])
    create_notification({
        "name": "Event Clock Out",
        "description": f"{request.user.get_full_name()} clock out from worksite {event.worksite.name}",
        "user": event.worksite.business.user
    }
    )


def send_clock_in_notification_to_employee(request):
    event = Event.objects.get(id=request.data['event'])
    create_notification({
        "name": "Event ClockIn",
        "description": f"you have clockIn in new {event.worksite.name}",
        "user": request.user
    }
    )


def get_total_amount(serializer_data):
    total_earned = 0
    for data in serializer_data['worksites']:
        total_earned += data['earned']
    return total_earned


def convert_file_from_bse64_to_blob(file, file_name):
    data = ContentFile(base64.b64decode(file), name='{}.jpg'.format(file_name))
    return data


def create_feedback(validated_data, request):

    feedback = Feedback.objects.create(
        email=validated_data['email'],
        message=validated_data['message'],
        user=request.user
    )
    for key, val in validated_data['files'].items():
        FeedbackMedia.objects.create(feedback=feedback, file=convert_file_from_bse64_to_blob(val, key))
    return feedback

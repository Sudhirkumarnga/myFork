from django.core.mail import send_mail
from allauth.utils import email_address_exists, generate_unique_username
from smart_workhorse_33965.settings import EMAIL_HOST_USER
from users.models import User
import base64
from django.core.files.base import ContentFile
from business.models import (
    Business,
    Employee,
    City,
    EmergencyContact,
    BusinessAddress,

)


def convert_image_from_bse64_to_blob(image):
    print(image)
    data = ContentFile(base64.b64decode(image), name='file.jpg')
    return None


def update_profile(user, data):
    User.objects.filter(id=user.id).update(**data['personal_information'])
    if user.role == 'Organization Admin':
        business = Business.objects.get(user=user)
        business.profile_image = convert_image_from_bse64_to_blob(data['business_information']['profile_image'])
        business.pay_frequency = data['business_information']['pay_frequency']
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
        gender=data['personal_information']['gender'],
        date_of_birth=data['personal_information']['date_of_birth'],
        email=data['contact']['email'],
        phone=data['contact']['phone'],
        role="Employee",
        username=generate_unique_username([
            data['personal_information']['first_name'],
            data['contact']['email'],
            'user'
        ]),
    )
    user.set_password(password)
    user.save()
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
    employee = Employee.objects.create(
        user=user,
        business=Business.objects.get(user=business_user),
        profile_image=convert_image_from_bse64_to_blob(data['personal_information']['profile_image']),
        mobile=data['contact']['mobile'],
        address_line_one=data['address_information']['address_line_one'],
        address_line_two=data['address_information']['address_line_two'],
        city=City.objects.get(id=data['address_information']['city']),
        position=data['work_information']['position'],
        hourly_rate=data['work_information']['hourly_rate']
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
        if 'city' in data['address_information']:
            employee.city = City.objects.get(id=data['address_information']['city'])

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

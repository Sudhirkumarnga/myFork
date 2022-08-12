from django.core.mail import send_mail
from allauth.utils import email_address_exists, generate_unique_username
from smart_workhorse_33965.settings import EMAIL_HOST_USER
from users.models import User
from business.models import (
    Business,
    Employee,
    City,
    EmergencyContact,
    BusinessAddress,

)
import json

def update_profile(user,data):
    User.objects.filter(id=user.id).update(**data['personal_information'])
    if user.role == 'Organization Admin':
        Business.objects.filter(user=user).update(**data['business_information'])
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
        phone = data['contact']['phone'],
        role = "Employee",
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
    user.first_name=data['personal_information']['first_name']
    user.last_name=data['personal_information']['last_name']
    user.date_of_birth=data['personal_information']['date_of_birth']
    user.email=data['contact']['email']
    user.phone = data['contact']['phone']
    user.set_password(password)
    user.save()
    return user, password


def create_employee(user,data, business_user):
    employee = Employee.objects.create(
        user=user,
        business= Business.objects.get(user=business_user),
        mobile = data['contact']['mobile'],
        address_line_one = data['address_information']['address_line_one'],
        address_line_two =data['address_information']['address_line_two'],
        city = City.objects.get(id=data['address_information']['city']),
        position = data['work_information']['position'],
        hourly_rate = data['work_information']['hourly_rate']
    )
    return employee


def update_employee(employee_user, data):
    employee = Employee.objects.get(user=employee_user)
    employee.mobile = data['contact']['mobile']
    employee.address_line_one = data['address_information']['address_line_one']
    employee.address_line_two =data['address_information']['address_line_two']
    employee.city = City.objects.get(id=data['address_information']['city'])
    employee.position = data['work_information']['position']
    employee.hourly_rate = data['work_information']['hourly_rate']
    employee.save()
    return employee


def send_email_to_employee(user,password):
    send_mail(
        "Smart WorkHorse Login Credentials",
        f"Your Login credentials are:\nEmail: {user.email}\nPassword: {password}",
        EMAIL_HOST_USER,
        [user.email],
        fail_silently=False,
    )
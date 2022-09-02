from django.utils.crypto import get_random_string
import random
from users.models import User_OTP
from django.core.mail import send_mail
from django.template.loader import render_to_string
from smart_workhorse_33965.settings import EMAIL_HOST_USER
from django.contrib.sites.models import Site

current_site = Site.objects.get_current()

from business.models import (
    Business,
    BusinessAddress,
    Employee,
    EmergencyContact
)


def create_business_and_business_address(user, data):
    business = Business.objects.create(
        user=user,
        employe_types=data['employee_types'],
        business_code=get_random_string(7)
    )
    business_address = BusinessAddress.objects.create(
        business=business
    )
    return business


def create_employee(business, user, data):
    Employee.objects.create(
        # first_name = data.get("first_name", ""),
        # phone = data.get("phone", ""),
        user=user,
        business=business,
        is_owner=True
    )


def create_organization_employee(user, data):
    employee = Employee.objects.create(
        user=user,
        business=Business.objects.get(
            business_code=data['business_code']
        ),
        mobile=data['phone'],
        is_owner=False
    )
    return employee


def create_emergency_contact(employee):
    EmergencyContact.objects.create(
        employee=employee
    )


def generate_user_otp(user):
    otp = format(random.randint(0, 9999), '04d')
    user_otp = User_OTP.objects.filter(user=user)
    if user_otp.exists():
        user_otp.update(otp=otp, is_expire=False)
    else:
        user_otp = User_OTP.objects.create(user=user, otp=otp)

    return otp


def send_account_confirmation_email(user, otp):
    msg_plain = render_to_string('email/account_confirmation_email.txt',
                                 {'user': user, 'otp': otp, 'domain': current_site.domain})
    msg_html = render_to_string('email/account_confirmation_email.html',
                                {'user': user, 'otp': otp, 'domain': current_site.domain})
    send_mail(
        'Account Confirmation Email',
        msg_plain,
        EMAIL_HOST_USER,
        [user.email],
        html_message=msg_html,
    )


def sent_password_reset_email(user, otp):
    msg_plain = render_to_string('email/password_reset_email.txt',
                                 {'user': user, 'otp': otp, 'domain': current_site.domain})
    msg_html = render_to_string('email/password_reset_email.html',
                                {'user': user, 'otp': otp, 'domain': current_site.domain})

    send_mail(
        'Password Reset Email',
        msg_plain,
        EMAIL_HOST_USER,
        [user.email],
        html_message=msg_html,
    )


def send_new_otp(user, otp):
    msg_plain = render_to_string('email/otp_email.txt', {'user': user, 'otp': otp, 'domain': current_site.domain})
    msg_html = render_to_string('email/otp_email.html', {'user': user, 'otp': otp, 'domain': current_site.domain})

    send_mail(
        'Password Reset Email',
        msg_plain,
        EMAIL_HOST_USER,
        [user.email],
        html_message=msg_html,
    )

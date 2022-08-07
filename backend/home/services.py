from django.utils.crypto import get_random_string
from business.models import (
    Business,
    BusinessAddress,
    Employee
)

def create_business_and_business_address(user, data):
    business = Business.objects.create(
        user=user,
        employe_types = data['employee_types'],
        business_code=get_random_string(7)
    )
    business_address = BusinessAddress.objects.create(
        business=business
    )
    return business

def create_employee(business,user,data):
    Employee.objects.create(
        first_name = data['name'],
        phone = data['phone'],
        user=user,
        business=business,
        is_owner=True
    )

def create_organization_employee(user,data):
    Employee.objects.create(
        user=user,
        business=Business.objects.get(
            business_code=data['business_code']
        ),
        phone= data['phone'],
        first_name=data['name'],
        is_owner=False
    )
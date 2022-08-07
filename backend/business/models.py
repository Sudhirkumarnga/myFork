from bulk_update_or_create import BulkUpdateOrCreateQuerySet
from ckeditor.fields import RichTextField
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
from django_countries.fields import CountryField
from home.models import TimeStampedModel
from cities_light.abstract_models import (AbstractCity, AbstractRegion,
                                          AbstractCountry, AbstractSubRegion)
from cities_light.receivers import connect_default_signals

from business.constants import BusinessPayFrequency

User = get_user_model()


class Country(AbstractCountry):
    pass

class SubRegion(AbstractSubRegion):
    pass

class Region(AbstractRegion):
    pass

class City(AbstractCity):
    timezone = models.CharField(max_length=40)

connect_default_signals(Country)
connect_default_signals(Region)
connect_default_signals(City)
connect_default_signals(SubRegion)

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT / user_<id>/<filename>
    return 'user/{0}/{1}'.format(instance.user.id, filename)


def business_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT / user_<id>/<filename>
    return 'business/{0}/{1}'.format(instance.id, filename)

class Business(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(_("Business Name"), blank=True, null=True, max_length=255)
    profile_image = models.FileField(_('Profile Picture'), upload_to=business_directory_path, null=True, blank=True)
    pay_frequency = models.CharField(
        _('Business Pay Frequency'), max_length=255, blank=True, null=True,
        choices=[(type.value, type.value) for type in BusinessPayFrequency]
    )
    business_code = models.CharField(_('Business Code'), max_length=255, blank=True, null=True)
    employe_types = models.CharField(_('How do you refer to your employees'), max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Business"
        verbose_name_plural = "Business"

    def __str__(self):
        return f'{self.name}'


class BusinessAddress(TimeStampedModel):
    business = models.OneToOneField(Business, on_delete=models.CASCADE, related_name="business_address")
    address_line_one = models.TextField(null=True, blank=True)
    address_line_two = models.TextField(null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True, blank=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, null=True, blank=True)
    zipcode = models.CharField(_("ZipCode"), blank=True, null=True, max_length=255)

    class Meta:
        verbose_name = "Business Address"
        verbose_name_plural = "Business Address"

    # def save(self, *args, **kwargs):
    #   print(self.profile_image.__dir__())
    #   super(BusinesProfile, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.business.name}'



class Employee(TimeStampedModel):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    date_of_birth = models.DateField(null=True, blank=True)
    phone = PhoneNumberField(null=True, blank=True)
    is_owner = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)


    class Meta:
        verbose_name = "Employee"
        verbose_name_plural = "Employees"

    def __str__(self):
        return f'{self.user.email}'


class EmergencyContact(TimeStampedModel):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="emergency_contact")
    is_active = models.BooleanField(default=True)


    class Meta:
        verbose_name = "EmergencyContact"
        verbose_name_plural = "EmergencyContact"

    def __str__(self):
        return f'{self.employee.first_name} - {self.employee.last_name}'
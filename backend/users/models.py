from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
from users.constants import UserRole, Gender
from home.models import TimeStampedModel
class User(AbstractUser):
    # WARNING!
    """
    Some officially supported features of Crowdbotics Dashboard depend on the initial
    state of this User model (Such as the creation of superusers using the CLI
    or password reset in the dashboard). Changing, extending, or modifying this model
    may lead to unexpected bugs and or behaviors in the automated flows provided
    by Crowdbotics. Change it at your own risk.


    This model represents the User instance of the system, login system and
    everything that relates with an `User` is represented by this model.
    """

    # First Name and Last Name do not cover name patterns
    # around the globe.
    first_name = models.CharField(_('first name'), max_length=30, blank=True, null=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True,  null=True)
    email = models.EmailField(_('email address'), blank=True, unique=True)
    phone = PhoneNumberField(_("Phone Field"), blank=True, null=True)
    is_read_terms = models.BooleanField(_('Is Terms and Condition Read?'), default=False)
    role = models.CharField(
        _('Role of User'), max_length=255, blank=True, null=True,
        choices=[(type.value, type.value) for type in UserRole]
    )
    gender = models.CharField(
        _('Gender of User'),
        max_length=200,
        choices=Gender.choices(),
        null=True,
        blank=True
    )
    date_of_birth = models.DateField(null=True, blank=True)

    customer = models.ForeignKey(
        'djstripe.Customer', null=True, blank=True, on_delete=models.SET_NULL,
        help_text="The user's Stripe Customer object, if it exists"
    )
    subscription = models.ForeignKey(
        'djstripe.Subscription', null=True, blank=True, on_delete=models.SET_NULL,
        help_text="The user's Stripe Subscription object, if it exists"
    )

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})

class User_OTP(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    otp = models.IntegerField()
    is_expire = models.BooleanField(default=False)

    class Meta:
        verbose_name = "User OTP"
        verbose_name_plural = "User OTPs"

    def __str__(self):
        return f'{self.user}'
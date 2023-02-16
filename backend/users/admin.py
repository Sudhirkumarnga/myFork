from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from users.models import User_OTP
from users.forms import UserChangeForm, UserCreationForm

User = get_user_model()


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    fieldsets = (("User",
                  {"fields": ("date_of_birth", "gender", "role", "is_read_terms")}),) + auth_admin.UserAdmin.fieldsets
    list_display = ["first_name", "last_name", "email", "role", "is_superuser", "is_active"]
    search_fields = ["email"]
    list_filter = ["is_active", "role", "is_superuser", "is_staff"]


@admin.register(User_OTP)
class UserOTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'otp', 'is_expire')

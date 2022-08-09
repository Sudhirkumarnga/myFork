# Generated by Django 3.2 on 2022-08-09 15:45

from django.db import migrations
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('business', '0005_auto_20220807_0736'),
    ]

    operations = [
        migrations.AddField(
            model_name='emergencycontact',
            name='phone',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None),
        ),
    ]

# Generated by Django 2.2.28 on 2022-08-09 18:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('business', '0007_merge_20220809_1732'),
    ]

    operations = [
        migrations.RenameField(
            model_name='business',
            old_name='employee_types',
            new_name='employe_types',
        ),
    ]

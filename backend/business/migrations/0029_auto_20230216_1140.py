# Generated by Django 3.2.12 on 2023-02-16 11:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('business', '0028_auto_20230216_1127'),
    ]

    operations = [
        migrations.RenameField(
            model_name='feedback',
            old_name='is_active',
            new_name='is_read',
        ),
        migrations.RemoveField(
            model_name='feedback',
            name='is_visible',
        ),
    ]

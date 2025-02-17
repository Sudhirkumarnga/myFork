# Generated by Django 3.2.12 on 2022-11-14 09:23

from django.db import migrations
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('workside', '0012_event_notify'),
    ]

    operations = [
        migrations.AlterField(
            model_name='worksite',
            name='clear_frequency_by_day',
            field=multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('MONDAY', 'MONDAY'), ('TUESDAY', 'TUESDAY'), ('WEDNESDAY', 'WEDNESDAY'), ('THURSDAY', 'THURSDAY'), ('FRIDAY', 'FRIDAY'), ('SATURDAY', 'SATURDAY'), ('SUNDAY', 'SUNDAY')], max_length=100, null=True, verbose_name='Clear Frequency by day'),
        ),
    ]

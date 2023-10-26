# Generated by Django 3.2.12 on 2023-10-26 05:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workside', '0020_worksite_upload_instruction_video_link'),
    ]

    operations = [
        migrations.AlterField(
            model_name='worksite',
            name='contact_person_name',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Contact Person Name'),
        ),
        migrations.AlterField(
            model_name='worksite',
            name='monthly_rates',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='WorkSide Monthly Rates'),
        ),
    ]

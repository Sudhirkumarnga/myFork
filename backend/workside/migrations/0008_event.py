# Generated by Django 2.2.28 on 2022-08-22 14:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('business', '0011_employee_profile_image'),
        ('workside', '0007_auto_20220822_1313'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('start_time', models.DateTimeField(blank=True, null=True)),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('frequency', models.CharField(blank=True, choices=[('DAILY', 'DAILY'), ('WEEKLY', 'WEEKLY'), ('ONE_TIME', 'ONE_TIME')], max_length=200, null=True, verbose_name='Frequency Of Event')),
                ('description', models.TextField(blank=True, null=True, verbose_name='WorkSide Description')),
                ('notes', models.TextField(blank=True, null=True, verbose_name='WorkSide Description')),
                ('reminder', models.BooleanField(default=False, verbose_name='Reminder for Travel Time')),
                ('schedule_inspection', models.BooleanField(default=False, verbose_name='Schedule Inspection')),
                ('event_status', models.CharField(blank=True, choices=[('DRAFT', 'DRAFT'), ('PUBLISHED', 'PUBLISHED')], max_length=200, null=True, verbose_name='Event Status')),
                ('employees', models.ManyToManyField(blank=True, null=True, to='business.Employee')),
                ('selected_tasks', models.ManyToManyField(blank=True, null=True, to='workside.Task')),
                ('worksite', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='workside.WorkSite')),
            ],
            options={
                'verbose_name': 'Event',
                'verbose_name_plural': 'Events',
            },
        ),
    ]

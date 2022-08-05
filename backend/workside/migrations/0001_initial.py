# Generated by Django 2.2.28 on 2022-08-04 17:42

from django.db import migrations, models
import django.db.models.deletion
import workside.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('business', '0003_auto_20220804_1740'),
    ]

    operations = [
        migrations.CreateModel(
            name='TaskAttachments',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('file', models.FileField(blank=True, null=True, upload_to=workside.models.workside_task_attachments_file_path, verbose_name='Task attachments')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='WorkSide',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(blank=True, max_length=255, null=True, verbose_name='WorkSide Name')),
                ('location', models.CharField(max_length=255, verbose_name='WorkSide Location')),
                ('description', models.TextField(blank=True, null=True, verbose_name='WorkSide Description')),
                ('notes', models.TextField(blank=True, null=True, verbose_name='WorkSide Description')),
                ('monthly_rates', models.CharField(max_length=10, verbose_name='WorkSide Monthly Rates')),
                ('clear_frequency_by_day', models.CharField(blank=True, choices=[('MONDAY', 'MONDAY'), ('TUESDAY', 'TUESDAY'), ('WEDNESDAY', 'WEDNESDAY'), ('THURSDAY', 'THURSDAY'), ('FRIDAY', 'FRIDAY'), ('SATURDAY', 'SATURDAY'), ('SUNDAY', 'SUNDAY')], max_length=10, null=True, verbose_name='WorkSide Monthly Rates')),
                ('desired_time', models.CharField(max_length=10, verbose_name='WorkSide Desired Time')),
                ('number_of_workers_needed', models.CharField(blank=True, max_length=10, null=True, verbose_name='WorkSide Num Of Workers Needed')),
                ('supplies_needed', models.CharField(blank=True, max_length=10, null=True, verbose_name='WorkSide Supplier Needed')),
                ('contact_person_name', models.CharField(blank=True, max_length=10, null=True, verbose_name='Contact Person Name')),
                ('phone_number', models.CharField(blank=True, max_length=10, null=True, verbose_name='Contact Person Number')),
                ('logo', models.FileField(blank=True, null=True, upload_to=workside.models.business_directory_path, verbose_name='Worksidet Logo')),
                ('instruction_video', models.FileField(blank=True, null=True, upload_to=workside.models.business_directory_path, verbose_name='Profile Picture')),
                ('is_active', models.BooleanField(default=True)),
                ('business', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='business.Business')),
            ],
            options={
                'verbose_name': 'Workside',
                'verbose_name_plural': 'Worksides',
            },
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(blank=True, max_length=255, null=True, verbose_name='WorkSide Name')),
                ('description', models.TextField(blank=True, null=True, verbose_name='WorkSide Description')),
                ('notes', models.TextField(blank=True, null=True, verbose_name='WorkSide Description')),
                ('priority', models.CharField(blank=True, choices=[('LOW', 'LOW'), ('MEDIUM', 'MEDIUM'), ('HIGH', 'HIGH')], max_length=10, null=True, verbose_name='Task Critically')),
                ('frequency_of_task', models.CharField(blank=True, choices=[('WEEKLY', 'WEEKLY'), ('MONTHLY', 'MONTHLY'), ('DAILY', 'DAILY')], max_length=10, null=True, verbose_name='Frequency Of Task')),
                ('workside', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='workside.WorkSide')),
            ],
            options={
                'verbose_name': 'Task',
                'verbose_name_plural': 'Tasks',
            },
        ),
    ]

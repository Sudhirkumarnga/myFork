# Generated by Django 3.2.12 on 2023-10-26 11:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workside', '0021_auto_20231026_1042'),
    ]

    operations = [
        migrations.AlterField(
            model_name='worksite',
            name='contact_phone_number',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]

# Generated by Django 3.2.12 on 2023-01-07 09:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('workside', '0018_event_parent'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='parent_event', to='workside.event'),
        ),
    ]

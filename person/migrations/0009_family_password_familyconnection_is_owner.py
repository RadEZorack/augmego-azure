# Generated by Django 5.0.6 on 2024-07-13 16:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('person', '0008_family_familyconnection'),
    ]

    operations = [
        migrations.AddField(
            model_name='family',
            name='password',
            field=models.CharField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='familyconnection',
            name='is_owner',
            field=models.BooleanField(default=False),
        ),
    ]

# Generated by Django 5.0.6 on 2024-07-22 01:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('person', '0010_rename_avatar_person_avatar_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='avatar',
            field=models.FileField(blank=True, null=True, upload_to='media/person-avatar/'),
        ),
    ]

# Generated by Django 4.2.6 on 2023-10-30 15:36

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='WebPage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('w', models.FloatField()),
                ('h', models.FloatField()),
                ('s', models.FloatField()),
                ('p1', models.FloatField()),
                ('p2', models.FloatField()),
                ('p3', models.FloatField()),
                ('r1', models.FloatField()),
                ('r2', models.FloatField()),
                ('r3', models.FloatField()),
                ('url', models.TextField()),
                ('html', models.TextField()),
            ],
        ),
    ]

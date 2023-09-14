# Generated by Django 3.2 on 2023-09-14 02:12

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('doctors', '0004_auto_20230910_1735'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='doctor',
            name='address',
        ),
        migrations.RemoveField(
            model_name='doctor',
            name='phones',
        ),
        migrations.AddField(
            model_name='doctor',
            name='i_care_better',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='doctor',
            name='image',
            field=models.ImageField(blank=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='doctor',
            name='nancys_nook',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='DoctorLocation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hospital_name', models.CharField(blank=True, max_length=200)),
                ('private_only', models.BooleanField(default=False)),
                ('address', models.CharField(blank=True, max_length=200)),
                ('phones', django.contrib.postgres.fields.ArrayField(base_field=phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None), blank=True, default=list, null=True, size=None)),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='doctors.doctor')),
            ],
        ),
    ]

# Generated by Django 3.2 on 2023-10-16 14:54

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Doctor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=100, unique=True)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female')], default='M', max_length=1)),
                ('websites', django.contrib.postgres.fields.ArrayField(base_field=models.URLField(), blank=True, default=list, null=True, size=None)),
                ('i_care_better', models.URLField(blank=True)),
                ('nancys_nook', models.BooleanField(default=False)),
                ('image', models.ImageField(blank=True, null=True, upload_to='images')),
                ('status', model_utils.fields.StatusField(choices=[('PENDING_APPROVAL', 'PENDING_APPROVAL'), ('APPROVED', 'APPROVED'), ('REJECTED', 'REJECTED')], default='PENDING_APPROVAL', max_length=100, no_check_for_status=True)),
                ('added_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('approved_at', model_utils.fields.MonitorField(default=django.utils.timezone.now, monitor='status', null=True, when={'APPROVED'})),
                ('rejected_at', model_utils.fields.MonitorField(default=django.utils.timezone.now, monitor='status', null=True, when={'REJECTED'})),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='DoctorCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30, unique=True)),
                ('active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='DoctorSpeciality',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30, unique=True)),
                ('active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='DoctorLocation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hospital_name', models.CharField(blank=True, max_length=200, null=True)),
                ('address', models.CharField(blank=True, max_length=200)),
                ('lat', models.DecimalField(blank=True, decimal_places=16, max_digits=22, null=True)),
                ('lng', models.DecimalField(blank=True, decimal_places=16, max_digits=22, null=True)),
                ('phone', phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('private_only', models.BooleanField(default=False)),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='doctors.doctor')),
            ],
        ),
        migrations.AddField(
            model_name='doctor',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='doctors.doctorcategory'),
        ),
        migrations.AddField(
            model_name='doctor',
            name='specialities',
            field=models.ManyToManyField(blank=True, to='doctors.DoctorSpeciality'),
        ),
    ]

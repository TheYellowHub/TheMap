# Generated by Django 3.2 on 2023-11-25 16:51

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20231124_1954'),
        ('doctors', '0003_doctor_added_by'),
    ]

    operations = [
        migrations.CreateModel(
            name='DoctorReview',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('past_operation', models.BooleanField()),
                ('future_operation', models.BooleanField()),
                ('operation_month', models.DateField(blank=True, null=True)),
                ('status', model_utils.fields.StatusField(choices=[('PENDING_APPROVAL', 'PENDING_APPROVAL'), ('APPROVED', 'APPROVED'), ('REJECTED', 'REJECTED')], default='PENDING_APPROVAL', max_length=100, no_check_for_status=True)),
                ('added_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('approved_at', model_utils.fields.MonitorField(default=django.utils.timezone.now, monitor='status', null=True, when={'APPROVED'})),
                ('rejected_at', model_utils.fields.MonitorField(default=django.utils.timezone.now, monitor='status', null=True, when={'REJECTED'})),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('added_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.user')),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='doctors.doctor')),
            ],
        ),
    ]
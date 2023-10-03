# Generated by Django 3.2 on 2023-09-30 09:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('doctors', '0002_auto_20230926_1952'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='doctor',
            name='categories',
        ),
        migrations.AddField(
            model_name='doctor',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='doctors.doctorcategory'),
        ),
        migrations.AlterUniqueTogether(
            name='doctorlocation',
            unique_together=set(),
        ),
    ]

# Generated by Django 3.2 on 2023-11-28 16:02

from django.db import migrations, models
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('doctors', '0007_alter_doctorreview_rating'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctorreview',
            name='rejection_reason',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='doctorreview',
            name='future_operation',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='doctorreview',
            name='past_operation',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='doctorreview',
            name='status',
            field=model_utils.fields.StatusField(choices=[(0, 'dummy')], default='DRAFT', max_length=100, no_check_for_status=True),
        ),
    ]

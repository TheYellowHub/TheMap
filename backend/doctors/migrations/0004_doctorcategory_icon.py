# Generated by Django 3.2 on 2023-10-01 01:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('doctors', '0003_auto_20230930_0924'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctorcategory',
            name='icon',
            field=models.ImageField(blank=True, null=True, upload_to='icons'),
        ),
    ]
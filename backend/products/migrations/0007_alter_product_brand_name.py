# Generated by Django 4.2.2 on 2023-07-19 00:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0006_brand'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='brand_name',
            field=models.CharField(blank=True, default='', max_length=100, null=True),
        ),
    ]

# Generated by Django 5.1.3 on 2024-11-12 00:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_usercurrencyaccount_currency_code'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='usercurrencyaccount',
            constraint=models.UniqueConstraint(fields=('user', 'currency_code'), name='unique_user_currency_account'),
        ),
    ]

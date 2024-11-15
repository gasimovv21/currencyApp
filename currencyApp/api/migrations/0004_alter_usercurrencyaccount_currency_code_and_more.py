# Generated by Django 5.1.3 on 2024-11-12 00:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_usercurrencyaccount'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usercurrencyaccount',
            name='currency_code',
            field=models.CharField(choices=[('USD', 'US Dollar'), ('EUR', 'Euro'), ('JPY', 'Japanese Yen'), ('GBP', 'British Pound'), ('AUD', 'Australian Dollar'), ('CAD', 'Canadian Dollar'), ('CHF', 'Swiss Franc'), ('CNY', 'Chinese Yuan'), ('SEK', 'Swedish Krona'), ('NZD', 'New Zealand Dollar'), ('MXN', 'Mexican Peso'), ('SGD', 'Singapore Dollar'), ('HKD', 'Hong Kong Dollar'), ('NOK', 'Norwegian Krone'), ('KRW', 'South Korean Won')], max_length=3),
        ),
        migrations.AlterField(
            model_name='usercurrencyaccount',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='currency_accounts', to='api.user'),
        ),
    ]

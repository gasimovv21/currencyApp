# Generated by Django 5.1.3 on 2024-11-12 00:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_user_phone_number'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserCurrencyAccount',
            fields=[
                ('account_id', models.AutoField(primary_key=True, serialize=False)),
                ('currency_code', models.CharField(max_length=3)),
                ('balance', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('is_active', models.BooleanField(default=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='currency_accounts', to='api.user')),
            ],
        ),
    ]

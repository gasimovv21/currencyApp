# Generated by Django 5.1.3 on 2024-11-09 22:08

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('user_id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=150, unique=True)),
                ('password', models.CharField(max_length=128)),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('phone_number', models.CharField(blank=True, max_length=15, null=True, unique=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('account_created_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]

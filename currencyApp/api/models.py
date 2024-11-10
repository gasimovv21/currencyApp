import re
from django.core.exceptions import ValidationError
from django.db import models

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15, unique=True, null=True)
    email = models.EmailField(unique=True)
    account_created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

    def clean(self):
    # Проверка username
        if not re.match(r'^[a-zA-Z0-9_]+$', self.username):
            raise ValidationError("Username cannot contain special characters.")
        
        name_pattern = r'^[A-Z][a-z]+(?: [A-Z][a-z]+)*$'
        if not re.match(name_pattern, self.first_name):
            raise ValidationError("First name must follow the format: Eltun.")
        if not re.match(name_pattern, self.last_name):
            raise ValidationError("Last name must follow the format: Gasimov.")
        
        if not re.match(r'^\+48\d{9}$', self.phone_number):
            raise ValidationError("Phone number must be in the format +48XXXXXXXXX (9 digits after country code +48).")
        
        if not re.match(r'^[^@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', self.email):
            raise ValidationError("Email must be valid (e.g., gasimoweltun@gmail.com).")
        
        if not re.match(r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$', self.password):
            raise ValidationError(
                "Password must be 8-16 characters long and contain at least 1 uppercase letter, 1 special character, and 1 number."
            )

        if any(word in self.password.lower() for word in self.username.lower().split('_')):
            raise ValidationError("Username and password must not be similar.")

        email_username = self.email.split('@')[0]
        if email_username in self.password:
            raise ValidationError("Email and password must not be similar.")


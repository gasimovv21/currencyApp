import re
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver



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
        if not self.username or self.username.strip() == "":
            raise ValidationError("Username is required.")
        if not re.match(r'^[a-zA-Z0-9_]+$', self.username):
            raise ValidationError("Username cannot contain special characters.")
        
        name_pattern = r'^[A-Z][a-z]+(?: [A-Z][a-z]+)*$'
        if not self.first_name or self.first_name.strip() == "":
            raise ValidationError("First name is required.")
        if not re.match(name_pattern, self.first_name):
            raise ValidationError("First name must follow the format: Eltun.")
        
        if not self.last_name or self.last_name.strip() == "":
            raise ValidationError("Last name is required.")
        if not re.match(name_pattern, self.last_name):
            raise ValidationError("Last name must follow the format: Gasimov.")
        
        if not self.phone_number or self.phone_number.strip() == "":
            raise ValidationError("Phone number is required.")
        if not re.match(r'^\+48\d{9}$', self.phone_number):
            raise ValidationError("Phone number must be in the format +48XXXXXXXXX (9 digits after +48).")
        
        if not self.email or self.email.strip() == "":
            raise ValidationError("Email is required.")
        if not re.match(r'^[^@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', self.email):
            raise ValidationError("Email must be valid (e.g., gasimoweltun@gmail.com).")
        
        if not self.password or self.password.strip() == "":
            raise ValidationError("Password is required.")
        
        if not (8 <= len(self.password) <= 16):
            raise ValidationError("Password must be between 8 and 16 characters.")
        
        if not re.search(r'[A-Z]', self.password):
            raise ValidationError("Password must contain at least 1 uppercase letter.")
        
        if not re.search(r'\d', self.password):
            raise ValidationError("Password must contain at least 1 number.")
        
        if not re.search(r'[@$!%*?&]', self.password):
            raise ValidationError("Password must contain at least 1 special character (@, $, !, %, *, ?, &).")

        if self.username and self.password:
            if any(word in self.password.lower() for word in self.username.lower().split('_')):
                raise ValidationError("Username and password must not be similar.")

        if self.email and self.password:
            email_username = self.email.split('@')[0]
            if email_username in self.password:
                raise ValidationError("Email and password must not be similar.")


class UserCurrencyAccount(models.Model):
    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('JPY', 'Japanese Yen'),
        ('GBP', 'British Pound'),
        ('AUD', 'Australian Dollar'),
        ('CAD', 'Canadian Dollar'),
        ('CHF', 'Swiss Franc'),
        ('CNY', 'Chinese Yuan'),
        ('SEK', 'Swedish Krona'),
        ('NZD', 'New Zealand Dollar'),
        ('MXN', 'Mexican Peso'),
        ('SGD', 'Singapore Dollar'),
        ('HKD', 'Hong Kong Dollar'),
        ('NOK', 'Norwegian Krone'),
        ('KRW', 'South Korean Won'),
        ('PLN', 'Polish Zloty'),  # Default
    ]

    account_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='currency_accounts')
    currency_code = models.CharField(max_length=3, choices=CURRENCY_CHOICES)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'currency_code'], name='unique_user_currency_account')
        ]

    def __str__(self):
        return f"{self.get_currency_code_display()} Account for {self.user.username}"

    def clean(self):
        if not re.match(r'^[A-Z]{3}$', self.currency_code):
            raise ValidationError("Currency code must be a valid ISO 4217 code (e.g., USD, EUR, PLN).")
        if self.balance < 0:
            raise ValidationError("Balance cannot be negative.")


# Сигнал для создания родного валютного счета
@receiver(post_save, sender=User)
def create_default_currency_account(sender, instance, created, **kwargs):
    if created:
        UserCurrencyAccount.objects.create(user=instance, currency_code='PLN')

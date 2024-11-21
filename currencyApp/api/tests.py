from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .models import User, UserCurrencyAccount, DepositHistory, AccountHistory

class CurrencyAppAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            username="testuser",
            password=make_password("Test@1234"),
            first_name="Test",
            last_name="User",
            phone_number="+48123456789",
            email="testuser@example.com",
        )

        self.currency_account = UserCurrencyAccount.objects.create(
            user=self.user,
            currency_code="USD",
            balance=1000.00,
        )
        self.login_url = reverse("login")
        self.register_url = reverse("register")
        self.deposit_url = reverse("deposit-to-account", kwargs={"user_id": self.user.user_id})
        self.convert_url = reverse("convert-currency", kwargs={"user_id": self.user.user_id})

    def test_register_user(self):
        data = {
            "username": "newuser",
            "password": "New@1234",
            "first_name": "New",
            "last_name": "User",
            "phone_number": "+48123456788",
            "email": "newuser@example.com",
        }
        mutable_data = dict(data)
        response = self.client.post(self.register_url, mutable_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "User registered successfully.")

    def test_login_user(self):
        data = {"username": "testuser", "password": "Test@1234"}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Login successful.")
        self.assertIn("user", response.data)

    def test_deposit_to_account(self):
        data = {"user_currency_account_code": "USD", "amount": 200.00}
        response = self.client.post(self.deposit_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Deposit successful.")

    def test_convert_currency(self):
        UserCurrencyAccount.objects.create(
            user=self.user,
            currency_code="EUR",
            balance=500.00,
        )
        data = {"from_currency": "USD", "to_currency": "EUR", "amount": 100.00}
        response = self.client.post(self.convert_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Conversion successful.")

    def test_protected_default_account_deletion(self):
        pln_account = self.user.currency_accounts.get(currency_code="PLN")
        delete_url = reverse("currency-account-detail", kwargs={"pk": pln_account.account_id})
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Cannot delete the default PLN account.")

    def test_insufficient_balance_conversion(self):
        UserCurrencyAccount.objects.create(
            user=self.user,
            currency_code="EUR",
            balance=0.00,
        )
        data = {"from_currency": "USD", "to_currency": "EUR", "amount": 5000.00}
        response = self.client.post(self.convert_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Insufficient balance in USD account.")

    def test_get_deposit_history(self):
        DepositHistory.objects.create(
            user=self.user,
            user_currency_account=self.currency_account,
            amount=100.00,
        )
        response = self.client.get(self.deposit_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_get_account_history(self):
        history_url = reverse("account-history", kwargs={"user_id": self.user.user_id})
        AccountHistory.objects.create(
            user=self.user,
            currency="USD",
            amount=100.00,
            action="income",
        )
        response = self.client.get(history_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

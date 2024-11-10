from django.test import TestCase
from django.core.exceptions import ValidationError
from .models import User

class UserModelTest(TestCase):

    def setUp(self):
        self.valid_user_data = {
            'username': 'valid_user',
            'password': 'StrongPass1!',
            'first_name': 'Eltun',
            'last_name': 'Gasimov',
            'phone_number': '+48511383345',
            'email': 'validemail@gmail.com',
        }

    def test_valid_user(self):
        user = User(**self.valid_user_data)
        try:
            user.full_clean()
        except ValidationError:
            self.fail("Valid user data raised ValidationError unexpectedly!")

    def test_invalid_username_special_characters(self):
        self.valid_user_data['username'] = 'invalid$user'
        user = User(**self.valid_user_data)
        with self.assertRaises(ValidationError) as context:
            user.full_clean()
        self.assertIn('Username cannot contain special characters.', str(context.exception))

    def test_invalid_password_length(self):
        self.valid_user_data['password'] = 'Short1!'
        user = User(**self.valid_user_data)
        with self.assertRaises(ValidationError) as context:
            user.full_clean()
        self.assertIn('Password must be 8-16 characters long', str(context.exception))

    def test_password_without_special_characters(self):
        self.valid_user_data['password'] = 'NoSpecial1'
        user = User(**self.valid_user_data)
        with self.assertRaises(ValidationError) as context:
            user.full_clean()
        self.assertIn('Password must be 8-16 characters long', str(context.exception))

    def test_email_password_similarity(self):
        """Ensure email and password are not similar"""
        self.valid_user_data['email'] = 'useremail@gmail.com'
        self.valid_user_data['password'] = 'Useremail1!'
        user = User(**self.valid_user_data)
        with self.assertRaises(ValidationError) as context:
            user.full_clean()

        error_messages = context.exception.message_dict.get('__all__', [])

        self.assertIn('Email and password must not be similar.', error_messages)
        self.assertIn('Username and password must not be similar.', error_messages)


    def test_invalid_phone_number_format(self):
        self.valid_user_data['phone_number'] = '+48012345'
        user = User(**self.valid_user_data)
        with self.assertRaises(ValidationError) as context:
            user.full_clean()
        self.assertIn('Phone number must be in the format +48XXXXXXXXX', str(context.exception))

    def test_invalid_email_format(self):
        self.valid_user_data['email'] = 'invalid-email@domain'
        user = User(**self.valid_user_data)
        with self.assertRaises(ValidationError) as context:
            user.full_clean()
        self.assertIn('Email must be valid', str(context.exception))

    def test_email_password_similarity(self):
        """Ensure email and password are not similar"""
        self.valid_user_data['email'] = 'useremail@gmail.com'
        self.valid_user_data['password'] = 'Useremail1!'
        user = User(**self.valid_user_data)
        with self.assertRaises(ValidationError) as context:
            user.full_clean()
        self.assertIn('Email and password must not be similar.', str(context.exception))

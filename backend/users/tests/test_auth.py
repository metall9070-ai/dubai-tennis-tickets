"""
Tests for user authentication endpoints.
Covers: registration, login, logout, token refresh, password change.
"""

from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserRegistrationTests(APITestCase):
    """Tests for user registration endpoint."""

    def setUp(self):
        self.register_url = reverse('register')
        self.valid_payload = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPass123!',
            'password_confirm': 'TestPass123!',
            'first_name': 'Test',
            'last_name': 'User'
        }

    def test_register_user_success(self):
        """Test successful user registration."""
        response = self.client.post(self.register_url, self.valid_payload)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'test@example.com')
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_register_user_duplicate_email(self):
        """Test registration fails with duplicate email."""
        User.objects.create_user(
            username='existing',
            email='test@example.com',
            password='Test123!'
        )

        response = self.client.post(self.register_url, self.valid_payload)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_password_mismatch(self):
        """Test registration fails when passwords don't match."""
        payload = self.valid_payload.copy()
        payload['password_confirm'] = 'DifferentPass123!'

        response = self.client.post(self.register_url, payload)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_weak_password(self):
        """Test registration fails with weak password."""
        payload = self.valid_payload.copy()
        payload['password'] = '123'
        payload['password_confirm'] = '123'

        response = self.client.post(self.register_url, payload)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_missing_required_fields(self):
        """Test registration fails with missing required fields."""
        response = self.client.post(self.register_url, {})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserLoginTests(APITestCase):
    """Tests for user login endpoint."""

    def setUp(self):
        self.login_url = reverse('token_obtain_pair')
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )

    def test_login_success(self):
        """Test successful login returns tokens."""
        response = self.client.post(self.login_url, {
            'username': 'testuser',
            'password': 'TestPass123!'
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_invalid_credentials(self):
        """Test login fails with invalid credentials."""
        response = self.client.post(self.login_url, {
            'username': 'testuser',
            'password': 'WrongPassword!'
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_nonexistent_user(self):
        """Test login fails for non-existent user."""
        response = self.client.post(self.login_url, {
            'username': 'nonexistent',
            'password': 'TestPass123!'
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserLogoutTests(APITestCase):
    """Tests for user logout endpoint with token blacklisting."""

    def setUp(self):
        self.logout_url = reverse('logout')
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
        self.refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.refresh.access_token}'
        )

    def test_logout_success(self):
        """Test successful logout blacklists token."""
        response = self.client.post(self.logout_url, {
            'refresh': str(self.refresh)
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Logout successful')

    def test_logout_missing_token(self):
        """Test logout fails without refresh token."""
        response = self.client.post(self.logout_url, {})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'missing_token')

    def test_logout_invalid_token(self):
        """Test logout fails with invalid token."""
        response = self.client.post(self.logout_url, {
            'refresh': 'invalid_token_string'
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'invalid_token')

    def test_logout_already_blacklisted_token(self):
        """Test logout fails for already blacklisted token."""
        # First logout
        self.client.post(self.logout_url, {'refresh': str(self.refresh)})

        # Second logout with same token
        response = self.client.post(self.logout_url, {
            'refresh': str(self.refresh)
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'token_blacklisted')

    def test_logout_other_users_token(self):
        """Test user cannot blacklist another user's token."""
        # Create another user and their token
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='TestPass123!'
        )
        other_refresh = RefreshToken.for_user(other_user)

        # Try to blacklist other user's token
        response = self.client.post(self.logout_url, {
            'refresh': str(other_refresh)
        })

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['error'], 'invalid_token')

    def test_logout_unauthenticated(self):
        """Test logout fails for unauthenticated user."""
        self.client.credentials()  # Remove auth
        response = self.client.post(self.logout_url, {
            'refresh': str(self.refresh)
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TokenRefreshTests(APITestCase):
    """Tests for token refresh endpoint."""

    def setUp(self):
        self.refresh_url = reverse('token_refresh')
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
        self.refresh = RefreshToken.for_user(self.user)

    def test_token_refresh_success(self):
        """Test successful token refresh."""
        response = self.client.post(self.refresh_url, {
            'refresh': str(self.refresh)
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_token_refresh_invalid_token(self):
        """Test refresh fails with invalid token."""
        response = self.client.post(self.refresh_url, {
            'refresh': 'invalid_token_string'
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh_blacklisted_token(self):
        """Test refresh fails with blacklisted token."""
        # Blacklist the token
        self.refresh.blacklist()

        response = self.client.post(self.refresh_url, {
            'refresh': str(self.refresh)
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PasswordChangeTests(APITestCase):
    """Tests for password change endpoint."""

    def setUp(self):
        self.password_change_url = reverse('password_change')
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='OldPass123!'
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}'
        )

    def test_password_change_success(self):
        """Test successful password change."""
        response = self.client.post(self.password_change_url, {
            'old_password': 'OldPass123!',
            'new_password': 'NewPass456!'
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify new password works
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewPass456!'))

    def test_password_change_wrong_old_password(self):
        """Test password change fails with wrong old password."""
        response = self.client.post(self.password_change_url, {
            'old_password': 'WrongOldPass!',
            'new_password': 'NewPass456!'
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_change_weak_new_password(self):
        """Test password change fails with weak new password."""
        response = self.client.post(self.password_change_url, {
            'old_password': 'OldPass123!',
            'new_password': '123'
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_change_unauthenticated(self):
        """Test password change fails for unauthenticated user."""
        self.client.credentials()  # Remove auth

        response = self.client.post(self.password_change_url, {
            'old_password': 'OldPass123!',
            'new_password': 'NewPass456!'
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileTests(APITestCase):
    """Tests for user profile endpoint."""

    def setUp(self):
        self.profile_url = reverse('profile')
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!',
            first_name='Test',
            last_name='User'
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}'
        )

    def test_get_profile_success(self):
        """Test getting user profile."""
        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')
        self.assertEqual(response.data['first_name'], 'Test')

    def test_update_profile_success(self):
        """Test updating user profile."""
        response = self.client.patch(self.profile_url, {
            'first_name': 'Updated',
            'last_name': 'Name'
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Updated')

        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')

    def test_profile_unauthenticated(self):
        """Test profile access fails for unauthenticated user."""
        self.client.credentials()  # Remove auth

        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


@override_settings(
    REST_FRAMEWORK={
        'DEFAULT_THROTTLE_RATES': {
            'login': '2/minute',
            'register': '2/minute',
        }
    }
)
class ThrottlingTests(APITestCase):
    """Tests for rate limiting on auth endpoints."""

    def setUp(self):
        self.login_url = reverse('token_obtain_pair')
        self.register_url = reverse('register')
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )

    def test_login_throttling(self):
        """Test login endpoint is throttled after too many attempts."""
        # Make requests up to the limit
        for i in range(3):
            self.client.post(self.login_url, {
                'username': 'testuser',
                'password': 'WrongPassword!'
            })

        # Next request should be throttled
        response = self.client.post(self.login_url, {
            'username': 'testuser',
            'password': 'TestPass123!'
        })

        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    def test_register_throttling(self):
        """Test register endpoint is throttled after too many attempts."""
        # Make requests up to the limit
        for i in range(3):
            self.client.post(self.register_url, {
                'username': f'user{i}',
                'email': f'user{i}@example.com',
                'password': 'TestPass123!',
                'password_confirm': 'TestPass123!'
            })

        # Next request should be throttled
        response = self.client.post(self.register_url, {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'TestPass123!',
            'password_confirm': 'TestPass123!'
        })

        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

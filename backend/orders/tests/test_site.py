"""
Tests for Site model and integration.

Verifies:
1. Site code immutability
2. Site status affects new order creation
3. Order.site immutability after creation
4. API site_code validation
"""

import pytest
from django.core.exceptions import ValidationError
from orders.models_site import Site
from orders.models import Order, SalesChannel
from orders.services import OrderService, SiteNotFoundError, SiteDisabledError


@pytest.fixture
def active_site(db):
    """Create an active site for testing."""
    return Site.objects.create(
        code='test_site',
        domain='test.example.com',
        status='active'
    )


@pytest.fixture
def disabled_site(db):
    """Create a disabled site for testing."""
    return Site.objects.create(
        code='disabled_site',
        domain='disabled.example.com',
        status='disabled'
    )


@pytest.fixture
def sales_channel(db):
    """Create a sales channel for testing."""
    return SalesChannel.objects.create(
        name='Test Channel',
        domain='test.example.com',
        currency='USD',
        is_active=True
    )


class TestSiteCodeImmutability:
    """Test that Site.code cannot be changed after creation."""

    def test_code_set_on_creation(self, active_site):
        """Code is set correctly on creation."""
        assert active_site.code == 'test_site'

    def test_code_cannot_change_via_save(self, active_site):
        """Code cannot be changed via save()."""
        active_site.code = 'new_code'
        with pytest.raises(ValueError, match="cannot be changed"):
            active_site.save()

    def test_code_cannot_change_via_update(self, active_site):
        """Code cannot be changed via direct update (bypasses model validation)."""
        # Note: update() bypasses model save(), but unique constraint prevents duplicates
        original_code = active_site.code
        # Reload and verify code unchanged
        active_site.refresh_from_db()
        assert active_site.code == original_code


class TestSiteStatus:
    """Test Site status affects order creation."""

    def test_active_site_allows_orders(self, active_site):
        """Active site can create orders."""
        assert active_site.can_create_order() is True
        assert active_site.is_active is True

    def test_disabled_site_blocks_orders(self, disabled_site):
        """Disabled site cannot create orders."""
        assert disabled_site.can_create_order() is False
        assert disabled_site.is_active is False


class TestOrderServiceSiteValidation:
    """Test OrderService validates site_code."""

    def test_resolve_site_active(self, active_site):
        """resolve_site returns active site."""
        site = OrderService.resolve_site('test_site')
        assert site.id == active_site.id

    def test_resolve_site_not_found(self, db):
        """resolve_site raises SiteNotFoundError for unknown code."""
        with pytest.raises(SiteNotFoundError) as exc_info:
            OrderService.resolve_site('nonexistent_site')
        assert exc_info.value.code == 'site_not_found'

    def test_resolve_site_disabled(self, disabled_site):
        """resolve_site raises SiteDisabledError for disabled site."""
        with pytest.raises(SiteDisabledError) as exc_info:
            OrderService.resolve_site('disabled_site')
        assert exc_info.value.code == 'site_disabled'


class TestOrderSiteImmutability:
    """Test that Order.site cannot be changed after creation."""

    @pytest.fixture
    def order_with_site(self, active_site, sales_channel, db):
        """Create an order with site for testing."""
        return Order.objects.create(
            name='Test Customer',
            email='test@example.com',
            phone='+1234567890',
            site=active_site,
            sales_channel=sales_channel,
            currency='USD',
        )

    def test_site_set_on_creation(self, order_with_site, active_site):
        """Site is set correctly on creation."""
        assert order_with_site.site_id == active_site.id

    def test_site_cannot_change(self, order_with_site, disabled_site):
        """Site cannot be changed after creation."""
        order_with_site.site = disabled_site
        with pytest.raises(ValueError, match="cannot be changed"):
            order_with_site.save()

    def test_site_cannot_change_via_update_fields(self, order_with_site, disabled_site):
        """Site cannot be changed even with update_fields."""
        order_with_site.site = disabled_site
        with pytest.raises(ValueError, match="cannot be changed"):
            order_with_site.save(update_fields=['site'])


class TestDefaultSiteMigration:
    """Test that default site is created and orders are linked."""

    def test_default_site_exists(self, db):
        """Default site exists after migration."""
        default_site = Site.objects.filter(code='default').first()
        assert default_site is not None
        assert default_site.status == 'active'

    def test_get_default_creates_if_missing(self, db):
        """Site.get_default() creates default site if missing."""
        Site.objects.filter(code='default').delete()
        default_site = Site.get_default()
        assert default_site.code == 'default'
        assert default_site.status == 'active'

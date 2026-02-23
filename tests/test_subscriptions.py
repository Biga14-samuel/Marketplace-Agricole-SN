"""
Module 10 : ABONNEMENTS & PANIERS
Tests pour Subscription, SubscriptionItem, SubscriptionDelivery,
ProductBundle, BundleItem
"""

import pytest
from fastapi import status

SUBSCRIPTIONS_PREFIX = "/subscription/subscriptions"


class TestSubscriptionsModule:
    """Tests du module Abonnements"""

    def test_root_endpoint(self, client):
        """Vérification que l'API répond"""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK

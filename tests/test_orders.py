import pytest
from fastapi import status

ORDERS_PREFIX = "/orders"


class TestOrdersModule:
    """Tests du module Panier & Commandes"""

    def test_get_cart_empty(self, client):
        """Voir le panier vide - utilisateur non connecté"""
        response = client.get(f"{ORDERS_PREFIX}/cart")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "items" in data or "id" in data

    def test_root_endpoint(self, client):
        """Vérification que l'API répond"""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK
        assert "status" in response.json()
        assert response.json()["status"] == "online"

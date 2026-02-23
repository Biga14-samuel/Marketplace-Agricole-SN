import pytest
from fastapi import status

DELIVERY_PREFIX = "/delivery"


class TestDeliveryModule:
    """Tests du module Livraison"""

    def test_root_endpoint(self, client):
        """Vérification que l'API répond"""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK

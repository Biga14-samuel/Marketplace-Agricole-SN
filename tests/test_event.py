import pytest
from fastapi import status

EVENTS_PREFIX = "/events"


class TestEventModule:
    """Tests du module Événements & Automatisation"""

    def test_root_endpoint(self, client):
        """Vérification que l'API répond"""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK

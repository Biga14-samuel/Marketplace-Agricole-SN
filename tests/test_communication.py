import pytest
from fastapi import status

COMMUNICATION_PREFIX = "/communication"


class TestCommunicationModule:
    """Tests du module Communication"""

    def test_root_endpoint(self, client):
        """Vérification que l'API répond"""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK

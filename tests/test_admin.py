import pytest
from fastapi import status

ADMIN_PREFIX = "/admin"


class TestAdminModule:
    """Tests du module Administration"""

    def test_root_endpoint(self, client):
        """Vérification que l'API répond"""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK

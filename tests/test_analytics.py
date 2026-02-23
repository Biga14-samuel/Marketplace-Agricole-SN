import pytest
from fastapi import status

ANALYTICS_PREFIX = "/analytics"


class TestAnalyticsModule:
    """Tests du module Analytics & Reporting"""

    def test_track_product_view_public(self, client):
        """Enregistrer une vue produit - peut être anonyme"""
        response = client.post(
            f"{ANALYTICS_PREFIX}/views/track",
            json={"product_id": 1, "session_id": "test-session-123"}
        )
        # Peut être 201 créé ou 404 si produit n'existe pas
        assert response.status_code in [201, 404]

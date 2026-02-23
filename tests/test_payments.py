import pytest
from fastapi import status
from datetime import datetime, timedelta

PAYMENTS_PREFIX = "/payments"


class TestPaymentsModule:
    """Tests du module Paiement & Facturation"""

    def test_get_payment_statistics(self, client):
        """Statistiques des paiements - requiert des dates"""
        start = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
        end = datetime.now().strftime("%Y-%m-%d")
        response = client.get(
            f"{PAYMENTS_PREFIX}/stats/",
            params={"start_date": start, "end_date": end}
        )
        assert response.status_code == status.HTTP_200_OK

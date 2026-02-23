"""
Module 7 : AVIS & CONFIANCE
Tests pour Review, ProducerReview, ReviewHelpful, ReviewReport
"""

import pytest
from fastapi import status

REVIEWS_PREFIX = "/reviews"


class TestReviewsModule:
    """Tests du module Avis & Confiance"""

    def test_root_reachable(self, client):
        """Vérification que l'API répond"""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK

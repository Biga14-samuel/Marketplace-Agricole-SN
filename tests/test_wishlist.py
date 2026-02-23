"""
Module 12 : FAVORIS & LISTES
Tests pour Wishlist, WishlistItem, ProductFollow, ProducerFollow
"""

import pytest
from fastapi import status

WISHLIST_PREFIX = "/wishlist"


class TestWishlistModule:
    """Tests du module Favoris & Listes"""

    def test_root_endpoint(self, client):
        """Vérification que l'API répond"""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK

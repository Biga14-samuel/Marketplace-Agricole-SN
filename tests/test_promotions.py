"""
Module 6 : PROMOTIONS & FIDÉLITÉ
Tests pour Coupon, CouponUsage, Promotion, LoyaltyProgram,
LoyaltyPoint, LoyaltyTransaction, Reward, RewardRedemption
"""

import pytest
from fastapi import status

PROMOTIONS_PREFIX = "/promotions"


class TestPromotionsModule:
    """Tests du module Promotions & Fidélité"""

    def test_get_coupons_public(self, client):
        """Liste des coupons actifs"""
        response = client.get(f"{PROMOTIONS_PREFIX}/coupons")
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.json(), list)

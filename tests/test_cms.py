import pytest
from fastapi import status

CMS_PREFIX = "/cms"


class TestCMSModule:
    """Tests du module Contenu & CMS"""

    def test_get_all_pages(self, client):
        """Liste des pages statiques"""
        response = client.get(f"{CMS_PREFIX}/pages")
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.json(), list)

    def test_get_all_faqs(self, client):
        """Liste des FAQs"""
        response = client.get(f"{CMS_PREFIX}/faqs")
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.json(), list)

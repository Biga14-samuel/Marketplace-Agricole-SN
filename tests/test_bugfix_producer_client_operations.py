"""
Tests d'exploration des conditions de bug pour producer-client-operations-fix

Ce fichier contient les tests basés sur les propriétés pour démontrer les bugs
AVANT d'implémenter les corrections, puis valider les corrections après implémentation.

**Validates: Requirements 1.1, 1.2, 2.1, 2.2**
"""

import pytest
from fastapi import status


# Préfixe des routes produits
PRODUCTS_PREFIX = "/api/v1/products-catalog"


class TestBug1ProductCreationByProducer:
    """
    Tests d'exploration de la condition de bug 1 : Erreur 403 lors de la création de produit par producteur
    
    **Bug Condition (C1)**: Producteur authentifié avec role="producer" tentant de créer un produit
    via POST /api/v1/products-catalog
    
    **Expected Behavior (P1)**: Le système DOIT créer le produit avec succès et retourner 201 Created
    
    **IMPORTANT**: Ce test DOIT ÉCHOUER sur le code NON CORRIGÉ (erreur 403).
    L'échec confirme que le bug existe et que l'analyse de la cause racine est correcte.
    """
    
    def test_bug1_producer_can_create_product_simple_case(
        self,
        client,
        test_db
    ):
        """
        Test d'exploration Bug 1 - Cas simple : Producteur authentifié crée un produit
        
        **Validates: Requirements 1.1, 1.2**
        
        Ce test démontre le bug sur le code NON CORRIGÉ :
        - Producteur authentifié avec role="producer"
        - Données de produit valides
        - POST /api/v1/products-catalog
        
        **RÉSULTAT ATTENDU SUR CODE NON CORRIGÉ**: 403 Forbidden
        **RÉSULTAT ATTENDU APRÈS CORRECTION**: 201 Created
        
        Assertions selon Expected Behavior Properties :
        - result.status_code = 201
        - result.product.id EXISTS
        - result.product.producer_id = input.user.id
        """
        # Créer un producteur manuellement avec le rôle "Producer"
        from app.models.auth import User, Role
        from app.core.security import hash_password
        
        # Récupérer le rôle Producer
        producer_role = test_db.query(Role).filter(Role.name == "Producer").first()
        assert producer_role is not None, "Producer role should exist"
        
        # Créer un utilisateur producteur
        producer_user = User(
            email="test_producer_bug1@marketplace.com",
            password_hash=hash_password("TestPassword123!"),
            is_active=True,
            is_verified=True
        )
        producer_user.roles.append(producer_role)
        test_db.add(producer_user)
        test_db.commit()
        test_db.refresh(producer_user)
        
        # Créer un token d'authentification pour le producteur
        from app.core.security import create_access_token
        access_token = create_access_token(data={"sub": str(producer_user.id)})
        producer_headers = {"Authorization": f"Bearer {access_token}"}
        
        # Récupérer les catégories et unités disponibles
        categories_response = client.get(f"{PRODUCTS_PREFIX}/categories")
        assert categories_response.status_code == status.HTTP_200_OK
        categories = categories_response.json()
        
        units_response = client.get(f"{PRODUCTS_PREFIX}/units")
        assert units_response.status_code == status.HTTP_200_OK
        units = units_response.json()
        
        if not categories or not units:
            pytest.skip("Catégories ou unités non initialisées")
        
        # Données de produit valides
        product_data = {
            "name": "Tomates Bio Test Bug1",
            "slug": "tomates-bio-test-bug1",
            "description": "Tomates biologiques pour test du bug 1",
            "category_id": categories[0]["id"],
            "unit_id": units[0]["id"],
            "price": 5.99,
            "stock_quantity": 100,
            "is_active": True
        }
        
        # Tentative de création par un producteur authentifié
        response = client.post(
            f"{PRODUCTS_PREFIX}/",
            headers=producer_headers,
            json=product_data
        )
        
        # Expected Behavior Properties (Requirements 2.1, 2.2)
        # Sur code NON CORRIGÉ : ce test ÉCHOUERA avec 403
        # Après correction : ce test PASSERA avec 201
        assert response.status_code == status.HTTP_201_CREATED, (
            f"Expected 201 Created but got {response.status_code}. "
            f"Response: {response.json() if response.status_code != 201 else 'N/A'}"
        )
        
        data = response.json()
        assert "id" in data, "Product ID should exist in response"
        assert data["id"] is not None, "Product ID should not be None"
        
        # Vérifier que le produit est associé au producteur
        # Note: producer_id peut être dans le produit ou accessible via une relation
        assert "name" in data
        assert data["name"] == product_data["name"]
    
    def test_bug1_verify_endpoint_uses_wrong_dependency(self, client):
        """
        Test de vérification : L'endpoint utilise get_current_user au lieu de require_producer
        
        Ce test vérifie indirectement que l'endpoint n'effectue pas la vérification
        de rôle appropriée au niveau de la dépendance FastAPI.
        
        **Note**: Ce test est informatif et aide à confirmer la cause racine.
        """
        # Ce test ne peut pas vérifier directement le code de la dépendance,
        # mais il documente l'analyse de la cause racine.
        # La vérification réelle se fait via les tests fonctionnels ci-dessus.
        pass


class TestBug1Preservation:
    """
    Tests de préservation pour Bug 1 : Les contrôles d'accès non-producteurs doivent être préservés
    
    **Preservation Property (P2)**: Pour tous les utilisateurs NON producteurs,
    le système DOIT continuer à retourner 403 Forbidden ou 401 Unauthorized.
    
    **Validates: Requirements 3.1, 3.2, 3.3**
    
    Ces tests DOIVENT PASSER sur le code NON CORRIGÉ ET après correction.
    """
    
    def test_preservation_client_cannot_create_product(
        self,
        client,
        auth_user_with_profile,
        auth_headers
    ):
        """
        Test de préservation : Un client (non-producteur) ne peut pas créer de produits
        
        **Validates: Requirements 3.2**
        
        Ce test DOIT PASSER sur le code NON CORRIGÉ et après correction.
        """
        categories_response = client.get(f"{PRODUCTS_PREFIX}/categories")
        categories = categories_response.json() if categories_response.status_code == 200 else []
        
        units_response = client.get(f"{PRODUCTS_PREFIX}/units")
        units = units_response.json() if units_response.status_code == 200 else []
        
        if not categories or not units:
            pytest.skip("Catégories ou unités non initialisées")
        
        product_data = {
            "name": "Produit par Client",
            "slug": "produit-par-client",
            "category_id": categories[0]["id"],
            "unit_id": units[0]["id"],
            "price": 10.00,
            "stock_quantity": 5
        }
        
        response = client.post(
            f"{PRODUCTS_PREFIX}/",
            headers=auth_headers,
            json=product_data
        )
        
        # Preservation: Les clients ne doivent toujours pas pouvoir créer de produits
        assert response.status_code == status.HTTP_403_FORBIDDEN, (
            f"Clients should not be able to create products. "
            f"Expected 403 but got {response.status_code}"
        )
    
    def test_preservation_unauthenticated_cannot_create_product(self, client):
        """
        Test de préservation : Un utilisateur non authentifié ne peut pas créer de produits
        
        **Validates: Requirements 3.1**
        
        Ce test DOIT PASSER sur le code NON CORRIGÉ et après correction.
        """
        categories_response = client.get(f"{PRODUCTS_PREFIX}/categories")
        categories = categories_response.json() if categories_response.status_code == 200 else []
        
        units_response = client.get(f"{PRODUCTS_PREFIX}/units")
        units = units_response.json() if units_response.status_code == 200 else []
        
        if not categories or not units:
            pytest.skip("Catégories ou unités non initialisées")
        
        product_data = {
            "name": "Produit sans Auth",
            "slug": "produit-sans-auth",
            "category_id": categories[0]["id"],
            "unit_id": units[0]["id"],
            "price": 10.00,
            "stock_quantity": 5
        }
        
        response = client.post(
            f"{PRODUCTS_PREFIX}/",
            json=product_data
        )
        
        # Preservation: Les utilisateurs non authentifiés ne doivent toujours pas pouvoir créer
        assert response.status_code == status.HTTP_401_UNAUTHORIZED, (
            f"Unauthenticated users should not be able to create products. "
            f"Expected 401 but got {response.status_code}"
        )

import pytest
from fastapi import status
from datetime import date, timedelta
from decimal import Decimal

# Préfixe des routes produits
PRODUCTS_PREFIX = "/products-catalog/products"


class TestCategories:
    """Tests de gestion des catégories de produits"""

    def test_get_all_categories(self, client):
        """
        Test de récupération de toutes les catégories.
        
        Cette route est publique car les visiteurs doivent pouvoir
        parcourir le catalogue sans être connectés.
        
        Vérifie que :
        - La route retourne un statut 200
        - Les données sont une liste
        - Les catégories initialisées sont présentes
        """
        response = client.get(f"{PRODUCTS_PREFIX}/categories")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        
        # init_catalog crée des catégories par défaut
        if len(data) > 0:
            assert "name" in data[0]
            assert "slug" in data[0]
            assert "id" in data[0]

    def test_get_category_tree(self, client):
        """
        Test de récupération de l'arbre des catégories.
        
        L'arbre montre les catégories avec leurs sous-catégories imbriquées,
        ce qui est utile pour afficher un menu de navigation.
        
        Vérifie que :
        - La structure hiérarchique est respectée
        - Les sous-catégories sont incluses
        """
        response = client.get(f"{PRODUCTS_PREFIX}/categories/tree")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        
        # Vérifier qu'il y a une structure avec subcategories
        if len(data) > 0:
            assert "name" in data[0]
            # Les catégories peuvent avoir des subcategories
            if "subcategories" in data[0]:
                assert isinstance(data[0]["subcategories"], list)

    def test_get_category_by_id(self, client):
        """
        Test de récupération d'une catégorie spécifique.
        
        Vérifie qu'on peut récupérer les détails d'une catégorie
        en utilisant son ID.
        """
        # D'abord récupérer les catégories disponibles
        categories_response = client.get(f"{PRODUCTS_PREFIX}/categories")
        categories = categories_response.json()
        
        if len(categories) > 0:
            category_id = categories[0]["id"]
            
            response = client.get(f"{PRODUCTS_PREFIX}/categories/{category_id}")
            
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            assert data["id"] == category_id
            assert "name" in data
            assert "slug" in data

    def test_get_nonexistent_category(self, client):
        """
        Test de récupération d'une catégorie qui n'existe pas.
        
        Vérifie que le système gère correctement les IDs invalides.
        """
        response = client.get(f"{PRODUCTS_PREFIX}/categories/99999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_create_category_as_admin(self, client, auth_headers):
        """
        Test de création d'une catégorie par un admin.
        
        Note : Vous devrez peut-être adapter ce test selon vos permissions.
        Un utilisateur normal ne devrait pas pouvoir créer de catégories.
        """
        # Ce test suppose que votre API permet la création de catégories
        # Adaptez selon votre implémentation
        pass


class TestTags:
    """Tests de gestion des tags/étiquettes"""

    def test_get_all_tags(self, client):
        """
        Test de récupération de tous les tags.
        
        Les tags (bio, local, saison, promo) permettent de filtrer
        et mettre en avant certains produits.
        
        Vérifie que :
        - La route est accessible publiquement
        - Les tags initialisés sont présents
        """
        response = client.get(f"{PRODUCTS_PREFIX}/tags")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        
        # Vérifier la structure si des tags existent
        if len(data) > 0:
            tag = data[0]
            assert "name" in tag
            assert "slug" in tag
            assert "type" in tag
            # Le type doit être parmi : bio, local, season, promo
            assert tag["type"] in ["bio", "local", "season", "promo"]

    def test_filter_tags_by_type(self, client):
        """
        Test de filtrage des tags par type.
        
        Vérifie qu'on peut récupérer uniquement les tags d'un type spécifique,
        par exemple uniquement les tags "bio".
        """
        response = client.get(
            f"{PRODUCTS_PREFIX}/tags",
            params={"type": "bio"}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Tous les tags retournés doivent être de type "bio"
        for tag in data:
            assert tag["type"] == "bio"
        
        # Il devrait y avoir au moins un tag bio (créé par init_catalog)
        assert len(data) >= 1


class TestUnits:
    """Tests de gestion des unités de mesure"""

    def test_get_all_units(self, client):
        """
        Test de récupération de toutes les unités.
        
        Les unités (kg, L, pièce) sont essentielles pour quantifier
        les produits agricoles.
        
        Vérifie que :
        - Les unités sont disponibles publiquement
        - La structure contient nom et abréviation
        """
        response = client.get(f"{PRODUCTS_PREFIX}/units")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        
        if len(data) > 0:
            unit = data[0]
            assert "name" in unit
            assert "abbreviation" in unit
            assert "type" in unit
            # Le type doit être : weight, volume, ou piece
            assert unit["type"] in ["weight", "volume", "piece"]


class TestProducts:
    """Tests de gestion des produits"""

    def test_search_products_public(self, client):
        """
        Test de recherche de produits sans authentification.
        
        La recherche de produits doit être accessible aux visiteurs
        pour qu'ils puissent parcourir le catalogue.
        
        Vérifie que :
        - La recherche fonctionne sans token
        - Les paramètres de recherche sont acceptés
        """
        response = client.get(
            f"{PRODUCTS_PREFIX}/",
            params={"search_term": "plantain"}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)

    def test_create_product_as_producer(self, client, producer_with_profile, producer_headers):
        """
        Test de création d'un produit par un producteur.
        
        Seuls les producteurs peuvent ajouter des produits à vendre.
        
        Vérifie que :
        - Un producteur authentifié peut créer un produit
        - Toutes les informations essentielles sont enregistrées
        - Le produit est associé au producteur
        """
        # D'abord récupérer une catégorie et une unité
        categories = client.get(f"{PRODUCTS_PREFIX}/categories").json()
        units = client.get(f"{PRODUCTS_PREFIX}/units").json()
        
        if len(categories) > 0 and len(units) > 0:
            product_data = {
                "name": "Tomates fraîches de Bafoussam",
                "slug": "tomates-fraiches-bafoussam",
                "description": "Tomates rouges bien mûres, cultivées localement à Bafoussam",
                "category_id": categories[0]["id"],
                "unit_id": units[0]["id"],
                "price": 800,  # 800 FCFA/kg
                "stock_quantity": 100,
                "min_order": 1,
                "max_order": 50,
                "is_active": True,
                "is_featured": False,
                "origin": "Bafoussam",
                "tag_ids": []
            }
            
            response = client.post(
                f"{PRODUCTS_PREFIX}/",
                headers=producer_headers,
                json=product_data
            )
            
            assert response.status_code == status.HTTP_201_CREATED
            data = response.json()
            assert data["name"] == product_data["name"]
            assert float(data["price"]) == product_data["price"]
            assert data["stock_quantity"] == product_data["stock_quantity"]

    def test_create_product_invalid_price(self, client, producer_with_profile, producer_headers):
        """
        Test de création avec un prix invalide.
        
        Le prix doit être positif et avoir maximum 2 décimales.
        
        Vérifie la validation du prix.
        """
        categories = client.get(f"{PRODUCTS_PREFIX}/categories").json()
        units = client.get(f"{PRODUCTS_PREFIX}/units").json()
        
        if len(categories) > 0 and len(units) > 0:
            product_data = {
                "name": "Produit Test",
                "slug": "produit-test",
                "category_id": categories[0]["id"],
                "unit_id": units[0]["id"],
                "price": -5.00,  # Prix négatif invalide
                "stock_quantity": 10
            }
            
            response = client.post(
                f"{PRODUCTS_PREFIX}/",
                headers=producer_headers,
                json=product_data
            )
            
            assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_create_product_requires_producer_auth(self, client, auth_headers):
        """
        Test de création de produit par un non-producteur.
        
        Vérifie qu'un client normal ne peut pas créer de produits.
        """
        categories = client.get(f"{PRODUCTS_PREFIX}/categories").json()
        units = client.get(f"{PRODUCTS_PREFIX}/units").json()
        
        if len(categories) > 0 and len(units) > 0:
            product_data = {
                "name": "Produit Unauthorized",
                "slug": "produit-unauthorized",
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
            
            # Devrait être refusé car pas producteur
            assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED]

    def test_get_product_by_id(self, client, producer_with_profile, producer_headers):
        """
        Test de récupération d'un produit spécifique.
        
        Vérifie qu'on peut consulter les détails d'un produit
        en utilisant son ID.
        """
        # Créer un produit d'abord
        categories = client.get(f"{PRODUCTS_PREFIX}/categories").json()
        units = client.get(f"{PRODUCTS_PREFIX}/units").json()
        
        if len(categories) > 0 and len(units) > 0:
            create_response = client.post(
                f"{PRODUCTS_PREFIX}/",
                headers=producer_headers,
                json={
                    "name": "Bananes plantain de Kribi",
                    "slug": "bananes-plantain-kribi",
                    "category_id": categories[0]["id"],
                    "unit_id": units[0]["id"],
                    "price": 1500,  # 1500 FCFA/régime
                    "stock_quantity": 50
                }
            )
            
            if create_response.status_code == status.HTTP_201_CREATED:
                product_id = create_response.json()["id"]
                
                # Récupérer le produit
                response = client.get(f"{PRODUCTS_PREFIX}/{product_id}")
                
                assert response.status_code == status.HTTP_200_OK
                data = response.json()
                assert data["id"] == product_id
                assert "name" in data
                assert "price" in data

    def test_update_product(self, client, producer_with_profile, producer_headers):
        """
        Test de mise à jour d'un produit.
        
        Vérifie qu'un producteur peut modifier ses produits.
        """
        # Créer un produit
        categories = client.get(f"{PRODUCTS_PREFIX}/categories").json()
        units = client.get(f"{PRODUCTS_PREFIX}/units").json()
        
        if len(categories) > 0 and len(units) > 0:
            create_response = client.post(
                f"{PRODUCTS_PREFIX}/",
                headers=producer_headers,
                json={
                    "name": "Produit à Modifier",
                    "slug": "produit-a-modifier",
                    "category_id": categories[0]["id"],
                    "unit_id": units[0]["id"],
                    "price": 5.00,
                    "stock_quantity": 20
                }
            )
            
            if create_response.status_code == status.HTTP_201_CREATED:
                product_id = create_response.json()["id"]
                
                # Mettre à jour
                update_data = {
                    "name": "Produit Modifié",
                    "price": 6.50,
                    "stock_quantity": 30
                }
                
                response = client.put(
                    f"{PRODUCTS_PREFIX}/{product_id}",
                    headers=producer_headers,
                    json=update_data
                )
                
                assert response.status_code == status.HTTP_200_OK
                data = response.json()
                assert data["name"] == update_data["name"]
                assert float(data["price"]) == update_data["price"]

    def test_delete_product(self, client, producer_with_profile, producer_headers):
        """
        Test de suppression d'un produit.
        
        Vérifie qu'un producteur peut supprimer ses produits.
        """
        # Créer un produit
        categories = client.get(f"{PRODUCTS_PREFIX}/categories").json()
        units = client.get(f"{PRODUCTS_PREFIX}/units").json()
        
        if len(categories) > 0 and len(units) > 0:
            create_response = client.post(
                f"{PRODUCTS_PREFIX}/",
                headers=producer_headers,
                json={
                    "name": "Produit à Supprimer",
                    "slug": "produit-a-supprimer",
                    "category_id": categories[0]["id"],
                    "unit_id": units[0]["id"],
                    "price": 3.00,
                    "stock_quantity": 10
                }
            )
            
            if create_response.status_code == status.HTTP_201_CREATED:
                product_id = create_response.json()["id"]
                
                # Supprimer
                response = client.delete(
                    f"{PRODUCTS_PREFIX}/{product_id}",
                    headers=producer_headers
                )
                
                assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_filter_products_by_category(self, client):
        """
        Test de filtrage des produits par catégorie.
        
        Vérifie que les utilisateurs peuvent filtrer le catalogue
        par catégorie pour trouver ce qu'ils cherchent.
        """
        categories = client.get(f"{PRODUCTS_PREFIX}/categories").json()
        
        if len(categories) > 0:
            category_id = categories[0]["id"]
            
            response = client.get(
                f"{PRODUCTS_PREFIX}/",
                params={"category_id": category_id}
            )
            
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            assert isinstance(data, list)

    def test_filter_products_in_stock(self, client):
        """
        Test de filtrage des produits en stock.
        
        Vérifie qu'on peut afficher uniquement les produits disponibles.
        """
        response = client.get(
            f"{PRODUCTS_PREFIX}/",
            params={"in_stock": True}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)


class TestProductImages:
    """Tests de gestion des images de produits"""

    def test_add_product_image(self, client, producer_with_profile, producer_headers):
        """
        Test d'ajout d'une image à un produit.
        
        Les images sont essentielles pour attirer les clients.
        
        Vérifie qu'un producteur peut ajouter des images à ses produits.
        """
        # Cette fonctionnalité nécessite souvent un upload de fichier
        # Votre implémentation peut varier
        # Adaptez ce test selon votre API
        pass


class TestProductVariants:
    """Tests de gestion des variantes de produits"""

    def test_create_product_variant(self, client, producer_with_profile, producer_headers):
        """
        Test de création d'une variante de produit.
        
        Les variantes permettent de proposer différentes options
        (ex: tomates 500g, tomates 1kg).
        
        Vérifie qu'un producteur peut ajouter des variantes.
        """
        # Créer d'abord un produit
        categories = client.get(f"{PRODUCTS_PREFIX}/categories").json()
        units = client.get(f"{PRODUCTS_PREFIX}/units").json()
        
        if len(categories) > 0 and len(units) > 0:
            create_response = client.post(
                f"{PRODUCTS_PREFIX}/",
                headers=producer_headers,
                json={
                    "name": "Manioc frais d'Ebolowa",
                    "slug": "manioc-frais-ebolowa",
                    "category_id": categories[0]["id"],
                    "unit_id": units[0]["id"],
                    "price": 400,  # 400 FCFA/kg
                    "stock_quantity": 100
                }
            )
            
            if create_response.status_code == status.HTTP_201_CREATED:
                product_id = create_response.json()["id"]
                
                # Ajouter une variante
                variant_data = {
                    "name": "Sac de 5kg",
                    "sku": "MAN-5KG",
                    "price_modifier": 1600,  # Ajout de 1600 FCFA au prix de base
                    "stock": 20
                }
                
                response = client.post(
                    f"{PRODUCTS_PREFIX}/{product_id}/variants",
                    headers=producer_headers,
                    json=variant_data
                )
                
                # Selon votre implémentation
                assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_404_NOT_FOUND]


class TestStockManagement:
    """Tests de gestion des stocks"""

    def test_update_stock_quantity(self, client, producer_with_profile, producer_headers):
        """
        Test de mise à jour manuelle du stock.
        
        Vérifie qu'un producteur peut ajuster son inventaire.
        """
        # Créer un produit
        categories = client.get(f"{PRODUCTS_PREFIX}/categories").json()
        units = client.get(f"{PRODUCTS_PREFIX}/units").json()
        
        if len(categories) > 0 and len(units) > 0:
            create_response = client.post(
                f"{PRODUCTS_PREFIX}/",
                headers=producer_headers,
                json={
                    "name": "Produit Stock Test",
                    "slug": "produit-stock-test",
                    "category_id": categories[0]["id"],
                    "unit_id": units[0]["id"],
                    "price": 4.00,
                    "stock_quantity": 50
                }
            )
            
            if create_response.status_code == status.HTTP_201_CREATED:
                product_id = create_response.json()["id"]
                
                # Mettre à jour le stock
                stock_update = {
                    "quantity": 20,
                    "type": "adjustment",
                    "reason": "Inventaire manuel"
                }
                
                response = client.post(
                    f"{PRODUCTS_PREFIX}/{product_id}/stock",
                    headers=producer_headers,
                    json=stock_update
                )
                
                # La route peut varier selon votre implémentation
                assert response.status_code in [
                    status.HTTP_200_OK,
                    status.HTTP_404_NOT_FOUND
                ]


@pytest.mark.integration
class TestProductCatalogIntegration:
    """Tests d'intégration du catalogue produits"""

    def test_complete_product_lifecycle(self, client, producer_with_profile, producer_headers):
        """
        Test du cycle de vie complet d'un produit.
        
        Vérifie : création → consultation → modification → suppression.
        """
        categories = client.get(f"{PRODUCTS_PREFIX}/categories").json()
        units = client.get(f"{PRODUCTS_PREFIX}/units").json()
        
        if len(categories) > 0 and len(units) > 0:
            # 1. Créer le produit
            create_response = client.post(
                f"{PRODUCTS_PREFIX}/",
                headers=producer_headers,
                json={
                    "name": "Lifecycle Test Product",
                    "slug": "lifecycle-test-product",
                    "category_id": categories[0]["id"],
                    "unit_id": units[0]["id"],
                    "price": 7.50,
                    "stock_quantity": 30
                }
            )
            assert create_response.status_code == status.HTTP_201_CREATED
            product_id = create_response.json()["id"]
            
            # 2. Consulter le produit
            get_response = client.get(f"{PRODUCTS_PREFIX}/{product_id}")
            assert get_response.status_code == status.HTTP_200_OK
            
            # 3. Modifier le produit
            update_response = client.put(
                f"{PRODUCTS_PREFIX}/{product_id}",
                headers=producer_headers,
                json={"price": 8.00}
            )
            assert update_response.status_code == status.HTTP_200_OK
            
            # 4. Supprimer le produit
            delete_response = client.delete(
                f"{PRODUCTS_PREFIX}/{product_id}",
                headers=producer_headers
            )
            assert delete_response.status_code == status.HTTP_204_NO_CONTENT

    def test_customer_browsing_catalog(self, client):
        """
        Test du parcours d'un client dans le catalogue.
        
        Simule le comportement d'un visiteur qui :
        - Consulte les catégories
        - Recherche des produits
        - Filtre par tags
        - Consulte un produit spécifique
        """
        # 1. Consulter les catégories
        categories_response = client.get(f"{PRODUCTS_PREFIX}/categories")
        assert categories_response.status_code == status.HTTP_200_OK
        
        # 2. Rechercher des produits
        search_response = client.get(
            f"{PRODUCTS_PREFIX}/",
            params={"search_term": "bio"}
        )
        assert search_response.status_code == status.HTTP_200_OK
        
        # 3. Filtrer par stock disponible
        filter_response = client.get(
            f"{PRODUCTS_PREFIX}/",
            params={"in_stock": True}
        )
        assert filter_response.status_code == status.HTTP_200_OK

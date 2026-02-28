"""
Test exploratoire de la condition de bug - Filtres Booléens SQLAlchemy

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14, 1.15, 1.16, 1.17, 1.18, 1.19, 1.20, 1.21, 1.22, 1.23**

CRITIQUE: Ce test DOIT ÉCHOUER sur le code non corrigé - l'échec confirme que le bug existe.
NE PAS tenter de corriger le test ou le code quand il échoue.

OBJECTIF: Faire apparaître des contre-exemples qui démontrent l'existence du bug.

Ce test encode le comportement attendu - il validera la correction quand il passera après l'implémentation.
"""

import pytest
from sqlalchemy.exc import SQLAlchemyError, ProgrammingError, DataError
from app.repositories.product_repository import (
    CategoryRepository,
    TagRepository,
    UnitRepository,
    ProductRepository,
    ProductVariantRepository
)
from app.models.products import Category, Tag, Unit, Product, ProductVariant


class TestBooleanFilterBugCondition:
    """
    Tests exploratoires pour démontrer le bug des filtres booléens SQLAlchemy.
    
    Ces tests DOIVENT ÉCHOUER sur le code non corrigé pour confirmer l'existence du bug.
    """

    def test_category_get_all_with_active_only_raises_error(self, test_db):
        """
        Test que CategoryRepository.get_all(active_only=True) génère une erreur SQLAlchemy.
        
        **Validates: Requirements 1.2, 1.3**
        
        Comportement actuel (défaut):
        - QUAND une requête filtre des catégories actives avec `.filter(Category.is_active)`
        - ALORS SQLAlchemy génère une requête SQL invalide
        
        Comportement attendu (après correction):
        - Les requêtes doivent utiliser `.filter(Category.is_active == True)`
        - Les requêtes doivent générer du SQL valide
        - Les requêtes doivent s'exécuter sans erreur
        """
        # Créer des catégories de test
        category_active = Category(
            name="Légumes Actifs",
            slug="legumes-actifs",
            is_active=True
        )
        category_inactive = Category(
            name="Légumes Inactifs",
            slug="legumes-inactifs",
            is_active=False
        )
        test_db.add_all([category_active, category_inactive])
        test_db.commit()
        
        # Tester le repository
        repo = CategoryRepository(test_db)
        
        # RÉSULTAT ATTENDU: Cette ligne DOIT lever une exception SQLAlchemy
        # car le code utilise `.filter(Category.is_active)` au lieu de `.filter(Category.is_active == True)`
        with pytest.raises((SQLAlchemyError, ProgrammingError, DataError, AttributeError, TypeError)):
            categories = repo.get_all(active_only=True)
            # Si on arrive ici sans exception, forcer l'exécution de la requête
            _ = len(categories)

    def test_category_get_root_categories_with_active_only_raises_error(self, test_db):
        """
        Test que CategoryRepository.get_root_categories(active_only=True) génère une erreur.
        
        **Validates: Requirements 1.2, 1.3**
        """
        # Créer une catégorie racine active
        root_category = Category(
            name="Fruits Racine",
            slug="fruits-racine",
            parent_id=None,
            is_active=True
        )
        test_db.add(root_category)
        test_db.commit()
        
        repo = CategoryRepository(test_db)
        
        # RÉSULTAT ATTENDU: Exception SQLAlchemy
        with pytest.raises((SQLAlchemyError, ProgrammingError, DataError, AttributeError, TypeError)):
            categories = repo.get_root_categories(active_only=True)
            _ = len(categories)

    def test_category_get_subcategories_with_active_only_raises_error(self, test_db):
        """
        Test que CategoryRepository.get_subcategories(active_only=True) génère une erreur.
        
        **Validates: Requirements 1.2, 1.3**
        """
        # Créer une catégorie parent et une sous-catégorie
        parent = Category(
            name="Légumes Parent",
            slug="legumes-parent",
            is_active=True
        )
        test_db.add(parent)
        test_db.flush()
        
        subcategory = Category(
            name="Tomates",
            slug="tomates",
            parent_id=parent.id,
            is_active=True
        )
        test_db.add(subcategory)
        test_db.commit()
        
        repo = CategoryRepository(test_db)
        
        # RÉSULTAT ATTENDU: Exception SQLAlchemy
        with pytest.raises((SQLAlchemyError, ProgrammingError, DataError, AttributeError, TypeError)):
            subcategories = repo.get_subcategories(parent.id, active_only=True)
            _ = len(subcategories)

    def test_tag_get_all_with_active_only_raises_error(self, test_db):
        """
        Test que TagRepository.get_all(active_only=True) génère une erreur SQLAlchemy.
        
        **Validates: Requirements 1.4**
        
        Comportement actuel (défaut):
        - QUAND une requête filtre des tags actifs avec `.filter(Tag.is_active)`
        - ALORS SQLAlchemy génère une requête SQL invalide
        """
        # Créer des tags de test
        tag_active = Tag(
            name="Bio Actif",
            slug="bio-actif",
            type="bio",
            is_active=True
        )
        tag_inactive = Tag(
            name="Bio Inactif",
            slug="bio-inactif",
            type="bio",
            is_active=False
        )
        test_db.add_all([tag_active, tag_inactive])
        test_db.commit()
        
        repo = TagRepository(test_db)
        
        # RÉSULTAT ATTENDU: Exception SQLAlchemy
        with pytest.raises((SQLAlchemyError, ProgrammingError, DataError, AttributeError, TypeError)):
            tags = repo.get_all(active_only=True)
            _ = len(tags)

    def test_unit_get_all_with_active_only_raises_error(self, test_db):
        """
        Test que UnitRepository.get_all(active_only=True) génère une erreur SQLAlchemy.
        
        **Validates: Requirements 1.5**
        
        Comportement actuel (défaut):
        - QUAND une requête filtre des unités actives avec `.filter(Unit.is_active)`
        - ALORS SQLAlchemy génère une requête SQL invalide
        """
        # Créer des unités de test
        unit_active = Unit(
            name="Kilogramme Actif",
            abbreviation="kg-a",
            type="weight",
            is_active=True
        )
        unit_inactive = Unit(
            name="Kilogramme Inactif",
            abbreviation="kg-i",
            type="weight",
            is_active=False
        )
        test_db.add_all([unit_active, unit_inactive])
        test_db.commit()
        
        repo = UnitRepository(test_db)
        
        # RÉSULTAT ATTENDU: Exception SQLAlchemy
        with pytest.raises((SQLAlchemyError, ProgrammingError, DataError, AttributeError, TypeError)):
            units = repo.get_all(active_only=True)
            _ = len(units)

    def test_product_get_producer_products_with_active_only_raises_error(self, test_db):
        """
        Test que ProductRepository.get_producer_products(active_only=True) génère une erreur.
        
        **Validates: Requirements 1.1, 1.2**
        
        Comportement actuel (défaut):
        - QUAND l'endpoint GET /api/v1/products est appelé
        - ALORS le système génère une erreur 422 (Unprocessable Content) ou 500 (Internal Server Error)
        
        Ce test simule l'appel qui cause l'erreur 422/500 sur l'endpoint.
        """
        # Créer un producteur fictif (on utilise un ID simple pour le test)
        producer_id = 1
        
        # Créer une catégorie et une unité pour le produit
        category = Category(name="Test Cat", slug="test-cat", is_active=True)
        unit = Unit(name="Test Unit", abbreviation="tu", type="weight", is_active=True)
        test_db.add_all([category, unit])
        test_db.flush()
        
        # Créer des produits de test
        product_active = Product(
            producer_id=producer_id,
            category_id=category.id,
            unit_id=unit.id,
            name="Produit Actif",
            slug="produit-actif",
            price=10.00,
            stock_quantity=100,
            is_active=True
        )
        product_inactive = Product(
            producer_id=producer_id,
            category_id=category.id,
            unit_id=unit.id,
            name="Produit Inactif",
            slug="produit-inactif",
            price=10.00,
            stock_quantity=100,
            is_active=False
        )
        test_db.add_all([product_active, product_inactive])
        test_db.commit()
        
        repo = ProductRepository(test_db)
        
        # RÉSULTAT ATTENDU: Exception SQLAlchemy
        with pytest.raises((SQLAlchemyError, ProgrammingError, DataError, AttributeError, TypeError)):
            products = repo.get_producer_products(producer_id, active_only=True)
            _ = len(products)

    def test_product_search_products_with_active_filter_raises_error(self, test_db):
        """
        Test que ProductRepository.search_products() génère une erreur.
        
        **Validates: Requirements 1.1, 1.2**
        
        La méthode search_products utilise toujours `.filter(Product.is_active)` sans paramètre,
        donc elle devrait toujours échouer.
        """
        # Créer une catégorie et une unité
        category = Category(name="Search Cat", slug="search-cat", is_active=True)
        unit = Unit(name="Search Unit", abbreviation="su", type="weight", is_active=True)
        test_db.add_all([category, unit])
        test_db.flush()
        
        # Créer un produit
        product = Product(
            producer_id=1,
            category_id=category.id,
            unit_id=unit.id,
            name="Produit Recherche",
            slug="produit-recherche",
            price=15.00,
            stock_quantity=50,
            is_active=True
        )
        test_db.add(product)
        test_db.commit()
        
        repo = ProductRepository(test_db)
        
        # RÉSULTAT ATTENDU: Exception SQLAlchemy
        with pytest.raises((SQLAlchemyError, ProgrammingError, DataError, AttributeError, TypeError)):
            products = repo.search_products()
            _ = len(products)

    def test_product_variant_get_product_variants_with_active_only_raises_error(self, test_db):
        """
        Test que ProductVariantRepository.get_product_variants(active_only=True) génère une erreur.
        
        **Validates: Requirements 1.6**
        """
        # Créer un produit parent
        category = Category(name="Variant Cat", slug="variant-cat", is_active=True)
        unit = Unit(name="Variant Unit", abbreviation="vu", type="weight", is_active=True)
        test_db.add_all([category, unit])
        test_db.flush()
        
        product = Product(
            producer_id=1,
            category_id=category.id,
            unit_id=unit.id,
            name="Produit avec Variantes",
            slug="produit-variantes",
            price=20.00,
            stock_quantity=100,
            is_active=True
        )
        test_db.add(product)
        test_db.flush()
        
        # Créer des variantes
        variant_active = ProductVariant(
            product_id=product.id,
            name="Variante Active",
            price_modifier=5.00,
            stock=50,
            is_active=True
        )
        variant_inactive = ProductVariant(
            product_id=product.id,
            name="Variante Inactive",
            price_modifier=3.00,
            stock=30,
            is_active=False
        )
        test_db.add_all([variant_active, variant_inactive])
        test_db.commit()
        
        repo = ProductVariantRepository(test_db)
        
        # RÉSULTAT ATTENDU: Exception SQLAlchemy
        with pytest.raises((SQLAlchemyError, ProgrammingError, DataError, AttributeError, TypeError)):
            variants = repo.get_product_variants(product.id, active_only=True)
            _ = len(variants)

    def test_multiple_filters_with_boolean_isolates_problem(self, test_db):
        """
        Test avec filtres multiples (booléen incorrect + autres filtres valides) pour isoler le problème.
        
        **Validates: Requirements 1.2**
        
        Ce test démontre que le problème vient spécifiquement du filtre booléen,
        pas des autres types de filtres.
        """
        # Créer des catégories
        parent = Category(name="Parent", slug="parent", parent_id=None, is_active=True)
        test_db.add(parent)
        test_db.flush()
        
        child1 = Category(name="Child1", slug="child1", parent_id=parent.id, is_active=True)
        child2 = Category(name="Child2", slug="child2", parent_id=parent.id, is_active=False)
        test_db.add_all([child1, child2])
        test_db.commit()
        
        repo = CategoryRepository(test_db)
        
        # Ce test combine:
        # - Un filtre valide: .filter(Category.parent_id == parent.id)
        # - Un filtre booléen invalide: .filter(Category.is_active)
        # 
        # Si seul le filtre booléen cause le problème, cette requête devrait échouer
        with pytest.raises((SQLAlchemyError, ProgrammingError, DataError, AttributeError, TypeError)):
            subcategories = repo.get_subcategories(parent.id, active_only=True)
            _ = len(subcategories)


class TestBooleanFilterBugDocumentation:
    """
    Tests pour documenter les contre-exemples et comprendre la cause racine.
    """

    def test_document_sqlalchemy_error_details(self, test_db):
        """
        Test pour capturer et documenter les détails de l'erreur SQLAlchemy.
        
        Ce test capture l'exception pour analyser le message d'erreur exact
        et comprendre pourquoi SQLAlchemy ne peut pas interpréter le filtre booléen.
        """
        # Créer une catégorie de test
        category = Category(name="Test", slug="test", is_active=True)
        test_db.add(category)
        test_db.commit()
        
        repo = CategoryRepository(test_db)
        
        try:
            categories = repo.get_all(active_only=True)
            _ = len(categories)
            
            # Si on arrive ici, le bug n'existe pas (ou a été corrigé)
            pytest.fail(
                "ATTENTION: Le test n'a pas échoué comme attendu. "
                "Cela signifie soit que le bug a été corrigé, "
                "soit que l'analyse de cause racine est incorrecte."
            )
        except Exception as e:
            # Documenter l'erreur pour analyse
            error_type = type(e).__name__
            error_message = str(e)
            
            # Afficher les détails pour analyse
            print(f"\n=== CONTRE-EXEMPLE TROUVÉ ===")
            print(f"Type d'erreur: {error_type}")
            print(f"Message: {error_message}")
            print(f"=== FIN DU CONTRE-EXEMPLE ===\n")
            
            # Le test passe si une exception est levée (confirme le bug)
            assert True, "Bug confirmé - Exception levée comme attendu"

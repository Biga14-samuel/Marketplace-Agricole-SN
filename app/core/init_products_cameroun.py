"""
Script d'initialisation des produits camerounais pour le marché local.

Ce script crée des produits typiques du marché camerounais pour démonstration.
"""
from sqlalchemy.orm import Session
from app.models.products import Product, Unit
from app.repositories.product_repository import (
    CategoryRepository, 
    TagRepository, 
    UnitRepository,
    ProductRepository
)


def init_cameroon_products(db: Session, producer_id: int) -> None:
    """
    Initialise des produits typiques du marché camerounais.
    
    Args:
        db: Session de base de données
        producer_id: ID du producteur à qui attribuer les produits
    """
    
    category_repo = CategoryRepository(db)
    tag_repo = TagRepository(db)
    unit_repo = UnitRepository(db)
    product_repo = ProductRepository(db)
    
    # Récupérer les catégories
    legumes = category_repo.get_by_slug("legumes")
    fruits = category_repo.get_by_slug("fruits")
    tubercules = category_repo.get_by_slug("tubercules")
    cereales = category_repo.get_by_slug("cereales")
    transformes = category_repo.get_by_slug("produits-transformes")
    
    # Récupérer les unités
    kg_unit = db.query(Unit).filter(Unit.abbreviation == "kg").first()
    piece_unit = db.query(Unit).filter(Unit.abbreviation == "pc").first()
    tas_unit = db.query(Unit).filter(Unit.abbreviation == "tas").first()
    regime_unit = db.query(Unit).filter(Unit.abbreviation == "rég").first()
    sac_unit = db.query(Unit).filter(Unit.abbreviation == "sac").first()
    
    # Récupérer les tags
    bio_tag = tag_repo.get_by_slug("bio")
    local_tag = tag_repo.get_by_slug("local")
    saison_tag = tag_repo.get_by_slug("de-saison")
    
    # Produits camerounais typiques
    products_data = [
        # LÉGUMES
        {
            "name": "Tomates fraîches",
            "slug": "tomates-fraiches",
            "description": "Tomates rouges bien mûres, cultivées localement",
            "category_id": legumes.id if legumes else None,
            "unit_id": kg_unit.id if kg_unit else None,
            "price": 800,  # 800 FCFA/kg
            "stock_quantity": 150,
            "min_order": 1,
            "origin": "Bafoussam",
            "is_active": True,
            "is_featured": True,
            "tag_ids": [local_tag.id, saison_tag.id] if local_tag and saison_tag else []
        },
        {
            "name": "Oignons rouges",
            "slug": "oignons-rouges",
            "description": "Oignons rouges de qualité supérieure",
            "category_id": legumes.id if legumes else None,
            "unit_id": kg_unit.id if kg_unit else None,
            "price": 600,  # 600 FCFA/kg
            "stock_quantity": 200,
            "min_order": 1,
            "origin": "Garoua",
            "is_active": True,
            "tag_ids": [local_tag.id] if local_tag else []
        },
        {
            "name": "Piments frais",
            "slug": "piments-frais",
            "description": "Piments rouges et verts, très piquants",
            "category_id": legumes.id if legumes else None,
            "unit_id": tas_unit.id if tas_unit else piece_unit.id,
            "price": 200,  # 200 FCFA/tas
            "stock_quantity": 80,
            "min_order": 1,
            "origin": "Yaoundé",
            "is_active": True,
            "tag_ids": [local_tag.id] if local_tag else []
        },
        {
            "name": "Gombo frais",
            "slug": "gombo-frais",
            "description": "Gombo tendre pour vos sauces",
            "category_id": legumes.id if legumes else None,
            "unit_id": tas_unit.id if tas_unit else piece_unit.id,
            "price": 250,  # 250 FCFA/tas
            "stock_quantity": 60,
            "min_order": 1,
            "origin": "Douala",
            "is_active": True,
            "tag_ids": [local_tag.id, saison_tag.id] if local_tag and saison_tag else []
        },
        {
            "name": "Aubergines africaines",
            "slug": "aubergines-africaines",
            "description": "Aubergines amères traditionnelles (ndolé)",
            "category_id": legumes.id if legumes else None,
            "unit_id": kg_unit.id if kg_unit else None,
            "price": 1000,  # 1000 FCFA/kg
            "stock_quantity": 40,
            "min_order": 1,
            "origin": "Bafoussam",
            "is_active": True,
            "tag_ids": [local_tag.id, bio_tag.id] if local_tag and bio_tag else []
        },
        
        # FRUITS
        {
            "name": "Bananes plantain",
            "slug": "bananes-plantain",
            "description": "Bananes plantain mûres, idéales pour friture",
            "category_id": fruits.id if fruits else None,
            "unit_id": regime_unit.id if regime_unit else piece_unit.id,
            "price": 1500,  # 1500 FCFA/régime
            "stock_quantity": 100,
            "min_order": 1,
            "origin": "Kribi",
            "is_active": True,
            "is_featured": True,
            "tag_ids": [local_tag.id, saison_tag.id] if local_tag and saison_tag else []
        },
        {
            "name": "Mangues",
            "slug": "mangues",
            "description": "Mangues juteuses et sucrées de saison",
            "category_id": fruits.id if fruits else None,
            "unit_id": piece_unit.id if piece_unit else None,
            "price": 100,  # 100 FCFA/pièce
            "stock_quantity": 300,
            "min_order": 3,
            "origin": "Maroua",
            "is_active": True,
            "is_featured": True,
            "tag_ids": [local_tag.id, saison_tag.id] if local_tag and saison_tag else []
        },
        {
            "name": "Papayes",
            "slug": "papayes",
            "description": "Papayes mûres à point",
            "category_id": fruits.id if fruits else None,
            "unit_id": piece_unit.id if piece_unit else None,
            "price": 500,  # 500 FCFA/pièce
            "stock_quantity": 80,
            "min_order": 1,
            "origin": "Douala",
            "is_active": True,
            "tag_ids": [local_tag.id] if local_tag else []
        },
        {
            "name": "Avocats",
            "slug": "avocats",
            "description": "Avocats bien gras, excellents pour les salades",
            "category_id": fruits.id if fruits else None,
            "unit_id": piece_unit.id if piece_unit else None,
            "price": 200,  # 200 FCFA/pièce
            "stock_quantity": 120,
            "min_order": 2,
            "origin": "Dschang",
            "is_active": True,
            "tag_ids": [local_tag.id, bio_tag.id] if local_tag and bio_tag else []
        },
        {
            "name": "Ananas",
            "slug": "ananas",
            "description": "Ananas sucrés et parfumés",
            "category_id": fruits.id if fruits else None,
            "unit_id": piece_unit.id if piece_unit else None,
            "price": 800,  # 800 FCFA/pièce
            "stock_quantity": 50,
            "min_order": 1,
            "origin": "Edéa",
            "is_active": True,
            "tag_ids": [local_tag.id] if local_tag else []
        },
        
        # TUBERCULES
        {
            "name": "Manioc frais",
            "slug": "manioc-frais",
            "description": "Manioc frais épluché, prêt à cuisiner",
            "category_id": tubercules.id if tubercules else None,
            "unit_id": kg_unit.id if kg_unit else None,
            "price": 400,  # 400 FCFA/kg
            "stock_quantity": 200,
            "min_order": 2,
            "origin": "Ebolowa",
            "is_active": True,
            "is_featured": True,
            "tag_ids": [local_tag.id] if local_tag else []
        },
        {
            "name": "Ignames",
            "slug": "ignames",
            "description": "Ignames de qualité supérieure",
            "category_id": tubercules.id if tubercules else None,
            "unit_id": kg_unit.id if kg_unit else None,
            "price": 600,  # 600 FCFA/kg
            "stock_quantity": 150,
            "min_order": 2,
            "origin": "Bamenda",
            "is_active": True,
            "tag_ids": [local_tag.id] if local_tag else []
        },
        {
            "name": "Macabo",
            "slug": "macabo",
            "description": "Macabo frais pour vos plats traditionnels",
            "category_id": tubercules.id if tubercules else None,
            "unit_id": kg_unit.id if kg_unit else None,
            "price": 500,  # 500 FCFA/kg
            "stock_quantity": 100,
            "min_order": 2,
            "origin": "Bafoussam",
            "is_active": True,
            "tag_ids": [local_tag.id, saison_tag.id] if local_tag and saison_tag else []
        },
        {
            "name": "Patates douces",
            "slug": "patates-douces",
            "description": "Patates douces oranges, riches en vitamines",
            "category_id": tubercules.id if tubercules else None,
            "unit_id": kg_unit.id if kg_unit else None,
            "price": 450,  # 450 FCFA/kg
            "stock_quantity": 120,
            "min_order": 1,
            "origin": "Foumbot",
            "is_active": True,
            "tag_ids": [local_tag.id, bio_tag.id] if local_tag and bio_tag else []
        },
        
        # CÉRÉALES
        {
            "name": "Maïs en grains",
            "slug": "mais-grains",
            "description": "Maïs sec en grains pour couscous",
            "category_id": cereales.id if cereales else None,
            "unit_id": kg_unit.id if kg_unit else None,
            "price": 350,  # 350 FCFA/kg
            "stock_quantity": 300,
            "min_order": 2,
            "origin": "Garoua",
            "is_active": True,
            "tag_ids": [local_tag.id] if local_tag else []
        },
        {
            "name": "Riz local",
            "slug": "riz-local",
            "description": "Riz blanc produit localement",
            "category_id": cereales.id if cereales else None,
            "unit_id": sac_unit.id if sac_unit else kg_unit.id,
            "price": 15000,  # 15000 FCFA/sac de 25kg
            "stock_quantity": 40,
            "min_order": 1,
            "origin": "Ndop",
            "is_active": True,
            "tag_ids": [local_tag.id] if local_tag else []
        },
        
        # PRODUITS TRANSFORMÉS
        {
            "name": "Huile de palme rouge",
            "slug": "huile-palme-rouge",
            "description": "Huile de palme artisanale 100% naturelle",
            "category_id": transformes.id if transformes else None,
            "unit_id": piece_unit.id if piece_unit else None,
            "price": 1500,  # 1500 FCFA/litre
            "stock_quantity": 80,
            "min_order": 1,
            "origin": "Kribi",
            "is_active": True,
            "is_featured": True,
            "tag_ids": [local_tag.id, bio_tag.id] if local_tag and bio_tag else []
        },
        {
            "name": "Arachides grillées",
            "slug": "arachides-grillees",
            "description": "Arachides grillées et salées",
            "category_id": transformes.id if transformes else None,
            "unit_id": tas_unit.id if tas_unit else kg_unit.id,
            "price": 300,  # 300 FCFA/tas
            "stock_quantity": 150,
            "min_order": 1,
            "origin": "Garoua",
            "is_active": True,
            "tag_ids": [local_tag.id] if local_tag else []
        },
        {
            "name": "Haricots rouges",
            "slug": "haricots-rouges",
            "description": "Haricots rouges secs de qualité",
            "category_id": transformes.id if transformes else None,
            "unit_id": kg_unit.id if kg_unit else None,
            "price": 700,  # 700 FCFA/kg
            "stock_quantity": 100,
            "min_order": 1,
            "origin": "Bamenda",
            "is_active": True,
            "tag_ids": [local_tag.id] if local_tag else []
        },
    ]
    
    # Créer les produits
    created_count = 0
    for product_data in products_data:
        # Vérifier si le produit existe déjà
        existing = db.query(Product).filter(Product.slug == product_data["slug"]).first()
        if not existing:
            # Extraire les tag_ids avant de créer le produit
            tag_ids = product_data.pop("tag_ids", [])
            
            # Ajouter le producer_id
            product_data["producer_id"] = producer_id
            
            # Créer le produit
            try:
                product = product_repo.create(**product_data)
                
                # Ajouter les tags
                if tag_ids:
                    for tag_id in tag_ids:
                        tag = tag_repo.get_by_id(tag_id)
                        if tag:
                            product.tags.append(tag)
                    db.commit()
                
                created_count += 1
                print(f"✅ Produit '{product_data['name']}' créé")
            except Exception as e:
                print(f"❌ Erreur lors de la création de '{product_data['name']}': {e}")
                db.rollback()
        else:
            print(f"ℹ️  Produit '{product_data['name']}' existe déjà")
    
    print(f"\n✅ {created_count} produits camerounais créés avec succès!")


if __name__ == "__main__":
    from app.core.database import SessionLocal
    from app.models.profiles import ProducerProfile
    
    db = SessionLocal()
    try:
        print("🔄 Initialisation des produits camerounais...")
        
        # Trouver un producteur existant ou en créer un
        producer = db.query(ProducerProfile).first()
        if not producer:
            print("❌ Aucun producteur trouvé. Veuillez d'abord créer un producteur.")
        else:
            init_cameroon_products(db, producer.id)
            print("✅ Initialisation terminée")
    finally:
        db.close()

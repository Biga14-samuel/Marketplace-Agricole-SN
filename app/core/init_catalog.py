from sqlalchemy.orm import Session
from app.models.products import Unit
from app.repositories.product_repository import CategoryRepository, TagRepository, UnitRepository


def init_catalog(db: Session) -> None:
    """Initialise les données de base du catalogue"""
    
    category_repo = CategoryRepository(db)
    tag_repo = TagRepository(db)
    unit_repo = UnitRepository(db)
    
    # Créer les catégories de base - Marché Camerounais
    categories = [
        {"name": "Légumes", "slug": "legumes", "description": "Légumes frais du marché local", "icon": "🥬", "position": 1},
        {"name": "Fruits", "slug": "fruits", "description": "Fruits tropicaux frais", "icon": "🍌", "position": 2},
        {"name": "Tubercules", "slug": "tubercules", "description": "Manioc, ignames, macabo et patates", "icon": "🥔", "position": 3},
        {"name": "Céréales", "slug": "cereales", "description": "Maïs, mil, sorgho et riz local", "icon": "🌾", "position": 4},
        {"name": "Produits transformés", "slug": "produits-transformes", "description": "Huiles, arachides et produits locaux", "icon": "🥜", "position": 5},
    ]
    
    for cat_data in categories:
        existing = category_repo.get_by_slug(cat_data["slug"])
        if not existing:
            category_repo.create(**cat_data)
            print(f"[ok] Category '{cat_data['name']}' created")
        else:
            print(f"[info] Category '{cat_data['name']}' already exists")
    
    # Créer les tags de base
    tags = [
        {"name": "Bio", "slug": "bio", "type": "bio", "color": "#10b981", "description": "Produit biologique certifié"},
        {"name": "Local", "slug": "local", "type": "local", "color": "#3b82f6", "description": "Produit local de la région"},
        {"name": "De saison", "slug": "de-saison", "type": "season", "color": "#f59e0b", "description": "Produit de saison"},
        {"name": "Promotion", "slug": "promotion", "type": "promo", "color": "#ef4444", "description": "En promotion"},
    ]
    
    for tag_data in tags:
        existing = tag_repo.get_by_slug(tag_data["slug"])
        if not existing:
            tag_repo.create(**tag_data)
            print(f"[ok] Tag '{tag_data['name']}' created")
        else:
            print(f"[info] Tag '{tag_data['name']}' already exists")
    
    # Créer les unités de base - Marché Camerounais
    units = [
        {"name": "Kilogramme", "abbreviation": "kg", "type": "weight"},
        {"name": "Gramme", "abbreviation": "g", "type": "weight"},
        {"name": "Litre", "abbreviation": "L", "type": "volume"},
        {"name": "Pièce", "abbreviation": "pc", "type": "piece"},
        {"name": "Tas", "abbreviation": "tas", "type": "piece"},  # Unité locale courante
        {"name": "Régime", "abbreviation": "rég", "type": "piece"},  # Pour bananes plantain
        {"name": "Sac", "abbreviation": "sac", "type": "piece"},  # Pour céréales/tubercules
    ]
    
    for unit_data in units:
        existing = unit_repo.get_by_id(1)  # Vérification simple
        if db.query(Unit).filter(Unit.abbreviation == unit_data["abbreviation"]).first() is None:
            unit_repo.create(**unit_data)
            print(f"[ok] Unit '{unit_data['name']}' created")
        else:
            print(f"[info] Unit '{unit_data['name']}' already exists")


if __name__ == "__main__":
    from app.core.database import SessionLocal
    
    db = SessionLocal()
    try:
        print("[init] Initializing catalog...")
        init_catalog(db)
        print("[ok] Initialization completed")
    finally:
        db.close()

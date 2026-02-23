from sqlalchemy.orm import Session
from app.repositories.auth_repository import RoleRepository


def init_roles(db: Session) -> None:
    """Initialise les rôles par défaut du système"""
    role_repo = RoleRepository(db)
    
    default_roles = [
        {
            "name": "Admin",
            "description": "Administrateur système avec tous les droits"
        },
        {
            "name": "Producer",
            "description": "Producteur agricole pouvant vendre des produits"
        },
        {
            "name": "Customer",
            "description": "Client pouvant acheter des produits"
        },
        {
            "name": "Moderator",
            "description": "Modérateur pouvant gérer les contenus et les avis"
        }
    ]
    
    for role_data in default_roles:
        # Vérifier si le rôle existe déjà
        existing_role = role_repo.get_by_name(role_data["name"])
        if not existing_role:
            role_repo.create(
                name=role_data["name"],
                description=role_data["description"]
            )
            print(f"✅ Rôle '{role_data['name']}' créé")
        else:
            print(f"ℹ️  Rôle '{role_data['name']}' existe déjà")


if __name__ == "__main__":
    from app.core.database import SessionLocal
    
    db = SessionLocal()
    try:
        print("🔄 Initialisation des rôles...")
        init_roles(db)
        print("✅ Initialisation terminée")
    finally:
        db.close()
#!/usr/bin/env python3
"""
Script automatique pour supprimer TOUS les utilisateurs de la base de données
Version sans confirmation pour les tests
"""

import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Ajouter le répertoire racine au path pour importer les modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.models.auth import User

def delete_all_users_auto():
    """Supprime automatiquement tous les utilisateurs de la base de données"""
    
    try:
        # Créer la connexion à la base de données
        engine = create_engine(settings.DATABASE_URL)
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()
        
        print("🔄 Connexion à la base de données...")
        
        # Compter les utilisateurs avant suppression
        user_count = db.query(User).count()
        print(f"📊 {user_count} utilisateur(s) trouvé(s)")
        
        if user_count == 0:
            print("✅ Aucun utilisateur à supprimer")
            return True
        
        print("🗑️  Suppression automatique en cours...")
        
        # Supprimer dans l'ordre pour respecter les contraintes de clés étrangères
        tables_to_clear = [
            'order_items',
            'orders', 
            'reviews',
            'notifications',
            'events',
            'admin_actions',
            'payment_methods',
            'payments',
            'product_images',
            'product_variants',
            'products',
            'pickup_points',
            'producer_schedules',
            'addresses',
            'customer_profiles',
            'producer_profiles',
            'user_roles',
            'users'
        ]
        
        total_deleted = 0
        for table in tables_to_clear:
            try:
                result = db.execute(text(f"DELETE FROM {table}"))
                deleted_count = result.rowcount
                total_deleted += deleted_count
                if deleted_count > 0:
                    print(f"  ✅ {table}: {deleted_count} enregistrement(s) supprimé(s)")
            except Exception as e:
                print(f"  ⚠️  {table}: {str(e)}")
        
        # Commit toutes les suppressions
        db.commit()
        
        # Vérifier que tous les utilisateurs ont été supprimés
        remaining_users = db.query(User).count()
        
        print(f"📊 Total supprimé: {total_deleted} enregistrement(s)")
        
        if remaining_users == 0:
            print(f"✅ Tous les utilisateurs ont été supprimés avec succès !")
        else:
            print(f"⚠️  {remaining_users} utilisateur(s) restant(s)")
        
        # Remettre à zéro les séquences
        print("🔄 Remise à zéro des séquences...")
        sequences = [
            'users_id_seq',
            'customer_profiles_id_seq', 
            'producer_profiles_id_seq',
            'addresses_id_seq',
            'products_id_seq',
            'orders_id_seq',
            'payments_id_seq',
            'reviews_id_seq',
            'notifications_id_seq',
            'events_id_seq'
        ]
        
        for seq in sequences:
            try:
                db.execute(text(f"ALTER SEQUENCE {seq} RESTART WITH 1"))
            except Exception:
                pass  # Ignorer si la séquence n'existe pas
        
        db.commit()
        print("✅ Séquences remises à zéro")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la suppression: {str(e)}")
        if 'db' in locals():
            db.rollback()
        return False
        
    finally:
        if 'db' in locals():
            db.close()

if __name__ == "__main__":
    print("🧹 Suppression automatique de tous les utilisateurs")
    print("=" * 50)
    
    success = delete_all_users_auto()
    
    if success:
        print()
        print("🎉 Base de données nettoyée avec succès !")
        print("💡 Vous pouvez maintenant créer de nouveaux comptes")
    else:
        print()
        print("❌ Échec de l'opération")
        sys.exit(1)
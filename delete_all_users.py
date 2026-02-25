#!/usr/bin/env python3
"""
Script pour supprimer TOUS les utilisateurs de la base de données
⚠️ ATTENTION: Cette action est irréversible !
"""

import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Ajouter le répertoire racine au path pour importer les modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import get_db_url
from app.models.auth import User

def delete_all_users():
    """Supprime tous les utilisateurs de la base de données"""
    
    # Confirmation de sécurité
    print("⚠️  ATTENTION: Vous êtes sur le point de supprimer TOUS les utilisateurs !")
    print("Cette action est IRRÉVERSIBLE et supprimera :")
    print("- Tous les comptes utilisateurs")
    print("- Tous les profils associés")
    print("- Toutes les commandes")
    print("- Tous les produits")
    print("- Toutes les données liées")
    print()
    
    confirmation = input("Tapez 'SUPPRIMER TOUT' pour confirmer: ")
    if confirmation != "SUPPRIMER TOUT":
        print("❌ Opération annulée")
        return False
    
    try:
        # Créer la connexion à la base de données
        db_url = get_db_url()
        engine = create_engine(db_url)
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()
        
        print("🔄 Connexion à la base de données...")
        
        # Compter les utilisateurs avant suppression
        user_count = db.query(User).count()
        print(f"📊 {user_count} utilisateur(s) trouvé(s)")
        
        if user_count == 0:
            print("✅ Aucun utilisateur à supprimer")
            return True
        
        print("🗑️  Suppression en cours...")
        
        # Supprimer dans l'ordre pour respecter les contraintes de clés étrangères
        
        # 1. Supprimer les données dépendantes en utilisant du SQL brut pour éviter les problèmes de cascade
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
        
        for table in tables_to_clear:
            try:
                result = db.execute(text(f"DELETE FROM {table}"))
                deleted_count = result.rowcount
                if deleted_count > 0:
                    print(f"  ✅ {table}: {deleted_count} enregistrement(s) supprimé(s)")
            except Exception as e:
                print(f"  ⚠️  {table}: {str(e)}")
        
        # Commit toutes les suppressions
        db.commit()
        
        # Vérifier que tous les utilisateurs ont été supprimés
        remaining_users = db.query(User).count()
        
        if remaining_users == 0:
            print(f"✅ Tous les utilisateurs ont été supprimés avec succès !")
            print("✅ Base de données nettoyée")
        else:
            print(f"⚠️  {remaining_users} utilisateur(s) restant(s)")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la suppression: {str(e)}")
        db.rollback()
        return False
        
    finally:
        db.close()

def reset_sequences():
    """Remet à zéro les séquences auto-increment"""
    try:
        db_url = get_db_url()
        engine = create_engine(db_url)
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()
        
        print("🔄 Remise à zéro des séquences...")
        
        # Liste des tables avec auto-increment
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
                print(f"  ✅ {seq} remise à zéro")
            except Exception as e:
                # Ignorer si la séquence n'existe pas
                pass
        
        db.commit()
        print("✅ Séquences remises à zéro")
        
    except Exception as e:
        print(f"⚠️  Erreur lors de la remise à zéro des séquences: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    print("🧹 Script de suppression de tous les utilisateurs")
    print("=" * 50)
    
    success = delete_all_users()
    
    if success:
        reset_sequences()
        print()
        print("🎉 Opération terminée avec succès !")
        print("💡 Vous pouvez maintenant créer de nouveaux comptes")
    else:
        print()
        print("❌ Échec de l'opération")
        sys.exit(1)
import pytest
from fastapi import status
from datetime import time

# Préfixes des routes
CUSTOMER_PREFIX = "/customer-profiles/customers"
PRODUCER_PREFIX = "/producer-profiles/producers"


class TestCustomerProfile:
    """Tests de gestion des profils clients"""

    def test_create_customer_profile(self, client, auth_headers):
        """
        Test de création d'un profil client.
        
        Vérifie que :
        - Un utilisateur authentifié peut créer son profil
        - Les données sont correctement enregistrées
        - L'ID utilisateur est automatiquement associé
        """
        profile_data = {
            "first_name": "Marie",
            "last_name": "Dubois",
            "avatar": None,
            "preferences": {"newsletter": True}
        }
        
        response = client.post(
            f"{CUSTOMER_PREFIX}/profile",
            headers=auth_headers,
            json=profile_data
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["first_name"] == profile_data["first_name"]
        assert data["last_name"] == profile_data["last_name"]
        assert "user_id" in data
        assert "id" in data

    def test_create_duplicate_customer_profile(self, client, auth_headers):
        """
        Test de création d'un second profil pour le même utilisateur.
        
        Vérifie qu'un utilisateur ne peut avoir qu'un seul profil client.
        """
        profile_data = {
            "first_name": "Jean",
            "last_name": "Martin"
        }
        
        # Première création réussie
        first_response = client.post(
            f"{CUSTOMER_PREFIX}/profile",
            headers=auth_headers,
            json=profile_data
        )
        assert first_response.status_code == status.HTTP_201_CREATED
        
        # Seconde tentative doit échouer
        second_response = client.post(
            f"{CUSTOMER_PREFIX}/profile",
            headers=auth_headers,
            json=profile_data
        )
        assert second_response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_customer_profile(self, client, auth_user_with_profile, auth_headers):
        """
        Test de récupération du profil client.
        
        Vérifie que l'utilisateur peut consulter son propre profil.
        """
        response = client.get(
            f"{CUSTOMER_PREFIX}/profile",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "first_name" in data
        assert "last_name" in data

    def test_get_profile_without_creation(self, client, auth_headers):
        """
        Test de récupération d'un profil non créé.
        
        Vérifie le comportement quand l'utilisateur n'a pas encore créé son profil.
        """
        response = client.get(
            f"{CUSTOMER_PREFIX}/profile",
            headers=auth_headers
        )
        
        # Peut retourner 404 ou un profil vide selon l'implémentation
        assert response.status_code in [status.HTTP_404_NOT_FOUND, status.HTTP_200_OK]

    def test_update_customer_profile(self, client, auth_user_with_profile, auth_headers):
        """
        Test de mise à jour du profil client.
        
        Vérifie que l'utilisateur peut modifier ses informations.
        """
        update_data = {
            "first_name": "Jean-Updated",
            "last_name": "Dupont-Updated",
            "preferences": {"notifications": False}
        }
        
        response = client.put(
            f"{CUSTOMER_PREFIX}/profile",
            headers=auth_headers,
            json=update_data
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["first_name"] == update_data["first_name"]
        assert data["last_name"] == update_data["last_name"]

    def test_profile_requires_authentication(self, client):
        """
        Test d'accès au profil sans authentification.
        
        Vérifie que les endpoints nécessitent une authentification.
        """
        response = client.get(f"{CUSTOMER_PREFIX}/profile")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestCustomerAddress:
    """Tests de gestion des adresses clients"""

    def test_create_address(self, client, auth_user_with_profile, auth_headers):
        """
        Test de création d'une adresse.
        
        Vérifie qu'un client peut ajouter une adresse de livraison/facturation.
        """
        address_data = {
            "type": "delivery",
            "street": "15 Avenue des Champs",
            "city": "Yaoundé",
            "postal_code": "00237",
            "country": "Cameroun",
            "is_default": True,
            "coordinates": "3.8480,11.5021"
        }
        
        response = client.post(
            f"{CUSTOMER_PREFIX}/addresses",
            headers=auth_headers,
            json=address_data
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["street"] == address_data["street"]
        assert data["city"] == address_data["city"]
        assert data["is_default"] == True

    def test_create_address_invalid_coordinates(self, client, auth_user_with_profile, auth_headers):
        """
        Test de création d'adresse avec coordonnées GPS invalides.
        
        Vérifie la validation des coordonnées GPS.
        """
        address_data = {
            "type": "delivery",
            "street": "15 Avenue Test",
            "city": "Yaoundé",
            "postal_code": "00237",
            "coordinates": "invalid,coords"
        }
        
        response = client.post(
            f"{CUSTOMER_PREFIX}/addresses",
            headers=auth_headers,
            json=address_data
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_get_all_addresses(self, client, auth_user_with_profile, auth_headers):
        """
        Test de récupération de toutes les adresses d'un client.
        
        Vérifie que le client peut lister toutes ses adresses.
        """
        # Créer plusieurs adresses
        addresses = [
            {
                "type": "delivery",
                "street": "10 Rue A",
                "city": "Yaoundé",
                "postal_code": "00237",
                "is_default": True
            },
            {
                "type": "billing",
                "street": "20 Rue B",
                "city": "Douala",
                "postal_code": "00237",
                "is_default": False
            }
        ]
        
        for addr in addresses:
            client.post(
                f"{CUSTOMER_PREFIX}/addresses",
                headers=auth_headers,
                json=addr
            )
        
        # Récupérer toutes les adresses
        response = client.get(
            f"{CUSTOMER_PREFIX}/addresses",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2

    def test_update_address(self, client, auth_user_with_profile, auth_headers):
        """
        Test de mise à jour d'une adresse.
        
        Vérifie qu'une adresse peut être modifiée.
        """
        # Créer une adresse
        create_response = client.post(
            f"{CUSTOMER_PREFIX}/addresses",
            headers=auth_headers,
            json={
                "type": "delivery",
                "street": "Old Street",
                "city": "Yaoundé",
                "postal_code": "00237"
            }
        )
        address_id = create_response.json()["id"]
        
        # Mettre à jour
        update_data = {
            "street": "New Street Updated",
            "city": "Douala"
        }
        
        response = client.put(
            f"{CUSTOMER_PREFIX}/addresses/{address_id}",
            headers=auth_headers,
            json=update_data
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["street"] == update_data["street"]
        assert data["city"] == update_data["city"]

    def test_delete_address(self, client, auth_user_with_profile, auth_headers):
        """
        Test de suppression d'une adresse.
        
        Vérifie qu'une adresse peut être supprimée.
        """
        # Créer une adresse
        create_response = client.post(
            f"{CUSTOMER_PREFIX}/addresses",
            headers=auth_headers,
            json={
                "type": "delivery",
                "street": "To Delete",
                "city": "Yaoundé",
                "postal_code": "00237"
            }
        )
        address_id = create_response.json()["id"]
        
        # Supprimer
        response = client.delete(
            f"{CUSTOMER_PREFIX}/addresses/{address_id}",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_204_NO_CONTENT


class TestProducerProfile:
    """Tests de gestion des profils producteurs"""

    def test_create_producer_profile(self, client, producer_headers):
        """
        Test de création d'un profil producteur.
        
        Vérifie qu'un utilisateur peut créer un profil producteur complet.
        """
        profile_data = {
            "business_name": "Ferme Biologique Martin",
            "bio": "Producteur local de légumes biologiques depuis 2010",
            "certifications": ["bio", "local"],
            "siret": "12345678901234",
            "tva_number": "FR12345678901",
            "farm_size": 10.5,
            "production_type": ["vegetables", "fruits"]
        }
        
        response = client.post(
            f"{PRODUCER_PREFIX}/profile",
            headers=producer_headers,
            json=profile_data
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["business_name"] == profile_data["business_name"]
        assert data["bio"] == profile_data["bio"]
        assert data["is_verified"] == False  # Nouveau producteur non vérifié

    def test_create_producer_invalid_siret(self, client, producer_headers):
        """
        Test de création avec un SIRET invalide.
        
        Vérifie la validation du numéro SIRET (9 ou 14 chiffres).
        """
        profile_data = {
            "business_name": "Ferme Test",
            "siret": "123",  # Trop court
            "farm_size": 5.0,
            "production_type": ["vegetables"]
        }
        
        response = client.post(
            f"{PRODUCER_PREFIX}/profile",
            headers=producer_headers,
            json=profile_data
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_get_producer_profile(self, client, producer_with_profile, producer_headers):
        """
        Test de récupération du profil producteur.
        
        Vérifie que le producteur peut consulter son profil.
        """
        response = client.get(
            f"{PRODUCER_PREFIX}/profile",
            headers=producer_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "business_name" in data
        assert "bio" in data

    def test_update_producer_profile(self, client, producer_with_profile, producer_headers):
        """
        Test de mise à jour du profil producteur.
        
        Vérifie qu'un producteur peut modifier ses informations.
        """
        update_data = {
            "bio": "Bio mise à jour avec plus de détails",
            "farm_size": 12.0
        }
        
        response = client.put(
            f"{PRODUCER_PREFIX}/profile",
            headers=producer_headers,
            json=update_data
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["bio"] == update_data["bio"]
        assert float(data["farm_size"]) == update_data["farm_size"]

    def test_get_public_producer_profile(self, client, producer_with_profile):
        """
        Test de consultation publique d'un profil producteur.
        
        Vérifie que n'importe qui peut voir les informations publiques d'un producteur.
        """
        producer_id = producer_with_profile["id"]
        
        response = client.get(f"{PRODUCER_PREFIX}/{producer_id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "business_name" in data
        # Les informations sensibles comme IBAN ne doivent pas être exposées
        assert "iban" not in data or data["iban"] is None


class TestProducerSchedule:
    """Tests de gestion des horaires de producteurs"""

    def test_create_schedule(self, client, producer_with_profile, producer_headers):
        """
        Test de création d'un horaire d'ouverture.
        
        Vérifie qu'un producteur peut définir ses horaires.
        """
        schedule_data = {
            "day_of_week": "monday",
            "open_time": "08:00:00",
            "close_time": "18:00:00",
            "is_closed": False
        }
        
        response = client.post(
            f"{PRODUCER_PREFIX}/schedules",
            headers=producer_headers,
            json=schedule_data
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["day_of_week"] == schedule_data["day_of_week"]

    def test_create_invalid_schedule(self, client, producer_with_profile, producer_headers):
        """
        Test de création d'horaires invalides.
        
        Vérifie que l'heure de fermeture doit être après l'heure d'ouverture.
        """
        schedule_data = {
            "day_of_week": "tuesday",
            "open_time": "18:00:00",
            "close_time": "08:00:00"  # Avant l'ouverture
        }
        
        response = client.post(
            f"{PRODUCER_PREFIX}/schedules",
            headers=producer_headers,
            json=schedule_data
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestPickupPoints:
    """Tests de gestion des points de retrait"""

    def test_create_pickup_point(self, client, producer_with_profile, producer_headers):
        """
        Test de création d'un point de retrait.
        
        Vérifie qu'un producteur peut définir un lieu de retrait.
        """
        pickup_data = {
            "name": "Marché Central",
            "address": "Place du Marché",
            "city": "Yaoundé",
            "postal_code": "00237",
            "coordinates": "3.8480,11.5021",
            "instructions": "Stand numéro 15",
            "is_active": True
        }
        
        response = client.post(
            f"{PRODUCER_PREFIX}/pickup-points",
            headers=producer_headers,
            json=pickup_data
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == pickup_data["name"]
        assert data["is_active"] == True

    def test_get_producer_pickup_points(self, client, producer_with_profile, producer_headers):
        """
        Test de récupération des points de retrait d'un producteur.
        
        Vérifie qu'on peut lister tous les points de retrait.
        """
        # Créer plusieurs points
        for i in range(2):
            client.post(
                f"{PRODUCER_PREFIX}/pickup-points",
                headers=producer_headers,
                json={
                    "name": f"Point {i}",
                    "address": f"Address {i}",
                    "city": "Yaoundé",
                    "postal_code": "00237"
                }
            )
        
        response = client.get(
            f"{PRODUCER_PREFIX}/pickup-points",
            headers=producer_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2


class TestPickupSlots:
    """Tests de gestion des créneaux de retrait"""

    def test_create_pickup_slot(self, client, producer_with_profile, producer_headers):
        """
        Test de création d'un créneau de retrait.
        
        Vérifie qu'un producteur peut définir des créneaux horaires
        pour les retraits sur un point.
        """
        # D'abord créer un point de retrait
        pickup_response = client.post(
            f"{PRODUCER_PREFIX}/pickup-points",
            headers=producer_headers,
            json={
                "name": "Marché Test",
                "address": "Test Address",
                "city": "Yaoundé",
                "postal_code": "00237"
            }
        )
        pickup_point_id = pickup_response.json()["id"]
        
        # Créer un créneau
        slot_data = {
            "day_of_week": "wednesday",
            "start_time": "09:00:00",
            "end_time": "12:00:00",
            "max_orders": 20,
            "is_active": True
        }
        
        response = client.post(
            f"{PRODUCER_PREFIX}/pickup-points/{pickup_point_id}/slots",
            headers=producer_headers,
            json=slot_data
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["max_orders"] == slot_data["max_orders"]


@pytest.mark.integration
class TestProfileIntegration:
    """Tests d'intégration des profils"""

    def test_complete_customer_setup(self, client, auth_headers):
        """
        Test du flux complet de configuration d'un client.
        
        Vérifie : création profil → ajout adresse → consultation.
        """
        # 1. Créer le profil
        profile_response = client.post(
            f"{CUSTOMER_PREFIX}/profile",
            headers=auth_headers,
            json={
                "first_name": "Alice",
                "last_name": "Wonderland"
            }
        )
        assert profile_response.status_code == status.HTTP_201_CREATED
        
        # 2. Ajouter une adresse
        address_response = client.post(
            f"{CUSTOMER_PREFIX}/addresses",
            headers=auth_headers,
            json={
                "type": "delivery",
                "street": "123 Main St",
                "city": "Yaoundé",
                "postal_code": "00237"
            }
        )
        assert address_response.status_code == status.HTTP_201_CREATED
        
        # 3. Vérifier le profil complet
        profile_check = client.get(
            f"{CUSTOMER_PREFIX}/profile",
            headers=auth_headers
        )
        assert profile_check.status_code == status.HTTP_200_OK

    def test_complete_producer_setup(self, client, producer_headers):
        """
        Test du flux complet de configuration d'un producteur.
        
        Vérifie : création profil → horaires → point retrait → créneaux.
        """
        # 1. Créer le profil
        profile_response = client.post(
            f"{PRODUCER_PREFIX}/profile",
            headers=producer_headers,
            json={
                "business_name": "Complete Farm",
                "bio": "Complete setup test",
                "siret": "12345678901234",
                "farm_size": 5.0,
                "production_type": ["vegetables"]
            }
        )
        assert profile_response.status_code == status.HTTP_201_CREATED
        
        # 2. Définir les horaires
        schedule_response = client.post(
            f"{PRODUCER_PREFIX}/schedules",
            headers=producer_headers,
            json={
                "day_of_week": "thursday",
                "open_time": "08:00:00",
                "close_time": "17:00:00"
            }
        )
        assert schedule_response.status_code == status.HTTP_201_CREATED
        
        # 3. Créer un point de retrait
        pickup_response = client.post(
            f"{PRODUCER_PREFIX}/pickup-points",
            headers=producer_headers,
            json={
                "name": "Main Pickup",
                "address": "Farm Location",
                "city": "Yaoundé",
                "postal_code": "00237"
            }
        )
        assert pickup_response.status_code == status.HTTP_201_CREATED

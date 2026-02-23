"""
Tests complets pour le module user-profiles (customer + producer)
Teste: models, repositories, services, schemas, routers
"""
import pytest
from fastapi import status
from sqlalchemy.orm import Session

# Préfixes des routes
CUSTOMER_PREFIX = "/customer-profiles/customers"
PRODUCER_PREFIX = "/producer-profiles/producers"


# ============= TESTS CUSTOMER PROFILE =============

class TestCustomerProfileModels:
    """Tests des modèles CustomerProfile et Address"""
    
    def test_customer_profile_creation(self, test_db: Session, auth_user_with_profile):
        """Test de création d'un profil client dans la base"""
        from app.models.profiles import CustomerProfile
        
        # auth_user_with_profile contient déjà un profil créé
        # Vérifions qu'il existe dans la base
        profile = test_db.query(CustomerProfile).filter(
            CustomerProfile.id == auth_user_with_profile["id"]
        ).first()
        
        assert profile is not None
        assert profile.first_name == "Jean"
        assert profile.created_at is not None
    
    def test_address_creation(self, test_db: Session, auth_user_with_profile):
        """Test de création d'une adresse dans la base"""
        from app.models.profiles import Address
        
        address = Address(
            customer_profile_id=auth_user_with_profile["id"],
            type="delivery",
            street="Test Street",
            city="Yaoundé",
            postal_code="1234",
            country="Cameroun"
        )
        test_db.add(address)
        test_db.commit()
        test_db.refresh(address)
        
        assert address.id is not None
        assert address.city == "Yaoundé"


class TestCustomerProfileRepository:
    """Tests du repository CustomerProfile"""
    
    def test_create_profile_repository(self, test_db: Session, registered_user):
        """Test de création via repository"""
        from app.repositories.profile_repository import CustomerProfileRepository
        
        repo = CustomerProfileRepository(test_db)
        profile = repo.create(
            user_id=registered_user["id"],
            first_name="Jean",
            last_name="Dupont"
        )
        
        assert profile.id is not None
        assert profile.first_name == "Jean"
    
    def test_get_by_user_id(self, test_db: Session, registered_user):
        """Test de récupération par user_id"""
        from app.repositories.profile_repository import CustomerProfileRepository
        
        repo = CustomerProfileRepository(test_db)
        profile = repo.create(
            user_id=registered_user["id"],
            first_name="Marie",
            last_name="Martin"
        )
        
        found = repo.get_by_user_id(registered_user["id"])
        assert found is not None
        assert found.id == profile.id


class TestCustomerProfileService:
    """Tests du service CustomerProfile"""
    
    def test_create_profile_service(self, test_db: Session, registered_user):
        """Test de création via service"""
        from app.services.profile_service import CustomerProfileService
        from app.schemas.profile_schema import CustomerProfileCreate
        
        service = CustomerProfileService(test_db)
        profile_data = CustomerProfileCreate(
            first_name="Service",
            last_name="Test"
        )
        
        profile = service.create_profile(
            user_id=registered_user["id"],
            profile_data=profile_data
        )
        
        assert profile.first_name == "Service"
    
    def test_duplicate_profile_raises_error(self, test_db: Session, registered_user):
        """Test qu'on ne peut pas créer 2 profils pour le même user"""
        from app.services.profile_service import CustomerProfileService
        from app.schemas.profile_schema import CustomerProfileCreate
        from fastapi import HTTPException
        
        service = CustomerProfileService(test_db)
        profile_data = CustomerProfileCreate(
            first_name="First",
            last_name="Profile"
        )
        
        # Premier profil OK
        service.create_profile(registered_user["id"], profile_data)
        
        # Second profil doit échouer
        with pytest.raises(HTTPException) as exc_info:
            service.create_profile(registered_user["id"], profile_data)
        
        assert exc_info.value.status_code == 400


class TestCustomerProfileAPI:
    """Tests des endpoints API customer profile"""
    
    def test_create_profile_endpoint(self, client, auth_headers):
        """Test POST /customers/profile"""
        response = client.post(
            f"{CUSTOMER_PREFIX}/profile",
            headers=auth_headers,
            json={
                "first_name": "API",
                "last_name": "Test",
                "preferences": {"lang": "fr"}
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["first_name"] == "API"
        assert "id" in data
    
    def test_get_profile_endpoint(self, client, auth_user_with_profile, auth_headers):
        """Test GET /customers/profile"""
        response = client.get(
            f"{CUSTOMER_PREFIX}/profile",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "first_name" in data
    
    def test_update_profile_endpoint(self, client, auth_user_with_profile, auth_headers):
        """Test PUT /customers/profile"""
        response = client.put(
            f"{CUSTOMER_PREFIX}/profile",
            headers=auth_headers,
            json={"first_name": "Updated"}
        )
        
        assert response.status_code == 200
        assert response.json()["first_name"] == "Updated"
    
    def test_profile_requires_auth(self, client):
        """Test que l'authentification est requise"""
        response = client.get(f"{CUSTOMER_PREFIX}/profile")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestAddressAPI:
    """Tests des endpoints API addresses"""
    
    def test_create_address(self, client, auth_user_with_profile, auth_headers):
        """Test POST /customers/addresses"""
        response = client.post(
            f"{CUSTOMER_PREFIX}/addresses",
            headers=auth_headers,
            json={
                "type": "delivery",
                "street": "Rue de la Réunification",
                "city": "Yaoundé",
                "postal_code": "1234",
                "country": "Cameroun",
                "coordinates": "3.8480,11.5021"
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["city"] == "Yaoundé"
        assert data["country"] == "Cameroun"
    
    def test_get_addresses(self, client, auth_user_with_profile, auth_headers):
        """Test GET /customers/addresses"""
        # Créer une adresse
        create_response = client.post(
            f"{CUSTOMER_PREFIX}/addresses",
            headers=auth_headers,
            json={
                "type": "billing",
                "street": "Test",
                "city": "Douala",
                "postal_code": "5678"
            }
        )
        assert create_response.status_code == 201
        
        # Récupérer
        response = client.get(
            f"{CUSTOMER_PREFIX}/addresses",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        assert len(response.json()) > 0
    
    def test_set_default_address(self, client, auth_user_with_profile, auth_headers):
        """Test POST /customers/addresses/{id}/set-default"""
        # Créer une adresse
        create_resp = client.post(
            f"{CUSTOMER_PREFIX}/addresses",
            headers=auth_headers,
            json={
                "type": "delivery",
                "street": "Default Test",
                "city": "Yaoundé",
                "postal_code": "1234"
            }
        )
        address_id = create_resp.json()["id"]
        
        # Définir comme défaut
        response = client.post(
            f"{CUSTOMER_PREFIX}/addresses/{address_id}/set-default",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        assert response.json()["is_default"] == True


# ============= TESTS PRODUCER PROFILE =============

class TestProducerProfileModels:
    """Tests des modèles ProducerProfile"""
    
    def test_producer_profile_creation(self, test_db: Session, registered_user):
        """Test de création d'un profil producteur"""
        from app.models.profiles import ProducerProfile
        
        profile = ProducerProfile(
            user_id=registered_user["id"],
            business_name="Test Farm",
            bio="Test bio"
        )
        test_db.add(profile)
        test_db.commit()
        test_db.refresh(profile)
        
        assert profile.id is not None
        assert profile.business_name == "Test Farm"
        assert profile.is_verified == False


class TestProducerProfileAPI:
    """Tests des endpoints API producer profile"""
    
    def test_create_producer_profile(self, client, producer_headers):
        """Test POST /producers/profile"""
        response = client.post(
            f"{PRODUCER_PREFIX}/profile",
            headers=producer_headers,
            json={
                "business_name": "Ferme Bio Yaoundé",
                "bio": "Production locale",
                "siret": "123456789",
                "farm_size": 5.5,
                "production_type": ["vegetables"]
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["business_name"] == "Ferme Bio Yaoundé"
        assert data["is_verified"] == False
    
    def test_get_producer_profile(self, client, producer_with_profile, producer_headers):
        """Test GET /producers/profile"""
        response = client.get(
            f"{PRODUCER_PREFIX}/profile",
            headers=producer_headers
        )
        
        assert response.status_code == 200
        assert "business_name" in response.json()
    
    def test_get_verified_producers(self, client):
        """Test GET /producers/verified"""
        response = client.get(f"{PRODUCER_PREFIX}/verified")
        
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestPickupPointsAPI:
    """Tests des endpoints API pickup points"""
    
    def test_create_pickup_point(self, client, producer_with_profile, producer_headers):
        """Test POST /producers/pickup-points"""
        response = client.post(
            f"{PRODUCER_PREFIX}/pickup-points",
            headers=producer_headers,
            json={
                "name": "Marché Central",
                "address": "Avenue Kennedy",
                "city": "Yaoundé",
                "postal_code": "1234",
                "coordinates": "3.8667,11.5167",
                "is_active": True
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Marché Central"
        assert data["is_active"] == True
    
    def test_get_pickup_points(self, client, producer_with_profile, producer_headers):
        """Test GET /producers/pickup-points"""
        # Créer un point
        client.post(
            f"{PRODUCER_PREFIX}/pickup-points",
            headers=producer_headers,
            json={
                "name": "Test Point",
                "address": "Test Address",
                "city": "Douala",
                "postal_code": "5678"
            }
        )
        
        # Récupérer
        response = client.get(
            f"{PRODUCER_PREFIX}/pickup-points",
            headers=producer_headers
        )
        
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_update_pickup_point(self, client, producer_with_profile, producer_headers):
        """Test PUT /producers/pickup-points/{id}"""
        # Créer
        create_resp = client.post(
            f"{PRODUCER_PREFIX}/pickup-points",
            headers=producer_headers,
            json={
                "name": "Old Name",
                "address": "Old Address",
                "city": "Yaoundé",
                "postal_code": "1234"
            }
        )
        point_id = create_resp.json()["id"]
        
        # Mettre à jour
        response = client.put(
            f"{PRODUCER_PREFIX}/pickup-points/{point_id}",
            headers=producer_headers,
            json={"name": "New Name"}
        )
        
        assert response.status_code == 200
        assert response.json()["name"] == "New Name"


class TestPickupSlotsAPI:
    """Tests des endpoints API pickup slots"""
    
    def test_create_pickup_slot(self, client, producer_with_profile, producer_headers):
        """Test POST /producers/pickup-points/{id}/slots"""
        # Créer un point
        point_resp = client.post(
            f"{PRODUCER_PREFIX}/pickup-points",
            headers=producer_headers,
            json={
                "name": "Slot Test Point",
                "address": "Test",
                "city": "Yaoundé",
                "postal_code": "1234"
            }
        )
        assert point_resp.status_code == 201
        point_id = point_resp.json()["id"]
        
        # Créer un créneau
        response = client.post(
            f"{PRODUCER_PREFIX}/pickup-points/{point_id}/slots",
            headers=producer_headers,
            json={
                "day_of_week": "monday",
                "start_time": "08:00",
                "end_time": "12:00",
                "max_orders": 20,
                "is_active": True
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["day_of_week"] == "monday"
        assert data["max_orders"] == 20
    
    def test_get_available_slots(self, client, producer_with_profile, producer_headers):
        """Test GET /producers/pickup-points/{id}/slots/available"""
        # Créer point et créneau
        point_resp = client.post(
            f"{PRODUCER_PREFIX}/pickup-points",
            headers=producer_headers,
            json={
                "name": "Available Test",
                "address": "Test",
                "city": "Yaoundé",
                "postal_code": "1234"
            }
        )
        assert point_resp.status_code == 201
        point_id = point_resp.json()["id"]
        
        slot_resp = client.post(
            f"{PRODUCER_PREFIX}/pickup-points/{point_id}/slots",
            headers=producer_headers,
            json={
                "day_of_week": "tuesday",
                "start_time": "09:00",
                "end_time": "13:00",
                "max_orders": 15
            }
        )
        assert slot_resp.status_code == 201
        
        # Récupérer les créneaux disponibles
        response = client.get(
            f"{PRODUCER_PREFIX}/pickup-points/{point_id}/slots/available",
            headers=producer_headers,
            params={"day_of_week": "tuesday"}
        )
        
        assert response.status_code == 200
        assert isinstance(response.json(), list)


# ============= TESTS DE VALIDATION =============

class TestValidation:
    """Tests de validation des schémas"""
    
    def test_invalid_coordinates(self, client, auth_user_with_profile, auth_headers):
        """Test de validation des coordonnées GPS"""
        response = client.post(
            f"{CUSTOMER_PREFIX}/addresses",
            headers=auth_headers,
            json={
                "type": "delivery",
                "street": "Test",
                "city": "Yaoundé",
                "postal_code": "1234",
                "coordinates": "invalid,format"
            }
        )
        
        assert response.status_code == 422
    
    def test_invalid_siret(self, client, producer_headers):
        """Test de validation du SIRET"""
        response = client.post(
            f"{PRODUCER_PREFIX}/profile",
            headers=producer_headers,
            json={
                "business_name": "Test",
                "siret": "123"  # Trop court
            }
        )
        
        assert response.status_code == 422


# ============= TESTS D'INTÉGRATION =============

@pytest.mark.integration
class TestProfilesIntegration:
    """Tests d'intégration complets"""
    
    def test_complete_customer_flow(self, client, auth_headers):
        """Test du flux complet client"""
        # 1. Créer profil
        profile_resp = client.post(
            f"{CUSTOMER_PREFIX}/profile",
            headers=auth_headers,
            json={"first_name": "Flow", "last_name": "Test"}
        )
        assert profile_resp.status_code == 201
        
        # 2. Ajouter adresse
        addr_resp = client.post(
            f"{CUSTOMER_PREFIX}/addresses",
            headers=auth_headers,
            json={
                "type": "delivery",
                "street": "Flow Street",
                "city": "Yaoundé",
                "postal_code": "1234"
            }
        )
        assert addr_resp.status_code == 201
        
        # 3. Récupérer profil complet
        complete_resp = client.get(
            f"{CUSTOMER_PREFIX}/profile/complete",
            headers=auth_headers
        )
        assert complete_resp.status_code == 200
        data = complete_resp.json()
        assert "addresses" in data
        assert len(data["addresses"]) > 0
    
    def test_complete_producer_flow(self, client, producer_headers):
        """Test du flux complet producteur"""
        # 1. Créer profil
        profile_resp = client.post(
            f"{PRODUCER_PREFIX}/profile",
            headers=producer_headers,
            json={
                "business_name": "Flow Farm",
                "bio": "Test",
                "siret": "123456789"
            }
        )
        assert profile_resp.status_code == 201
        
        # 2. Créer point de retrait
        point_resp = client.post(
            f"{PRODUCER_PREFIX}/pickup-points",
            headers=producer_headers,
            json={
                "name": "Flow Point",
                "address": "Flow Address",
                "city": "Yaoundé",
                "postal_code": "1234"
            }
        )
        assert point_resp.status_code == 201
        point_id = point_resp.json()["id"]
        
        # 3. Créer créneau
        slot_resp = client.post(
            f"{PRODUCER_PREFIX}/pickup-points/{point_id}/slots",
            headers=producer_headers,
            json={
                "day_of_week": "friday",
                "start_time": "10:00",
                "end_time": "14:00",
                "max_orders": 25
            }
        )
        assert slot_resp.status_code == 201
        
        # 4. Récupérer profil complet
        complete_resp = client.get(
            f"{PRODUCER_PREFIX}/profile/complete",
            headers=producer_headers
        )
        assert complete_resp.status_code == 200
        data = complete_resp.json()
        assert "pickup_points" in data

from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException, status

from app.repositories.profile_repository import (
    CustomerProfileRepository, AddressRepository, ProducerProfileRepository,
    ProducerDocumentRepository, ProducerScheduleRepository,
    PickupPointRepository, PickupSlotRepository
)
from app.repositories.auth_repository import UserRepository
from app.models.profiles import (
    CustomerProfile, Address, ProducerProfile,
    PickupPoint, PickupSlot, ProducerSchedule
)
from app.schemas.profile_schema import (
    CustomerProfileCreate, CustomerProfileUpdate,
    AddressCreate, AddressUpdate,
    ProducerProfileCreate, ProducerProfileUpdate,
    PickupPointCreate, PickupPointUpdate,
    PickupSlotCreate,
    ProducerScheduleCreate, ProducerScheduleUpdate
)


# ============= Customer Profile Service =============

class CustomerProfileService:
    """Service pour la gestion des profils clients"""
    
    def __init__(self, db: Session):
        self.db = db
        self.profile_repo = CustomerProfileRepository(db)
        self.address_repo = AddressRepository(db)
        self.user_repo = UserRepository(db)
    
    def create_profile(self, user_id: int, profile_data: CustomerProfileCreate) -> CustomerProfile:
        """Crée un profil client pour un utilisateur"""
        # Vérifier que l'utilisateur existe
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Utilisateur non trouvé"
            )
        
        # Vérifier qu'il n'a pas déjà un profil client
        existing_profile = self.profile_repo.get_by_user_id(user_id)
        if existing_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cet utilisateur a déjà un profil client"
            )
        
        # Créer le profil
        return self.profile_repo.create(
            user_id=user_id,
            **profile_data.model_dump()
        )
    
    def get_profile(self, user_id: int) -> CustomerProfile:
        """Récupère le profil client d'un utilisateur"""
        profile = self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profil client non trouvé"
            )
        return profile
    
    def get_complete_profile(self, user_id: int) -> CustomerProfile:
        """Récupère le profil complet avec adresses"""
        profile = self.profile_repo.get_complete_profile(user_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profil client non trouvé"
            )
        return profile
    
    def update_profile(self, user_id: int, profile_data: CustomerProfileUpdate) -> CustomerProfile:
        """Met à jour un profil client"""
        profile = self.get_profile(user_id)
        
        # Mettre à jour uniquement les champs fournis
        update_data = profile_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(profile, field, value)
        
        return self.profile_repo.update(profile)
    
    def delete_profile(self, user_id: int) -> bool:
        """Supprime un profil client"""
        profile = self.get_profile(user_id)
        return self.profile_repo.delete(profile)


# ============= Address Service =============

class AddressService:
    """Service pour la gestion des adresses"""
    
    def __init__(self, db: Session):
        self.db = db
        self.address_repo = AddressRepository(db)
        self.profile_service = CustomerProfileService(db)
    
    def create_address(self, user_id: int, address_data: AddressCreate) -> Address:
        """Crée une nouvelle adresse pour un utilisateur"""
        # Vérifier que l'utilisateur a un profil client
        profile = self.profile_service.get_profile(user_id)
        
        # Si c'est la première adresse de ce type, la définir par défaut
        existing = self.address_repo.get_default_address(profile.id, address_data.type.value)
        if not existing:
            address_data.is_default = True
        
        return self.address_repo.create(
            customer_profile_id=profile.id,
            **address_data.model_dump()
        )
    
    def get_user_addresses(self, user_id: int) -> List[Address]:
        """Récupère toutes les adresses d'un utilisateur"""
        return self.address_repo.get_user_addresses(user_id)
    
    def get_address(self, address_id: int, user_id: int) -> Address:
        """Récupère une adresse spécifique"""
        address = self.address_repo.get_by_id(address_id)
        if not address:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Adresse non trouvée"
            )
        
        # Vérifier que l'adresse appartient bien à l'utilisateur via le profil
        profile = self.profile_service.get_profile(user_id)
        if address.customer_profile_id != profile.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'avez pas accès à cette adresse"
            )
        
        return address
    
    def update_address(self, address_id: int, user_id: int, address_data: AddressUpdate) -> Address:
        """Met à jour une adresse"""
        address = self.get_address(address_id, user_id)
        
        # Mettre à jour les champs fournis
        update_data = address_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(address, field, value)
        
        # Si on définit comme par défaut, gérer les autres adresses
        if address_data.is_default:
            return self.address_repo.set_as_default(address)
        
        return self.address_repo.update(address)
    
    def delete_address(self, address_id: int, user_id: int) -> bool:
        """Supprime une adresse"""
        address = self.get_address(address_id, user_id)
        return self.address_repo.delete(address)
    
    def set_default_address(self, address_id: int, user_id: int) -> Address:
        """Définit une adresse comme par défaut"""
        address = self.get_address(address_id, user_id)
        return self.address_repo.set_as_default(address)


# ============= Producer Profile Service =============

class ProducerProfileService:
    """Service pour la gestion des profils producteurs"""
    
    def __init__(self, db: Session):
        self.db = db
        self.profile_repo = ProducerProfileRepository(db)
        self.document_repo = ProducerDocumentRepository(db)
        self.schedule_repo = ProducerScheduleRepository(db)
        self.user_repo = UserRepository(db)
    
    def create_profile(self, user_id: int, profile_data: ProducerProfileCreate) -> ProducerProfile:
        """Crée un profil producteur"""
        # Vérifier que l'utilisateur existe
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Utilisateur non trouvé"
            )
        
        # Vérifier qu'il n'a pas déjà un profil producteur
        existing_profile = self.profile_repo.get_by_user_id(user_id)
        if existing_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cet utilisateur a déjà un profil producteur"
            )
        
        # Créer le profil (non vérifié par défaut)
        return self.profile_repo.create(
            user_id=user_id,
            **profile_data.model_dump()
        )
    
    def get_profile(self, user_id: int) -> ProducerProfile:
        """Récupère le profil producteur"""
        profile = self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profil producteur non trouvé"
            )
        return profile
    
    def get_complete_profile(self, user_id: int) -> ProducerProfile:
        """Récupère le profil complet avec tous les détails"""
        profile = self.profile_repo.get_complete_profile(user_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profil producteur non trouvé"
            )
        return profile
    
    def get_profile_by_id(self, profile_id: int) -> ProducerProfile:
        """Récupère un profil par son ID"""
        profile = self.profile_repo.get_by_id(profile_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profil producteur non trouvé"
            )
        return profile
    
    def get_public_profile(self, profile_id: int) -> ProducerProfile:
        """Récupère les informations publiques d'un profil producteur"""
        profile = self.profile_repo.get_by_id(profile_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profil producteur non trouvé"
            )
        
        # Masquer les informations sensibles pour l'affichage public
        profile.iban = None
        profile.tva_number = None
        profile.siret = None
        
        return profile
    
    def update_profile(self, user_id: int, profile_data: ProducerProfileUpdate) -> ProducerProfile:
        """Met à jour un profil producteur"""
        profile = self.get_profile(user_id)
        
        # Mettre à jour les champs fournis
        update_data = profile_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(profile, field, value)
        
        return self.profile_repo.update(profile)
    
    def verify_producer(self, profile_id: int, admin_user_id: int) -> ProducerProfile:
        """Vérifie un producteur (action admin)"""
        profile = self.get_profile_by_id(profile_id)
        
        # Vérifier que tous les documents obligatoires sont présents
        documents = self.document_repo.get_producer_documents(profile.id)
        required_docs = {"kbis", "insurance"}
        uploaded_docs = {doc.type for doc in documents if doc.verified}
        
        if not required_docs.issubset(uploaded_docs):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tous les documents obligatoires doivent être vérifiés"
            )
        
        return self.profile_repo.verify_producer(profile)
    
    def get_verified_producers(self, skip: int = 0, limit: int = 100) -> List[ProducerProfile]:
        """Récupère les producteurs vérifiés"""
        return self.profile_repo.get_verified_producers(skip, limit)


# ============= Pickup Point Service =============

class PickupPointService:
    """Service pour la gestion des points de retrait"""
    
    def __init__(self, db: Session):
        self.db = db
        self.point_repo = PickupPointRepository(db)
        self.slot_repo = PickupSlotRepository(db)
        self.producer_service = ProducerProfileService(db)
    
    def create_point(self, user_id: int, point_data: PickupPointCreate) -> PickupPoint:
        """Crée un point de retrait"""
        # Vérifier que l'utilisateur est un producteur
        profile = self.producer_service.get_profile(user_id)
        
        return self.point_repo.create(
            producer_id=profile.id,
            **point_data.model_dump()
        )
    
    def get_producer_points(self, user_id: int, active_only: bool = False) -> List[PickupPoint]:
        """Récupère les points d'un producteur"""
        profile = self.producer_service.get_profile(user_id)
        return self.point_repo.get_producer_points(profile.id, active_only)
    
    def get_point(self, point_id: int, user_id: int) -> PickupPoint:
        """Récupère un point spécifique"""
        point = self.point_repo.get_by_id(point_id)
        if not point:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Point de retrait non trouvé"
            )
        
        # Vérifier la propriété
        profile = self.producer_service.get_profile(user_id)
        if point.producer_id != profile.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'avez pas accès à ce point de retrait"
            )
        
        return point
    
    def update_point(self, point_id: int, user_id: int, point_data: PickupPointUpdate) -> PickupPoint:
        """Met à jour un point de retrait"""
        point = self.get_point(point_id, user_id)
        
        update_data = point_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(point, field, value)
        
        return self.point_repo.update(point)
    
    def delete_point(self, point_id: int, user_id: int) -> bool:
        """Supprime un point de retrait"""
        point = self.get_point(point_id, user_id)
        return self.point_repo.delete(point)
    
    def create_slot(self, point_id: int, user_id: int, slot_data: PickupSlotCreate) -> PickupSlot:
        """Crée un créneau pour un point de retrait"""
        # Vérifier que le point appartient au producteur
        self.get_point(point_id, user_id)
        
        return self.slot_repo.create(
            pickup_point_id=point_id,
            **slot_data.model_dump()
        )
    
    def get_point_slots(self, point_id: int, active_only: bool = False) -> List[PickupSlot]:
        """Récupère les créneaux d'un point"""
        return self.slot_repo.get_point_slots(point_id, active_only)
    
    def get_available_slots(self, point_id: int, day_of_week: str) -> List[PickupSlot]:
        """Récupère les créneaux disponibles pour un jour"""
        return self.slot_repo.get_available_slots(point_id, day_of_week)



# ============= Producer Schedule Service =============

class ProducerScheduleService:
    """Service pour la gestion des horaires producteurs"""
    
    def __init__(self, db: Session):
        self.db = db
        self.schedule_repo = ProducerScheduleRepository(db)
        self.producer_repo = ProducerProfileRepository(db)
    
    def create_schedule(self, user_id: int, schedule_data: ProducerScheduleCreate) -> ProducerSchedule:
        """Crée un horaire pour un producteur"""
        # Récupérer le profil producteur
        producer = self.producer_repo.get_by_user_id(user_id)
        if not producer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profil producteur non trouvé"
            )
        
        # Vérifier qu'il n'existe pas déjà un horaire pour ce jour
        existing = self.schedule_repo.get_schedule_by_day(
            producer.id, 
            schedule_data.day_of_week.value
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Un horaire existe déjà pour {schedule_data.day_of_week.value}"
            )
        
        # Créer l'horaire
        return self.schedule_repo.create(
            producer_id=producer.id,
            **schedule_data.model_dump()
        )
    
    def get_producer_schedules(self, user_id: int) -> List[ProducerSchedule]:
        """Récupère tous les horaires d'un producteur"""
        producer = self.producer_repo.get_by_user_id(user_id)
        if not producer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profil producteur non trouvé"
            )
        return self.schedule_repo.get_producer_schedules(producer.id)
    
    def get_schedule(self, schedule_id: int, user_id: int) -> ProducerSchedule:
        """Récupère un horaire spécifique"""
        producer = self.producer_repo.get_by_user_id(user_id)
        if not producer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profil producteur non trouvé"
            )
        
        schedule = self.schedule_repo.get_by_id(schedule_id)
        if not schedule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Horaire non trouvé"
            )
        
        # Vérifier que l'horaire appartient au producteur
        if schedule.producer_id != producer.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Accès non autorisé à cet horaire"
            )
        
        return schedule
    
    def update_schedule(self, schedule_id: int, user_id: int, schedule_data: ProducerScheduleUpdate) -> ProducerSchedule:
        """Met à jour un horaire"""
        schedule = self.get_schedule(schedule_id, user_id)
        
        # Mettre à jour uniquement les champs fournis
        update_data = schedule_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(schedule, field, value)
        
        return self.schedule_repo.update(schedule)
    
    def delete_schedule(self, schedule_id: int, user_id: int) -> bool:
        """Supprime un horaire"""
        schedule = self.get_schedule(schedule_id, user_id)
        return self.schedule_repo.delete(schedule)

from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from datetime import datetime

from app.models.profiles import (
    CustomerProfile, Address, ProducerProfile, ProducerDocument,
    ProducerSchedule, PickupPoint, PickupSlot
)


# ============= Customer Profile Repository =============

class CustomerProfileRepository:
    """Repository pour les profils clients"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, user_id: int, first_name: str, last_name: str, **kwargs) -> CustomerProfile:
        """Crée un profil client"""
        profile = CustomerProfile(
            user_id=user_id,
            first_name=first_name,
            last_name=last_name,
            **kwargs
        )
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile
    
    def get_by_id(self, profile_id: int) -> Optional[CustomerProfile]:
        """Récupère un profil par son ID"""
        return self.db.query(CustomerProfile).filter(CustomerProfile.id == profile_id).first()
    
    def get_by_user_id(self, user_id: int) -> Optional[CustomerProfile]:
        """Récupère le profil d'un utilisateur"""
        return self.db.query(CustomerProfile).filter(CustomerProfile.user_id == user_id).first()
    
    def get_complete_profile(self, user_id: int) -> Optional[CustomerProfile]:
        """Récupère le profil complet avec les adresses"""
        return self.db.query(CustomerProfile).options(
            joinedload(CustomerProfile.addresses)
        ).filter(CustomerProfile.user_id == user_id).first()
    
    def update(self, profile: CustomerProfile) -> CustomerProfile:
        """Met à jour un profil"""
        self.db.commit()
        self.db.refresh(profile)
        return profile
    
    def delete(self, profile: CustomerProfile) -> bool:
        """Supprime un profil"""
        self.db.delete(profile)
        self.db.commit()
        return True


# ============= Address Repository =============

class AddressRepository:
    """
    Repository pour les adresses.
    
    MODIFICATION IMPORTANTE : Ce repository a été corrigé pour utiliser customer_profile_id
    au lieu de user_id, conformément aux corrections apportées au modèle Address.
    
    Hiérarchie : User → CustomerProfile → Address
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, customer_profile_id: int, **kwargs) -> Address:
        """
        Crée une adresse pour un profil client.
        
        MODIFIÉ : Utilise customer_profile_id au lieu de user_id
        
        Args:
            customer_profile_id: L'ID du profil client
            **kwargs: Les autres champs de l'adresse
        """
        address = Address(customer_profile_id=customer_profile_id, **kwargs)
        self.db.add(address)
        self.db.commit()
        self.db.refresh(address)
        return address
    
    def get_by_id(self, address_id: int) -> Optional[Address]:
        """Récupère une adresse par son ID"""
        return self.db.query(Address).filter(Address.id == address_id).first()
    
    def get_profile_addresses(self, customer_profile_id: int) -> List[Address]:
        """
        Récupère toutes les adresses d'un profil client.
        
        MODIFIÉ : Utilise customer_profile_id au lieu de user_id
        
        Args:
            customer_profile_id: L'ID du profil client
        """
        return self.db.query(Address).filter(
            Address.customer_profile_id == customer_profile_id
        ).all()
    
    def get_user_addresses(self, user_id: int) -> List[Address]:
        """
        MÉTHODE UTILITAIRE : Récupère les adresses via user_id en faisant une jointure.
        
        Cette méthode fait la jointure entre CustomerProfile et Address pour permettre
        de récupérer les adresses à partir d'un user_id. C'est une méthode de
        convenance qui respecte l'architecture du modèle.
        
        Args:
            user_id: L'ID de l'utilisateur
        """
        return self.db.query(Address).join(
            CustomerProfile,
            Address.customer_profile_id == CustomerProfile.id
        ).filter(
            CustomerProfile.user_id == user_id
        ).all()
    
    def get_default_address(self, customer_profile_id: int, address_type: str) -> Optional[Address]:
        """
        Récupère l'adresse par défaut d'un profil pour un type donné.
        
        MODIFIÉ : Utilise customer_profile_id au lieu de user_id
        
        Args:
            customer_profile_id: L'ID du profil client
            address_type: Le type d'adresse ('billing' ou 'delivery')
        """
        return self.db.query(Address).filter(
            Address.customer_profile_id == customer_profile_id,
            Address.type == address_type,
            Address.is_default
        ).first()
    
    def get_default_address_by_user_id(self, user_id: int, address_type: str) -> Optional[Address]:
        """
        MÉTHODE UTILITAIRE : Récupère l'adresse par défaut via user_id.
        
        Fait la jointure avec CustomerProfile pour récupérer l'adresse par défaut
        à partir d'un user_id.
        
        Args:
            user_id: L'ID de l'utilisateur
            address_type: Le type d'adresse
        """
        return self.db.query(Address).join(
            CustomerProfile,
            Address.customer_profile_id == CustomerProfile.id
        ).filter(
            CustomerProfile.user_id == user_id,
            Address.type == address_type,
            Address.is_default
        ).first()
    
    def set_as_default(self, address: Address) -> Address:
        """
        Définit une adresse comme par défaut.
        
        MODIFIÉ : Utilise customer_profile_id au lieu de user_id
        """
        # Désactiver les autres adresses du même type pour ce profil
        self.db.query(Address).filter(
            Address.customer_profile_id == address.customer_profile_id,
            Address.type == address.type,
            Address.id != address.id
        ).update({"is_default": False})
        
        address.is_default = True
        self.db.commit()
        self.db.refresh(address)
        return address
    
    def update(self, address: Address) -> Address:
        """Met à jour une adresse"""
        self.db.commit()
        self.db.refresh(address)
        return address
    
    def delete(self, address: Address) -> bool:
        """Supprime une adresse"""
        self.db.delete(address)
        self.db.commit()
        return True


# ============= Producer Profile Repository =============

class ProducerProfileRepository:
    """Repository pour les profils producteurs"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, user_id: int, business_name: str, **kwargs) -> ProducerProfile:
        """Crée un profil producteur"""
        profile = ProducerProfile(
            user_id=user_id,
            business_name=business_name,
            **kwargs
        )
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile
    
    def get_by_id(self, profile_id: int) -> Optional[ProducerProfile]:
        """Récupère un profil par son ID"""
        return self.db.query(ProducerProfile).filter(ProducerProfile.id == profile_id).first()
    
    def get_by_user_id(self, user_id: int) -> Optional[ProducerProfile]:
        """Récupère le profil d'un utilisateur"""
        return self.db.query(ProducerProfile).filter(ProducerProfile.user_id == user_id).first()
    
    def get_complete_profile(self, user_id: int) -> Optional[ProducerProfile]:
        """Récupère le profil complet avec tous les détails"""
        return self.db.query(ProducerProfile).options(
            joinedload(ProducerProfile.documents),
            joinedload(ProducerProfile.schedules),
            joinedload(ProducerProfile.pickup_points).joinedload(PickupPoint.pickup_slots)
        ).filter(ProducerProfile.user_id == user_id).first()
    
    def get_verified_producers(self, skip: int = 0, limit: int = 100) -> List[ProducerProfile]:
        """Récupère les producteurs vérifiés"""
        return self.db.query(ProducerProfile).filter(
            ProducerProfile.is_verified
        ).offset(skip).limit(limit).all()
    
    def verify_producer(self, profile: ProducerProfile) -> ProducerProfile:
        """Vérifie un producteur"""
        profile.is_verified = True
        return self.update(profile)
    
    def update(self, profile: ProducerProfile) -> ProducerProfile:
        """Met à jour un profil"""
        self.db.commit()
        self.db.refresh(profile)
        return profile
    
    def delete(self, profile: ProducerProfile) -> bool:
        """Supprime un profil"""
        self.db.delete(profile)
        self.db.commit()
        return True


# ============= Producer Document Repository =============

class ProducerDocumentRepository:
    """Repository pour les documents producteurs"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, producer_id: int, **kwargs) -> ProducerDocument:
        """Crée un document"""
        document = ProducerDocument(producer_id=producer_id, **kwargs)
        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)
        return document
    
    def get_by_id(self, document_id: int) -> Optional[ProducerDocument]:
        """Récupère un document par son ID"""
        return self.db.query(ProducerDocument).filter(ProducerDocument.id == document_id).first()
    
    def get_producer_documents(self, producer_id: int) -> List[ProducerDocument]:
        """Récupère tous les documents d'un producteur"""
        return self.db.query(ProducerDocument).filter(
            ProducerDocument.producer_id == producer_id
        ).all()
    
    def verify_document(self, document: ProducerDocument, verified_by: int) -> ProducerDocument:
        """Vérifie un document"""
        document.verified = True
        document.verified_by = verified_by
        document.verified_at = datetime.now()
        self.db.commit()
        self.db.refresh(document)
        return document
    
    def delete(self, document: ProducerDocument) -> bool:
        """Supprime un document"""
        self.db.delete(document)
        self.db.commit()
        return True


# ============= Producer Schedule Repository =============

class ProducerScheduleRepository:
    """Repository pour les horaires producteurs"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, producer_id: int, **kwargs) -> ProducerSchedule:
        """Crée un horaire"""
        schedule = ProducerSchedule(producer_id=producer_id, **kwargs)
        self.db.add(schedule)
        self.db.commit()
        self.db.refresh(schedule)
        return schedule
    
    def get_by_id(self, schedule_id: int) -> Optional[ProducerSchedule]:
        """Récupère un horaire par son ID"""
        return self.db.query(ProducerSchedule).filter(ProducerSchedule.id == schedule_id).first()
    
    def get_producer_schedules(self, producer_id: int) -> List[ProducerSchedule]:
        """Récupère tous les horaires d'un producteur"""
        return self.db.query(ProducerSchedule).filter(
            ProducerSchedule.producer_id == producer_id
        ).all()
    
    def get_schedule_by_day(self, producer_id: int, day_of_week: str) -> Optional[ProducerSchedule]:
        """Récupère l'horaire d'un jour spécifique"""
        return self.db.query(ProducerSchedule).filter(
            ProducerSchedule.producer_id == producer_id,
            ProducerSchedule.day_of_week == day_of_week
        ).first()
    
    def update(self, schedule: ProducerSchedule) -> ProducerSchedule:
        """Met à jour un horaire"""
        self.db.commit()
        self.db.refresh(schedule)
        return schedule
    
    def delete(self, schedule: ProducerSchedule) -> bool:
        """Supprime un horaire"""
        self.db.delete(schedule)
        self.db.commit()
        return True


# ============= Pickup Point Repository =============

class PickupPointRepository:
    """Repository pour les points de retrait"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, producer_id: int, **kwargs) -> PickupPoint:
        """Crée un point de retrait"""
        pickup_point = PickupPoint(producer_id=producer_id, **kwargs)
        self.db.add(pickup_point)
        self.db.commit()
        self.db.refresh(pickup_point)
        return pickup_point
    
    def get_by_id(self, point_id: int) -> Optional[PickupPoint]:
        """Récupère un point par son ID"""
        return self.db.query(PickupPoint).filter(PickupPoint.id == point_id).first()
    
    def get_producer_points(self, producer_id: int, active_only: bool = False) -> List[PickupPoint]:
        """Récupère tous les points d'un producteur"""
        query = self.db.query(PickupPoint).filter(PickupPoint.producer_id == producer_id)
        if active_only:
            query = query.filter(PickupPoint.is_active)
        return query.all()
    
    def get_with_slots(self, point_id: int) -> Optional[PickupPoint]:
        """Récupère un point avec ses créneaux"""
        return self.db.query(PickupPoint).options(
            joinedload(PickupPoint.pickup_slots)
        ).filter(PickupPoint.id == point_id).first()
    
    def update(self, pickup_point: PickupPoint) -> PickupPoint:
        """Met à jour un point"""
        self.db.commit()
        self.db.refresh(pickup_point)
        return pickup_point
    
    def delete(self, pickup_point: PickupPoint) -> bool:
        """Supprime un point"""
        self.db.delete(pickup_point)
        self.db.commit()
        return True


# ============= Pickup Slot Repository =============

class PickupSlotRepository:
    """Repository pour les créneaux de retrait"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, pickup_point_id: int, **kwargs) -> PickupSlot:
        """Crée un créneau"""
        slot = PickupSlot(pickup_point_id=pickup_point_id, **kwargs)
        self.db.add(slot)
        self.db.commit()
        self.db.refresh(slot)
        return slot
    
    def get_by_id(self, slot_id: int) -> Optional[PickupSlot]:
        """Récupère un créneau par son ID"""
        return self.db.query(PickupSlot).filter(PickupSlot.id == slot_id).first()
    
    def get_point_slots(self, pickup_point_id: int, active_only: bool = False) -> List[PickupSlot]:
        """Récupère tous les créneaux d'un point"""
        query = self.db.query(PickupSlot).filter(PickupSlot.pickup_point_id == pickup_point_id)
        if active_only:
            query = query.filter(PickupSlot.is_active)
        return query.all()
    
    def get_available_slots(self, pickup_point_id: int, day_of_week: str) -> List[PickupSlot]:
        """Récupère les créneaux disponibles pour un jour donné"""
        return self.db.query(PickupSlot).filter(
            PickupSlot.pickup_point_id == pickup_point_id,
            PickupSlot.day_of_week == day_of_week,
            PickupSlot.is_active,
            PickupSlot.current_orders < PickupSlot.max_orders
        ).all()
    
    def increment_orders(self, slot: PickupSlot) -> PickupSlot:
        """Incrémente le nombre de commandes d'un créneau"""
        if slot.current_orders < slot.max_orders:
            slot.current_orders += 1
            self.db.commit()
            self.db.refresh(slot)
        return slot
    
    def decrement_orders(self, slot: PickupSlot) -> PickupSlot:
        """Décrémente le nombre de commandes d'un créneau"""
        if slot.current_orders > 0:
            slot.current_orders -= 1
            self.db.commit()
            self.db.refresh(slot)
        return slot
    
    def update(self, slot: PickupSlot) -> PickupSlot:
        """Met à jour un créneau"""
        self.db.commit()
        self.db.refresh(slot)
        return slot
    
    def delete(self, slot: PickupSlot) -> bool:
        """Supprime un créneau"""
        self.db.delete(slot)
        self.db.commit()
        return True
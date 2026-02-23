from typing import List, Optional
from datetime import date
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_

from app.models.delivery import (
    DeliveryZone,
    DeliverySchedule,
    Delivery,
    DeliveryRoute,
    DeliveryRouteItem,
    DeliveryDriver
)


class DeliveryZoneRepository:
    """Repository pour les zones de livraison"""
    
    @staticmethod
    def create(db: Session, zone: DeliveryZone) -> DeliveryZone:
        """Crée une nouvelle zone de livraison"""
        db.add(zone)
        db.commit()
        db.refresh(zone)
        return zone
    
    @staticmethod
    def get_by_id(db: Session, zone_id: int) -> Optional[DeliveryZone]:
        """Récupère une zone par son ID"""
        return db.query(DeliveryZone).filter(DeliveryZone.id == zone_id).first()
    
    @staticmethod
    def get_by_producer(
        db: Session,
        producer_id: int,
        active_only: bool = False
    ) -> List[DeliveryZone]:
        """Récupère toutes les zones d'un producteur"""
        query = db.query(DeliveryZone).filter(DeliveryZone.producer_id == producer_id)
        
        if active_only:
            query = query.filter(DeliveryZone.is_active)
        
        return query.all()
    
    @staticmethod
    def get_with_schedules(db: Session, zone_id: int) -> Optional[DeliveryZone]:
        """Récupère une zone avec ses créneaux horaires"""
        return db.query(DeliveryZone).options(
            joinedload(DeliveryZone.schedules)
        ).filter(DeliveryZone.id == zone_id).first()
    
    @staticmethod
    def update(db: Session, zone: DeliveryZone) -> DeliveryZone:
        """Met à jour une zone de livraison"""
        db.commit()
        db.refresh(zone)
        return zone
    
    @staticmethod
    def delete(db: Session, zone: DeliveryZone) -> None:
        """Supprime une zone de livraison"""
        db.delete(zone)
        db.commit()
    
    @staticmethod
    def get_all_active(db: Session) -> List[DeliveryZone]:
        """Récupère toutes les zones actives"""
        return db.query(DeliveryZone).filter(DeliveryZone.is_active).all()


class DeliveryScheduleRepository:
    """Repository pour les créneaux de livraison"""
    
    @staticmethod
    def create(db: Session, schedule: DeliverySchedule) -> DeliverySchedule:
        """Crée un nouveau créneau de livraison"""
        db.add(schedule)
        db.commit()
        db.refresh(schedule)
        return schedule
    
    @staticmethod
    def get_by_id(db: Session, schedule_id: int) -> Optional[DeliverySchedule]:
        """Récupère un créneau par son ID"""
        return db.query(DeliverySchedule).filter(DeliverySchedule.id == schedule_id).first()
    
    @staticmethod
    def get_by_zone(
        db: Session,
        zone_id: int,
        day_of_week: Optional[int] = None,
        active_only: bool = True
    ) -> List[DeliverySchedule]:
        """Récupère les créneaux d'une zone"""
        query = db.query(DeliverySchedule).filter(
            DeliverySchedule.delivery_zone_id == zone_id
        )
        
        if day_of_week is not None:
            query = query.filter(DeliverySchedule.day_of_week == day_of_week)
        
        if active_only:
            query = query.filter(DeliverySchedule.is_active)
        
        return query.order_by(
            DeliverySchedule.day_of_week,
            DeliverySchedule.time_slot_start
        ).all()
    
    @staticmethod
    def update(db: Session, schedule: DeliverySchedule) -> DeliverySchedule:
        """Met à jour un créneau de livraison"""
        db.commit()
        db.refresh(schedule)
        return schedule
    
    @staticmethod
    def delete(db: Session, schedule: DeliverySchedule) -> None:
        """Supprime un créneau de livraison"""
        db.delete(schedule)
        db.commit()
    
    @staticmethod
    def count_scheduled_deliveries(
        db: Session,
        schedule_id: int,
        delivery_date: date
    ) -> int:
        """Compte le nombre de livraisons déjà planifiées pour un créneau à une date donnée"""
        schedule = DeliveryScheduleRepository.get_by_id(db, schedule_id)
        
        if not schedule:
            return 0
        
        time_slot = f"{schedule.time_slot_start}-{schedule.time_slot_end}"
        
        return db.query(Delivery).filter(
            and_(
                Delivery.delivery_zone_id == schedule.delivery_zone_id,
                Delivery.scheduled_date == delivery_date,
                Delivery.scheduled_time_slot == time_slot,
                Delivery.status.in_(['pending', 'assigned', 'in_transit'])
            )
        ).count()


class DeliveryRepository:
    """Repository pour les livraisons"""
    
    @staticmethod
    def create(db: Session, delivery: Delivery) -> Delivery:
        """Crée une nouvelle livraison"""
        db.add(delivery)
        db.commit()
        db.refresh(delivery)
        return delivery
    
    @staticmethod
    def get_by_id(db: Session, delivery_id: int) -> Optional[Delivery]:
        """Récupère une livraison par son ID"""
        return db.query(Delivery).filter(Delivery.id == delivery_id).first()
    
    @staticmethod
    def get_by_order(db: Session, order_id: int) -> Optional[Delivery]:
        """Récupère la livraison associée à une commande"""
        return db.query(Delivery).filter(Delivery.order_id == order_id).first()
    
    @staticmethod
    def get_by_driver(
        db: Session,
        driver_id: int,
        delivery_date: Optional[date] = None,
        status: Optional[str] = None
    ) -> List[Delivery]:
        """Récupère les livraisons d'un livreur"""
        query = db.query(Delivery).filter(Delivery.driver_id == driver_id)
        
        if delivery_date:
            query = query.filter(Delivery.scheduled_date == delivery_date)
        
        if status:
            query = query.filter(Delivery.status == status)
        
        return query.order_by(Delivery.scheduled_date, Delivery.created_at).all()
    
    @staticmethod
    def get_pending_deliveries(
        db: Session,
        zone_id: Optional[int] = None
    ) -> List[Delivery]:
        """Récupère les livraisons en attente d'assignation"""
        query = db.query(Delivery).filter(Delivery.status == 'pending')
        
        if zone_id:
            query = query.filter(Delivery.delivery_zone_id == zone_id)
        
        return query.order_by(Delivery.created_at).all()
    
    @staticmethod
    def get_by_status(db: Session, status: str) -> List[Delivery]:
        """Récupère toutes les livraisons avec un statut donné"""
        return db.query(Delivery).filter(Delivery.status == status).all()
    
    @staticmethod
    def update(db: Session, delivery: Delivery) -> Delivery:
        """Met à jour une livraison"""
        db.commit()
        db.refresh(delivery)
        return delivery
    
    @staticmethod
    def delete(db: Session, delivery: Delivery) -> None:
        """Supprime une livraison"""
        db.delete(delivery)
        db.commit()
    
    @staticmethod
    def get_deliveries_for_optimization(
        db: Session,
        delivery_ids: List[int]
    ) -> List[Delivery]:
        """Récupère les livraisons pour optimisation de tournée"""
        return db.query(Delivery).filter(
            Delivery.id.in_(delivery_ids)
        ).all()


class DeliveryRouteRepository:
    """Repository pour les tournées de livraison"""
    
    @staticmethod
    def create(db: Session, route: DeliveryRoute) -> DeliveryRoute:
        """Crée une nouvelle tournée"""
        db.add(route)
        db.commit()
        db.refresh(route)
        return route
    
    @staticmethod
    def get_by_id(db: Session, route_id: int) -> Optional[DeliveryRoute]:
        """Récupère une tournée par son ID"""
        return db.query(DeliveryRoute).filter(DeliveryRoute.id == route_id).first()
    
    @staticmethod
    def get_with_items(db: Session, route_id: int) -> Optional[DeliveryRoute]:
        """Récupère une tournée avec tous ses éléments"""
        return db.query(DeliveryRoute).options(
            joinedload(DeliveryRoute.items)
        ).filter(DeliveryRoute.id == route_id).first()
    
    @staticmethod
    def get_with_deliveries(db: Session, route_id: int) -> Optional[DeliveryRoute]:
        """Récupère une tournée avec toutes les livraisons associées"""
        return db.query(DeliveryRoute).options(
            joinedload(DeliveryRoute.deliveries)
        ).filter(DeliveryRoute.id == route_id).first()
    
    @staticmethod
    def get_by_driver(
        db: Session,
        driver_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        status: Optional[str] = None
    ) -> List[DeliveryRoute]:
        """Récupère les tournées d'un livreur"""
        query = db.query(DeliveryRoute).filter(DeliveryRoute.driver_id == driver_id)
        
        if start_date:
            query = query.filter(DeliveryRoute.delivery_date >= start_date)
        
        if end_date:
            query = query.filter(DeliveryRoute.delivery_date <= end_date)
        
        if status:
            query = query.filter(DeliveryRoute.status == status)
        
        return query.order_by(DeliveryRoute.delivery_date.desc()).all()
    
    @staticmethod
    def get_by_date(db: Session, delivery_date: date) -> List[DeliveryRoute]:
        """Récupère toutes les tournées pour une date donnée"""
        return db.query(DeliveryRoute).filter(
            DeliveryRoute.delivery_date == delivery_date
        ).all()
    
    @staticmethod
    def update(db: Session, route: DeliveryRoute) -> DeliveryRoute:
        """Met à jour une tournée"""
        db.commit()
        db.refresh(route)
        return route
    
    @staticmethod
    def delete(db: Session, route: DeliveryRoute) -> None:
        """Supprime une tournée"""
        db.delete(route)
        db.commit()
    
    @staticmethod
    def count_driver_routes_for_date(
        db: Session,
        driver_id: int,
        delivery_date: date
    ) -> int:
        """Compte le nombre de tournées d'un livreur pour une date donnée"""
        return db.query(DeliveryRoute).filter(
            and_(
                DeliveryRoute.driver_id == driver_id,
                DeliveryRoute.delivery_date == delivery_date,
                DeliveryRoute.status.in_(['planned', 'in_progress'])
            )
        ).count()


class DeliveryRouteItemRepository:
    """Repository pour les éléments de tournée"""
    
    @staticmethod
    def create(db: Session, item: DeliveryRouteItem) -> DeliveryRouteItem:
        """Crée un nouvel élément de tournée"""
        db.add(item)
        db.commit()
        db.refresh(item)
        return item
    
    @staticmethod
    def create_bulk(db: Session, items: List[DeliveryRouteItem]) -> List[DeliveryRouteItem]:
        """Crée plusieurs éléments de tournée en une seule transaction"""
        db.add_all(items)
        db.commit()
        for item in items:
            db.refresh(item)
        return items
    
    @staticmethod
    def get_by_route(db: Session, route_id: int) -> List[DeliveryRouteItem]:
        """Récupère tous les éléments d'une tournée"""
        return db.query(DeliveryRouteItem).filter(
            DeliveryRouteItem.route_id == route_id
        ).order_by(DeliveryRouteItem.sequence).all()
    
    @staticmethod
    def update(db: Session, item: DeliveryRouteItem) -> DeliveryRouteItem:
        """Met à jour un élément de tournée"""
        db.commit()
        db.refresh(item)
        return item
    
    @staticmethod
    def delete_by_route(db: Session, route_id: int) -> None:
        """Supprime tous les éléments d'une tournée"""
        db.query(DeliveryRouteItem).filter(
            DeliveryRouteItem.route_id == route_id
        ).delete()
        db.commit()


class DeliveryDriverRepository:
    """Repository pour les profils de livreurs"""
    
    @staticmethod
    def create(db: Session, driver: DeliveryDriver) -> DeliveryDriver:
        """Crée un nouveau profil de livreur"""
        db.add(driver)
        db.commit()
        db.refresh(driver)
        return driver
    
    @staticmethod
    def get_by_id(db: Session, driver_id: int) -> Optional[DeliveryDriver]:
        """Récupère un profil de livreur par son ID"""
        return db.query(DeliveryDriver).filter(DeliveryDriver.id == driver_id).first()
    
    @staticmethod
    def get_by_user(db: Session, user_id: int) -> Optional[DeliveryDriver]:
        """Récupère le profil de livreur associé à un utilisateur"""
        return db.query(DeliveryDriver).filter(DeliveryDriver.user_id == user_id).first()
    
    @staticmethod
    def get_available(
        db: Session,
        zone_id: Optional[int] = None
    ) -> List[DeliveryDriver]:
        """Récupère les livreurs disponibles et vérifiés"""
        query = db.query(DeliveryDriver).filter(
            and_(
                DeliveryDriver.is_available,
                DeliveryDriver.is_verified
            )
        )
        
        if zone_id:
            # Filtre les livreurs qui travaillent dans cette zone
            query = query.filter(
                DeliveryDriver.working_zones.contains([zone_id])
            )
        
        return query.all()
    
    @staticmethod
    def get_all_verified(db: Session) -> List[DeliveryDriver]:
        """Récupère tous les livreurs vérifiés"""
        return db.query(DeliveryDriver).filter(
            DeliveryDriver.is_verified
        ).all()
    
    @staticmethod
    def update(db: Session, driver: DeliveryDriver) -> DeliveryDriver:
        """Met à jour un profil de livreur"""
        db.commit()
        db.refresh(driver)
        return driver
    
    @staticmethod
    def delete(db: Session, driver: DeliveryDriver) -> None:
        """Supprime un profil de livreur"""
        db.delete(driver)
        db.commit()
    
    @staticmethod
    def get_driver_statistics(db: Session, driver_id: int) -> dict:
        """Calcule les statistiques d'un livreur depuis la base de données"""
        deliveries = db.query(Delivery).filter(Delivery.driver_id == driver_id).all()
        
        total = len(deliveries)
        successful = len([d for d in deliveries if d.status == "delivered"])
        failed = len([d for d in deliveries if d.status == "failed"])
        in_transit = len([d for d in deliveries if d.status == "in_transit"])
        
        return {
            "total_deliveries": total,
            "successful_deliveries": successful,
            "failed_deliveries": failed,
            "pending_deliveries": in_transit,
            "success_rate": round((successful / total * 100) if total > 0 else 0, 2)
        }
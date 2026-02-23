from datetime import datetime, date, timezone
from typing import List, Optional, Dict, Any, Tuple
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import and_
import math

from app.models.delivery import (
    DeliveryZone,
    DeliverySchedule,
    Delivery,
    DeliveryRoute,
    DeliveryRouteItem,
    DeliveryDriver
)


from app.schemas.delivery import (
    DeliveryZoneCreate,
    DeliveryZoneUpdate,
    DeliveryScheduleCreate,
    DeliveryCreate,
    DeliveryUpdate,
    DeliveryRouteCreate,
    DeliveryRouteOptimize
)


class DeliveryZoneService:
    """Service pour la gestion des zones de livraison"""
    
    @staticmethod
    def create_zone(db: Session, zone_data: DeliveryZoneCreate) -> DeliveryZone:
        """Crée une nouvelle zone de livraison"""
        zone = DeliveryZone(**zone_data.model_dump())
        db.add(zone)
        db.commit()
        db.refresh(zone)
        return zone
    
    @staticmethod
    def get_zone(db: Session, zone_id: int) -> Optional[DeliveryZone]:
        """Récupère une zone de livraison par son ID"""
        return db.query(DeliveryZone).filter(DeliveryZone.id == zone_id).first()
    
    @staticmethod
    def get_producer_zones(
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
    def update_zone(
        db: Session,
        zone_id: int,
        zone_data: DeliveryZoneUpdate
    ) -> Optional[DeliveryZone]:
        """Met à jour une zone de livraison"""
        zone = db.query(DeliveryZone).filter(DeliveryZone.id == zone_id).first()
        
        if not zone:
            return None
        
        # Met à jour uniquement les champs fournis
        update_data = zone_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(zone, field, value)
        
        db.commit()
        db.refresh(zone)
        return zone
    
    @staticmethod
    def delete_zone(db: Session, zone_id: int) -> bool:
        """Supprime une zone de livraison"""
        zone = db.query(DeliveryZone).filter(DeliveryZone.id == zone_id).first()
        
        if not zone:
            return False
        
        db.delete(zone)
        db.commit()
        return True
    
    @staticmethod
    def check_address_in_zone(
        db: Session,
        zone_id: int,
        postal_code: str,
        latitude: Optional[Decimal] = None,
        longitude: Optional[Decimal] = None
    ) -> bool:
        """
        Vérifie si une adresse est dans une zone de livraison.
        Utilise soit le code postal, soit les coordonnées GPS.
        """
        zone = db.query(DeliveryZone).filter(DeliveryZone.id == zone_id).first()
        
        if not zone or not zone.is_active:
            return False
        
        # Vérification par code postal
        if zone.postal_codes and postal_code:
            return postal_code in zone.postal_codes
        
        # Vérification par rayon géographique
        if zone.radius_km and latitude and longitude and zone.center_latitude and zone.center_longitude:
            distance = DeliveryZoneService._calculate_distance(
                float(zone.center_latitude),
                float(zone.center_longitude),
                float(latitude),
                float(longitude)
            )
            return distance <= float(zone.radius_km)
        
        return False
    
    @staticmethod
    def _calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calcule la distance entre deux points géographiques en km.
        Utilise la formule de Haversine.
        """
        R = 6371  # Rayon de la Terre en km
        
        # Conversion en radians
        lat1_rad = math.radians(lat1)
        lon1_rad = math.radians(lon1)
        lat2_rad = math.radians(lat2)
        lon2_rad = math.radians(lon2)
        
        # Différences
        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad
        
        # Formule de Haversine
        a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        return R * c
    
    @staticmethod
    def calculate_delivery_fee(
        db: Session,
        zone_id: int,
        order_amount: Decimal
    ) -> Decimal:
        """Calcule les frais de livraison pour une commande"""
        zone = db.query(DeliveryZone).filter(DeliveryZone.id == zone_id).first()
        
        if not zone:
            return Decimal("0")
        
        # Si le montant dépasse le seuil de livraison gratuite
        if zone.free_delivery_threshold and order_amount >= zone.free_delivery_threshold:
            return Decimal("0")
        
        return zone.delivery_fee


class DeliveryScheduleService:
    """Service pour la gestion des créneaux de livraison"""
    
    @staticmethod
    def create_schedule(db: Session, schedule_data: DeliveryScheduleCreate) -> DeliverySchedule:
        """Crée un nouveau créneau de livraison"""
        schedule = DeliverySchedule(**schedule_data.model_dump())
        db.add(schedule)
        db.commit()
        db.refresh(schedule)
        return schedule
    
    @staticmethod
    def get_zone_schedules(
        db: Session,
        zone_id: int,
        day_of_week: Optional[int] = None,
        active_only: bool = True
    ) -> List[DeliverySchedule]:
        """Récupère les créneaux d'une zone"""
        query = db.query(DeliverySchedule).filter(DeliverySchedule.delivery_zone_id == zone_id)
        
        if day_of_week is not None:
            query = query.filter(DeliverySchedule.day_of_week == day_of_week)
        
        if active_only:
            query = query.filter(DeliverySchedule.is_active)
        
        return query.order_by(DeliverySchedule.day_of_week, DeliverySchedule.time_slot_start).all()
    
    @staticmethod
    def check_schedule_availability(
        db: Session,
        schedule_id: int,
        delivery_date: date
    ) -> Tuple[bool, Optional[str]]:
        """
        Vérifie si un créneau est disponible pour une date donnée.
        Retourne (disponible, raison_si_non_disponible)
        """
        schedule = db.query(DeliverySchedule).filter(DeliverySchedule.id == schedule_id).first()
        
        if not schedule:
            return False, "Créneau non trouvé"
        
        if not schedule.is_active:
            return False, "Créneau inactif"
        
        # Vérifier le jour de la semaine
        if delivery_date.weekday() != schedule.day_of_week:
            return False, "Jour de la semaine incorrect"
        
        # Vérifier le nombre de commandes déjà planifiées
        if schedule.max_orders:
            existing_deliveries = db.query(Delivery).filter(
                and_(
                    Delivery.delivery_zone_id == schedule.delivery_zone_id,
                    Delivery.scheduled_date == delivery_date,
                    Delivery.scheduled_time_slot == f"{schedule.time_slot_start}-{schedule.time_slot_end}",
                    Delivery.status.in_(['pending', 'assigned', 'in_transit'])
                )
            ).count()
            
            if existing_deliveries >= schedule.max_orders:
                return False, "Créneau complet"
        
        return True, None


class DeliveryService:
    """Service pour la gestion des livraisons"""
    
    @staticmethod
    def create_delivery(db: Session, delivery_data: DeliveryCreate) -> Delivery:
        """Crée une nouvelle livraison pour une commande"""
        delivery = Delivery(**delivery_data.model_dump())
        delivery.status = "pending"
        
        db.add(delivery)
        db.commit()
        db.refresh(delivery)
        return delivery
    
    @staticmethod
    def get_delivery(db: Session, delivery_id: int) -> Optional[Delivery]:
        """Récupère une livraison par son ID"""
        return db.query(Delivery).filter(Delivery.id == delivery_id).first()
    
    @staticmethod
    def get_delivery_by_order(db: Session, order_id: int) -> Optional[Delivery]:
        """Récupère la livraison d'une commande"""
        return db.query(Delivery).filter(Delivery.order_id == order_id).first()
    
    @staticmethod
    def update_delivery(
        db: Session,
        delivery_id: int,
        delivery_data: DeliveryUpdate
    ) -> Optional[Delivery]:
        """Met à jour une livraison"""
        delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()
        
        if not delivery:
            return None
        
        update_data = delivery_data.model_dump(exclude_unset=True)
        
        # Gestion automatique des timestamps selon le statut
        if 'status' in update_data:
            new_status = update_data['status']
            
            if new_status == 'assigned' and not delivery.assigned_at:
                delivery.assigned_at = datetime.now(timezone.utc)
            elif new_status == 'in_transit' and not delivery.pickup_time:
                delivery.pickup_time = datetime.now(timezone.utc)
            elif new_status == 'delivered' and not delivery.delivery_time:
                delivery.delivery_time = datetime.now(timezone.utc)
        
        for field, value in update_data.items():
            setattr(delivery, field, value)
        
        db.commit()
        db.refresh(delivery)
        return delivery
    
    @staticmethod
    def assign_delivery(
        db: Session,
        delivery_id: int,
        driver_id: int,
        scheduled_date: Optional[date] = None
    ) -> Optional[Delivery]:
        """Assigne une livraison à un livreur"""
        delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()
        
        if not delivery:
            return None
        
        delivery.driver_id = driver_id
        delivery.status = "assigned"
        delivery.assigned_at = datetime.now(timezone.utc)
        
        if scheduled_date:
            delivery.scheduled_date = scheduled_date
        
        db.commit()
        db.refresh(delivery)
        return delivery
    
    @staticmethod
    def mark_as_delivered(
        db: Session,
        delivery_id: int,
        signature: Optional[str] = None,
        photo_proof: Optional[str] = None,
        recipient_name: Optional[str] = None,
        notes: Optional[str] = None
    ) -> Optional[Delivery]:
        """Marque une livraison comme effectuée avec preuve"""
        delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()
        
        if not delivery:
            return None
        
        delivery.status = "delivered"
        delivery.delivery_time = datetime.now(timezone.utc)
        delivery.signature = signature
        delivery.photo_proof = photo_proof
        delivery.recipient_name = recipient_name
        
        if notes:
            delivery.notes = notes
        
        db.commit()
        db.refresh(delivery)
        return delivery
    
    @staticmethod
    def get_driver_deliveries(
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
    def update_location(
        db: Session,
        delivery_id: int,
        latitude: Decimal,
        longitude: Decimal
    ) -> Optional[Delivery]:
        """Met à jour la position GPS du livreur"""
        delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()
        
        if not delivery:
            return None
        
        delivery.last_location_latitude = latitude
        delivery.last_location_longitude = longitude
        delivery.last_location_update = datetime.now(timezone.utc)
        
        db.commit()
        db.refresh(delivery)
        return delivery


class DeliveryRouteService:
    """Service pour la gestion des tournées de livraison"""
    
    @staticmethod
    def create_route(db: Session, route_data: DeliveryRouteCreate) -> DeliveryRoute:
        """Crée une nouvelle tournée de livraison"""
        # Créer la tournée
        route_dict = route_data.model_dump(exclude={'delivery_ids'})
        route = DeliveryRoute(**route_dict)
        route.status = "planned"
        route.total_deliveries = len(route_data.delivery_ids)
        
        db.add(route)
        db.flush()  # Pour obtenir l'ID sans commit
        
        # Ajouter les livraisons à la tournée
        for idx, delivery_id in enumerate(route_data.delivery_ids, start=1):
            item = DeliveryRouteItem(
                route_id=route.id,
                delivery_id=delivery_id,
                sequence=idx
            )
            db.add(item)
            
            # Mettre à jour le statut de la livraison
            delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()
            if delivery:
                delivery.driver_id = route.driver_id
                delivery.status = "assigned"
                delivery.assigned_at = datetime.now(timezone.utc)
        
        db.commit()
        db.refresh(route)
        return route
    
    @staticmethod
    def optimize_route(
        db: Session,
        optimize_data: DeliveryRouteOptimize
    ) -> Dict[str, Any]:
        """
        Optimise l'ordre des livraisons pour minimiser la distance.
        Utilise un algorithme glouton simple (nearest neighbor).
        Pour une solution plus sophistiquée, intégrer une API comme Google Maps ou OSRM.
        """
        deliveries = db.query(Delivery).filter(
            Delivery.id.in_(optimize_data.delivery_ids)
        ).all()
        
        if not deliveries:
            return {"error": "Aucune livraison trouvée"}
        
        # Point de départ
        current_lat = float(optimize_data.start_latitude)
        current_lon = float(optimize_data.start_longitude)
        
        optimized_order = []
        remaining_deliveries = deliveries.copy()
        total_distance = 0
        
        # Algorithme du plus proche voisin
        while remaining_deliveries:
            nearest = None
            nearest_distance = float('inf')
            
            for delivery in remaining_deliveries:
                if delivery.delivery_latitude and delivery.delivery_longitude:
                    distance = DeliveryZoneService._calculate_distance(
                        current_lat,
                        current_lon,
                        float(delivery.delivery_latitude),
                        float(delivery.delivery_longitude)
                    )
                    
                    if distance < nearest_distance:
                        nearest_distance = distance
                        nearest = delivery
            
            if nearest:
                optimized_order.append({
                    "delivery_id": nearest.id,
                    "sequence": len(optimized_order) + 1,
                    "address": nearest.delivery_address,
                    "distance_from_previous": round(nearest_distance, 2)
                })
                
                total_distance += nearest_distance
                current_lat = float(nearest.delivery_latitude)
                current_lon = float(nearest.delivery_longitude)
                remaining_deliveries.remove(nearest)
            else:
                # Si pas de coordonnées, ajouter à la fin
                optimized_order.append({
                    "delivery_id": nearest.id,
                    "sequence": len(optimized_order) + 1,
                    "address": nearest.delivery_address,
                    "distance_from_previous": 0
                })
                remaining_deliveries.remove(nearest)
        
        # Si un point d'arrivée est spécifié, calculer la distance finale
        if optimize_data.end_latitude and optimize_data.end_longitude:
            final_distance = DeliveryZoneService._calculate_distance(
                current_lat,
                current_lon,
                float(optimize_data.end_latitude),
                float(optimize_data.end_longitude)
            )
            total_distance += final_distance
        
        # Estimer la durée (en supposant 30 km/h en moyenne + 10 min par arrêt)
        estimated_duration = int((total_distance / 30) * 60 + len(deliveries) * 10)
        
        return {
            "optimized_route": optimized_order,
            "total_distance_km": round(total_distance, 2),
            "estimated_duration_minutes": estimated_duration,
            "total_deliveries": len(deliveries)
        }
    
    @staticmethod
    def start_route(db: Session, route_id: int) -> Optional[DeliveryRoute]:
        """Démarre une tournée"""
        route = db.query(DeliveryRoute).filter(DeliveryRoute.id == route_id).first()
        
        if not route:
            return None
        
        route.status = "in_progress"
        route.started_at = datetime.now(timezone.utc)
        
        db.commit()
        db.refresh(route)
        return route
    
    @staticmethod
    def complete_route(db: Session, route_id: int) -> Optional[DeliveryRoute]:
        """Complète une tournée"""
        route = db.query(DeliveryRoute).filter(DeliveryRoute.id == route_id).first()
        
        if not route:
            return None
        
        # Calculer les statistiques
        items = db.query(DeliveryRouteItem).filter(DeliveryRouteItem.route_id == route_id).all()
        
        for item in items:
            delivery = db.query(Delivery).filter(Delivery.id == item.delivery_id).first()
            if delivery:
                if delivery.status == "delivered":
                    route.successful_deliveries += 1
                elif delivery.status == "failed":
                    route.failed_deliveries += 1
        
        route.status = "completed"
        route.completed_at = datetime.now(timezone.utc)
        
        db.commit()
        db.refresh(route)
        return route
    
    @staticmethod
    def get_driver_routes(
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


class DeliveryDriverService:
    """Service pour la gestion des livreurs"""
    
    @staticmethod
    def get_available_drivers(
        db: Session,
        zone_id: Optional[int] = None,
        delivery_date: Optional[date] = None
    ) -> List[DeliveryDriver]:
        """Récupère les livreurs disponibles"""
        query = db.query(DeliveryDriver).filter(
            and_(
                DeliveryDriver.is_available,
                DeliveryDriver.is_verified
            )
        )
        
        # Filtrer par zone de travail si spécifiée
        if zone_id:
            query = query.filter(
                DeliveryDriver.working_zones.contains([zone_id])
            )
        
        drivers = query.all()
        
        # Filtrer par disponibilité à la date donnée
        if delivery_date:
            available = []
            for driver in drivers:
                # Vérifier s'il n'a pas trop de livraisons ce jour-là
                existing_routes = db.query(DeliveryRoute).filter(
                    and_(
                        DeliveryRoute.driver_id == driver.user_id,
                        DeliveryRoute.delivery_date == delivery_date,
                        DeliveryRoute.status.in_(['planned', 'in_progress'])
                    )
                ).count()
                
                if existing_routes < 2:  # Max 2 tournées par jour
                    available.append(driver)
            
            return available
        
        return drivers
    
    @staticmethod
    def calculate_driver_stats(db: Session, driver_id: int) -> Dict[str, Any]:
        """Calcule les statistiques d'un livreur"""
        deliveries = db.query(Delivery).filter(Delivery.driver_id == driver_id).all()
        
        total = len(deliveries)
        successful = len([d for d in deliveries if d.status == "delivered"])
        failed = len([d for d in deliveries if d.status == "failed"])
        
        # Calculer le temps moyen de livraison
        delivery_times = []
        for d in deliveries:
            if d.pickup_time and d.delivery_time:
                duration = (d.delivery_time - d.pickup_time).total_seconds() / 60
                delivery_times.append(duration)
        
        avg_delivery_time = sum(delivery_times) / len(delivery_times) if delivery_times else 0
        
        return {
            "total_deliveries": total,
            "successful_deliveries": successful,
            "failed_deliveries": failed,
            "success_rate": round((successful / total * 100) if total > 0 else 0, 2),
            "average_delivery_time_minutes": round(avg_delivery_time, 2)
        }
from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core import deps
from app.models.auth import User
from app.schemas.delivery import (
    DeliveryZone,
    DeliveryZoneCreate,
    DeliveryZoneUpdate,
    DeliveryZoneWithSchedules,
    DeliverySchedule,
    DeliveryScheduleCreate,
    DeliveryScheduleUpdate,
    Delivery,
    DeliveryCreate,
    DeliveryUpdate,
    DeliveryAssign,
    DeliveryProof,
    DeliveryLocationUpdate,
    DeliveryRoute,
    DeliveryRouteCreate,
    DeliveryRouteUpdate,
    DeliveryRouteOptimize,
    DeliveryRouteWithDeliveries,
    DeliveryDriver,
    DeliveryDriverCreate,
    DeliveryDriverUpdate,
    DeliveryStats
)
from app.services.delivery_service import (
    DeliveryZoneService,
    DeliveryScheduleService,
    DeliveryService,
    DeliveryRouteService,
    DeliveryDriverService
)

router = APIRouter()


# ==================== ZONES DE LIVRAISON ====================

@router.post("/zones", response_model=DeliveryZone, status_code=status.HTTP_201_CREATED)
def create_delivery_zone(
    *,
    db: Session = Depends(deps.get_db),
    zone_in: DeliveryZoneCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Crée une nouvelle zone de livraison.
    Seuls les producteurs peuvent créer des zones de livraison.
    """
    if current_user.role not in ["producer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les producteurs peuvent créer des zones de livraison"
        )
    
    if current_user.role == "producer" and zone_in.producer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez créer des zones que pour votre propre compte"
        )
    
    return DeliveryZoneService.create_zone(db, zone_in)


@router.get("/zones/{zone_id}", response_model=DeliveryZoneWithSchedules)
def get_delivery_zone(
    *,
    db: Session = Depends(deps.get_db),
    zone_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Récupère les détails d'une zone de livraison avec ses créneaux horaires."""
    zone = DeliveryZoneService.get_zone(db, zone_id)
    
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Zone de livraison non trouvée"
        )
    
    return zone


@router.get("/zones/producer/{producer_id}", response_model=List[DeliveryZone])
def get_producer_zones(
    *,
    db: Session = Depends(deps.get_db),
    producer_id: int,
    active_only: bool = Query(False, description="Afficher uniquement les zones actives"),
    current_user: User = Depends(deps.get_current_active_user)
):
    """Récupère toutes les zones de livraison d'un producteur."""
    return DeliveryZoneService.get_producer_zones(db, producer_id, active_only)


@router.put("/zones/{zone_id}", response_model=DeliveryZone)
def update_delivery_zone(
    *,
    db: Session = Depends(deps.get_db),
    zone_id: int,
    zone_in: DeliveryZoneUpdate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Met à jour une zone de livraison."""
    zone = DeliveryZoneService.get_zone(db, zone_id)
    
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Zone de livraison non trouvée"
        )
    
    if current_user.role == "producer" and zone.producer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez modifier que vos propres zones"
        )
    
    return DeliveryZoneService.update_zone(db, zone_id, zone_in)


@router.delete("/zones/{zone_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_delivery_zone(
    *,
    db: Session = Depends(deps.get_db),
    zone_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Supprime une zone de livraison."""
    zone = DeliveryZoneService.get_zone(db, zone_id)
    
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Zone de livraison non trouvée"
        )
    
    if current_user.role == "producer" and zone.producer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez supprimer que vos propres zones"
        )
    
    DeliveryZoneService.delete_zone(db, zone_id)


@router.post("/zones/{zone_id}/check-address")
def check_address_in_zone(
    *,
    db: Session = Depends(deps.get_db),
    zone_id: int,
    postal_code: str,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Vérifie si une adresse est dans la zone de livraison."""
    is_in_zone = DeliveryZoneService.check_address_in_zone(
        db, zone_id, postal_code, latitude, longitude
    )
    
    return {"in_zone": is_in_zone}


# ==================== CRÉNEAUX DE LIVRAISON ====================

@router.post("/schedules", response_model=DeliverySchedule, status_code=status.HTTP_201_CREATED)
def create_delivery_schedule(
    *,
    db: Session = Depends(deps.get_db),
    schedule_in: DeliveryScheduleCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Crée un nouveau créneau de livraison pour une zone."""
    zone = DeliveryZoneService.get_zone(db, schedule_in.delivery_zone_id)
    
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Zone de livraison non trouvée"
        )
    
    if current_user.role == "producer" and zone.producer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez créer des créneaux que pour vos propres zones"
        )
    
    return DeliveryScheduleService.create_schedule(db, schedule_in)


@router.get("/schedules/zone/{zone_id}", response_model=List[DeliverySchedule])
def get_zone_schedules(
    *,
    db: Session = Depends(deps.get_db),
    zone_id: int,
    day_of_week: Optional[int] = Query(None, ge=0, le=6, description="Jour de la semaine (0=Lundi, 6=Dimanche)"),
    current_user: User = Depends(deps.get_current_active_user)
):
    """Récupère les créneaux de livraison d'une zone."""
    return DeliveryScheduleService.get_zone_schedules(db, zone_id, day_of_week)


@router.put("/schedules/{schedule_id}", response_model=DeliverySchedule)
def update_delivery_schedule(
    *,
    db: Session = Depends(deps.get_db),
    schedule_id: int,
    schedule_in: DeliveryScheduleUpdate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Met à jour un créneau de livraison."""
    return DeliveryScheduleService.update_schedule(db, schedule_id, schedule_in)


@router.post("/schedules/{schedule_id}/check-availability")
def check_schedule_availability(
    *,
    db: Session = Depends(deps.get_db),
    schedule_id: int,
    delivery_date: date,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Vérifie si un créneau est disponible pour une date donnée."""
    available, reason = DeliveryScheduleService.check_schedule_availability(
        db, schedule_id, delivery_date
    )
    
    return {
        "available": available,
        "reason": reason
    }


# ==================== LIVRAISONS ====================

@router.post("/deliveries", response_model=Delivery, status_code=status.HTTP_201_CREATED)
def create_delivery(
    *,
    db: Session = Depends(deps.get_db),
    delivery_in: DeliveryCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Crée une nouvelle livraison pour une commande."""
    return DeliveryService.create_delivery(db, delivery_in)


@router.get("/deliveries/{delivery_id}", response_model=Delivery)
def get_delivery(
    *,
    db: Session = Depends(deps.get_db),
    delivery_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Récupère les détails d'une livraison."""
    delivery = DeliveryService.get_delivery(db, delivery_id)
    
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Livraison non trouvée"
        )
    
    return delivery


@router.get("/deliveries/order/{order_id}", response_model=Delivery)
def get_delivery_by_order(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Récupère la livraison associée à une commande."""
    delivery = DeliveryService.get_delivery_by_order(db, order_id)
    
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucune livraison trouvée pour cette commande"
        )
    
    return delivery


@router.put("/deliveries/{delivery_id}", response_model=Delivery)
def update_delivery(
    *,
    db: Session = Depends(deps.get_db),
    delivery_id: int,
    delivery_in: DeliveryUpdate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Met à jour une livraison."""
    delivery = DeliveryService.get_delivery(db, delivery_id)
    
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Livraison non trouvée"
        )
    
    if current_user.role not in ["admin"]:
        if current_user.role == "driver" and delivery.driver_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous ne pouvez modifier que vos propres livraisons"
            )
    
    return DeliveryService.update_delivery(db, delivery_id, delivery_in)


@router.post("/deliveries/{delivery_id}/assign", response_model=Delivery)
def assign_delivery(
    *,
    db: Session = Depends(deps.get_db),
    delivery_id: int,
    assign_data: DeliveryAssign,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Assigne une livraison à un livreur."""
    if current_user.role not in ["producer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les producteurs et administrateurs peuvent assigner des livraisons"
        )
    
    delivery = DeliveryService.assign_delivery(
        db,
        delivery_id,
        assign_data.driver_id,
        assign_data.scheduled_date
    )
    
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Livraison non trouvée"
        )
    
    return delivery


@router.post("/deliveries/{delivery_id}/deliver", response_model=Delivery)
def mark_as_delivered(
    *,
    db: Session = Depends(deps.get_db),
    delivery_id: int,
    proof: DeliveryProof,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Marque une livraison comme effectuée avec preuve de livraison."""
    delivery = DeliveryService.get_delivery(db, delivery_id)
    
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Livraison non trouvée"
        )
    
    if current_user.role == "driver" and delivery.driver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez marquer comme livrée que vos propres livraisons"
        )
    
    return DeliveryService.mark_as_delivered(
        db,
        delivery_id,
        proof.signature,
        proof.photo_proof,
        proof.recipient_name,
        proof.notes
    )


@router.post("/deliveries/{delivery_id}/location", response_model=Delivery)
def update_delivery_location(
    *,
    db: Session = Depends(deps.get_db),
    delivery_id: int,
    location: DeliveryLocationUpdate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Met à jour la position GPS du livreur pour une livraison en cours."""
    delivery = DeliveryService.get_delivery(db, delivery_id)
    
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Livraison non trouvée"
        )
    
    if delivery.driver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez mettre à jour la position que pour vos propres livraisons"
        )
    
    return DeliveryService.update_location(
        db,
        delivery_id,
        location.latitude,
        location.longitude
    )


@router.get("/deliveries/driver/me", response_model=List[Delivery])
def get_my_deliveries(
    *,
    db: Session = Depends(deps.get_db),
    delivery_date: Optional[date] = Query(None, description="Filtrer par date de livraison"),
    status: Optional[str] = Query(None, description="Filtrer par statut"),
    current_user: User = Depends(deps.get_current_active_user)
):
    """Récupère les livraisons du livreur connecté."""
    if current_user.role != "driver":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les livreurs peuvent accéder à cette ressource"
        )
    
    return DeliveryService.get_driver_deliveries(db, current_user.id, delivery_date, status)


# ==================== TOURNÉES ====================

@router.post("/routes", response_model=DeliveryRoute, status_code=status.HTTP_201_CREATED)
def create_delivery_route(
    *,
    db: Session = Depends(deps.get_db),
    route_in: DeliveryRouteCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Crée une nouvelle tournée de livraison."""
    if current_user.role not in ["producer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les producteurs et administrateurs peuvent créer des tournées"
        )
    
    return DeliveryRouteService.create_route(db, route_in)


@router.get("/routes/{route_id}", response_model=DeliveryRouteWithDeliveries)
def get_delivery_route(
    *,
    db: Session = Depends(deps.get_db),
    route_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Récupère les détails d'une tournée avec toutes ses livraisons."""
    route = DeliveryRouteService.get_route(db, route_id)
    
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tournée non trouvée"
        )
    
    return route


@router.put("/routes/{route_id}", response_model=DeliveryRoute)
def update_delivery_route(
    *,
    db: Session = Depends(deps.get_db),
    route_id: int,
    route_in: DeliveryRouteUpdate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Met à jour une tournée de livraison."""
    return DeliveryRouteService.update_route(db, route_id, route_in)


@router.post("/routes/optimize", response_model=dict)
def optimize_delivery_route(
    *,
    db: Session = Depends(deps.get_db),
    optimize_data: DeliveryRouteOptimize,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Optimise l'ordre des livraisons pour minimiser la distance totale."""
    if current_user.role not in ["producer", "admin", "driver"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas la permission d'optimiser des tournées"
        )
    
    return DeliveryRouteService.optimize_route(db, optimize_data)


@router.post("/routes/{route_id}/start", response_model=DeliveryRoute)
def start_delivery_route(
    *,
    db: Session = Depends(deps.get_db),
    route_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Démarre une tournée de livraison."""
    route = DeliveryRouteService.start_route(db, route_id)
    
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tournée non trouvée"
        )
    
    if current_user.role == "driver" and route.driver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez démarrer que vos propres tournées"
        )
    
    return route


@router.post("/routes/{route_id}/complete", response_model=DeliveryRoute)
def complete_delivery_route(
    *,
    db: Session = Depends(deps.get_db),
    route_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Marque une tournée comme terminée et calcule les statistiques."""
    route = DeliveryRouteService.complete_route(db, route_id)
    
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tournée non trouvée"
        )
    
    if current_user.role == "driver" and route.driver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez terminer que vos propres tournées"
        )
    
    return route


@router.get("/routes/driver/me", response_model=List[DeliveryRoute])
def get_my_routes(
    *,
    db: Session = Depends(deps.get_db),
    start_date: Optional[date] = Query(None, description="Date de début"),
    end_date: Optional[date] = Query(None, description="Date de fin"),
    status: Optional[str] = Query(None, description="Filtrer par statut"),
    current_user: User = Depends(deps.get_current_active_user)
):
    """Récupère les tournées du livreur connecté."""
    if current_user.role != "driver":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les livreurs peuvent accéder à cette ressource"
        )
    
    return DeliveryRouteService.get_driver_routes(db, current_user.id, start_date, end_date, status)


# ==================== LIVREURS ====================

@router.post("/drivers", response_model=DeliveryDriver, status_code=status.HTTP_201_CREATED)
def create_driver_profile(
    *,
    db: Session = Depends(deps.get_db),
    driver_in: DeliveryDriverCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Crée un profil de livreur."""
    if current_user.role not in ["admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les administrateurs peuvent créer des profils de livreurs"
        )
    
    return DeliveryDriverService.create_driver(db, driver_in)


@router.get("/drivers/available", response_model=List[DeliveryDriver])
def get_available_drivers(
    *,
    db: Session = Depends(deps.get_db),
    zone_id: Optional[int] = Query(None, description="Filtrer par zone de travail"),
    delivery_date: Optional[date] = Query(None, description="Filtrer par disponibilité à une date"),
    current_user: User = Depends(deps.get_current_active_user)
):
    """Récupère la liste des livreurs disponibles."""
    if current_user.role not in ["producer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les producteurs et administrateurs peuvent voir les livreurs disponibles"
        )
    
    return DeliveryDriverService.get_available_drivers(db, zone_id, delivery_date)


@router.get("/drivers/{driver_id}", response_model=DeliveryDriver)
def get_driver_profile(
    *,
    db: Session = Depends(deps.get_db),
    driver_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Récupère le profil d'un livreur."""
    driver = DeliveryDriverService.get_driver(db, driver_id)
    
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil de livreur non trouvé"
        )
    
    return driver


@router.put("/drivers/{driver_id}", response_model=DeliveryDriver)
def update_driver_profile(
    *,
    db: Session = Depends(deps.get_db),
    driver_id: int,
    driver_in: DeliveryDriverUpdate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Met à jour le profil d'un livreur."""
    driver = DeliveryDriverService.get_driver(db, driver_id)
    
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil de livreur non trouvé"
        )
    
    if current_user.role not in ["admin"] and driver.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez modifier que votre propre profil"
        )
    
    return DeliveryDriverService.update_driver(db, driver_id, driver_in)


@router.get("/drivers/{driver_id}/stats", response_model=DeliveryStats)
def get_driver_stats(
    *,
    db: Session = Depends(deps.get_db),
    driver_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Récupère les statistiques détaillées d'un livreur."""
    if current_user.role == "driver" and driver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez voir que vos propres statistiques"
        )
    
    return DeliveryDriverService.calculate_driver_stats(db, driver_id)
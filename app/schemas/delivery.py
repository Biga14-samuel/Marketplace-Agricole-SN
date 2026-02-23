from datetime import datetime, date, time
from typing import Optional, List, Dict, Any
from decimal import Decimal
from pydantic import BaseModel, Field, field_validator, ConfigDict


# ============ DELIVERY ZONE SCHEMAS ============

class DeliveryZoneBase(BaseModel):
    """Schéma de base pour une zone de livraison"""
    name: str = Field(..., min_length=1, max_length=100)
    postal_codes: Optional[List[str]] = None
    radius_km: Optional[Decimal] = Field(None, ge=0, le=100)
    center_latitude: Optional[Decimal] = Field(None, ge=-90, le=90)
    center_longitude: Optional[Decimal] = Field(None, ge=-180, le=180)
    min_order_amount: Optional[Decimal] = Field(None, ge=0)
    delivery_fee: Decimal = Field(default=Decimal("0"), ge=0)
    free_delivery_threshold: Optional[Decimal] = Field(None, ge=0)
    estimated_delivery_days: Optional[int] = Field(None, ge=0, le=30)
    is_active: bool = True


class DeliveryZoneCreate(DeliveryZoneBase):
    """Schéma pour créer une zone de livraison"""
    producer_id: int


class DeliveryZoneUpdate(BaseModel):
    """Schéma pour mettre à jour une zone de livraison"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    postal_codes: Optional[List[str]] = None
    radius_km: Optional[Decimal] = None
    center_latitude: Optional[Decimal] = None
    center_longitude: Optional[Decimal] = None
    min_order_amount: Optional[Decimal] = None
    delivery_fee: Optional[Decimal] = None
    free_delivery_threshold: Optional[Decimal] = None
    estimated_delivery_days: Optional[int] = None
    is_active: Optional[bool] = None


class DeliveryZone(DeliveryZoneBase):
    """Schéma complet d'une zone de livraison"""
    id: int
    producer_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


# ============ DELIVERY SCHEDULE SCHEMAS ============

class DeliveryScheduleBase(BaseModel):
    """Schéma de base pour un créneau de livraison"""
    day_of_week: int = Field(..., ge=0, le=6)  # 0 = Lundi, 6 = Dimanche
    time_slot_start: time
    time_slot_end: time
    max_orders: Optional[int] = Field(None, ge=1)
    max_weight_kg: Optional[Decimal] = Field(None, ge=0)
    is_active: bool = True
    
    @field_validator('time_slot_end')
    @classmethod
    def end_after_start(cls, v, info): 
        """Vérifie que l'heure de fin est après l'heure de début"""
        if 'time_slot_start' in info.data and v <= info.data['time_slot_start']:
            raise ValueError("L'heure de fin doit être après l'heure de début")
        return v


class DeliveryScheduleCreate(DeliveryScheduleBase):
    """Schéma pour créer un créneau de livraison"""
    delivery_zone_id: int


class DeliveryScheduleUpdate(BaseModel):
    """Schéma pour mettre à jour un créneau de livraison"""
    time_slot_start: Optional[time] = None
    time_slot_end: Optional[time] = None
    max_orders: Optional[int] = None
    max_weight_kg: Optional[Decimal] = None
    is_active: Optional[bool] = None


class DeliverySchedule(DeliveryScheduleBase):
    """Schéma complet d'un créneau de livraison"""
    id: int
    delivery_zone_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ============ DELIVERY SCHEMAS ============

class DeliveryBase(BaseModel):
    """Schéma de base pour une livraison"""
    delivery_address: str = Field(..., min_length=1)
    delivery_city: str = Field(..., min_length=1, max_length=100)
    delivery_postal_code: str = Field(..., min_length=1, max_length=20)
    delivery_country: str = Field(default="France", max_length=100)
    delivery_instructions: Optional[str] = None
    scheduled_date: Optional[date] = None
    scheduled_time_slot: Optional[str] = None


class DeliveryCreate(DeliveryBase):
    """Schéma pour créer une livraison"""
    order_id: int
    delivery_zone_id: Optional[int] = None
    delivery_latitude: Optional[Decimal] = None
    delivery_longitude: Optional[Decimal] = None


class DeliveryUpdate(BaseModel):
    """Schéma pour mettre à jour une livraison"""
    status: Optional[str] = Field(
        None,
        pattern="^(pending|assigned|in_transit|delivered|failed|cancelled)$"
    )
    driver_id: Optional[int] = None
    scheduled_date: Optional[date] = None
    scheduled_time_slot: Optional[str] = None
    delivery_instructions: Optional[str] = None
    notes: Optional[str] = None
    failure_reason: Optional[str] = None


class DeliveryAssign(BaseModel):
    """Schéma pour assigner une livraison à un livreur"""
    driver_id: int
    scheduled_date: Optional[date] = None
    scheduled_time_slot: Optional[str] = None


class DeliveryProof(BaseModel):
    """Schéma pour ajouter une preuve de livraison"""
    signature: Optional[str] = None  # Base64 de la signature
    photo_proof: Optional[str] = None  # URL de la photo
    recipient_name: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = None


class DeliveryLocationUpdate(BaseModel):
    """Schéma pour mettre à jour la position GPS du livreur"""
    latitude: Decimal = Field(..., ge=-90, le=90)
    longitude: Decimal = Field(..., ge=-180, le=180)


class Delivery(DeliveryBase):
    """Schéma complet d'une livraison"""
    id: int
    order_id: int
    delivery_zone_id: Optional[int] = None
    driver_id: Optional[int] = None
    status: str
    delivery_latitude: Optional[Decimal] = None
    delivery_longitude: Optional[Decimal] = None
    assigned_at: Optional[datetime] = None
    pickup_time: Optional[datetime] = None
    delivery_time: Optional[datetime] = None
    signature: Optional[str] = None
    photo_proof: Optional[str] = None
    recipient_name: Optional[str] = None
    notes: Optional[str] = None
    failure_reason: Optional[str] = None
    tracking_url: Optional[str] = None
    last_location_latitude: Optional[Decimal] = None
    last_location_longitude: Optional[Decimal] = None
    last_location_update: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


# ============ DELIVERY ROUTE SCHEMAS ============

class DeliveryRouteBase(BaseModel):
    """Schéma de base pour une tournée de livraison"""
    delivery_date: date
    planned_start_time: Optional[time] = None
    planned_end_time: Optional[time] = None
    start_location_name: Optional[str] = Field(None, max_length=100)
    start_latitude: Optional[Decimal] = None
    start_longitude: Optional[Decimal] = None
    end_location_name: Optional[str] = Field(None, max_length=100)
    end_latitude: Optional[Decimal] = None
    end_longitude: Optional[Decimal] = None
    notes: Optional[str] = None


class DeliveryRouteCreate(DeliveryRouteBase):
    """Schéma pour créer une tournée de livraison"""
    driver_id: int
    delivery_ids: List[int] = []  # Liste des IDs de livraisons à inclure


class DeliveryRouteUpdate(BaseModel):
    """Schéma pour mettre à jour une tournée"""
    status: Optional[str] = Field(
        None,
        pattern="^(planned|in_progress|completed|cancelled)$"
    )
    planned_start_time: Optional[time] = None
    planned_end_time: Optional[time] = None
    notes: Optional[str] = None


class DeliveryRouteOptimize(BaseModel):
    """Schéma pour demander l'optimisation d'une tournée"""
    delivery_ids: List[int]
    start_latitude: Decimal
    start_longitude: Decimal
    end_latitude: Optional[Decimal] = None
    end_longitude: Optional[Decimal] = None


class DeliveryRouteItemBase(BaseModel):
    """Schéma de base pour un élément de tournée"""
    sequence: int = Field(..., ge=1)
    estimated_arrival: Optional[datetime] = None
    distance_from_previous_km: Optional[Decimal] = None


class DeliveryRouteItem(DeliveryRouteItemBase):
    """Schéma complet d'un élément de tournée"""
    id: int
    route_id: int
    delivery_id: int
    actual_arrival: Optional[datetime] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class DeliveryRoute(DeliveryRouteBase):
    """Schéma complet d'une tournée de livraison"""
    id: int
    driver_id: int
    status: str
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    optimized_route: Optional[Dict[str, Any]] = None
    total_distance_km: Optional[Decimal] = None
    estimated_duration_minutes: Optional[int] = None
    total_deliveries: int
    successful_deliveries: int
    failed_deliveries: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[DeliveryRouteItem] = []
    
    model_config = ConfigDict(from_attributes=True)


# ============ DELIVERY DRIVER SCHEMAS ============

class DeliveryDriverBase(BaseModel):
    """Schéma de base pour un livreur"""
    vehicle_type: Optional[str] = Field(None, pattern="^(car|bike|scooter|van)$")
    vehicle_plate: Optional[str] = Field(None, max_length=20)
    vehicle_capacity_kg: Optional[Decimal] = Field(None, ge=0)
    is_available: bool = True
    working_zones: Optional[List[int]] = None  # IDs des zones de travail


class DeliveryDriverCreate(DeliveryDriverBase):
    """Schéma pour créer un profil de livreur"""
    user_id: int
    license_number: Optional[str] = Field(None, max_length=50)
    license_expiry: Optional[date] = None
    insurance_number: Optional[str] = Field(None, max_length=50)
    insurance_expiry: Optional[date] = None


class DeliveryDriverUpdate(BaseModel):
    """Schéma pour mettre à jour un profil de livreur"""
    vehicle_type: Optional[str] = None
    vehicle_plate: Optional[str] = None
    vehicle_capacity_kg: Optional[Decimal] = None
    is_available: Optional[bool] = None
    working_zones: Optional[List[int]] = None
    license_number: Optional[str] = None
    license_expiry: Optional[date] = None
    insurance_number: Optional[str] = None
    insurance_expiry: Optional[date] = None


class DeliveryDriver(DeliveryDriverBase):
    """Schéma complet d'un livreur"""
    id: int
    user_id: int
    is_verified: bool
    average_rating: Optional[Decimal] = None
    total_deliveries: int
    successful_deliveries: int
    license_number: Optional[str] = None
    license_expiry: Optional[date] = None
    insurance_number: Optional[str] = None
    insurance_expiry: Optional[date] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


# ============ RESPONSE SCHEMAS ============

class DeliveryZoneWithSchedules(DeliveryZone):
    """Zone de livraison avec ses créneaux horaires"""
    schedules: List[DeliverySchedule] = []


class DeliveryWithDetails(Delivery):
    """Livraison avec détails complets"""
    zone: Optional[DeliveryZone] = None
    # order: Optional[Order] = None  # À décommenter si vous importez Order


class DeliveryRouteWithDeliveries(DeliveryRoute):
    """Tournée avec toutes ses livraisons"""
    deliveries: List[Delivery] = []


class DeliveryStats(BaseModel):
    """Statistiques de livraison"""
    total_deliveries: int
    pending_deliveries: int
    in_transit_deliveries: int
    completed_deliveries: int
    failed_deliveries: int
    success_rate: Decimal
    average_delivery_time_minutes: Optional[int] = None
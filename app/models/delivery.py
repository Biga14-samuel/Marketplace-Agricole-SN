from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey,
    Numeric, Text, Date, Time, func
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.core.database import Base


class DeliveryZone(Base):
    """
    Zones de livraison pour les producteurs.
    Permet de définir les zones géographiques où le producteur livre.
    """
    __tablename__ = "delivery_zones"
    
    id = Column(Integer, primary_key=True, index=True)
    producer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)  # Ex: "Centre-ville", "Banlieue Sud"
    
    # Définition géographique de la zone
    postal_codes = Column(JSONB, nullable=True)  # Liste de codes postaux: ["75001", "75002"]
    radius_km = Column(Numeric(5, 2), nullable=True)  # Rayon en km depuis un point central
    center_latitude = Column(Numeric(10, 8), nullable=True)  # Coordonnées du centre
    center_longitude = Column(Numeric(11, 8), nullable=True)
    
    # Conditions de livraison
    min_order_amount = Column(Numeric(10, 2), nullable=True)  # Montant minimum de commande
    delivery_fee = Column(Numeric(10, 2), nullable=False, default=0)  # Frais de livraison
    free_delivery_threshold = Column(Numeric(10, 2), nullable=True)  # Seuil pour livraison gratuite
    
    # Délai de livraison
    estimated_delivery_days = Column(Integer, nullable=True)  # Délai estimé en jours
    
    is_active = Column(Boolean, nullable=False, default=True)
    
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relations
    # Le producteur qui gère cette zone
    producer = relationship("User", foreign_keys=[producer_id], back_populates="delivery_zones")
    
    # Les horaires de livraison pour cette zone
    schedules = relationship("DeliverySchedule", back_populates="zone", cascade="all, delete-orphan")
    
    # Les livraisons effectuées dans cette zone
    deliveries = relationship("Delivery", back_populates="zone")


class DeliverySchedule(Base):
    """
    Planning des livraisons pour une zone.
    Définit les créneaux de livraison disponibles.
    """
    __tablename__ = "delivery_schedules"
    
    id = Column(Integer, primary_key=True, index=True)
    delivery_zone_id = Column(Integer, ForeignKey("delivery_zones.id", ondelete="CASCADE"), nullable=False)
    
    # Jour de la semaine (0 = Lundi, 6 = Dimanche)
    day_of_week = Column(Integer, nullable=False)  # 0-6
    
    # Créneau horaire
    time_slot_start = Column(Time, nullable=False)  # Ex: 09:00
    time_slot_end = Column(Time, nullable=False)    # Ex: 12:00
    
    # Capacité
    max_orders = Column(Integer, nullable=True)  # Nombre max de commandes pour ce créneau
    max_weight_kg = Column(Numeric(8, 2), nullable=True)  # Poids max total en kg
    
    is_active = Column(Boolean, nullable=False, default=True)
    
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    
    # Relations
    zone = relationship("DeliveryZone", back_populates="schedules")


class Delivery(Base):
    """
    Livraison d'une commande.
    Suit le statut et les détails de chaque livraison.
    """
    __tablename__ = "deliveries"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, unique=True)
    delivery_zone_id = Column(Integer, ForeignKey("delivery_zones.id", ondelete="SET NULL"), nullable=True)
    driver_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Statut de la livraison
    status = Column(
        String(20),
        nullable=False,
        default="pending"
    )  # pending, assigned, in_transit, delivered, failed, cancelled
    
    # Informations de livraison
    scheduled_date = Column(Date, nullable=True)  # Date prévue
    scheduled_time_slot = Column(String(50), nullable=True)  # "09:00-12:00"
    
    # Adresse de livraison (dénormalisée pour historique)
    delivery_address = Column(Text, nullable=False)
    delivery_city = Column(String(100), nullable=False)
    delivery_postal_code = Column(String(20), nullable=False)
    delivery_country = Column(String(100), nullable=False, default="France")
    
    # Coordonnées pour optimisation de tournée
    delivery_latitude = Column(Numeric(10, 8), nullable=True)
    delivery_longitude = Column(Numeric(11, 8), nullable=True)
    
    # Instructions spéciales
    delivery_instructions = Column(Text, nullable=True)  # "Code porte: 1234, 2ème étage"
    
    # Horaires réels
    assigned_at = Column(DateTime, nullable=True)  # Quand assigné au livreur
    pickup_time = Column(DateTime, nullable=True)  # Quand récupéré par le livreur
    delivery_time = Column(DateTime, nullable=True)  # Quand effectivement livré
    
    # Preuves de livraison
    signature = Column(Text, nullable=True)  # Signature numérique (base64)
    photo_proof = Column(String(255), nullable=True)  # URL de la photo de preuve
    recipient_name = Column(String(100), nullable=True)  # Nom du destinataire
    
    # Notes et problèmes
    notes = Column(Text, nullable=True)  # Notes du livreur
    failure_reason = Column(Text, nullable=True)  # Raison en cas d'échec
    
    # Suivi GPS
    tracking_url = Column(String(255), nullable=True)
    last_location_latitude = Column(Numeric(10, 8), nullable=True)
    last_location_longitude = Column(Numeric(11, 8), nullable=True)
    last_location_update = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relations
    # La commande associée à cette livraison (relation one-to-one)
    order = relationship("Order", back_populates="delivery")
    
    # La zone de livraison
    zone = relationship("DeliveryZone", back_populates="deliveries")
    
    # Le livreur assigné
    driver = relationship("User", foreign_keys=[driver_id], back_populates="deliveries_as_driver")
    
    # Les items de tournée qui incluent cette livraison
    route_items = relationship("DeliveryRouteItem", back_populates="delivery", cascade="all, delete-orphan")


class DeliveryRoute(Base):
    """
    Tournée de livraison.
    Organise plusieurs livraisons en une tournée optimisée.
    """
    __tablename__ = "delivery_routes"
    
    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Date et statut
    delivery_date = Column(Date, nullable=False)
    status = Column(
        String(20),
        nullable=False,
        default="planned"
    )  # planned, in_progress, completed, cancelled
    
    # Planification
    planned_start_time = Column(Time, nullable=True)
    planned_end_time = Column(Time, nullable=True)
    
    # Exécution réelle
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Optimisation de la tournée
    optimized_route = Column(JSONB, nullable=True)  # Ordre optimisé des livraisons avec détails
    total_distance_km = Column(Numeric(8, 2), nullable=True)
    estimated_duration_minutes = Column(Integer, nullable=True)
    
    # Point de départ et d'arrivée
    start_location_name = Column(String(100), nullable=True)  # "Entrepôt Principal"
    start_latitude = Column(Numeric(10, 8), nullable=True)
    start_longitude = Column(Numeric(11, 8), nullable=True)
    
    end_location_name = Column(String(100), nullable=True)
    end_latitude = Column(Numeric(10, 8), nullable=True)
    end_longitude = Column(Numeric(11, 8), nullable=True)
    
    # Statistiques
    total_deliveries = Column(Integer, nullable=False, default=0)
    successful_deliveries = Column(Integer, nullable=False, default=0)
    failed_deliveries = Column(Integer, nullable=False, default=0)
    
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relations
    # Le livreur qui effectue cette tournée
    driver = relationship("User", foreign_keys=[driver_id], back_populates="delivery_routes")
    
    # Les livraisons dans l'ordre de la tournée
    items = relationship("DeliveryRouteItem", back_populates="route", cascade="all, delete-orphan", order_by="DeliveryRouteItem.sequence")


class DeliveryRouteItem(Base):
    """
    Table d'association entre DeliveryRoute et Delivery.
    Permet de gérer l'ordre des livraisons dans une tournée.
    """
    __tablename__ = "delivery_route_items"
    
    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("delivery_routes.id", ondelete="CASCADE"), nullable=False)
    delivery_id = Column(Integer, ForeignKey("deliveries.id", ondelete="CASCADE"), nullable=False)
    
    # Position dans la tournée (ordre de livraison)
    sequence = Column(Integer, nullable=False)
    
    # Horaires estimés pour cette étape
    estimated_arrival = Column(DateTime, nullable=True)
    actual_arrival = Column(DateTime, nullable=True)
    
    # Distance depuis l'étape précédente
    distance_from_previous_km = Column(Numeric(8, 2), nullable=True)
    
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    
    # Relations
    route = relationship("DeliveryRoute", back_populates="items")
    delivery = relationship("Delivery", back_populates="route_items")


class DeliveryDriver(Base):
    """
    Informations spécifiques aux livreurs.
    Extension du modèle User pour les livreurs.
    """
    __tablename__ = "delivery_drivers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    # Informations du véhicule
    vehicle_type = Column(String(50), nullable=True)  # "car", "bike", "scooter", "van"
    vehicle_plate = Column(String(20), nullable=True)
    vehicle_capacity_kg = Column(Numeric(8, 2), nullable=True)
    
    # Statut
    is_available = Column(Boolean, nullable=False, default=True)
    is_verified = Column(Boolean, nullable=False, default=False)
    
    # Zone de travail
    working_zones = Column(JSONB, nullable=True)  # Liste des IDs de zones où le livreur travaille
    
    # Évaluations
    average_rating = Column(Numeric(3, 2), nullable=True)
    total_deliveries = Column(Integer, nullable=False, default=0)
    successful_deliveries = Column(Integer, nullable=False, default=0)
    
    # Documents
    license_number = Column(String(50), nullable=True)
    license_expiry = Column(Date, nullable=True)
    insurance_number = Column(String(50), nullable=True)
    insurance_expiry = Column(Date, nullable=True)
    
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relations
    user = relationship("User", back_populates="driver_profile")
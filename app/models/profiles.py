from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Numeric, Time, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


# ============= Enums =============

class AddressType(str, enum.Enum):
    """Types d'adresses"""
    BILLING = "billing"
    DELIVERY = "delivery"


class DocumentType(str, enum.Enum):
    """Types de documents pour les producteurs"""
    KBIS = "kbis"
    INSURANCE = "insurance"
    CERTIFICATION = "certification"


class DayOfWeek(str, enum.Enum):
    """Jours de la semaine"""
    MONDAY = "monday"
    TUESDAY = "tuesday"
    WEDNESDAY = "wednesday"
    THURSDAY = "thursday"
    FRIDAY = "friday"
    SATURDAY = "saturday"
    SUNDAY = "sunday"


# ============= Customer Models =============

class CustomerProfile(Base):
    """Profil client - One-to-One avec User"""
    __tablename__ = "customer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    avatar = Column(String(500), nullable=True)  # URL de l'image de profil
    preferences = Column(JSON, nullable=True)  # Préférences stockées en JSON (bio, local, etc.)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relations
    user = relationship("User", backref="customer_profile", uselist=False)
    addresses = relationship("Address", back_populates="customer", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<CustomerProfile(id={self.id}, user_id={self.user_id}, name='{self.first_name} {self.last_name}')>"


class Address(Base):
    """Adresses multiples pour les clients"""
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    # Une adresse appartient à un profil client
    customer_profile_id = Column(Integer, ForeignKey("customer_profiles.id", ondelete='CASCADE'), nullable=False, index=True)
    
    type = Column(SQLEnum(AddressType), nullable=False)
    street = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    postal_code = Column(String(20), nullable=False)
    country = Column(String(100), nullable=False, default="Cameroun")
    is_default = Column(Boolean, default=False, nullable=False)
    
    # Coordonnées GPS au format "latitude,longitude"
    coordinates = Column(String(50), nullable=True)
    additional_info = Column(Text, nullable=True)  # Instructions supplémentaires
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relations
    customer = relationship("CustomerProfile", back_populates="addresses")

    def __repr__(self):
        return f"<Address(id={self.id}, type={self.type}, city='{self.city}')>"


# ============= Producer Models =============

class ProducerProfile(Base):
    """Profil producteur - One-to-One avec User"""
    __tablename__ = "producer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False, index=True)
    business_name = Column(String(255), nullable=False)  # Nom de la ferme/entreprise
    bio = Column(Text, nullable=True)  # Description de la ferme
    certifications = Column(JSON, nullable=True)  # Liste des certifications (Bio, Label Rouge, etc.)
    siret = Column(String(14), unique=True, nullable=True)  # Numéro SIRET (France/Cameroun)
    tva_number = Column(String(20), nullable=True)  # Numéro de TVA intracommunautaire
    iban = Column(String(34), nullable=True)  # IBAN pour les paiements
    farm_size = Column(Numeric(10, 2), nullable=True)  # Taille de la ferme en hectares
    production_type = Column(JSON, nullable=True)  # Types de production (légumes, fruits, viandes, etc.)
    avatar = Column(String(500), nullable=True)  # Logo de la ferme
    cover_image = Column(String(500), nullable=True)  # Image de couverture
    is_verified = Column(Boolean, default=False, nullable=False)  # Vérifié par l'admin
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relations
    user = relationship("User", backref="producer_profile", uselist=False)
    documents = relationship("ProducerDocument", back_populates="producer", cascade="all, delete-orphan")
    schedules = relationship("ProducerSchedule", back_populates="producer", cascade="all, delete-orphan")
    pickup_points = relationship("PickupPoint", back_populates="producer", cascade="all, delete-orphan")
    payouts = relationship("ProducerPayout", back_populates="producer", cascade="all, delete-orphan")
    reviews = relationship("ProducerReview", back_populates="producer", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<ProducerProfile(id={self.id}, business_name='{self.business_name}')>"


class ProducerDocument(Base):
    """Documents légaux des producteurs"""
    __tablename__ = "producer_documents"

    id = Column(Integer, primary_key=True, index=True)
    producer_id = Column(Integer, ForeignKey('producer_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    type = Column(SQLEnum(DocumentType), nullable=False)
    file_path = Column(String(500), nullable=False)  # Chemin du fichier uploadé
    original_filename = Column(String(255), nullable=True)
    verified = Column(Boolean, default=False, nullable=False)
    verified_by = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)  # Admin qui a vérifié
    verified_at = Column(DateTime, nullable=True)
    uploaded_at = Column(DateTime, server_default=func.now(), nullable=False)
    expires_at = Column(DateTime, nullable=True)  # Date d'expiration du document (ex: assurance)

    # Relations
    producer = relationship("ProducerProfile", back_populates="documents")

    def __repr__(self):
        return f"<ProducerDocument(id={self.id}, type={self.type}, verified={self.verified})>"


class ProducerSchedule(Base):
    """Horaires d'ouverture des producteurs"""
    __tablename__ = "producer_schedules"

    id = Column(Integer, primary_key=True, index=True)
    producer_id = Column(Integer, ForeignKey('producer_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    day_of_week = Column(SQLEnum(DayOfWeek), nullable=False)
    open_time = Column(Time, nullable=False)
    close_time = Column(Time, nullable=False)
    is_closed = Column(Boolean, default=False, nullable=False)  # Fermé ce jour-là
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relations
    producer = relationship("ProducerProfile", back_populates="schedules")

    def __repr__(self):
        return f"<ProducerSchedule(id={self.id}, day={self.day_of_week}, {self.open_time}-{self.close_time})>"


class PickupPoint(Base):
    """Points de retrait des commandes"""
    __tablename__ = "pickup_points"

    id = Column(Integer, primary_key=True, index=True)
    producer_id = Column(Integer, ForeignKey('producer_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    name = Column(String(255), nullable=False)  # Nom du point de retrait
    address = Column(Text, nullable=False)  # Adresse complète
    city = Column(String(100), nullable=False)
    postal_code = Column(String(20), nullable=False)
    
    # Coordonnées GPS au format "latitude,longitude"
    coordinates = Column(String(50), nullable=True)
    instructions = Column(Text, nullable=True)  # Instructions pour trouver le lieu
    is_active = Column(Boolean, default=True, nullable=False)
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relations
    producer = relationship("ProducerProfile", back_populates="pickup_points")
    pickup_slots = relationship("PickupSlot", back_populates="pickup_point", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<PickupPoint(id={self.id}, name='{self.name}', city='{self.city}')>"


class PickupSlot(Base):
    """Créneaux horaires pour les points de retrait"""
    __tablename__ = "pickup_slots"

    id = Column(Integer, primary_key=True, index=True) 
    pickup_point_id = Column(Integer, ForeignKey('pickup_points.id', ondelete='CASCADE'), nullable=False, index=True)
    day_of_week = Column(SQLEnum(DayOfWeek), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    max_orders = Column(Integer, nullable=False, default=10)  # Nombre maximum de commandes par créneau
    current_orders = Column(Integer, nullable=False, default=0)  # Nombre actuel de commandes
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relations
    pickup_point = relationship("PickupPoint", back_populates="pickup_slots")

    def __repr__(self):
        return f"<PickupSlot(id={self.id}, day={self.day_of_week}, {self.start_time}-{self.end_time}, {self.current_orders}/{self.max_orders})>"
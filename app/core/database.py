from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings
import os

# Désactiver echo pendant les tests
is_testing = os.getenv("PYTEST_CURRENT_TEST") is not None

# Création du moteur de base de données
# Configuration du pool de connexions pour PostgreSQL
if "postgresql" in settings.DATABASE_URL:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        echo=settings.DEBUG and not is_testing,
        pool_size=10,
        max_overflow=20,
        pool_recycle=3600,  # Recycler les connexions après 1 heure
        pool_timeout=30
    )
else:
    # Configuration pour SQLite (tests)
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        echo=settings.DEBUG and not is_testing,
        connect_args={"check_same_thread": False}
    )

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Nouvelle syntaxe SQLAlchemy 2.0 pour la Base
class Base(DeclarativeBase):
    """Classe de base pour tous les modèles de l'application"""
    pass

# Dependency pour FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
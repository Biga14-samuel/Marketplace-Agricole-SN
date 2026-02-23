from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.init_roles import init_roles
from app.core.init_catalog import init_catalog

# --- IMPORT DES MODÈLES (Pour enregistrement dans Base.metadata) ---
import app.models 

# --- IMPORT DES ROUTERS ---
from app.routers import (
    auth_router,
    customer_profile_router,
    producer_profile_router,
    product_router,
    order_router,
    reviews,
    communication as communication_router,
    payments as payments_router,
    promotions,
    analytics as analytics_router,
    subscriptions as subscriptions_router,
    delivery,
    wishlist,
    event,
    admin,
    cms as cms_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gère le démarrage et l'arrêt de l'application (Initialisation DB)."""
    db = SessionLocal()
    try:
        init_roles(db)
        init_catalog(db)
    finally:
        db.close()
    yield 

# Initialisation de l'API
app = FastAPI(
    title=settings.APP_NAME, 
    version="1.1.6", 
    lifespan=lifespan,
    description="Marketplace Agricole - Système de gestion et abonnements"
)

# Configuration des timeouts pour éviter les blocages
import uvicorn
from fastapi.middleware.trustedhost import TrustedHostMiddleware

# Ajouter un middleware pour gérer les timeouts
@app.middleware("http")
async def timeout_middleware(request, call_next):
    import asyncio
    try:
        # Timeout de 180 secondes (3 minutes) pour toutes les requêtes
        response = await asyncio.wait_for(call_next(request), timeout=180.0)
        return response
    except asyncio.TimeoutError:
        from fastapi import HTTPException
        raise HTTPException(status_code=408, detail="Request timeout")

# Affichage de debug utile pour les problèmes d'envoi d'emails (NE PAS afficher le mot de passe)
print("[startup] SKIP_EMAIL_VERIFICATION=", settings.SKIP_EMAIL_VERIFICATION)
print("[startup] MAIL_USERNAME=", settings.MAIL_USERNAME)
print("[startup] MAIL_FROM=", settings.MAIL_FROM)
print("[startup] FRONTEND_URL=", settings.FRONTEND_URL)

# --- CONFIGURATION CORS ---
# Configuration CORS sécurisée avec variables d'environnement
allowed_origins = [
    "http://localhost:5173",  # Frontend dev
    "http://localhost:5174",  # Frontend dev (alternative port)
    "http://localhost:3000",  # Alternative frontend port
]

# En production, ajouter les domaines autorisés via une variable d'environnement
if hasattr(settings, 'ALLOWED_ORIGINS') and settings.ALLOWED_ORIGINS:
    allowed_origins.extend(settings.ALLOWED_ORIGINS.split(','))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# --- INCLUSION DES ROUTERS ---

# Administration Système
app.include_router(
    admin.router,
    prefix=f"{settings.API_V1_PREFIX}/admin",
    tags=["Administration"]
)

# Authentification & Utilisateurs
app.include_router(
    auth_router.router,
    prefix=f"{settings.API_V1_PREFIX}/authentification",
    tags=["Authentication"]
)

app.include_router(
    customer_profile_router.router,
    prefix=f"{settings.API_V1_PREFIX}/customer-profiles",
    tags=["Customer Profiles"]
)

app.include_router(
    producer_profile_router.router,
    prefix=f"{settings.API_V1_PREFIX}/producer-profiles",
    tags=["Producer Profiles"]
)

# Catalogue & Commerce
app.include_router(
    product_router.router,
    prefix=f"{settings.API_V1_PREFIX}/products-catalog",
    tags=["Products & Catalog"]
)

app.include_router(
    order_router.router,
    prefix=f"{settings.API_V1_PREFIX}/orders",
    tags=["Orders"]
)

# Marketing & Finance
app.include_router(
    payments_router.router,
    prefix=f"{settings.API_V1_PREFIX}/payments",
    tags=["Payments & Invoices"]
)

app.include_router(
    promotions.router,
    prefix=f"{settings.API_V1_PREFIX}/promotions",
    tags=["Promotions"]
)

app.include_router(
    reviews.router,
    prefix=f"{settings.API_V1_PREFIX}/reviews",
    tags=["Product Reviews"]
)

# Communication & Analytics
app.include_router(
    communication_router.router,
    prefix=f"{settings.API_V1_PREFIX}/communication",
    tags=["Communication"]
)

app.include_router(
    analytics_router.router,
    prefix=f"{settings.API_V1_PREFIX}/analytics",
    tags=["Analytics"]
)

# Abonnements
app.include_router(
    subscriptions_router.router,
    prefix=f"{settings.API_V1_PREFIX}/subscription",
    tags=["Subscriptions"]
)

# Livraison & Listes
app.include_router(
    delivery.router,
    prefix=f"{settings.API_V1_PREFIX}/delivery",
    tags=["Delivery"]
)

app.include_router(
    wishlist.router,
    prefix=f"{settings.API_V1_PREFIX}/wishlist",
    tags=["Wishlist"]
)

app.include_router(
    event.router,
    prefix=f"{settings.API_V1_PREFIX}/events",
    tags=["Events"]
)

# CMS & Contenu
app.include_router(
    cms_router.router,
    prefix=f"{settings.API_V1_PREFIX}/cms",
    tags=["CMS & Content"]
)

@app.get("/", tags=["System"])
def read_root():
    return {
        "status": "online",
        "message": f"Bienvenue sur l'API de {settings.APP_NAME}",
        "docs": "/docs"
    }
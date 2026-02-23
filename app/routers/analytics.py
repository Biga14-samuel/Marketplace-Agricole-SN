from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, timedelta

from app.core import deps
from app.core.database import get_db
from app.models.auth import User
from app.schemas.analytics import (
    ProductViewCreate, ProductViewResponse, SearchQueryCreate, SearchQueryResponse,
    PopularSearchTerm, DashboardMetricCreate, DashboardMetricResponse, MetricSummary,
    SalesReportCreate, SalesReportResponse,
    InventoryReportResponse
)
from app.services.analytics_service import (
    ProductViewService, SearchQueryService, DashboardMetricService,
    SalesReportService, InventoryReportService
)
from app.models.analytics import EntityType, MetricPeriod


router = APIRouter(prefix="", tags=["analytics"])


# ============================================================================
# DÉPENDANCES
# ============================================================================
# Les dépendances d'authentification sont maintenant dans app.core.deps

def get_current_producer_id(
    current_user: User = Depends(deps.get_current_active_user),
    db: Session = Depends(get_db)
) -> Optional[int]:
    """Récupère l'ID du producteur depuis le profil utilisateur"""
    from app.repositories.profile_repository import ProducerProfileRepository
    repo = ProducerProfileRepository(db)
    profile = repo.get_by_user_id(current_user.id)
    return profile.id if profile else None


# ============================================================================
# ROUTES PRODUCTVIEW - Tracking des vues de produits
# ============================================================================

@router.post("/views/track", response_model=ProductViewResponse, status_code=status.HTTP_201_CREATED)
def track_product_view(
    view_data: ProductViewCreate,
    db: Session = Depends(get_db)
):
    """
    Enregistre la vue d'un produit.
    
    Cette route doit être appelée chaque fois qu'un utilisateur consulte
    la page d'un produit. Elle permet de construire des statistiques précises
    sur les produits les plus consultés et le comportement des visiteurs.
    
    Le tracking peut se faire pour un utilisateur connecté (user_id) ou
    un visiteur anonyme (session_id). Le referrer permet de savoir d'où
    vient le trafic (moteur de recherche, réseaux sociaux, etc.).
    """
    service = ProductViewService(db)
    return service.track_view(view_data)


@router.get("/views/products/{product_id}")
def get_product_view_stats(
    product_id: int,
    start_date: Optional[date] = Query(None, description="Date de début (par défaut: 30 jours avant)"),
    end_date: Optional[date] = Query(None, description="Date de fin (par défaut: aujourd'hui)"),
    db: Session = Depends(get_db)
):
    """
    Récupère les statistiques de vue d'un produit.
    
    Cette route fournit une analyse complète des vues d'un produit incluant :
    - Le nombre total de vues
    - Le nombre de visiteurs uniques
    - L'évolution des vues jour par jour
    
    Ces données permettent de comprendre l'intérêt porté au produit et
    d'identifier les pics de trafic.
    """
    service = ProductViewService(db)
    return service.get_product_stats(product_id, start_date, end_date)


@router.get("/views/top-products")
def get_top_viewed_products(
    limit: int = Query(10, ge=1, le=50, description="Nombre de produits à retourner"),
    start_date: Optional[date] = Query(None, description="Date de début"),
    end_date: Optional[date] = Query(None, description="Date de fin"),
    db: Session = Depends(get_db)
):
    """
    Récupère les produits les plus consultés.
    
    Cette analyse identifie les produits qui attirent le plus l'attention
    des visiteurs. Ces informations peuvent guider :
    - Les décisions de merchandising (mise en avant des produits populaires)
    - Les campagnes marketing (focus sur les produits à fort potentiel)
    - L'optimisation du catalogue (analyse pourquoi certains produits attirent plus)
    """
    service = ProductViewService(db)
    return service.get_top_products(limit, start_date, end_date)


# ============================================================================
# ROUTES SEARCHQUERY - Tracking des recherches
# ============================================================================

@router.post("/search/track", response_model=SearchQueryResponse, status_code=status.HTTP_201_CREATED)
def track_search(
    search_data: SearchQueryCreate,
    db: Session = Depends(get_db)
):
    """
    Enregistre une recherche effectuée par un utilisateur.
    
    Cette route doit être appelée chaque fois qu'un utilisateur effectue
    une recherche sur la plateforme. Elle capture :
    - Le terme de recherche exact
    - Le nombre de résultats trouvés
    - Si l'utilisateur a cliqué sur un résultat (et lequel)
    
    Ces données permettent d'améliorer l'algorithme de recherche et de
    comprendre ce que les utilisateurs cherchent.
    """
    service = SearchQueryService(db)
    return service.track_search(search_data)


@router.get("/search/popular", response_model=List[PopularSearchTerm])
def get_popular_searches(
    limit: int = Query(20, ge=1, le=100, description="Nombre de termes à retourner"),
    days: int = Query(30, ge=1, le=365, description="Période en jours"),
    db: Session = Depends(get_db)
):
    """
    Récupère les termes de recherche les plus populaires.
    
    Cette analyse révèle ce que les utilisateurs cherchent le plus
    fréquemment. Le taux de clic (click-through rate) indique si les
    résultats de recherche sont pertinents pour chaque terme.
    
    Un taux de clic faible pour un terme populaire indique que
    l'algorithme de recherche doit être amélioré pour ce terme.
    """
    service = SearchQueryService(db)
    return service.get_popular_searches(limit, days)


@router.get("/search/failed")
def get_failed_searches(
    limit: int = Query(20, ge=1, le=100),
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """
    Récupère les recherches qui n'ont retourné aucun résultat.
    
    Ces données sont précieuses car elles identifient ce que les utilisateurs
    cherchent mais ne trouvent pas. Cela peut révéler :
    - Des opportunités d'enrichir le catalogue avec de nouveaux produits
    - Des problèmes avec l'algorithme de recherche (mauvais matching)
    - Des variations orthographiques à prendre en compte
    """
    service = SearchQueryService(db)
    return service.get_failed_searches(limit, days)


@router.get("/search/analytics")
def get_search_analytics(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """
    Récupère des statistiques générales sur les recherches.
    
    Cette route fournit une vue d'ensemble de l'efficacité du système
    de recherche avec des métriques clés :
    - Nombre total de recherches
    - Taux de succès (recherches avec résultats / total)
    - Taux de clic (recherches avec clic / total)
    
    Ces métriques permettent de suivre l'amélioration du système de
    recherche dans le temps.
    """
    service = SearchQueryService(db)
    return service.get_search_analytics(days)


# ============================================================================
# ROUTES DASHBOARDMETRIC - Métriques de tableaux de bord
# ============================================================================

@router.post("/metrics", response_model=DashboardMetricResponse, status_code=status.HTTP_201_CREATED)
def create_metric(
    metric_data: DashboardMetricCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.require_admin)
):
    """
    Crée ou met à jour une métrique de tableau de bord.
    
    Cette route est réservée aux administrateurs et aux jobs automatisés.
    Elle permet de stocker des métriques pré-calculées pour un affichage
    rapide dans les dashboards.
    
    Les métriques sont généralement calculées périodiquement (chaque nuit)
    pour tous les produits, producteurs et catégories.
    """
    service = DashboardMetricService(db)
    return service.create_or_update_metric(metric_data)


@router.get("/metrics/{entity_type}/{entity_id}", response_model=MetricSummary)
def get_entity_metrics(
    entity_type: EntityType,
    entity_id: int,
    period: MetricPeriod = Query(MetricPeriod.DAY, description="Période d'agrégation"),
    days: int = Query(30, ge=1, le=365, description="Nombre de jours à inclure"),
    db: Session = Depends(get_db)
):
    """
    Récupère toutes les métriques d'une entité pour son dashboard.
    
    Cette route retourne un résumé complet des performances d'une entité
    (produit, producteur ou catégorie) incluant toutes les métriques
    disponibles : vues, ventes, revenus, taux de conversion, etc.
    
    Le paramètre 'period' détermine la granularité des données :
    - DAY : métriques quotidiennes
    - WEEK : métriques hebdomadaires
    - MONTH : métriques mensuelles
    - YEAR : métriques annuelles
    """
    service = DashboardMetricService(db)
    return service.get_entity_dashboard(entity_type, entity_id, period, days)


@router.post("/metrics/calculate/product/{product_id}")
def calculate_product_metrics(
    product_id: int,
    metric_date: date = Query(..., description="Date pour laquelle calculer les métriques"),
    period: MetricPeriod = Query(MetricPeriod.DAY),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.require_admin)
):
    """
    Calcule et stocke toutes les métriques d'un produit pour une date.
    
    Cette route est utilisée par les jobs automatisés pour recalculer
    les métriques quotidiennes. Elle analyse les données brutes (vues,
    commandes) et génère les métriques agrégées.
    
    Réservé aux administrateurs et aux processus automatisés.
    """
    service = DashboardMetricService(db)
    return service.calculate_product_metrics(product_id, metric_date, period)


# ============================================================================
# ROUTES SALESREPORT - Rapports de ventes
# ============================================================================

@router.post("/reports/sales", response_model=SalesReportResponse, status_code=status.HTTP_201_CREATED)
def generate_sales_report(
    report_data: SalesReportCreate,
    db: Session = Depends(get_db),
    current_producer_id: Optional[int] = Depends(get_current_producer_id),
    current_user: User = Depends(deps.require_admin)
):
    """
    Génère un rapport de ventes pour un producteur sur une période.
    
    Cette route analyse toutes les commandes d'un producteur sur la période
    spécifiée et calcule automatiquement :
    - Le nombre de commandes
    - Le chiffre d'affaires total
    - La commission de la plateforme
    - Le revenu net du producteur
    - Le nombre de produits vendus
    - Le panier moyen
    
    Un producteur ne peut générer que ses propres rapports, sauf les admins
    qui peuvent générer des rapports pour n'importe quel producteur.
    """
    # Vérifier les permissions
    is_admin_user = current_user.has_role("admin") or current_user.has_role("superadmin")
    if not is_admin_user and current_producer_id != report_data.producer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez générer que vos propres rapports"
        )
    
    service = SalesReportService(db)
    return service.generate_report(report_data)


@router.get("/reports/sales/{report_id}", response_model=SalesReportResponse)
def get_sales_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
    current_producer_id: Optional[int] = Depends(get_current_producer_id)
):
    """
    Récupère un rapport de ventes spécifique.
    
    Cette route permet de consulter les détails complets d'un rapport
    de ventes existant. Les producteurs ne peuvent accéder qu'à leurs
    propres rapports.
    """
    service = SalesReportService(db)
    is_admin_user = current_user.has_role("admin") or current_user.has_role("superadmin")
    return service.get_report(report_id, current_producer_id if not is_admin_user else None)


@router.get("/reports/sales/producer/{producer_id}", response_model=List[SalesReportResponse])
def get_producer_sales_reports(
    producer_id: int,
    start_date: Optional[date] = Query(None, description="Date de début de la période"),
    end_date: Optional[date] = Query(None, description="Date de fin de la période"),
    db: Session = Depends(get_db),
    current_producer_id: Optional[int] = Depends(get_current_producer_id),
    current_user: User = Depends(deps.require_admin)
):
    """
    Récupère tous les rapports de ventes d'un producteur.
    
    Cette route retourne l'historique complet des rapports de ventes
    d'un producteur, permettant de suivre l'évolution de son activité
    dans le temps.
    
    Utile pour :
    - Analyser les tendances de vente
    - Comparer les performances entre périodes
    - Préparer la comptabilité
    - Suivre la croissance de l'activité
    """
    # Vérifier les permissions
    is_admin_user = current_user.has_role("admin") or current_user.has_role("superadmin")
    if not is_admin_user and current_producer_id != producer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez accéder qu'à vos propres rapports"
        )
    
    service = SalesReportService(db)
    return service.get_producer_reports(producer_id, start_date, end_date)


# ============================================================================
# ROUTES INVENTORYREPORT - Rapports d'inventaire
# ============================================================================

@router.post("/reports/inventory/generate/{producer_id}")
def generate_inventory_reports(
    producer_id: int,
    report_date: date = Query(..., description="Date pour laquelle générer les rapports"),
    db: Session = Depends(get_db),
    current_producer_id: Optional[int] = Depends(get_current_producer_id),
    current_user: User = Depends(deps.require_admin)
):
    """
    Génère les rapports d'inventaire quotidiens pour un producteur.
    
    Cette route crée un rapport d'inventaire pour chaque produit actif
    du producteur à la date spécifiée. Chaque rapport inclut :
    - Le stock de début de journée
    - Les quantités reçues (réapprovisionnements)
    - Les quantités vendues
    - Les ajustements manuels
    - Le stock de fin de journée
    - La valeur financière du stock
    
    Typiquement exécutée automatiquement chaque nuit par un job planifié.
    """
    # Vérifier les permissions
    is_admin_user = current_user.has_role("admin") or current_user.has_role("superadmin")
    if not is_admin_user and current_producer_id != producer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez générer que vos propres rapports"
        )
    
    service = InventoryReportService(db)
    reports = service.generate_daily_reports(producer_id, report_date)
    
    return {
        "producer_id": producer_id,
        "report_date": report_date,
        "reports_generated": len(reports),
        "reports": reports
    }


@router.get("/reports/inventory/product/{product_id}", response_model=List[InventoryReportResponse])
def get_product_inventory_history(
    product_id: int,
    start_date: Optional[date] = Query(None, description="Date de début"),
    end_date: Optional[date] = Query(None, description="Date de fin"),
    db: Session = Depends(get_db)
):
    """
    Récupère l'historique d'inventaire d'un produit.
    
    Cette route retourne tous les rapports d'inventaire quotidiens d'un
    produit sur la période spécifiée. Cela permet de :
    - Visualiser l'évolution du stock dans le temps
    - Analyser les tendances de vente
    - Détecter les anomalies dans les mouvements de stock
    - Planifier les réapprovisionnements
    
    Les données peuvent être utilisées pour créer des graphiques d'évolution
    du stock et identifier les patterns de consommation.
    """
    service = InventoryReportService(db)
    return service.get_product_inventory_history(product_id, start_date, end_date)


@router.get("/reports/inventory/low-stock/{producer_id}")
def get_low_stock_alerts(
    producer_id: int,
    threshold: int = Query(10, ge=0, le=1000, description="Seuil d'alerte de stock"),
    db: Session = Depends(get_db),
    current_producer_id: Optional[int] = Depends(get_current_producer_id),
    current_user: User = Depends(deps.require_admin)
):
    """
    Identifie les produits avec un stock faible nécessitant un réapprovisionnement.
    
    Cette route analyse les derniers rapports d'inventaire du producteur
    et identifie tous les produits dont le stock est inférieur ou égal
    au seuil spécifié.
    
    C'est un outil crucial pour la gestion proactive de l'inventaire,
    permettant d'éviter les ruptures de stock qui peuvent entraîner :
    - Des ventes perdues
    - Des clients insatisfaits
    - Une mauvaise réputation
    
    Le seuil peut être ajusté selon le délai de réapprovisionnement
    et le rythme de vente de chaque producteur.
    """
    # Vérifier les permissions
    is_admin_user = current_user.has_role("admin") or current_user.has_role("superadmin")
    if not is_admin_user and current_producer_id != producer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous ne pouvez accéder qu'à vos propres alertes"
        )
    
    service = InventoryReportService(db)
    low_stock_products = service.get_low_stock_alert(producer_id, threshold)
    
    return {
        "producer_id": producer_id,
        "threshold": threshold,
        "products_count": len(low_stock_products),
        "products": low_stock_products
    }


# ============================================================================
# ROUTES ANALYTICS AVANCÉES - Analyses complètes et dashboards
# ============================================================================

@router.get("/dashboard/overview")
def get_dashboard_overview(
    entity_type: EntityType = Query(..., description="Type d'entité (product, producer, category)"),
    entity_id: int = Query(..., description="ID de l'entité"),
    days: int = Query(30, ge=1, le=365, description="Nombre de jours à analyser"),
    db: Session = Depends(get_db)
):
    """
    Récupère une vue d'ensemble complète pour un tableau de bord.
    
    Cette route agrège toutes les métriques importantes pour afficher un
    dashboard complet avec :
    - Revenus totaux
    - Nombre de commandes
    - Produits vendus
    - Vues totales
    - Panier moyen
    - Taux de conversion
    - Comparaison avec la période précédente (croissance)
    
    C'est le endpoint principal pour afficher un tableau de bord complet
    et informatif permettant de suivre les performances d'un coup d'œil.
    """
    # Cette route nécessiterait une implémentation plus complexe qui agrège
    # différents services. Pour l'instant, on retourne une structure de base.
    return {
        "entity_type": entity_type,
        "entity_id": entity_id,
        "period": {
            "start_date": date.today() - timedelta(days=days),
            "end_date": date.today()
        },
        "message": "Implémentation du dashboard overview à compléter"
    }
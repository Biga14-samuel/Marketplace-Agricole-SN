from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from decimal import Decimal

from app.models.analytics import EntityType, MetricName, MetricPeriod


# ============================================================================
# SCHÉMAS PRODUCTVIEW
# ============================================================================

class ProductViewBase(BaseModel):
    """
    Schéma de base pour l'enregistrement d'une vue de produit.
    
    Quand un utilisateur consulte un produit, on enregistre cette information
    pour analyser les tendances et comprendre quels produits attirent l'attention.
    """
    product_id: int = Field(..., gt=0, description="ID du produit consulté")
    referrer: Optional[str] = Field(None, max_length=500, description="URL de provenance du visiteur")


class ProductViewCreate(ProductViewBase):
    """
    Schéma pour créer un enregistrement de vue de produit.
    
    On peut enregistrer soit un utilisateur connecté (user_id), soit
    un visiteur anonyme (session_id). Au moins l'un des deux doit être présent.
    """
    user_id: Optional[int] = Field(None, gt=0, description="ID de l'utilisateur connecté")
    session_id: Optional[str] = Field(None, max_length=255, description="ID de session pour visiteurs anonymes")
    
    @field_validator('session_id')
    @classmethod
    def validate_user_or_session(cls, v, info):
        """
        Valide qu'au moins user_id ou session_id est fourni.
        
        Cette validation garantit qu'on peut toujours identifier le visiteur,
        même s'il n'est pas connecté, grâce à son ID de session.
        """
        user_id = info.data.get('user_id')
        if not user_id and not v:
            raise ValueError("user_id ou session_id doit être fourni")
        return v


class ProductViewResponse(ProductViewBase):
    """Schéma de réponse pour une vue de produit"""
    id: int
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    viewed_at: datetime
    
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

# ============================================================================
# SCHÉMAS SEARCHQUERY
# ============================================================================

class SearchQueryBase(BaseModel):
    """
    Schéma de base pour l'enregistrement d'une recherche.
    
    Chaque recherche effectuée sur la plateforme est enregistrée pour
    permettre l'analyse des comportements de recherche et l'amélioration
    de l'algorithme de pertinence.
    """
    query: str = Field(..., min_length=1, max_length=255, description="Terme de recherche saisi")
    results_count: int = Field(..., ge=0, description="Nombre de résultats trouvés")


class SearchQueryCreate(SearchQueryBase):
    """
    Schéma pour créer un enregistrement de recherche.
    
    Si l'utilisateur clique sur un produit dans les résultats, on enregistre
    lequel pour mesurer la pertinence des résultats de recherche.
    """
    user_id: Optional[int] = Field(None, gt=0, description="ID de l'utilisateur ayant effectué la recherche")
    clicked_product_id: Optional[int] = Field(None, gt=0, description="ID du produit cliqué dans les résultats")


class SearchQueryResponse(SearchQueryBase):
    """Schéma de réponse pour une recherche"""
    id: int
    user_id: Optional[int] = None
    clicked_product_id: Optional[int] = None
    searched_at: datetime
    
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class PopularSearchTerm(BaseModel):
    """
    Schéma pour les termes de recherche populaires.
    
    Utilisé pour afficher les recherches les plus fréquentes, ce qui peut
    aider à comprendre les tendances et à optimiser le catalogue de produits.
    """
    query: str
    search_count: int
    click_through_rate: Optional[float] = Field(None, description="Pourcentage de recherches ayant mené à un clic")


# ============================================================================
# SCHÉMAS DASHBOARDMETRIC
# ============================================================================

class DashboardMetricBase(BaseModel):
    """
    Schéma de base pour une métrique de tableau de bord.
    
    Les métriques pré-calculées permettent d'afficher rapidement les
    performances sans avoir à exécuter des requêtes complexes à chaque fois.
    """
    entity_type: EntityType = Field(..., description="Type d'entité (product, producer, category)")
    entity_id: int = Field(..., gt=0, description="ID de l'entité concernée")
    metric_name: MetricName = Field(..., description="Nom de la métrique (views, sales, revenue, etc.)")
    value: Decimal = Field(..., description="Valeur de la métrique")
    period: MetricPeriod = Field(..., description="Période de temps (day, week, month, year)")
    metric_date: date = Field(..., description="Date à laquelle s'applique cette métrique")


class DashboardMetricCreate(DashboardMetricBase):
    """Schéma pour créer une métrique de tableau de bord"""
    pass


class DashboardMetricUpdate(BaseModel):
    """
    Schéma pour mettre à jour une métrique existante.
    
    Généralement, on crée de nouvelles métriques plutôt que de mettre à jour
    les anciennes, mais ce schéma permet de corriger des erreurs si nécessaire.
    """
    value: Decimal


class DashboardMetricResponse(DashboardMetricBase):
    """Schéma de réponse pour une métrique"""
    id: int
    calculated_at: datetime
    
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class MetricSummary(BaseModel):
    """
    Résumé de métriques pour un tableau de bord.
    
    Ce schéma agrège plusieurs métriques pour donner une vue d'ensemble
    rapide des performances. Par exemple, les vues, ventes et revenus
    d'un produit sur le mois en cours.
    """
    entity_type: EntityType
    entity_id: int
    period: MetricPeriod
    metrics: Dict[str, Decimal] = Field(default_factory=dict, description="Dictionnaire métrique -> valeur")


# ============================================================================
# SCHÉMAS SALESREPORT
# ============================================================================

class SalesReportBase(BaseModel):
    """
    Schéma de base pour un rapport de ventes.
    
    Les rapports de ventes sont générés périodiquement pour donner aux
    producteurs une vue claire de leurs performances commerciales.
    """
    period_start: date = Field(..., description="Début de la période couverte")
    period_end: date = Field(..., description="Fin de la période couverte")
    
    @field_validator('period_end')
    @classmethod
    def validate_period(cls, v, info):
        """
        Valide que la date de fin est après la date de début.
        
        Cette validation évite la création de rapports avec des périodes
        invalides qui pourraient causer des erreurs dans les calculs.
        """
        period_start = info.data.get('period_start')
        if period_start and v < period_start:
            raise ValueError("period_end doit être après ou égal à period_start")
        return v


class SalesReportCreate(SalesReportBase):
    """
    Schéma pour créer un rapport de ventes.
    
    Lors de la création d'un rapport, on spécifie le producteur et la période.
    Les statistiques (commandes, revenus, etc.) sont calculées automatiquement
    en analysant les données de vente pour cette période.
    """
    producer_id: int = Field(..., gt=0, description="ID du producteur concerné")


class SalesReportResponse(SalesReportBase):
    """Schéma de réponse pour un rapport de ventes"""
    id: int
    producer_id: int
    total_orders: int = Field(..., description="Nombre total de commandes")
    total_revenue: Decimal = Field(..., description="Chiffre d'affaires brut")
    total_commission: Decimal = Field(..., description="Commission de la plateforme")
    net_revenue: Decimal = Field(..., description="Revenu net du producteur")
    total_products_sold: int = Field(..., description="Nombre total de produits vendus")
    average_order_value: Optional[Decimal] = Field(None, description="Valeur moyenne d'une commande")
    generated_at: datetime
    
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class SalesReportSummary(BaseModel):
    """
    Résumé de plusieurs rapports de ventes.
    
    Ce schéma permet d'afficher une vue d'ensemble sur plusieurs périodes,
    par exemple pour comparer les ventes mois par mois ou suivre l'évolution
    des performances dans le temps.
    """
    total_revenue: Decimal
    total_orders: int
    total_products_sold: int
    average_order_value: Decimal
    period_count: int = Field(..., description="Nombre de périodes incluses dans le résumé")


# ============================================================================
# SCHÉMAS INVENTORYREPORT
# ============================================================================

class InventoryReportBase(BaseModel):
    """
    Schéma de base pour un rapport d'inventaire.
    
    Ces rapports suivent quotidiennement les mouvements de stock pour chaque
    produit, permettant aux producteurs de garder une trace précise de leur
    inventaire et de détecter rapidement les anomalies.
    """
    product_id: int = Field(..., gt=0, description="ID du produit concerné")
    stock_start: int = Field(..., ge=0, description="Stock en début de journée")
    stock_received: int = Field(0, ge=0, description="Quantité reçue (réapprovisionnement)")
    stock_sold: int = Field(0, ge=0, description="Quantité vendue")
    stock_adjusted: int = Field(0, description="Ajustements manuels (peut être négatif)")
    stock_end: int = Field(..., ge=0, description="Stock en fin de journée")
    report_date: date = Field(..., description="Date du rapport")
    
    @field_validator('stock_end')
    @classmethod
    def validate_stock_calculation(cls, v, info):
        """
        Valide que le stock final correspond au calcul attendu.
        
        Le stock final devrait être égal à :
        stock_start + stock_received - stock_sold + stock_adjusted
        
        Cette validation détecte les erreurs de saisie ou de calcul.
        """
        stock_start = info.data.get('stock_start')
        stock_received = info.data.get('stock_received', 0)
        stock_sold = info.data.get('stock_sold', 0)
        stock_adjusted = info.data.get('stock_adjusted', 0)
        
        if stock_start is not None:
            expected = stock_start + stock_received - stock_sold + stock_adjusted
            if v != expected:
                raise ValueError(
                    f"stock_end ({v}) ne correspond pas au calcul attendu ({expected}). "
                    f"Vérifiez: stock_start({stock_start}) + received({stock_received}) "
                    f"- sold({stock_sold}) + adjusted({stock_adjusted})"
                )
        return v


class InventoryReportCreate(InventoryReportBase):
    """
    Schéma pour créer un rapport d'inventaire.
    
    Ces rapports sont généralement créés automatiquement à la fin de chaque
    journée, mais peuvent aussi être créés manuellement pour corriger ou
    compléter l'historique.
    """
    producer_id: int = Field(..., gt=0, description="ID du producteur concerné")
    stock_value: Optional[Decimal] = Field(None, ge=0, description="Valeur financière du stock final")


class InventoryReportResponse(InventoryReportBase):
    """Schéma de réponse pour un rapport d'inventaire"""
    id: int
    producer_id: int
    stock_value: Optional[Decimal] = None
    generated_at: datetime
    
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class InventoryMovementSummary(BaseModel):
    """
    Résumé des mouvements d'inventaire sur une période.
    
    Ce schéma agrège plusieurs rapports quotidiens pour donner une vue
    d'ensemble des mouvements de stock sur une semaine ou un mois.
    """
    product_id: int
    period_start: date
    period_end: date
    total_received: int = Field(..., description="Total des entrées de stock")
    total_sold: int = Field(..., description="Total des sorties de stock")
    total_adjusted: int = Field(..., description="Total des ajustements")
    stock_start: int = Field(..., description="Stock au début de la période")
    stock_end: int = Field(..., description="Stock à la fin de la période")
    average_daily_sales: float = Field(..., description="Moyenne des ventes quotidiennes")


# ============================================================================
# SCHÉMAS POUR LES ANALYTICS AVANCÉES
# ============================================================================

class AnalyticsPeriod(BaseModel):
    """
    Définition d'une période pour les requêtes analytiques.
    
    Ce schéma standardise la façon dont on spécifie des périodes de temps
    pour extraire des données analytiques. Il peut être réutilisé dans
    différents endpoints d'analytics.
    """
    start_date: date = Field(..., description="Date de début de la période")
    end_date: date = Field(..., description="Date de fin de la période")
    
    @field_validator('end_date')
    @classmethod
    def validate_dates(cls, v, info):
        """Valide que end_date est après start_date"""
        start_date = info.data.get('start_date')
        if start_date and v < start_date:
            raise ValueError("end_date doit être après ou égal à start_date")
        return v


class ProductPerformance(BaseModel):
    """
    Analyse de performance d'un produit.
    
    Ce schéma agrège différentes métriques pour donner une vue complète
    des performances d'un produit : vues, ventes, taux de conversion, etc.
    """
    product_id: int
    product_name: str
    total_views: int = Field(..., description="Nombre total de vues")
    total_sales: int = Field(..., description="Nombre total de ventes")
    total_revenue: Decimal = Field(..., description="Chiffre d'affaires généré")
    conversion_rate: float = Field(..., description="Taux de conversion (ventes/vues)")
    average_rating: Optional[float] = Field(None, description="Note moyenne du produit")
    period: AnalyticsPeriod


class ProducerPerformance(BaseModel):
    """
    Analyse de performance d'un producteur.
    
    Ce schéma fournit une vue d'ensemble des performances commerciales
    d'un producteur sur une période donnée, incluant ses ventes, son
    chiffre d'affaires, et ses produits les plus performants.
    """
    producer_id: int
    producer_name: str
    total_orders: int = Field(..., description="Nombre total de commandes")
    total_revenue: Decimal = Field(..., description="Chiffre d'affaires total")
    total_commission: Decimal = Field(..., description="Commission totale")
    net_revenue: Decimal = Field(..., description="Revenu net")
    active_products: int = Field(..., description="Nombre de produits actifs")
    top_products: List[Dict[str, Any]] = Field(default_factory=list, description="Produits les plus vendus")
    period: AnalyticsPeriod


class CategoryPerformance(BaseModel):
    """
    Analyse de performance d'une catégorie.
    
    Ce schéma permet de comprendre quelles catégories de produits
    sont les plus populaires et génèrent le plus de revenus.
    """
    category_id: int
    category_name: str
    total_products: int = Field(..., description="Nombre de produits dans la catégorie")
    total_views: int = Field(..., description="Nombre total de vues")
    total_sales: int = Field(..., description="Nombre total de ventes")
    total_revenue: Decimal = Field(..., description="Chiffre d'affaires total")
    period: AnalyticsPeriod


class DashboardOverview(BaseModel):
    """
    Vue d'ensemble complète pour un tableau de bord.
    
    Ce schéma agrège les métriques clés pour afficher un tableau de bord
    complet avec les KPIs principaux d'un producteur ou de la plateforme.
    """
    total_revenue: Decimal
    total_orders: int
    total_products_sold: int
    total_views: int
    average_order_value: Decimal
    conversion_rate: float
    period: AnalyticsPeriod
    
    # Métriques comparatives avec la période précédente
    revenue_growth: Optional[float] = Field(None, description="Croissance du CA en %")
    orders_growth: Optional[float] = Field(None, description="Croissance des commandes en %")
    views_growth: Optional[float] = Field(None, description="Croissance des vues en %")
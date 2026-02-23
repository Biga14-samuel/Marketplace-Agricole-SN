from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Date, Enum as SQLEnum, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base


# ============================================================================
# Définition des énumérations pour les métriques et périodes
# ============================================================================

class EntityType(str, enum.Enum):
    """
    Types d'entités pour lesquelles on peut calculer des métriques.
    
    Ces types permettent de catégoriser les données analytiques selon
    qu'elles concernent un produit spécifique, un producteur, ou une
    catégorie entière de produits. Cela facilite l'agrégation et la
    comparaison des performances à différents niveaux.
    """
    PRODUCT = "product"  # Métriques pour un produit spécifique
    PRODUCER = "producer"  # Métriques pour un producteur
    CATEGORY = "category"  # Métriques pour une catégorie de produits


class MetricName(str, enum.Enum):
    """
    Noms des métriques disponibles pour le suivi des performances.
    Chaque métrique représente un indicateur clé de performance (KPI)
    qui aide à comprendre le succès d'un produit, d'un producteur ou
    d'une catégorie. Ces métriques sont calculées et stockées pour
    permettre une analyse rapide sans recalcul constant.
    """
    VIEWS = "views"  # Nombre de fois qu'un élément a été vu
    SALES = "sales"  # Nombre de ventes réalisées
    REVENUE = "revenue"  # Revenu généré
    ORDERS = "orders"  # Nombre de commandes
    CONVERSION_RATE = "conversion_rate"  # Taux de conversion (vues -> ventes)


class MetricPeriod(str, enum.Enum):
    """
    Périodes de temps pour l'agrégation des métriques.
    
    Les métriques peuvent être calculées sur différentes périodes pour
    permettre une analyse à court terme (jour) ou à long terme (mois/année).
    Cela permet de détecter les tendances et les variations saisonnières.
    """
    DAY = "day"  # Métriques journalières
    WEEK = "week"  # Métriques hebdomadaires
    MONTH = "month"  # Métriques mensuelles
    YEAR = "year"  # Métriques annuelles


# ============================================================================
# MODÈLE PRODUCTVIEW : Suivi des vues de produits
# ============================================================================

class ProductView(Base):
    """
    Enregistre chaque fois qu'un produit est consulté par un utilisateur.
    
    Ce tracking est essentiel pour comprendre quels produits attirent
    l'attention des visiteurs. En analysant ces données, on peut identifier
    les produits populaires, optimiser le référencement, et détecter les
    produits qui génèrent beaucoup de vues mais peu de ventes (problème
    de prix ou de description par exemple).
    
    Le système enregistre à la fois les utilisateurs connectés (user_id)
    et les visiteurs anonymes (session_id) pour avoir une vue complète
    du trafic.
    """
    __tablename__ = "product_views"

    id = Column(Integer, primary_key=True, index=True)
    
    # Identification du produit consulté
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Identification du visiteur
    # Si l'utilisateur est connecté, user_id est renseigné
    # Sinon, on utilise session_id pour suivre les visiteurs anonymes
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    session_id = Column(String(255), nullable=True, index=True)  # Pour les utilisateurs non connectés
    
    # Provenance du trafic
    # Le referrer indique d'où vient le visiteur (moteur de recherche, réseau social, etc.)
    # Cette information est cruciale pour mesurer l'efficacité des campagnes marketing
    referrer = Column(String(500), nullable=True)
    
    # Horodatage
    viewed_at = Column(DateTime, server_default=func.now(), nullable=False, index=True)
    
    # Relations
    product = relationship("Product", backref="views")
    user = relationship("User", backref="product_views")

    def __repr__(self):
        return f"<ProductView(product_id={self.product_id}, user_id={self.user_id}, viewed_at={self.viewed_at})>"


# Index composite pour améliorer les performances des requêtes analytiques
# Cet index permet de compter rapidement les vues par produit sur une période donnée
Index('idx_product_views_product_date', ProductView.product_id, ProductView.viewed_at)


# ============================================================================
# MODÈLE SEARCHQUERY : Suivi des recherches effectuées
# ============================================================================

class SearchQuery(Base):
    """
    Enregistre chaque recherche effectuée sur la plateforme.
    
    Comprendre ce que les utilisateurs recherchent est fondamental pour
    améliorer l'expérience utilisateur. Ces données permettent de :
    - Identifier les termes de recherche populaires
    - Détecter les recherches sans résultats (opportunités d'ajouter des produits)
    - Mesurer l'efficacité de l'algorithme de recherche
    - Optimiser les suggestions de recherche
    
    On enregistre aussi si l'utilisateur a cliqué sur un produit après
    la recherche, ce qui indique que les résultats étaient pertinents.
    """
    __tablename__ = "search_queries"

    id = Column(Integer, primary_key=True, index=True)
    
    # Utilisateur ayant effectué la recherche (nullable pour les visiteurs anonymes)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Terme de recherche exact saisi par l'utilisateur
    # On le stocke tel quel pour pouvoir analyser les variations orthographiques
    query = Column(String(255), nullable=False, index=True)
    
    # Nombre de résultats trouvés
    # Une valeur de 0 indique une recherche infructueuse (important à analyser)
    results_count = Column(Integer, nullable=False, default=0)
    
    # Si l'utilisateur a cliqué sur un produit, on enregistre lequel
    # Cela permet de mesurer la pertinence des résultats de recherche
    clicked_product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Horodatage
    searched_at = Column(DateTime, server_default=func.now(), nullable=False, index=True)
    
    # Relations
    user = relationship("User", backref="search_queries")
    clicked_product = relationship("Product", foreign_keys=[clicked_product_id], backref="search_clicks")

    def __repr__(self):
        return f"<SearchQuery(query='{self.query}', results={self.results_count}, clicked={self.clicked_product_id is not None})>"


# Index pour analyser rapidement les termes de recherche populaires
Index('idx_search_queries_query_date', SearchQuery.query, SearchQuery.searched_at)


# ============================================================================
# MODÈLE DASHBOARDMETRIC : Métriques agrégées pour les tableaux de bord
# ============================================================================

class DashboardMetric(Base):
    """
    Stocke des métriques pré-calculées pour affichage rapide dans les dashboards.
    
    Plutôt que de recalculer les statistiques à chaque fois qu'un utilisateur
    consulte son tableau de bord, on pré-calcule et stocke les métriques
    importantes. Cela permet d'afficher instantanément les performances sans
    ralentir l'application avec des requêtes complexes.
    
    Les métriques sont calculées périodiquement (par exemple, chaque nuit)
    par un job automatisé. On peut calculer des métriques pour différentes
    entités (produits, producteurs, catégories) et différentes périodes.
    """
    __tablename__ = "dashboard_metrics"

    id = Column(Integer, primary_key=True, index=True)
    
    # Type et identification de l'entité concernée
    # Par exemple : entity_type="product", entity_id=123 pour le produit #123
    entity_type = Column(SQLEnum(EntityType), nullable=False, index=True)
    entity_id = Column(Integer, nullable=False, index=True)
    
    # Nom et valeur de la métrique
    # Par exemple : metric_name="views", value=1500 pour 1500 vues
    metric_name = Column(SQLEnum(MetricName), nullable=False, index=True)
    value = Column(Numeric(15, 2), nullable=False)
    
    # Période de temps couverte par cette métrique
    period = Column(SQLEnum(MetricPeriod), nullable=False, index=True)
    
    # Date à laquelle cette métrique s'applique
    # Pour une métrique journalière, c'est le jour en question
    # Pour une métrique mensuelle, c'est le premier jour du mois
    date = Column(Date, nullable=False, index=True)
    
    # Horodatage de calcul
    calculated_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<DashboardMetric({self.entity_type}:{self.entity_id}, {self.metric_name}={self.value}, {self.period}, {self.date})>"


# Index composites pour accès rapide aux métriques par entité et période
Index('idx_dashboard_metrics_entity', DashboardMetric.entity_type, DashboardMetric.entity_id, DashboardMetric.date)
Index('idx_dashboard_metrics_lookup', DashboardMetric.entity_type, DashboardMetric.entity_id, 
      DashboardMetric.metric_name, DashboardMetric.period, DashboardMetric.date)


# ============================================================================
# MODÈLE SALESREPORT : Rapports de ventes pour les producteurs
# ============================================================================

class SalesReport(Base):
    """
    Génère des rapports de ventes détaillés pour les producteurs.
    
    Ces rapports sont générés périodiquement (quotidiennement, hebdomadairement,
    ou mensuellement) et fournissent aux producteurs une vue complète de leurs
    performances commerciales. Ils incluent le nombre de commandes, le chiffre
    d'affaires total, et la commission prélevée par la plateforme.
    
    Ces rapports servent aussi de base pour le calcul des paiements à effectuer
    aux producteurs. Ils constituent un enregistrement permanent des performances
    qui peut être consulté à tout moment pour l'historique.
    """
    __tablename__ = "sales_reports"

    id = Column(Integer, primary_key=True, index=True)
    
    # Producteur concerné par ce rapport
    producer_id = Column(Integer, ForeignKey("producer_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Période couverte par le rapport
    period_start = Column(Date, nullable=False, index=True)
    period_end = Column(Date, nullable=False, index=True)
    
    # Statistiques de ventes
    total_orders = Column(Integer, nullable=False, default=0)  # Nombre total de commandes
    total_revenue = Column(Numeric(12, 2), nullable=False, default=0)  # Chiffre d'affaires brut
    total_commission = Column(Numeric(12, 2), nullable=False, default=0)  # Commission plateforme
    
    # Statistiques supplémentaires calculées
    # Le montant net est ce que le producteur recevra (revenue - commission)
    net_revenue = Column(Numeric(12, 2), nullable=False, default=0)
    
    # Nombre de produits vendus (quantité totale)
    total_products_sold = Column(Integer, nullable=False, default=0)
    
    # Panier moyen (revenue / orders)
    average_order_value = Column(Numeric(10, 2), nullable=True)
    
    # Horodatage de génération du rapport
    generated_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Relations
    producer = relationship("ProducerProfile", backref="sales_reports")

    def __repr__(self):
        return f"<SalesReport(producer_id={self.producer_id}, {self.period_start} to {self.period_end}, revenue={self.total_revenue})>"


# Index pour rechercher rapidement les rapports d'un producteur sur une période
Index('idx_sales_reports_producer_period', SalesReport.producer_id, SalesReport.period_start, SalesReport.period_end)


# ============================================================================
# MODÈLE INVENTORYREPORT : Rapports d'inventaire pour le suivi du stock
# ============================================================================

class InventoryReport(Base):
    """
    Génère des rapports quotidiens de mouvement de stock pour chaque produit.
    
    Ces rapports permettent aux producteurs de suivre précisément l'évolution
    de leur inventaire jour après jour. Ils montrent :
    - Le stock de départ (début de journée)
    - Les entrées (réapprovisionnements)
    - Les sorties (ventes)
    - Les ajustements manuels (corrections d'inventaire)
    - Le stock final (fin de journée)
    
    Cette traçabilité est essentielle pour détecter les erreurs d'inventaire,
    prévoir les besoins de réapprovisionnement, et analyser les tendances
    de vente. Ces rapports constituent aussi une preuve en cas de litige.
    """
    __tablename__ = "inventory_reports"

    id = Column(Integer, primary_key=True, index=True)
    
    # Identification du producteur et du produit
    producer_id = Column(Integer, ForeignKey("producer_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Mouvements de stock pour la journée
    stock_start = Column(Integer, nullable=False)  # Stock au début de la journée
    stock_received = Column(Integer, nullable=False, default=0)  # Quantité reçue (réapprovisionnement)
    stock_sold = Column(Integer, nullable=False, default=0)  # Quantité vendue
    stock_adjusted = Column(Integer, nullable=False, default=0)  # Ajustements manuels (peut être négatif)
    stock_end = Column(Integer, nullable=False)  # Stock à la fin de la journée
    
    # Calcul automatique : stock_end = stock_start + stock_received - stock_sold + stock_adjusted
    
    # Valeur financière du stock (optionnel, basé sur le prix du produit)
    stock_value = Column(Numeric(12, 2), nullable=True)  # stock_end * prix_unitaire
    
    # Date du rapport (un rapport par jour et par produit)
    report_date = Column(Date, nullable=False, index=True)
    
    # Horodatage de génération
    generated_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Relations
    producer = relationship("ProducerProfile", backref="inventory_reports")
    product = relationship("Product", backref="inventory_reports")

    def __repr__(self):
        return f"<InventoryReport(product_id={self.product_id}, date={self.report_date}, start={self.stock_start}, end={self.stock_end})>"


# Index pour accès rapide aux rapports d'inventaire par producteur et date
Index('idx_inventory_reports_producer_date', InventoryReport.producer_id, InventoryReport.report_date)
# Index pour suivre l'historique d'un produit spécifique
Index('idx_inventory_reports_product_date', InventoryReport.product_id, InventoryReport.report_date)
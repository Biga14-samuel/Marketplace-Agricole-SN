from sqlalchemy.orm import Session
from sqlalchemy import and_, func, desc
from typing import List, Optional, Dict, Tuple
from datetime import datetime, date, timedelta, timezone
from decimal import Decimal

from app.models.analytics import (
    ProductView, SearchQuery, DashboardMetric, SalesReport, InventoryReport,
    EntityType, MetricName, MetricPeriod
)


# ============================================================================
# REPOSITORY PRODUCTVIEW
# ============================================================================

class ProductViewRepository:
    """
    Gère l'enregistrement et l'analyse des vues de produits.
    
    Ce repository permet de tracker chaque consultation de produit et
    d'extraire des statistiques utiles pour comprendre le comportement
    des utilisateurs et identifier les produits populaires.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, product_id: int, user_id: Optional[int] = None,
               session_id: Optional[str] = None, referrer: Optional[str] = None) -> ProductView:
        """
        Enregistre une vue de produit.
        
        Cette méthode est appelée chaque fois qu'un utilisateur consulte
        la page d'un produit. Elle permet de construire un historique
        complet des consultations pour l'analyse future.
        """
        view = ProductView(
            product_id=product_id,
            user_id=user_id,
            session_id=session_id,
            referrer=referrer
        )
        self.db.add(view)
        self.db.commit()
        self.db.refresh(view)
        return view
    
    def get_product_views_count(self, product_id: int, start_date: Optional[date] = None,
                               end_date: Optional[date] = None) -> int:
        """
        Compte le nombre de vues d'un produit sur une période.
        
        Cette requête optimisée utilise COUNT pour éviter de charger
        toutes les lignes en mémoire, ce qui est crucial quand il y a
        des milliers de vues à compter.
        """
        query = self.db.query(func.count(ProductView.id)).filter(
            ProductView.product_id == product_id
        )
        
        if start_date:
            query = query.filter(ProductView.viewed_at >= start_date)
        if end_date:
            # Ajouter 1 jour pour inclure toute la journée de end_date
            query = query.filter(ProductView.viewed_at < end_date + timedelta(days=1))
        
        return query.scalar() or 0
    
    def get_top_viewed_products(self, limit: int = 10, start_date: Optional[date] = None,
                               end_date: Optional[date] = None) -> List[Tuple[int, int]]:
        """
        Récupère les produits les plus consultés.
        
        Retourne une liste de tuples (product_id, view_count) triée par
        nombre de vues décroissant. Utile pour identifier les produits
        qui attirent le plus d'attention.
        """
        query = self.db.query(
            ProductView.product_id,
            func.count(ProductView.id).label('view_count')
        )
        
        if start_date:
            query = query.filter(ProductView.viewed_at >= start_date)
        if end_date:
            query = query.filter(ProductView.viewed_at < end_date + timedelta(days=1))
        
        return query.group_by(ProductView.product_id).order_by(
            desc('view_count')
        ).limit(limit).all()
    
    def get_views_by_date(self, product_id: int, start_date: date,
                         end_date: date) -> List[Tuple[date, int]]:
        """
        Récupère le nombre de vues par jour pour un produit.
        
        Cette méthode retourne une série temporelle des vues, ce qui
        permet de visualiser l'évolution de l'intérêt pour un produit
        au fil du temps et de détecter les pics d'activité.
        """
        results = self.db.query(
            func.date(ProductView.viewed_at).label('view_date'),
            func.count(ProductView.id).label('view_count')
        ).filter(
            and_(
                ProductView.product_id == product_id,
                ProductView.viewed_at >= start_date,
                ProductView.viewed_at < end_date + timedelta(days=1)
            )
        ).group_by('view_date').order_by('view_date').all()
        
        return [(row.view_date, row.view_count) for row in results]
    
    def get_unique_viewers(self, product_id: int, start_date: Optional[date] = None,
                          end_date: Optional[date] = None) -> int:
        """
        Compte le nombre de visiteurs uniques d'un produit.
        
        Un visiteur unique est compté une seule fois, même s'il consulte
        le produit plusieurs fois. Cette métrique donne une meilleure
        idée de la portée réelle d'un produit.
        """
        query = self.db.query(
            func.count(func.distinct(
                func.coalesce(ProductView.user_id, ProductView.session_id)
            ))
        ).filter(ProductView.product_id == product_id)
        
        if start_date:
            query = query.filter(ProductView.viewed_at >= start_date)
        if end_date:
            query = query.filter(ProductView.viewed_at < end_date + timedelta(days=1))
        
        return query.scalar() or 0


# ============================================================================
# REPOSITORY SEARCHQUERY
# ============================================================================

class SearchQueryRepository:
    """
    Gère l'enregistrement et l'analyse des recherches effectuées.
    
    Ce repository permet de comprendre ce que les utilisateurs cherchent,
    d'identifier les termes populaires, et de mesurer l'efficacité de
    l'algorithme de recherche en suivant les clics sur les résultats.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, query: str, results_count: int, user_id: Optional[int] = None,
               clicked_product_id: Optional[int] = None) -> SearchQuery:
        """
        Enregistre une recherche effectuée par un utilisateur.
        
        Cette méthode capture non seulement le terme recherché, mais aussi
        le nombre de résultats trouvés et si l'utilisateur a cliqué sur
        un résultat, ce qui permet de mesurer la pertinence.
        """
        search = SearchQuery(
            user_id=user_id,
            query=query.lower().strip(),  # Normaliser pour l'analyse
            results_count=results_count,
            clicked_product_id=clicked_product_id
        )
        self.db.add(search)
        self.db.commit()
        self.db.refresh(search)
        return search
    
    def get_popular_searches(self, limit: int = 20, start_date: Optional[date] = None,
                            end_date: Optional[date] = None) -> List[Tuple[str, int, float]]:
        """
        Récupère les termes de recherche les plus populaires.
        
        Retourne une liste de tuples (query, search_count, click_through_rate)
        pour identifier ce que les gens cherchent le plus et avec quel
        succès ils trouvent ce qu'ils veulent.
        """
        query = self.db.query(
            SearchQuery.query,
            func.count(SearchQuery.id).label('search_count'),
            (func.count(SearchQuery.clicked_product_id) * 100.0 / 
             func.count(SearchQuery.id)).label('ctr')
        )
        
        if start_date:
            query = query.filter(SearchQuery.searched_at >= start_date)
        if end_date:
            query = query.filter(SearchQuery.searched_at < end_date + timedelta(days=1))
        
        results = query.group_by(SearchQuery.query).order_by(
            desc('search_count')
        ).limit(limit).all()
        
        return [(row.query, row.search_count, row.ctr) for row in results]
    
    def get_failed_searches(self, limit: int = 20, start_date: Optional[date] = None,
                           end_date: Optional[date] = None) -> List[Tuple[str, int]]:
        """
        Récupère les recherches qui n'ont retourné aucun résultat.
        
        Ces données sont précieuses car elles identifient ce que les
        utilisateurs cherchent mais ne trouvent pas. Cela peut révéler
        des opportunités d'ajouter de nouveaux produits au catalogue.
        """
        query = self.db.query(
            SearchQuery.query,
            func.count(SearchQuery.id).label('search_count')
        ).filter(SearchQuery.results_count == 0)
        
        if start_date:
            query = query.filter(SearchQuery.searched_at >= start_date)
        if end_date:
            query = query.filter(SearchQuery.searched_at < end_date + timedelta(days=1))
        
        results = query.group_by(SearchQuery.query).order_by(
            desc('search_count')
        ).limit(limit).all()
        
        return [(row.query, row.search_count) for row in results]
    
    def get_search_analytics(self, start_date: date, end_date: date) -> Dict:
        """
        Récupère des statistiques générales sur les recherches.
        
        Cette méthode agrège différentes métriques pour donner une vue
        d'ensemble de l'activité de recherche sur la plateforme.
        """
        total = self.db.query(func.count(SearchQuery.id)).filter(
            and_(
                SearchQuery.searched_at >= start_date,
                SearchQuery.searched_at < end_date + timedelta(days=1)
            )
        ).scalar() or 0
        
        with_results = self.db.query(func.count(SearchQuery.id)).filter(
            and_(
                SearchQuery.searched_at >= start_date,
                SearchQuery.searched_at < end_date + timedelta(days=1),
                SearchQuery.results_count > 0
            )
        ).scalar() or 0
        
        with_clicks = self.db.query(func.count(SearchQuery.id)).filter(
            and_(
                SearchQuery.searched_at >= start_date,
                SearchQuery.searched_at < end_date + timedelta(days=1),
                SearchQuery.clicked_product_id.isnot(None)
            )
        ).scalar() or 0
        
        return {
            "total_searches": total,
            "searches_with_results": with_results,
            "searches_with_clicks": with_clicks,
            "success_rate": (with_results / total * 100) if total > 0 else 0,
            "click_through_rate": (with_clicks / total * 100) if total > 0 else 0
        }


# ============================================================================
# REPOSITORY DASHBOARDMETRIC
# ============================================================================

class DashboardMetricRepository:
    """
    Gère les métriques pré-calculées pour les tableaux de bord.
    
    Les métriques sont pré-calculées et stockées pour permettre un affichage
    rapide des dashboards sans avoir à recalculer les statistiques à chaque
    consultation. C'est une optimisation cruciale pour les performances.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, entity_type: EntityType, entity_id: int, metric_name: MetricName,
               value: Decimal, period: MetricPeriod, metric_date: date) -> DashboardMetric:
        """
        Crée ou met à jour une métrique.
        
        Si une métrique existe déjà pour la même combinaison
        (entity, metric, period, date), elle est mise à jour plutôt
        que de créer un doublon.
        """
        existing = self.db.query(DashboardMetric).filter(
            and_(
                DashboardMetric.entity_type == entity_type,
                DashboardMetric.entity_id == entity_id,
                DashboardMetric.metric_name == metric_name,
                DashboardMetric.period == period,
                DashboardMetric.date == metric_date
            )
        ).first()
        
        if existing:
            existing.value = value
            existing.calculated_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(existing)
            return existing
        else:
            metric = DashboardMetric(
                entity_type=entity_type,
                entity_id=entity_id,
                metric_name=metric_name,
                value=value,
                period=period,
                date=metric_date
            )
            self.db.add(metric)
            self.db.commit()
            self.db.refresh(metric)
            return metric
    
    def get_metric(self, entity_type: EntityType, entity_id: int, metric_name: MetricName,
                   period: MetricPeriod, metric_date: date) -> Optional[DashboardMetric]:
        """Récupère une métrique spécifique"""
        return self.db.query(DashboardMetric).filter(
            and_(
                DashboardMetric.entity_type == entity_type,
                DashboardMetric.entity_id == entity_id,
                DashboardMetric.metric_name == metric_name,
                DashboardMetric.period == period,
                DashboardMetric.date == metric_date
            )
        ).first()
    
    def get_metrics_for_entity(self, entity_type: EntityType, entity_id: int,
                              period: MetricPeriod, start_date: date,
                              end_date: date) -> List[DashboardMetric]:
        """
        Récupère toutes les métriques d'une entité sur une période.
        
        Cette méthode permet de construire un dashboard complet en
        récupérant toutes les métriques disponibles pour une entité
        donnée (produit, producteur, catégorie) sur une plage de dates.
        """
        return self.db.query(DashboardMetric).filter(
            and_(
                DashboardMetric.entity_type == entity_type,
                DashboardMetric.entity_id == entity_id,
                DashboardMetric.period == period,
                DashboardMetric.date >= start_date,
                DashboardMetric.date <= end_date
            )
        ).order_by(DashboardMetric.date).all()
    
    def get_metrics_summary(self, entity_type: EntityType, entity_id: int,
                           period: MetricPeriod, start_date: date,
                           end_date: date) -> Dict[str, Decimal]:
        """
        Récupère un résumé des métriques sous forme de dictionnaire.
        
        Cette méthode est optimisée pour afficher rapidement un résumé
        avec toutes les métriques clés : vues, ventes, revenus, etc.
        """
        metrics = self.get_metrics_for_entity(
            entity_type, entity_id, period, start_date, end_date
        )
        
        summary = {}
        for metric in metrics:
            if metric.metric_name.value not in summary:
                summary[metric.metric_name.value] = Decimal(0)
            summary[metric.metric_name.value] += metric.value
        
        return summary


# ============================================================================
# REPOSITORY SALESREPORT
# ============================================================================

class SalesReportRepository:
    """
    Gère la génération et le stockage des rapports de ventes.
    
    Les rapports de ventes sont générés périodiquement pour donner aux
    producteurs une vue claire de leurs performances et faciliter la
    comptabilité et les paiements.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, producer_id: int, period_start: date, period_end: date,
               total_orders: int, total_revenue: Decimal, total_commission: Decimal,
               net_revenue: Decimal, total_products_sold: int,
               average_order_value: Optional[Decimal] = None) -> SalesReport:
        """
        Crée un nouveau rapport de ventes.
        
        Cette méthode est généralement appelée par un job automatisé qui
        calcule les statistiques de vente à partir des commandes réelles
        et génère les rapports pour tous les producteurs.
        """
        report = SalesReport(
            producer_id=producer_id,
            period_start=period_start,
            period_end=period_end,
            total_orders=total_orders,
            total_revenue=total_revenue,
            total_commission=total_commission,
            net_revenue=net_revenue,
            total_products_sold=total_products_sold,
            average_order_value=average_order_value
        )
        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)
        return report
    
    def get_by_id(self, report_id: int) -> Optional[SalesReport]:
        """Récupère un rapport par son ID"""
        return self.db.query(SalesReport).filter(SalesReport.id == report_id).first()
    
    def get_producer_reports(self, producer_id: int, start_date: Optional[date] = None,
                            end_date: Optional[date] = None) -> List[SalesReport]:
        """
        Récupère tous les rapports d'un producteur.
        
        Cette méthode permet à un producteur de consulter l'historique
        complet de ses ventes, ce qui est utile pour l'analyse des
        tendances et la comptabilité.
        """
        query = self.db.query(SalesReport).filter(
            SalesReport.producer_id == producer_id
        )
        
        if start_date:
            query = query.filter(SalesReport.period_end >= start_date)
        if end_date:
            query = query.filter(SalesReport.period_start <= end_date)
        
        return query.order_by(desc(SalesReport.period_start)).all()
    
    def get_report_for_period(self, producer_id: int, period_start: date,
                             period_end: date) -> Optional[SalesReport]:
        """
        Récupère le rapport d'une période spécifique.
        
        Utile pour vérifier si un rapport existe déjà avant d'en créer
        un nouveau, évitant ainsi les doublons.
        """
        return self.db.query(SalesReport).filter(
            and_(
                SalesReport.producer_id == producer_id,
                SalesReport.period_start == period_start,
                SalesReport.period_end == period_end
            )
        ).first()


# ============================================================================
# REPOSITORY INVENTORYREPORT
# ============================================================================

class InventoryReportRepository:
    """
    Gère les rapports d'inventaire quotidiens.
    
    Ces rapports permettent aux producteurs de suivre précisément l'évolution
    de leur stock jour après jour et de détecter rapidement les anomalies
    ou les besoins de réapprovisionnement.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, producer_id: int, product_id: int, stock_start: int,
               stock_received: int, stock_sold: int, stock_adjusted: int,
               stock_end: int, report_date: date, stock_value: Optional[Decimal] = None) -> InventoryReport:
        """
        Crée un rapport d'inventaire quotidien.
        
        Ces rapports sont généralement générés automatiquement à la fin
        de chaque journée en analysant les mouvements de stock (ventes,
        réapprovisionnements, ajustements).
        """
        report = InventoryReport(
            producer_id=producer_id,
            product_id=product_id,
            stock_start=stock_start,
            stock_received=stock_received,
            stock_sold=stock_sold,
            stock_adjusted=stock_adjusted,
            stock_end=stock_end,
            report_date=report_date,
            stock_value=stock_value
        )
        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)
        return report
    
    def get_by_id(self, report_id: int) -> Optional[InventoryReport]:
        """Récupère un rapport par son ID"""
        return self.db.query(InventoryReport).filter(InventoryReport.id == report_id).first()
    
    def get_product_reports(self, product_id: int, start_date: Optional[date] = None,
                           end_date: Optional[date] = None) -> List[InventoryReport]:
        """
        Récupère l'historique des rapports d'inventaire d'un produit.
        
        Cette méthode permet de suivre l'évolution du stock d'un produit
        sur une période, ce qui est utile pour analyser les tendances de
        vente et planifier les réapprovisionnements.
        """
        query = self.db.query(InventoryReport).filter(
            InventoryReport.product_id == product_id
        )
        
        if start_date:
            query = query.filter(InventoryReport.report_date >= start_date)
        if end_date:
            query = query.filter(InventoryReport.report_date <= end_date)
        
        return query.order_by(InventoryReport.report_date).all()
    
    def get_producer_reports(self, producer_id: int, report_date: date) -> List[InventoryReport]:
        """
        Récupère tous les rapports d'inventaire d'un producteur pour une date.
        
        Cette méthode retourne l'état de tous les produits d'un producteur
        à une date donnée, ce qui permet d'avoir une vue d'ensemble complète
        de l'inventaire.
        """
        return self.db.query(InventoryReport).filter(
            and_(
                InventoryReport.producer_id == producer_id,
                InventoryReport.report_date == report_date
            )
        ).all()
    
    def get_report_for_date(self, product_id: int, report_date: date) -> Optional[InventoryReport]:
        """
        Récupère le rapport d'inventaire d'un produit pour une date spécifique.
        
        Utile pour vérifier l'état du stock à un moment précis ou pour
        éviter de créer des doublons de rapports.
        """
        return self.db.query(InventoryReport).filter(
            and_(
                InventoryReport.product_id == product_id,
                InventoryReport.report_date == report_date
            )
        ).first()
    
    def get_low_stock_products(self, producer_id: int, threshold: int = 10) -> List[InventoryReport]:
        """
        Identifie les produits avec un stock faible.
        
        Cette méthode aide les producteurs à identifier rapidement les
        produits qui nécessitent un réapprovisionnement urgent en
        récupérant les derniers rapports dont le stock final est sous
        un seuil défini.
        """
        # Récupérer le dernier rapport pour chaque produit du producteur
        subquery = self.db.query(
            InventoryReport.product_id,
            func.max(InventoryReport.report_date).label('max_date')
        ).filter(
            InventoryReport.producer_id == producer_id
        ).group_by(InventoryReport.product_id).subquery()
        
        return self.db.query(InventoryReport).join(
            subquery,
            and_(
                InventoryReport.product_id == subquery.c.product_id,
                InventoryReport.report_date == subquery.c.max_date
            )
        ).filter(
            and_(
                InventoryReport.producer_id == producer_id,
                InventoryReport.stock_end <= threshold
            )
        ).all()
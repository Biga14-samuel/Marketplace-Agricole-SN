from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from typing import Optional, List

from app.models.cms import Page, FAQ, BlogPost, Testimonial, FAQCategory


# ============= Page Repository =============

class PageRepository:
    """Repository pour les pages statiques"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, **kwargs) -> Page:
        """Crée une page"""
        page = Page(**kwargs)
        self.db.add(page)
        self.db.commit()
        self.db.refresh(page)
        return page
    
    def get_by_id(self, page_id: int) -> Optional[Page]:
        """Récupère une page par son ID"""
        return self.db.query(Page).filter(Page.id == page_id).first()
    
    def get_by_slug(self, slug: str, published_only: bool = False) -> Optional[Page]:
        """Récupère une page par son slug"""
        query = self.db.query(Page).filter(Page.slug == slug)
        if published_only:
            query = query.filter(Page.is_published)
        return query.first()
    
    def get_all(self, published_only: bool = False) -> List[Page]:
        """Récupère toutes les pages"""
        query = self.db.query(Page).order_by(Page.title)
        if published_only:
            query = query.filter(Page.is_published)
        return query.all()
    
    def update(self, page_id: int, **kwargs) -> Optional[Page]:
        """Met à jour une page"""
        page = self.get_by_id(page_id)
        if not page:
            return None
        
        for key, value in kwargs.items():
            setattr(page, key, value)
        
        self.db.commit()
        self.db.refresh(page)
        return page
    
    def delete(self, page_id: int) -> bool:
        """Supprime une page"""
        page = self.get_by_id(page_id)
        if not page:
            return False
        
        self.db.delete(page)
        self.db.commit()
        return True


# ============= FAQ Repository =============

class FAQRepository:
    """Repository pour les questions fréquentes"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, **kwargs) -> FAQ:
        """Crée une FAQ"""
        faq = FAQ(**kwargs)
        self.db.add(faq)
        self.db.commit()
        self.db.refresh(faq)
        return faq
    
    def get_by_id(self, faq_id: int) -> Optional[FAQ]:
        """Récupère une FAQ par son ID"""
        return self.db.query(FAQ).filter(FAQ.id == faq_id).first()
    
    def get_all(self, category: Optional[FAQCategory] = None, published_only: bool = False) -> List[FAQ]:
        """Récupère toutes les FAQs"""
        query = self.db.query(FAQ)
        
        if category:
            query = query.filter(FAQ.category == category)
        
        if published_only:
            query = query.filter(FAQ.is_published)
        
        query = query.order_by(FAQ.position, FAQ.id)
        return query.all()
    
    def get_by_category(self, category: FAQCategory, published_only: bool = False) -> List[FAQ]:
        """Récupère les FAQs d'une catégorie"""
        query = self.db.query(FAQ).filter(FAQ.category == category)
        if published_only:
            query = query.filter(FAQ.is_published)
        return query.order_by(FAQ.position, FAQ.id).all()
    
    def update(self, faq_id: int, **kwargs) -> Optional[FAQ]:
        """Met à jour une FAQ"""
        faq = self.get_by_id(faq_id)
        if not faq:
            return None
        
        for key, value in kwargs.items():
            setattr(faq, key, value)
        
        self.db.commit()
        self.db.refresh(faq)
        return faq
    
    def delete(self, faq_id: int) -> bool:
        """Supprime une FAQ"""
        faq = self.get_by_id(faq_id)
        if not faq:
            return False
        
        self.db.delete(faq)
        self.db.commit()
        return True


# ============= BlogPost Repository =============

class BlogPostRepository:
    """Repository pour les articles de blog"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, **kwargs) -> BlogPost:
        """Crée un article de blog"""
        post = BlogPost(**kwargs)
        self.db.add(post)
        self.db.commit()
        self.db.refresh(post)
        return post
    
    def get_by_id(self, post_id: int, published_only: bool = False) -> Optional[BlogPost]:
        """Récupère un article par son ID"""
        query = self.db.query(BlogPost).filter(BlogPost.id == post_id)
        if published_only:
            query = query.filter(BlogPost.is_published)
        return query.first()
    
    def get_by_slug(self, slug: str, published_only: bool = False) -> Optional[BlogPost]:
        """Récupère un article par son slug"""
        query = self.db.query(BlogPost).filter(BlogPost.slug == slug)
        if published_only:
            query = query.filter(BlogPost.is_published)
        return query.first()
    
    def get_all(
        self, 
        published_only: bool = False,
        author_id: Optional[int] = None,
        limit: Optional[int] = None,
        offset: int = 0
    ) -> List[BlogPost]:
        """Récupère tous les articles"""
        query = self.db.query(BlogPost)
        
        if published_only:
            query = query.filter(BlogPost.is_published)
        
        if author_id:
            query = query.filter(BlogPost.author_id == author_id)
        
        query = query.order_by(desc(BlogPost.published_at), desc(BlogPost.created_at))
        
        if limit:
            query = query.limit(limit).offset(offset)
        
        return query.all()
    
    def get_featured(self, limit: int = 5) -> List[BlogPost]:
        """Récupère les articles mis en avant"""
        return self.db.query(BlogPost)\
            .filter(BlogPost.is_published)\
            .order_by(desc(BlogPost.published_at))\
            .limit(limit)\
            .all()
    
    def increment_views(self, post_id: int) -> Optional[BlogPost]:
        """Incrémente le compteur de vues"""
        post = self.get_by_id(post_id)
        if not post:
            return None
        
        post.views = (post.views or 0) + 1
        self.db.commit()
        self.db.refresh(post)
        return post
    
    def update(self, post_id: int, **kwargs) -> Optional[BlogPost]:
        """Met à jour un article"""
        post = self.get_by_id(post_id)
        if not post:
            return None
        
        for key, value in kwargs.items():
            setattr(post, key, value)
        
        self.db.commit()
        self.db.refresh(post)
        return post
    
    def delete(self, post_id: int) -> bool:
        """Supprime un article"""
        post = self.get_by_id(post_id)
        if not post:
            return False
        
        self.db.delete(post)
        self.db.commit()
        return True
    
    def search(self, search_term: str, published_only: bool = True) -> List[BlogPost]:
        """Recherche dans les articles"""
        query = self.db.query(BlogPost).filter(
            or_(
                BlogPost.title.ilike(f"%{search_term}%"),
                BlogPost.content.ilike(f"%{search_term}%"),
                BlogPost.tags.ilike(f"%{search_term}%")
            )
        )
        
        if published_only:
            query = query.filter(BlogPost.is_published)
        
        return query.order_by(desc(BlogPost.published_at)).all()


# ============= Testimonial Repository =============

class TestimonialRepository:
    """Repository pour les témoignages"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, **kwargs) -> Testimonial:
        """Crée un témoignage"""
        testimonial = Testimonial(**kwargs)
        self.db.add(testimonial)
        self.db.commit()
        self.db.refresh(testimonial)
        return testimonial
    
    def get_by_id(self, testimonial_id: int) -> Optional[Testimonial]:
        """Récupère un témoignage par son ID"""
        return self.db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    
    def get_all(
        self,
        approved_only: bool = False,
        featured_only: bool = False,
        user_id: Optional[int] = None,
        limit: Optional[int] = None
    ) -> List[Testimonial]:
        """Récupère tous les témoignages"""
        query = self.db.query(Testimonial)
        
        if approved_only:
            query = query.filter(Testimonial.is_approved)
        
        if featured_only:
            query = query.filter(Testimonial.is_featured)
        
        if user_id:
            query = query.filter(Testimonial.user_id == user_id)
        
        query = query.order_by(desc(Testimonial.is_featured), desc(Testimonial.created_at))
        
        if limit:
            query = query.limit(limit)
        
        return query.all()
    
    def get_featured(self, limit: int = 10) -> List[Testimonial]:
        """Récupère les témoignages mis en avant"""
        return self.db.query(Testimonial)\
            .filter(Testimonial.is_approved)\
            .filter(Testimonial.is_featured)\
            .order_by(desc(Testimonial.created_at))\
            .limit(limit)\
            .all()
    
    def update(self, testimonial_id: int, **kwargs) -> Optional[Testimonial]:
        """Met à jour un témoignage"""
        testimonial = self.get_by_id(testimonial_id)
        if not testimonial:
            return None
        
        for key, value in kwargs.items():
            setattr(testimonial, key, value)
        
        self.db.commit()
        self.db.refresh(testimonial)
        return testimonial
    
    def delete(self, testimonial_id: int) -> bool:
        """Supprime un témoignage"""
        testimonial = self.get_by_id(testimonial_id)
        if not testimonial:
            return False
        
        self.db.delete(testimonial)
        self.db.commit()
        return True
    
    def approve(self, testimonial_id: int) -> Optional[Testimonial]:
        """Approuve un témoignage"""
        return self.update(testimonial_id, is_approved=True)
    
    def reject(self, testimonial_id: int) -> Optional[Testimonial]:
        """Rejette un témoignage"""
        return self.update(testimonial_id, is_approved=False)

// module/catalog/services/models/productImage.model.ts

import type { CreateProductImageRequest } from '../api/productImages.api';

export class ProductImage {
    id: string;
    product_id: string;
    url: string;
    alt_text?: string;
    is_main: boolean;
    order: number;
    created_at: Date;
    updated_at?: Date;
    file_size?: number;
    file_type?: string;
    dimensions?: {
        width: number;
        height: number;
    };
    thumbnail_url?: string;
    medium_url?: string;
    large_url?: string;

    constructor(data: Partial<ProductImage> = {}) {
        this.id = data.id || '';
        this.product_id = data.product_id || '';
        this.url = data.url || '';
        this.alt_text = data.alt_text;
        this.is_main = data.is_main || false;
        this.order = data.order || 0;
        this.created_at = data.created_at ? new Date(data.created_at) : new Date();
        this.updated_at = data.updated_at ? new Date(data.updated_at) : undefined;
        this.file_size = data.file_size;
        this.file_type = data.file_type;
        this.dimensions = data.dimensions;
        this.thumbnail_url = data.thumbnail_url;
        this.medium_url = data.medium_url;
        this.large_url = data.large_url;
    }

    // Factory method pour créer une image à partir des données de l'API
    static fromApiData(data: any): ProductImage {
        return new ProductImage({
            id: data.id,
            product_id: data.product_id,
            url: data.url,
            alt_text: data.alt_text,
            is_main: data.is_main,
            order: data.order,
            created_at: data.created_at,
            updated_at: data.updated_at,
            file_size: data.file_size,
            file_type: data.file_type,
            dimensions: data.dimensions,
            thumbnail_url: data.thumbnail_url,
            medium_url: data.medium_url,
            large_url: data.large_url,
        });
    }

    // Convertir en format de requête pour l'API (création)
    toCreateRequest(): CreateProductImageRequest {
        return {
            url: this.url,
            alt_text: this.alt_text,
            is_main: this.is_main,
            order: this.order,
        };
    }

    // Vérifier si l'image est valide pour la création
    isValidForCreation(): boolean {
        return !!this.url.trim();
    }

    // Vérifier si l'image est valide pour la mise à jour
    isValidForUpdate(): boolean {
        return !!this.id && !!this.url.trim();
    }

    // Obtenir l'URL appropriée selon la taille demandée
    getUrl(size: 'original' | 'thumbnail' | 'medium' | 'large' = 'original'): string {
        switch (size) {
            case 'thumbnail':
                return this.thumbnail_url || this.url;
            case 'medium':
                return this.medium_url || this.url;
            case 'large':
                return this.large_url || this.url;
            default:
                return this.url;
        }
    }

    // Obtenir la taille de fichier formatée
    getFormattedFileSize(): string {
        if (!this.file_size) return 'Inconnu';

        const sizes = ['octets', 'Ko', 'Mo', 'Go'];
        const i = Math.floor(Math.log(this.file_size) / Math.log(1024));
        return `${(this.file_size / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    }

    // Obtenir les dimensions formatées
    getFormattedDimensions(): string {
        if (!this.dimensions) return 'Inconnues';
        return `${this.dimensions.width} × ${this.dimensions.height} px`;
    }

    // Obtenir le type de fichier simplifié
    getFileTypeSimple(): string {
        if (!this.file_type) return 'Image';

        const types: Record<string, string> = {
            'image/jpeg': 'JPEG',
            'image/png': 'PNG',
            'image/gif': 'GIF',
            'image/webp': 'WebP',
            'image/svg+xml': 'SVG',
        };

        return types[this.file_type] || this.file_type.replace('image/', '').toUpperCase();
    }

    // Vérifier si l'image est un format supporté
    isSupportedFormat(): boolean {
        const supported = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        return !this.file_type || supported.includes(this.file_type);
    }

    // Calculer le ratio d'aspect
    getAspectRatio(): number | null {
        if (!this.dimensions?.width || !this.dimensions?.height || this.dimensions.height === 0) {
            return null;
        }
        return this.dimensions.width / this.dimensions.height;
    }

    // Obtenir l'orientation (portrait, paysage, carré)
    getOrientation(): 'portrait' | 'landscape' | 'square' | 'unknown' {
        const ratio = this.getAspectRatio();
        if (ratio === null) return 'unknown';

        if (ratio > 1.1) return 'landscape';
        if (ratio < 0.9) return 'portrait';
        return 'square';
    }

    // Vérifier si l'image est haute résolution
    isHighResolution(): boolean {
        if (!this.dimensions) return false;
        return this.dimensions.width >= 1920 || this.dimensions.height >= 1080;
    }

    // Générer un texte alternatif automatique
    generateAltText(productName?: string): string {
        if (this.alt_text) return this.alt_text;

        if (productName) {
            return `Image du produit ${productName}`;
        }

        return `Image produit`;
    }

    // Cloner l'image
    clone(): ProductImage {
        return new ProductImage({
            ...this,
            created_at: new Date(this.created_at),
            updated_at: this.updated_at ? new Date(this.updated_at) : undefined,
            dimensions: this.dimensions ? { ...this.dimensions } : undefined,
        });
    }

    // Mettre à jour les propriétés
    update(data: Partial<ProductImage>): ProductImage {
        Object.assign(this, data);
        this.updated_at = new Date();
        return this;
    }

    // Vérifier si l'image correspond à un terme de recherche
    matchesSearch(searchTerm: string): boolean {
        const term = searchTerm.toLowerCase();
        return (
            (this.alt_text && this.alt_text.toLowerCase().includes(term)) ||
            (this.file_type && this.file_type.toLowerCase().includes(term)) ||
            false
        );
    }
}

// Helper functions
export const ProductImageHelper = {
    // Filtrer les images par recherche
    filterBySearch(images: ProductImage[], searchTerm: string): ProductImage[] {
        if (!searchTerm.trim()) return images;

        return images.filter(image => image.matchesSearch(searchTerm));
    },

    // Trier les images
    sortImages(
        images: ProductImage[],
        sortBy: 'order' | 'created_at' | 'file_size' | 'is_main' = 'order',
        order: 'asc' | 'desc' = 'asc'
    ): ProductImage[] {
        const sorted = [...images];

        switch (sortBy) {
            case 'order':
                sorted.sort((a, b) => a.order - b.order);
                break;
            case 'created_at':
                sorted.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
                break;
            case 'file_size':
                sorted.sort((a, b) => (a.file_size || 0) - (b.file_size || 0));
                break;
            case 'is_main':
                sorted.sort((a, b) => (b.is_main ? 1 : 0) - (a.is_main ? 1 : 0));
                break;
        }

        return order === 'desc' ? sorted.reverse() : sorted;
    },

    // Obtenir l'image principale
    getMainImage(images: ProductImage[]): ProductImage | null {
        return images.find(img => img.is_main) || null;
    },

    // Définir une image comme principale
    setMainImage(images: ProductImage[], imageId: string): ProductImage[] {
    return images.map((img, index) => new ProductImage({ ...img, order: index }));
    },

    // Réordonner les images
    reorderImages(images: ProductImage[], newOrder: { id: string; order: number }[]): ProductImage[] {
        const orderMap = new Map(newOrder.map(item => [item.id, item.order]));
        return images.map(img => {
            if (orderMap.has(img.id)) {
                return img.clone().update({ order: orderMap.get(img.id)! });
            }
            return img;
        });
    },

    // Ajouter une image
    addImage(images: ProductImage[], image: ProductImage): ProductImage[] {
        return [...images, image];
    },

    // Supprimer une image
    removeImage(images: ProductImage[], imageId: string): ProductImage[] {
        return images.filter(img => img.id !== imageId);
    },

    // Mettre à jour une image
    updateImage(images: ProductImage[], imageId: string, data: Partial<ProductImage>): ProductImage[] {
        return images.map(img => {
            if (img.id === imageId) {
                return img.clone().update(data);
            }
            return img;
        });
    },

    // Trouver une image par ID
    findById(images: ProductImage[], id: string): ProductImage | undefined {
        return images.find(img => img.id === id);
    },

    // Vérifier si une URL existe déjà
    urlExists(images: ProductImage[], url: string, excludeId?: string): boolean {
        return images.some(img =>
            img.url === url &&
            (!excludeId || img.id !== excludeId)
        );
    },

    // Grouper les images par orientation
    groupByOrientation(images: ProductImage[]): {
        portrait: ProductImage[];
        landscape: ProductImage[];
        square: ProductImage[];
        unknown: ProductImage[];
    } {
        const groups = {
            portrait: [] as ProductImage[],
            landscape: [] as ProductImage[],
            square: [] as ProductImage[],
            unknown: [] as ProductImage[],
        };

        images.forEach(img => {
            const orientation = img.getOrientation();
            groups[orientation].push(img);
        });

        return groups;
    },

    // Filtrer par type de fichier
    filterByFileType(images: ProductImage[], fileType: string): ProductImage[] {
        return images.filter(img => img.file_type === fileType);
    },

    // Calculer les statistiques des images
    getImageStats(images: ProductImage[]): {
        total: number;
        withAltText: number;
        totalFileSize: number;
        averageFileSize: number;
        byOrientation: {
            portrait: number;
            landscape: number;
            square: number;
            unknown: number;
        };
    } {
        const total = images.length;
        const withAltText = images.filter(img => !!img.alt_text).length;
        const totalFileSize = images.reduce((sum, img) => sum + (img.file_size || 0), 0);
        const averageFileSize = total > 0 ? totalFileSize / total : 0;

        const orientationGroups = ProductImageHelper.groupByOrientation(images);
        const byOrientation = {
            portrait: orientationGroups.portrait.length,
            landscape: orientationGroups.landscape.length,
            square: orientationGroups.square.length,
            unknown: orientationGroups.unknown.length,
        };

        return {
            total,
            withAltText,
            totalFileSize,
            averageFileSize,
            byOrientation,
        };
    },

    // Générer des miniatures (simulé)
    generateThumbnails(images: ProductImage[], baseUrl: string): ProductImage[] {
        return images.map(img => {
            const clone = img.clone();
            const urlParts = img.url.split('.');
            const extension = urlParts.pop();
            const baseName = urlParts.join('.');

            clone.thumbnail_url = `${baseName}_thumb.${extension}`;
            clone.medium_url = `${baseName}_medium.${extension}`;
            clone.large_url = `${baseName}_large.${extension}`;

            return clone;
        });
    },

    // Valider les images
    validateImages(images: ProductImage[]): {
        valid: ProductImage[];
        invalid: ProductImage[];
        errors: Array<{ imageId: string; message: string }>;
    } {
        const valid: ProductImage[] = [];
        const invalid: ProductImage[] = [];
        const errors: Array<{ imageId: string; message: string }> = [];

        images.forEach(img => {
            if (!img.isValidForCreation()) {
                invalid.push(img);
                errors.push({
                    imageId: img.id || 'nouveau',
                    message: 'URL invalide',
                });
            } else if (!img.isSupportedFormat()) {
                invalid.push(img);
                errors.push({
                    imageId: img.id || 'nouveau',
                    message: `Format non supporté: ${img.file_type}`,
                });
            } else {
                valid.push(img);
            }
        });

        return { valid, invalid, errors };
    },
};

// Classe pour gérer la galerie d'images d'un produit
export class ProductGalleryManager {
    private images: Map<string, ProductImage> = new Map();

    constructor(images: ProductImage[] = []) {
        images.forEach(img => this.images.set(img.id, img));
    }

    // Ajouter une image
    addImage(image: ProductImage): void {
        this.images.set(image.id, image);
    }

    // Supprimer une image
    removeImage(imageId: string): boolean {
        return this.images.delete(imageId);
    }

    // Mettre à jour une image
    updateImage(imageId: string, data: Partial<ProductImage>): boolean {
        const image = this.images.get(imageId);
        if (!image) return false;

        image.update(data);
        return true;
    }

    // Définir une image comme principale
    setMainImage(imageId: string): boolean {
        // Désactiver toutes les images principales d'abord
        this.images.forEach(img => {
            if (img.is_main) {
                img.update({ is_main: false });
            }
        });

        // Activer la nouvelle image principale
        const image = this.images.get(imageId);
        if (!image) return false;

        image.update({ is_main: true });
        return true;
    }

    // Réordonner les images
    reorderImages(order: Array<{ id: string; order: number }>): void {
        order.forEach(({ id, order }) => {
            const image = this.images.get(id);
            if (image) {
                image.update({ order });
            }
        });
    }

    // Obtenir toutes les images triées
    getAllImages(): ProductImage[] {
        return Array.from(this.images.values())
            .sort((a, b) => a.order - b.order);
    }

    // Obtenir l'image principale
    getMainImage(): ProductImage | null {
        const images = this.getAllImages();
        return images.find(img => img.is_main) || images[0] || null;
    }

    // Obtenir les images secondaires
    getSecondaryImages(): ProductImage[] {
        const mainImage = this.getMainImage();
        return this.getAllImages().filter(img => img.id !== mainImage?.id);
    }

    // Obtenir les images par orientation
    getImagesByOrientation(orientation: 'portrait' | 'landscape' | 'square'): ProductImage[] {
        return this.getAllImages().filter(img => img.getOrientation() === orientation);
    }

    // Vérifier si une URL existe déjà
    hasUrl(url: string, excludeId?: string): boolean {
        return Array.from(this.images.values()).some(img =>
            img.url === url &&
            (!excludeId || img.id !== excludeId)
        );
    }

    // Obtenir les statistiques de la galerie
    getStats() {
        const images = this.getAllImages();
        return ProductImageHelper.getImageStats(images);
    }

    // Valider la galerie
    validate(): { isValid: boolean; errors: string[] } {
        const images = this.getAllImages();
        const { invalid, errors } = ProductImageHelper.validateImages(images);

        return {
            isValid: invalid.length === 0,
            errors: errors.map(e => `Image ${e.imageId}: ${e.message}`),
        };
    }

    // Cloner la galerie
    clone(): ProductGalleryManager {
        const clonedImages = this.getAllImages().map(img => img.clone());
        return new ProductGalleryManager(clonedImages);
    }

    // Exporter pour l'API
    exportForAPI(): CreateProductImageRequest[] {
        return this.getAllImages().map(img => img.toCreateRequest());
    }

    // Importer depuis les données API
    importFromAPI(apiData: any[]): void {
        this.images.clear();
        apiData.forEach(data => {
            const image = ProductImage.fromApiData(data);
            this.images.set(image.id, image);
        });
    }
}

// Types utilitaires pour les composants
export interface ImageUploadProgress {
    imageId: string;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
}

export interface ImageSelection {
    image: ProductImage;
    selected: boolean;
}

// Classe pour gérer les téléchargements d'images
export class ImageUploadManager {
    private uploads: Map<string, ImageUploadProgress> = new Map();

    // Ajouter un téléchargement
    addUpload(imageId: string): void {
        this.uploads.set(imageId, {
            imageId,
            progress: 0,
            status: 'pending',
        });
    }

    // Mettre à jour la progression
    updateProgress(imageId: string, progress: number): void {
        const upload = this.uploads.get(imageId);
        if (upload) {
            upload.progress = progress;
            upload.status = 'uploading';
        }
    }

    // Marquer comme réussi
    markAsSuccess(imageId: string): void {
        const upload = this.uploads.get(imageId);
        if (upload) {
            upload.progress = 100;
            upload.status = 'success';
        }
    }

    // Marquer comme erreur
    markAsError(imageId: string, error: string): void {
        const upload = this.uploads.get(imageId);
        if (upload) {
            upload.status = 'error';
            upload.error = error;
        }
    }

    // Obtenir l'état d'un téléchargement
    getUploadStatus(imageId: string): ImageUploadProgress | undefined {
        return this.uploads.get(imageId);
    }

    // Obtenir tous les téléchargements en cours
    getActiveUploads(): ImageUploadProgress[] {
        return Array.from(this.uploads.values())
            .filter(upload => upload.status === 'uploading' || upload.status === 'pending');
    }

    // Nettoyer les téléchargements terminés
    cleanupCompleted(): void {
        Array.from(this.uploads.keys()).forEach(key => {
            const upload = this.uploads.get(key)!;
            if (upload.status === 'success' || upload.status === 'error') {
                this.uploads.delete(key);
            }
        });
    }

    // Réinitialiser tous les téléchargements
    reset(): void {
        this.uploads.clear();
    }
}
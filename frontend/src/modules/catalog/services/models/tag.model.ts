// module/catalog/services/models/tag.model.ts

import type {
    CreateTagRequest, UpdateTagRequest
} from '../api/tags.api';

export class Tag {
    id: string;
    name: string;
    description?: string;
    color?: string;
    type?: string;
    created_at: Date;
    updated_at: Date;
    usage_count?: number; // Optionnel: pour suivre le nombre d'utilisations

    constructor(data: Partial<Tag> = {}) {
        this.id = data.id || '';
        this.name = data.name || '';
        this.description = data.description;
        this.color = data.color || this.generateDefaultColor();
        this.type = data.type;
        this.created_at = data.created_at ? new Date(data.created_at) : new Date();
        this.updated_at = data.updated_at ? new Date(data.updated_at) : new Date();
        this.usage_count = data.usage_count || 0;
    }

    // Factory method pour créer un tag à partir des données de l'API
    static fromApiData(data: any): Tag {
        return new Tag({
            id: data.id,
            name: data.name,
            description: data.description,
            color: data.color,
            type: data.type,
            created_at: data.created_at,
            updated_at: data.updated_at,
            usage_count: data.usage_count,
        });
    }

    // Convertir en format de requête pour l'API (création)
    toCreateRequest(): CreateTagRequest {
        return {
            name: this.name,
            description: this.description,
            color: this.color,
        };
    }

    // Convertir en format de requête pour l'API (mise à jour)
    toUpdateRequest(): UpdateTagRequest {
        return {
            name: this.name,
            description: this.description,
            color: this.color,
        };
    }

    // Vérifier si le tag est valide pour la création
    isValidForCreation(): boolean {
        return !!this.name.trim();
    }

    // Vérifier si le tag est valide pour la mise à jour
    isValidForUpdate(): boolean {
        return !!this.id && !!this.name.trim();
    }

    // Générer une couleur par défaut basée sur le nom
    generateDefaultColor(): string {
        // Si pas de couleur fournie, générer une couleur basée sur le hash du nom
        const colors = [
            '#3B82F6', // blue
            '#10B981', // emerald
            '#EF4444', // red
            '#F59E0B', // amber
            '#8B5CF6', // violet
            '#EC4899', // pink
            '#14B8A6', // teal
            '#F97316', // orange
            '#6366F1', // indigo
            '#84CC16', // lime
        ];

        // Simple hash du nom pour sélectionner une couleur
        let hash = 0;
        for (let i = 0; i < this.name.length; i++) {
            hash = this.name.charCodeAt(i) + ((hash << 5) - hash);
        }

        const index = Math.abs(hash) % colors.length;
        return colors[index];
    }

    // Vérifier si la couleur est claire (pour décider de la couleur du texte)
    isLightColor(): boolean {
        if (!this.color || !this.color.startsWith('#')) return false;

        const hex = this.color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Formule de luminance relative
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5;
    }

    // Obtenir la couleur du texte appropriée (noir ou blanc) selon la couleur de fond
    getTextColor(): string {
        return this.isLightColor() ? '#000000' : '#FFFFFF';
    }

    // Formater le tag pour l'affichage (avec ou sans couleur)
    getDisplayText(showHash = false): string {
        const prefix = showHash && this.name.startsWith('#') ? '' : '#';
        return `${prefix}${this.name}`;
    }

    // Vérifier si le tag correspond à un terme de recherche
    matchesSearch(searchTerm: string): boolean {
        const term = searchTerm.toLowerCase();
        return (
            this.name.toLowerCase().includes(term) ||
            (this.description && this.description.toLowerCase().includes(term)) ||
            false
        );
    }

    // Vérifier si le tag est populaire (basé sur le nombre d'utilisations)
    isPopular(threshold = 10): boolean {
        return (this.usage_count || 0) >= threshold;
    }

    // Cloner le tag
    clone(): Tag {
        return new Tag({
            ...this,
            created_at: new Date(this.created_at),
            updated_at: new Date(this.updated_at),
        });
    }

    // Mettre à jour les propriétés
    update(data: Partial<Tag>): void {
        Object.assign(this, data);
        this.updated_at = new Date();
    }

    // Incrémenter le compteur d'utilisation
    incrementUsage(): void {
        this.usage_count = (this.usage_count || 0) + 1;
        this.updated_at = new Date();
    }

    // Décrémenter le compteur d'utilisation
    decrementUsage(): void {
        this.usage_count = Math.max(0, (this.usage_count || 1) - 1);
        this.updated_at = new Date();
    }
}

// Helper functions
export const TagHelper = {
    // Filtrer les tags par recherche
    filterBySearch(tags: Tag[], searchTerm: string): Tag[] {
        if (!searchTerm.trim()) return tags;

        return tags.filter(tag => tag.matchesSearch(searchTerm));
    },

    // Trier les tags
    sortTags(
        tags: Tag[],
        sortBy: 'name' | 'created_at' | 'updated_at' | 'usage' = 'name',
        order: 'asc' | 'desc' = 'asc'
    ): Tag[] {
        const sorted = [...tags];

        switch (sortBy) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'created_at':
                sorted.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
                break;
            case 'updated_at':
                sorted.sort((a, b) => a.updated_at.getTime() - b.updated_at.getTime());
                break;
            case 'usage':
                sorted.sort((a, b) => (a.usage_count || 0) - (b.usage_count || 0));
                break;
        }

        return order === 'desc' ? sorted.reverse() : sorted;
    },

    // Grouper les tags par première lettre
    groupByFirstLetter(tags: Tag[]): Record<string, Tag[]> {
        const groups: Record<string, Tag[]> = {};

        tags.forEach(tag => {
            const firstLetter = tag.name.charAt(0).toUpperCase();
            if (!groups[firstLetter]) {
                groups[firstLetter] = [];
            }
            groups[firstLetter].push(tag);
        });

        return groups;
    },

    // Obtenir les tags les plus populaires
    getPopularTags(tags: Tag[], limit = 10): Tag[] {
        return TagHelper.sortTags(tags, 'usage', 'desc').slice(0, limit);
    },

    // Filtrer les tags par couleur
    filterByColor(tags: Tag[], color: string): Tag[] {
        return tags.filter(tag => tag.color === color);
    },

    // Trouver un tag par ID
    findById(tags: Tag[], id: string): Tag | undefined {
        return tags.find(tag => tag.id === id);
    },

    // Trouver des tags par nom (insensible à la casse)
    findByName(tags: Tag[], name: string): Tag[] {
        const normalized = name.toLowerCase();
        return tags.filter(tag => tag.name.toLowerCase() === normalized);
    },

    // Vérifier si un nom de tag existe déjà
    nameExists(tags: Tag[], name: string, excludeId?: string): boolean {
        const normalized = name.toLowerCase();
        return tags.some(tag =>
            tag.name.toLowerCase() === normalized &&
            (!excludeId || tag.id !== excludeId)
        );
    },

    // Convertir une liste de noms de tags en objets Tag
    createTagsFromNames(names: string[]): Tag[] {
        return names.map(name => new Tag({ name }));
    },

    // Extraire les tags d'un texte (séparés par des virgules, espaces, etc.)
    extractTagsFromText(text: string, separator = /[,\s]+/): string[] {
        return text
            .split(separator)
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
            .map(tag => tag.startsWith('#') ? tag.substring(1) : tag);
    },

    // Formater des tags pour l'affichage dans un champ de saisie
    formatTagsForInput(tags: Tag[]): string {
        return tags.map(tag => tag.name).join(', ');
    },

    // Calculer les statistiques des tags
    getTagStats(tags: Tag[]): {
        total: number;
        withColor: number;
        withDescription: number;
        averageUsage: number;
        mostUsed: Tag | null;
    } {
        const total = tags.length;
        const withColor = tags.filter(tag => !!tag.color).length;
        const withDescription = tags.filter(tag => !!tag.description).length;

        const totalUsage = tags.reduce((sum, tag) => sum + (tag.usage_count || 0), 0);
        const averageUsage = total > 0 ? totalUsage / total : 0;

        const mostUsed = tags.length > 0
            ? TagHelper.sortTags(tags, 'usage', 'desc')[0]
            : null;

        return {
            total,
            withColor,
            withDescription,
            averageUsage,
            mostUsed,
        };
    },
};

// Types utilitaires pour les composants
export interface TagSelection {
    tag: Tag;
    selected: boolean;
}

export interface TagGroup {
    letter: string;
    tags: Tag[];
}

// Classe pour gérer les sélections de tags
export class TagSelector {
    private selectedTags: Set<string> = new Set();

    constructor(initialSelection: string[] = []) {
        initialSelection.forEach(id => this.selectedTags.add(id));
    }

    // Basculer la sélection d'un tag
    toggleTag(tagId: string): void {
        if (this.selectedTags.has(tagId)) {
            this.selectedTags.delete(tagId);
        } else {
            this.selectedTags.add(tagId);
        }
    }

    // Sélectionner un tag
    selectTag(tagId: string): void {
        this.selectedTags.add(tagId);
    }

    // Désélectionner un tag
    deselectTag(tagId: string): void {
        this.selectedTags.delete(tagId);
    }

    // Vérifier si un tag est sélectionné
    isSelected(tagId: string): boolean {
        return this.selectedTags.has(tagId);
    }

    // Obtenir tous les IDs sélectionnés
    getSelectedIds(): string[] {
        return Array.from(this.selectedTags);
    }

    // Obtenir les tags sélectionnés à partir d'une liste complète
    getSelectedTags(allTags: Tag[]): Tag[] {
        return allTags.filter(tag => this.selectedTags.has(tag.id));
    }

    // Sélectionner tous les tags
    selectAll(tagIds: string[]): void {
        tagIds.forEach(id => this.selectedTags.add(id));
    }

    // Désélectionner tous les tags
    deselectAll(): void {
        this.selectedTags.clear();
    }

    // Vérifier si tous les tags sont sélectionnés
    areAllSelected(tagIds: string[]): boolean {
        return tagIds.every(id => this.selectedTags.has(id));
    }

    // Nombre de tags sélectionnés
    getSelectedCount(): number {
        return this.selectedTags.size;
    }

    // Effacer la sélection
    clear(): void {
        this.selectedTags.clear();
    }
}

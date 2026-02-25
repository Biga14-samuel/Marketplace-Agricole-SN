// module/catalog/services/models/category.model.ts

import type {
    CreateCategoryRequest, UpdateCategoryRequest
} from '../api/categories.api';

const slugifyCategory = (value: string): string =>
    (
        value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'categorie'
    );

export class Category {
    id: string;
    name: string;
    description?: string;
    slug?: string;
    icon?: string;
    color?: string;
    is_active?: boolean;
    product_count?: number;
    parent_id?: string | null;
    order: number;
    created_at: Date;
    updated_at: Date;

    constructor(data: Partial<Category> = {}) {
        this.id = data.id || '';
        this.name = data.name || '';
        this.description = data.description;
        this.slug = data.slug;
        this.icon = data.icon;
        this.color = data.color;
        this.is_active = data.is_active ?? true;
        this.product_count = data.product_count;
        this.parent_id = data.parent_id || null;
        this.order = data.order || 0;
        this.created_at = data.created_at ? new Date(data.created_at) : new Date();
        this.updated_at = data.updated_at ? new Date(data.updated_at) : new Date();
    }

    // Factory method pour créer une nouvelle catégorie à partir des données de l'API
    static fromApiData(data: any): Category {
        return new Category({
            id: data.id,
            name: data.name,
            description: data.description,
            slug: data.slug,
            icon: data.icon,
            color: data.color,
            is_active: data.is_active,
            product_count: data.product_count,
            parent_id: data.parent_id,
            order: data.order ?? data.position ?? 0,
            created_at: data.created_at,
            updated_at: data.updated_at,
        });
    }

    // Convertir en format de requête pour l'API (création)
    toCreateRequest(): CreateCategoryRequest {
        const slugValue = slugifyCategory(this.slug || this.name);
        return {
            name: this.name,
            slug: slugValue,
            description: this.description,
            icon: this.icon,
            parent_id: this.parent_id,
            order: this.order,
            position: this.order,
            is_active: this.is_active,
        };
    }

    // Convertir en format de requête pour l'API (mise à jour)
    toUpdateRequest(): UpdateCategoryRequest {
        const slugValue = this.slug ? slugifyCategory(this.slug) : undefined;
        return {
            name: this.name,
            slug: slugValue,
            description: this.description,
            icon: this.icon,
            parent_id: this.parent_id,
            order: this.order,
            position: this.order,
            is_active: this.is_active,
        };
    }

    // Vérifier si la catégorie est valide pour la création
    isValidForCreation(): boolean {
        return !!this.name.trim();
    }

    // Vérifier si la catégorie est valide pour la mise à jour
    isValidForUpdate(): boolean {
        return !!this.id && !!this.name.trim();
    }

    // Obtenir le chemin d'affichage (pour l'arborescence)
    getDisplayPath(categories: Category[]): string {
        if (!this.parent_id) {
            return this.name;
        }

        const parent = categories.find(cat => cat.id === this.parent_id);
        if (!parent) {
            return this.name;
        }

        return `${parent.getDisplayPath(categories)} / ${this.name}`;
    }

    // Vérifier si la catégorie a des enfants
    hasChildren(categories: Category[]): boolean {
        return categories.some(cat => cat.parent_id === this.id);
    }

    // Obtenir les enfants directs
    getChildren(categories: Category[]): Category[] {
        return categories
            .filter(cat => cat.parent_id === this.id)
            .sort((a, b) => a.order - b.order);
    }

    // Vérifier si la catégorie est un descendant d'une autre catégorie
    isDescendantOf(parentId: string, categories: Category[]): boolean {
        if (!this.parent_id) return false;
        if (this.parent_id === parentId) return true;

        const parent = categories.find(cat => cat.id === this.parent_id);
        if (!parent) return false;

        return parent.isDescendantOf(parentId, categories);
    }

    // Cloner la catégorie
    clone(): Category {
        return new Category({
            ...this,
            created_at: new Date(this.created_at),
            updated_at: new Date(this.updated_at),
        });
    }
}

export class CategoryTree extends Category {
    children: CategoryTree[];

    constructor(data: Partial<CategoryTree> = {}) {
        super(data);
        this.children = data.children || [];
    }

    // Factory method pour créer un arbre de catégories à partir des données de l'API
    static fromApiData(data: any): CategoryTree {
        const rawChildren = data.children ?? data.subcategories;
        const children = Array.isArray(rawChildren)
            ? rawChildren.map((child: any) => CategoryTree.fromApiData(child))
            : [];

        return new CategoryTree({
            id: data.id,
            name: data.name,
            description: data.description,
            slug: data.slug,
            icon: data.icon,
            color: data.color,
            is_active: data.is_active,
            product_count: data.product_count,
            parent_id: data.parent_id,
            order: data.order ?? data.position ?? 0,
            created_at: data.created_at,
            updated_at: data.updated_at,
            children,
        });
    }

    // Convertir une liste plate en arbre
    static buildTreeFromList(categories: Category[]): CategoryTree[] {
        const categoryMap = new Map<string, CategoryTree>();
        const roots: CategoryTree[] = [];

        // Créer des nœuds d'arbre
        categories.forEach(category => {
            categoryMap.set(category.id, new CategoryTree({
                ...category,
                children: [],
            }));
        });

        // Construire la hiérarchie
        categories.forEach(category => {
            const treeNode = categoryMap.get(category.id)!;

            if (!category.parent_id) {
                roots.push(treeNode);
            } else {
                const parent = categoryMap.get(category.parent_id);
                if (parent) {
                    parent.children.push(treeNode);
                }
            }
        });

        // Trier les enfants par ordre
        categoryMap.forEach(node => {
            node.children.sort((a, b) => a.order - b.order);
        });

        // Trier les racines par ordre
        roots.sort((a, b) => a.order - b.order);

        return roots;
    }

    // Aplatir l'arbre en liste
    flatten(): Category[] {
        const result: Category[] = [new Category(this)];

        this.children.forEach(child => {
            result.push(...child.flatten());
        });

        return result;
    }

    // Trouver un nœud dans l'arbre par ID
    findNodeById(id: string): CategoryTree | null {
        if (this.id === id) {
            return this;
        }

        for (const child of this.children) {
            const found = child.findNodeById(id);
            if (found) {
                return found;
            }
        }

        return null;
    }

    // Obtenir tous les descendants
    getAllDescendants(): CategoryTree[] {
        const descendants: CategoryTree[] = [];

        for (const child of this.children) {
            descendants.push(child, ...child.getAllDescendants());
        }

        return descendants;
    }

    // Vérifier si le nœud est une feuille
    isLeaf(): boolean {
        return this.children.length === 0;
    }

    // Obtenir la profondeur dans l'arbre
    getDepth(): number {
        if (this.children.length === 0) {
            return 1;
        }

        const maxChildDepth = Math.max(...this.children.map(child => child.getDepth()));
        return maxChildDepth + 1;
    }

    // Formater pour l'affichage avec indentation
    getFormattedName(level = 0): string {
        const indent = '  '.repeat(level);
        return `${indent}${this.name}`;
    }

    // Parcourir l'arbre en profondeur d'abord
    traverseDepthFirst(callback: (node: CategoryTree, depth: number) => void, depth = 0): void {
        callback(this, depth);
        this.children.forEach(child => {
            child.traverseDepthFirst(callback, depth + 1);
        });
    }

    // Parcourir l'arbre en largeur d'abord
    traverseBreadthFirst(callback: (node: CategoryTree, depth: number) => void): void {
        const queue: { node: CategoryTree; depth: number }[] = [{ node: this, depth: 0 }];

        while (queue.length > 0) {
            const { node, depth } = queue.shift()!;
            callback(node, depth);

            node.children.forEach(child => {
                queue.push({ node: child, depth: depth + 1 });
            });
        }
    }
}

// Helper functions
export const CategoryHelper = {
    // Filtrer les catégories par parent
    filterByParent(categories: Category[], parentId: string | null): Category[] {
        return categories
            .filter(category => category.parent_id === parentId)
            .sort((a, b) => a.order - b.order);
    },

    // Trouver une catégorie par ID
    findById(categories: Category[], id: string): Category | undefined {
        return categories.find(category => category.id === id);
    },

    // Obtenir le chemin complet d'une catégorie
    getFullPath(categories: Category[], categoryId: string): string[] {
        const path: string[] = [];
        let currentId: string | null | undefined = categoryId;

        while (currentId) {
            const category = CategoryHelper.findById(categories, currentId);
            if (!category) break;

            path.unshift(category.name);
            currentId = category.parent_id;
        }

        return path;
    },

    // Vérifier si une catégorie peut être supprimée (n'a pas d'enfants)
    canDelete(categories: Category[], categoryId: string): boolean {
        return !categories.some(cat => cat.parent_id === categoryId);
    },

    // Obtenir le niveau maximum de profondeur
    getMaxDepth(categories: Category[]): number {
        const depths = categories.map(category => {
            const path = CategoryHelper.getFullPath(categories, category.id);
            return path.length;
        });

        return Math.max(0, ...depths);
    },

    // Générer un sélecteur de catégories hiérarchique
    generateHierarchicalSelectOptions(
        categories: Category[],
        parentId: string | null = null,
        level = 0
    ): { value: string; label: string; disabled?: boolean }[] {
        const options: { value: string; label: string; disabled?: boolean }[] = [];

        const children = CategoryHelper.filterByParent(categories, parentId);

        children.forEach(category => {
            const indent = '─ '.repeat(level);
            options.push({
                value: category.id,
                label: `${indent}${category.name}`,
            });

            options.push(...CategoryHelper.generateHierarchicalSelectOptions(categories, category.id, level + 1));
        });

        return options;
    },
};

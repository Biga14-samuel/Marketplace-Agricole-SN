// frontend/src/modules/user-profiles/producer/types/ProducerDocument.ts

/**
 * Types pour les documents des producteurs
 * Gestion des documents légaux, certifications et attestations
 */

// ==================== ENUMS ====================

/**
 * Type de document légal pour les producteurs
 */
export enum DocumentType {
    // Documents d'identification légale
    KBIS = 'kbis',                    // Extrait Kbis / Statuts
    SIRET = 'siret',                  // Attestation SIRET
    TVA_CERTIFICATE = 'tva_certificate', // Certificat d'assujettissement TVA
    IDENTITY = 'identity',            // Pièce d'identité du responsable
    RIB = 'rib',                      // Relevé d'identité bancaire

    // Assurances
    INSURANCE_CIVIL = 'insurance_civil', // Assurance responsabilité civile
    INSURANCE_PRODUCT = 'insurance_product', // Assurance produits

    // Certifications professionnelles
    CERTIFICATION_ORGANIC = 'certification_organic', // Certificat AB/Bio
    CERTIFICATION_HVE = 'certification_hve', // Haute Valeur Environnementale
    CERTIFICATION_DEMETER = 'certification_demeter', // Biodynamie Demeter
    CERTIFICATION_FAIRTRADE = 'certification_fairtrade', // Commerce équitable

    // Hygiène et sécurité
    HYGIENE_CERTIFICATE = 'hygiène_certificate', // Certificat d'hygiène
    SANITARY_REGISTRATION = 'sanitary_registration', // Agrément sanitaire
    HACCP = 'haccp',                    // Plan HACCP

    // Accords et autorisations
    ENVIRONMENTAL_AGREEMENT = 'environmental_agreement', // Accord environnemental
    WATER_RIGHT = 'water_right',        // Droit d'eau
    BUILDING_PERMIT = 'building_permit', // Permis de construire

    // Contrats et conventions
    DISTRIBUTION_CONTRACT = 'distribution_contract', // Contrat de distribution
    LEASE_AGREEMENT = 'lease_agreement', // Bail agricole
    LAND_TITLE = 'land_title',         // Titre de propriété

    // Autres
    PRODUCT_SPECIFICATIONS = 'product_specifications', // Cahier des charges produits
    QUALITY_CHARTER = 'quality_charter', // Charte qualité
    OTHER = 'other'                    // Autre document
}

/**
 * Statut de vérification d'un document
 */
export enum DocumentStatus {
    PENDING = 'pending',              // En attente de téléchargement
    UPLOADED = 'uploaded',           // Téléchargé, en attente de vérification
    UNDER_REVIEW = 'under_review',   // En cours de vérification
    VERIFIED = 'verified',           // Vérifié et approuvé
    REJECTED = 'rejected',           // Rejeté
    EXPIRED = 'expired',             // Expiré
    REQUIRES_UPDATE = 'requires_update' // Nécessite une mise à jour
}

/**
 * Catégorie de document
 */
export enum DocumentCategory {
    LEGAL = 'legal',                 // Documents légaux
    FINANCIAL = 'financial',         // Documents financiers
    CERTIFICATION = 'certification', // Certifications
    INSURANCE = 'insurance',         // Assurances
    HYGIENE = 'hygiene',             // Hygiène et sécurité
    ENVIRONMENTAL = 'environmental', // Environnement
    CONTRACTUAL = 'contractual',     // Contrats
    OTHER = 'other'                  // Autres
}

/**
 * Niveau d'importance du document
 */
export enum DocumentPriority {
    MANDATORY = 'mandatory',         // Obligatoire pour la vérification
    IMPORTANT = 'important',         // Important mais pas bloquant
    OPTIONAL = 'optional',           // Optionnel
    INFORMATIONAL = 'informational'  // Informatif seulement
}

// ==================== INTERFACES PRINCIPALES ====================

/**
 * Document complet d'un producteur
 */
export interface ProducerDocument {
    // Identifiants
    id: string;
    producer_id: string;
    document_number?: string;        // Numéro du document (ex: numéro de certification)

    // Informations du document
    type: DocumentType;
    category: DocumentCategory;
    priority: DocumentPriority;
    title: string;                  // Nom du document (généré ou personnalisé)
    description?: string;           // Description détaillée

    // Fichier
    file_name: string;
    file_size: number;              // en bytes
    file_type: string;              // MIME type (ex: application/pdf)
    file_path: string;              // Chemin sur le serveur
    thumbnail_path?: string;        // Miniature pour les images
    file_url?: string;              // URL de téléchargement direct

    // Dates
    issue_date?: string;            // Date d'émission du document
    expiration_date?: string;       // Date d'expiration
    uploaded_at: string;
    verified_at?: string;
    updated_at: string;

    // Vérification
    status: DocumentStatus;
    verification_status: DocumentStatus;  // Alias pour compatibilité
    verified: boolean;  // Calculé depuis status
    verified_by?: string;           // ID de l'administrateur qui a vérifié
    verified_by_name?: string;      // Nom de l'administrateur
    rejection_reason?: string;      // Raison du rejet si status = REJECTED
    verification_notes?: string;    // Notes internes de vérification

    // Métadonnées
    metadata?: {
        issuer?: string;              // Émetteur du document (État, organisme, etc.)
        reference_number?: string;    // Numéro de référence
        coverage_amount?: number;     // Montant de couverture (assurances)
        coverage_period?: string;     // Période de couverture
        authorized_by?: string;       // Autorité ayant délivré le document
        pages?: number;               // Nombre de pages
        is_original?: boolean;        // Document original ou copie
        tags?: string[];              // Tags supplémentaires
    };

    // Relations
    related_documents?: string[];   // IDs des documents liés
    version?: number;               // Version du document
    previous_version_id?: string;   // ID de la version précédente
}

/**
 * Document téléchargé (pour l'upload)
 */
export interface UploadedDocument {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    upload_progress?: number;       // Pourcentage d'upload (0-100)
    upload_status: 'pending' | 'uploading' | 'completed' | 'error';
    error_message?: string;
}

/**
 * Données pour télécharger un nouveau document
 */
export interface UploadDocumentRequest {
    type: DocumentType;
    file: File;
    title?: string;
    name?: string;  // Alias pour title
    description?: string;
    issue_date?: string;
    expiration_date?: string;
    expires_at?: string | Date;  // Alias pour expiration_date
    metadata?: Record<string, unknown>;
    is_original?: boolean;
}

// Alias pour compatibilité
export type ProducerDocumentUpload = UploadDocumentRequest;

/**
 * Réponse après upload réussi
 */
export interface UploadDocumentResponse {
    success: boolean;
    document: ProducerDocument;
    message?: string;
    warnings?: string[];
}

/**
 * Données pour mettre à jour un document existant
 */
export interface UpdateDocumentRequest {
    title?: string;
    description?: string;
    issue_date?: string;
    expiration_date?: string;
    status?: DocumentStatus;
    metadata?: Record<string, any>;
}

/**
 * Vérification d'un document (par administrateur)
 */
export interface DocumentVerificationRequest {
    status: DocumentStatus;
    verified_by?: string;
    rejection_reason?: string;
    verification_notes?: string;
    notify_producer?: boolean;      // Envoyer une notification au producteur
}

/**
 * Configuration des exigences documentaires par type
 */
export interface DocumentRequirement {
    type: DocumentType;
    category: DocumentCategory;
    priority: DocumentPriority;
    title: string;
    description: string;
    is_required: boolean;
    validity_period?: number;       // Durée de validité en mois
    accepted_formats: string[];     // Formats acceptés (ex: ['.pdf', '.jpg'])
    max_file_size: number;          // Taille max en bytes
    help_text?: string;
    validation_rules?: {
        min_size?: number;            // Taille minimale (pour les images)
        max_size?: number;            // Taille maximale
        aspect_ratio?: string;        // Ratio d'aspect (ex: '16:9')
        required_fields?: string[];   // Champs requis dans le document
    };
}

// ==================== DOCUMENT BATCH OPERATIONS ====================

/**
 * Opération par lot sur des documents
 */
export interface DocumentBatchOperation {
    document_ids: string[];
    operation: 'verify' | 'reject' | 'archive' | 'delete';
    parameters?: Record<string, any>;
}

export interface BatchOperationResponse {
    success: boolean;
    processed: number;
    succeeded: number;
    failed: number;
    results: Array<{
        document_id: string;
        success: boolean;
        message?: string;
        error?: string;
    }>;
}

// ==================== DOCUMENT STATISTICS ====================

/**
 * Statistiques sur les documents d'un producteur
 */
export interface DocumentStats {
    total: number;
    by_status: Record<DocumentStatus, number>;
    by_category: Record<DocumentCategory, number>;
    by_priority: Record<DocumentPriority, number>;
    verified: number;
    pending_verification: number;
    expired: number;
    expiring_soon: number;          // Documents expirant dans les 30 jours
    missing_required: number;       // Documents obligatoires manquants
    completeness_percentage: number; // Pourcentage de complétude
}

/**
 * Rapport d'expiration des documents
 */
export interface ExpirationReport {
    expiring_soon: ProducerDocument[];    // Expire dans < 30 jours
    expired: ProducerDocument[];          // Déjà expirés
    upcoming_expirations: Array<{
        document: ProducerDocument;
        days_until_expiration: number;
    }>;
}

// ==================== DOCUMENT TEMPLATES ====================

/**
 * Template pour générer des documents
 */
export interface DocumentTemplate {
    id: string;
    name: string;
    type: DocumentType;
    description?: string;
    template_file: string;          // Chemin du template
    variables: string[];            // Variables à remplacer
    output_format: 'pdf' | 'docx' | 'html';
    is_active: boolean;
}

/**
 * Données pour générer un document à partir d'un template
 */
export interface GenerateDocumentRequest {
    template_id: string;
    variables: Record<string, string>;
    output_format?: 'pdf' | 'docx' | 'html';
    producer_id?: string;
}

// ==================== API RESPONSES ====================

/**
 * Réponse pour la liste paginée des documents
 */
export interface DocumentListResponse {
    documents: ProducerDocument[];
    stats: DocumentStats;
    pagination: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
        has_next: boolean;
        has_previous: boolean;
    };
    filters?: {
        status?: DocumentStatus[];
        category?: DocumentCategory[];
        type?: DocumentType[];
        priority?: DocumentPriority[];
        search?: string;
    };
}

/**
 * Réponse pour les exigences documentaires
 */
export interface DocumentRequirementsResponse {
    requirements: DocumentRequirement[];
    producer_id: string;
    completeness: {
        percentage: number;
        required_completed: number;
        required_total: number;
        optional_completed: number;
        optional_total: number;
    };
    missing_documents: DocumentRequirement[];
    expired_documents: ProducerDocument[];
}

/**
 * Réponse de vérification de document
 */
export interface VerificationResponse {
    success: boolean;
    document: ProducerDocument;
    message: string;
    next_steps?: Array<{
        action: string;
        description: string;
        priority: 'high' | 'medium' | 'low';
    }>;
}

// ==================== EVENT TYPES ====================

/**
 * Événements liés aux documents
 */
export interface DocumentEvent {
    id: string;
    document_id: string;
    producer_id: string;
    type: 'upload' | 'verification' | 'rejection' | 'expiration' | 'update';
    action: string;
    performed_by: string;
    performed_by_name?: string;
    metadata?: Record<string, any>;
    created_at: string;
}

// ==================== HELPER TYPES ====================

/**
 * Filtres pour la recherche de documents
 */
export interface DocumentFilters {
    search?: string;
    status?: DocumentStatus[];
    category?: DocumentCategory[];
    type?: DocumentType[];
    priority?: DocumentPriority[];
    date_from?: string;
    date_to?: string;
    expired_only?: boolean;
    expiring_soon?: boolean;        // Expire dans les 30 jours
    missing_required?: boolean;     // Documents obligatoires manquants
    verified_only?: boolean;
    sort_by?: 'uploaded_at' | 'expiration_date' | 'title' | 'status';
    sort_order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

/**
 * Options d'affichage des documents
 */
export interface DocumentViewOptions {
    group_by?: 'category' | 'status' | 'priority' | 'type' | 'none';
    show_expired?: boolean;
    show_optional?: boolean;
    show_metadata?: boolean;
    compact_view?: boolean;
}

/**
 * Configuration de la galerie de documents
 */
export interface DocumentGalleryConfig {
    show_previews: boolean;
    preview_size: 'small' | 'medium' | 'large';
    allow_download: boolean;
    allow_print: boolean;
    show_qr_codes: boolean;         // QR code pour partage
    watermark_enabled: boolean;     // Filigrane sur les previews
    max_previews_per_page: number;
}

// ==================== VALIDATION TYPES ====================

/**
 * Résultat de validation d'un document
 */
export interface DocumentValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
    metadata_extracted?: Record<string, any>;
}

/**
 * Règles de validation pour un type de document
 */
export interface DocumentValidationRules {
    type: DocumentType;
    required_fields: string[];
    format_requirements: {
        allowed_extensions: string[];
        max_file_size_mb: number;
        min_file_size_kb?: number;
        allowed_mime_types: string[];
    };
    content_requirements?: {
        min_pages?: number;
        max_pages?: number;
        required_text?: string[];     // Textes qui doivent apparaître
        prohibited_text?: string[];   // Textes interdits
    };
    metadata_requirements?: {
        required_keys: string[];
        validation_rules: Record<string, (value: unknown) => boolean>;
    };
}

// ==================== EXPORT/IMPORT TYPES ====================

/**
 * Configuration d'export de documents
 */
export interface ExportConfig {
    format: 'pdf' | 'zip' | 'excel' | 'json';
    include_files: boolean;
    include_metadata: boolean;
    include_verification_history: boolean;
    compression_level?: 'none' | 'low' | 'high';
    password_protected?: boolean;
    expiration_days?: number;       // Lien d'export expirant après X jours
}

/**
 * Données d'export
 */
export interface ExportData {
    producer_info: {
        business_name: string;
        siret: string;
        contact_email: string;
    };
    documents: ProducerDocument[];
    stats: DocumentStats;
    export_date: string;
    export_id: string;
}

/**
 * Résultat d'export
 */
export interface ExportResult {
    success: boolean;
    export_id: string;
    download_url: string;
    file_size: number;
    expires_at: string;
    message?: string;
}

// ==================== NOTIFICATION TYPES ====================

/**
 * Notification liée aux documents
 */
export interface DocumentNotification {
    id: string;
    type: 'expiration_warning' | 'verification_complete' | 'verification_rejected' | 'new_requirement';
    document_id?: string;
    document_type?: DocumentType;
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    action_required: boolean;
    actions?: Array<{
        label: string;
        action: string;
        url?: string;
    }>;
    created_at: string;
    read: boolean;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Obtient les informations d'affichage pour un type de document
 */
export const getDocumentTypeInfo = (type: DocumentType) => {
    const typeInfo: Record<DocumentType, {
        label: string;
        description: string;
        icon: string;
        color: string;
    }> = {
        [DocumentType.KBIS]: {
            label: 'Extrait Kbis',
            description: 'Document officiel attestant de l\'existence légale de l\'entreprise',
            icon: 'document-text',
            color: 'blue'
        },
        [DocumentType.SIRET]: {
            label: 'Attestation SIRET',
            description: 'Justificatif du numéro SIRET de l\'entreprise',
            icon: 'identification',
            color: 'indigo'
        },
        [DocumentType.TVA_CERTIFICATE]: {
            label: 'Certificat TVA',
            description: 'Attestation d\'assujettissement à la TVA',
            icon: 'currency-euro',
            color: 'green'
        },
        [DocumentType.IDENTITY]: {
            label: 'Pièce d\'identité',
            description: 'Carte d\'identité ou passeport du responsable',
            icon: 'user',
            color: 'gray'
        },
        [DocumentType.RIB]: {
            label: 'RIB',
            description: 'Relevé d\'identité bancaire',
            icon: 'banknotes',
            color: 'emerald'
        },
        [DocumentType.INSURANCE_CIVIL]: {
            label: 'Assurance RC',
            description: 'Assurance responsabilité civile professionnelle',
            icon: 'shield-check',
            color: 'red'
        },
        [DocumentType.INSURANCE_PRODUCT]: {
            label: 'Assurance produits',
            description: 'Assurance des produits commercialisés',
            icon: 'shield-exclamation',
            color: 'orange'
        },
        [DocumentType.CERTIFICATION_ORGANIC]: {
            label: 'Certification Bio',
            description: 'Certificat d\'agriculture biologique',
            icon: 'leaf',
            color: 'green'
        },
        [DocumentType.CERTIFICATION_HVE]: {
            label: 'Certification HVE',
            description: 'Haute Valeur Environnementale niveau 3',
            icon: 'sparkles',
            color: 'emerald'
        },
        [DocumentType.CERTIFICATION_DEMETER]: {
            label: 'Certification Demeter',
            description: 'Certificat d\'agriculture biodynamique',
            icon: 'moon',
            color: 'purple'
        },
        [DocumentType.CERTIFICATION_FAIRTRADE]: {
            label: 'Commerce équitable',
            description: 'Certification de commerce équitable',
            icon: 'hand-raised',
            color: 'amber'
        },
        [DocumentType.HYGIENE_CERTIFICATE]: {
            label: 'Certificat d\'hygiène',
            description: 'Attestation de conformité aux normes d\'hygiène',
            icon: 'beaker',
            color: 'sky'
        },
        [DocumentType.SANITARY_REGISTRATION]: {
            label: 'Agrément sanitaire',
            description: 'Agrément des établissements pour la production alimentaire',
            icon: 'clipboard-document-check',
            color: 'red'
        },
        [DocumentType.HACCP]: {
            label: 'Plan HACCP',
            description: 'Plan de maîtrise des risques sanitaires',
            icon: 'chart-bar',
            color: 'blue'
        },
        [DocumentType.ENVIRONMENTAL_AGREEMENT]: {
            label: 'Accord environnemental',
            description: 'Accord avec les autorités environnementales',
            icon: 'globe-europe-africa',
            color: 'emerald'
        },
        [DocumentType.WATER_RIGHT]: {
            label: 'Droit d\'eau',
            description: 'Autorisation d\'utilisation des ressources en eau',
            icon: 'droplets',
            color: 'blue'
        },
        [DocumentType.BUILDING_PERMIT]: {
            label: 'Permis de construire',
            description: 'Autorisation de construction des bâtiments agricoles',
            icon: 'building-office',
            color: 'gray'
        },
        [DocumentType.DISTRIBUTION_CONTRACT]: {
            label: 'Contrat de distribution',
            description: 'Contrats avec les distributeurs',
            icon: 'document-duplicate',
            color: 'indigo'
        },
        [DocumentType.LEASE_AGREEMENT]: {
            label: 'Bail agricole',
            description: 'Contrat de location des terres agricoles',
            icon: 'home',
            color: 'amber'
        },
        [DocumentType.LAND_TITLE]: {
            label: 'Titre de propriété',
            description: 'Acte de propriété des terres',
            icon: 'map',
            color: 'green'
        },
        [DocumentType.PRODUCT_SPECIFICATIONS]: {
            label: 'Cahier des charges',
            description: 'Spécifications techniques des produits',
            icon: 'clipboard-document-list',
            color: 'purple'
        },
        [DocumentType.QUALITY_CHARTER]: {
            label: 'Charte qualité',
            description: 'Engagements qualité du producteur',
            icon: 'trophy',
            color: 'amber'
        },
        [DocumentType.OTHER]: {
            label: 'Autre document',
            description: 'Document divers',
            icon: 'document',
            color: 'gray'
        }
    };

    return typeInfo[type] || typeInfo[DocumentType.OTHER];
};

/**
 * Vérifie si un document a expiré
 */
export const isDocumentExpired = (document: ProducerDocument): boolean => {
    if (!document.expiration_date) return false;
    const expirationDate = new Date(document.expiration_date);
    const now = new Date();
    return expirationDate < now;
};

/**
 * Calcule le nombre de jours avant expiration
 */
export const daysUntilExpiration = (document: ProducerDocument): number | null => {
    if (!document.expiration_date) return null;
    const expirationDate = new Date(document.expiration_date);
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Vérifie si un document expire bientôt (dans les 30 jours)
 */
export const isExpiringSoon = (document: ProducerDocument): boolean => {
    const days = daysUntilExpiration(document);
    return days !== null && days > 0 && days <= 30;
};

/**
 * Obtient la classe de couleur CSS pour le statut d'un document
 */
export const getStatusColor = (status: DocumentStatus): string => {
    const colors: Record<DocumentStatus, string> = {
        [DocumentStatus.PENDING]: 'bg-gray-100 text-gray-800',
        [DocumentStatus.UPLOADED]: 'bg-blue-100 text-blue-800',
        [DocumentStatus.UNDER_REVIEW]: 'bg-amber-100 text-amber-800',
        [DocumentStatus.VERIFIED]: 'bg-green-100 text-green-800',
        [DocumentStatus.REJECTED]: 'bg-red-100 text-red-800',
        [DocumentStatus.EXPIRED]: 'bg-orange-100 text-orange-800',
        [DocumentStatus.REQUIRES_UPDATE]: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || colors[DocumentStatus.PENDING];
};

/**
 * Obtient l'icône pour un type de document
 */
export const getDocumentIcon = (type: DocumentType): string => {
    const icons: Record<DocumentType, string> = {
        [DocumentType.KBIS]: 'document-text',
        [DocumentType.SIRET]: 'identification',
        [DocumentType.TVA_CERTIFICATE]: 'currency-euro',
        [DocumentType.IDENTITY]: 'user',
        [DocumentType.RIB]: 'banknotes',
        [DocumentType.INSURANCE_CIVIL]: 'shield-check',
        [DocumentType.INSURANCE_PRODUCT]: 'shield-exclamation',
        [DocumentType.CERTIFICATION_ORGANIC]: 'leaf',
        [DocumentType.CERTIFICATION_HVE]: 'sparkles',
        [DocumentType.CERTIFICATION_DEMETER]: 'moon',
        [DocumentType.CERTIFICATION_FAIRTRADE]: 'hand-raised',
        [DocumentType.HYGIENE_CERTIFICATE]: 'beaker',
        [DocumentType.SANITARY_REGISTRATION]: 'clipboard-document-check',
        [DocumentType.HACCP]: 'chart-bar',
        [DocumentType.ENVIRONMENTAL_AGREEMENT]: 'globe-europe-africa',
        [DocumentType.WATER_RIGHT]: 'droplets',
        [DocumentType.BUILDING_PERMIT]: 'building-office',
        [DocumentType.DISTRIBUTION_CONTRACT]: 'document-duplicate',
        [DocumentType.LEASE_AGREEMENT]: 'home',
        [DocumentType.LAND_TITLE]: 'map',
        [DocumentType.PRODUCT_SPECIFICATIONS]: 'clipboard-document-list',
        [DocumentType.QUALITY_CHARTER]: 'trophy',
        [DocumentType.OTHER]: 'document'
    };
    return icons[type] || icons[DocumentType.OTHER];
};

/**
 * Formatte la taille d'un fichier de manière lisible
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Vérifie si un type de document est obligatoire
 */
export const isDocumentRequired = (type: DocumentType): boolean => {
    const requiredTypes: DocumentType[] = [
        DocumentType.KBIS,
        DocumentType.SIRET,
        DocumentType.IDENTITY,
        DocumentType.INSURANCE_CIVIL,
        DocumentType.HYGIENE_CERTIFICATE,
        DocumentType.RIB
    ];
    return requiredTypes.includes(type);
};

/**
 * Génère un nom de fichier sécurisé
 */
export const generateSafeFilename = (originalName: string, producerId: string, type: DocumentType): string => {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop() || '';
    const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_');
    return `${producerId}_${type}_${baseName}_${timestamp}_${random}.${extension}`.toLowerCase();
};

// ==================== EXPORTS ====================

export type {
    ProducerDocument as Document,
    UploadDocumentRequest as NewDocument,
    UpdateDocumentRequest as DocumentUpdate,
    DocumentListResponse as PaginatedDocuments,
    DocumentStats as DocumentStatistics,
    DocumentValidationResult as ValidationResult
};

/**
 * Type guard pour vérifier si un objet est un ProducerDocument
 */
export const isProducerDocument = (obj: any): obj is ProducerDocument => {
    return obj &&
        typeof obj.id === 'string' &&
        typeof obj.producer_id === 'string' &&
        typeof obj.type === 'string' &&
        typeof obj.title === 'string' &&
        typeof obj.file_name === 'string' &&
        typeof obj.status === 'string' &&
        typeof obj.uploaded_at === 'string';
};
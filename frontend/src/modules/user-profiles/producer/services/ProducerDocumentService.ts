import api from '@/shared/services/api';
import type {
    ProducerDocument,
    ProducerDocumentUpload,
    ProducerDocumentUpdate,
    DocumentType,
    VerificationRequest,
    VerificationStatus
} from '../types';

export const ProducerDocumentService = {
    // ============================================
    // CRUD DOCUMENTS
    // ============================================

    /**
     * Télécharger un nouveau document
     * POST /api/v1/producer-profiles/producers/documents
     */
    async uploadDocument(documentData: ProducerDocumentUpload): Promise<ProducerDocument> {
        const formData = new FormData();

        // Ajouter le fichier
        formData.append('file', documentData.file);
        formData.append('type', documentData.type);

        // Ajouter les métadonnées optionnelles
        if ((documentData as any).name) {
            formData.append('name', (documentData as any).name);
        }
        if ((documentData as any).description) {
            formData.append('description', (documentData as any).description);
        }
        if (documentData.expires_at) {
            formData.append('expires_at', documentData.expires_at);
        }
        if ((documentData as any).metadata) {
            formData.append('metadata', JSON.stringify((documentData as any).metadata));
        }

        const response = await api.post('/producer-profiles/producers/documents', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                // Émetteur d'événements personnalisé pour le suivi de progression
                const event = new CustomEvent('document-upload-progress', {
                    detail: { progress, fileName: documentData.file.name }
                });
                window.dispatchEvent(event);
            }
        });

        return response.data;
    },

    /**
     * Télécharger plusieurs documents en une seule requête
     * POST /api/v1/producer-profiles/producers/documents/batch
     */
    async uploadDocumentsBatch(documents: ProducerDocumentUpload[]): Promise<ProducerDocument[]> {
        const formData = new FormData();

        documents.forEach((doc, index) => {
            formData.append(`documents[${index}][file]`, doc.file);
            formData.append(`documents[${index}][type]`, doc.type);
            if ((doc as any).name) {
                formData.append(`documents[${index}][name]`, (doc as any).name);
            }
            if (doc.expires_at) {
                formData.append(`documents[${index}][expires_at]`, doc.expires_at);
            }
        });

        const response = await api.post('/producer-profiles/producers/documents/batch', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return response.data;
    },

    /**
     * Obtenir tous les documents du producteur
     * GET /api/v1/producer-profiles/producers/documents
     */
    async getDocuments(params?: {
        type?: DocumentType;
        verified?: boolean;
        expired?: boolean;
        page?: number;
        limit?: number;
        sort_by?: 'uploaded_at' | 'type' | 'name';
        sort_order?: 'asc' | 'desc';
    }): Promise<{
        documents: ProducerDocument[];
        total: number;
        pages: number;
        current_page: number;
    }> {
        const response = await api.get('/producer-profiles/producers/documents', { params });
        return response.data;
    },

    /**
     * Obtenir un document spécifique
     * GET /api/v1/producer-profiles/producers/documents/{id}
     */
    async getDocument(documentId: string): Promise<ProducerDocument> {
        const response = await api.get(`/producer-profiles/producers/documents/${documentId}`);
        return response.data;
    },

    /**
     * Mettre à jour les métadonnées d'un document
     * PUT /api/v1/producer-profiles/producers/documents/{id}
     */
    async updateDocument(
        documentId: string,
        updateData: ProducerDocumentUpdate
    ): Promise<ProducerDocument> {
        const response = await api.put(`/producer-profiles/producers/documents/${documentId}`, updateData);
        return response.data;
    },

    /**
     * Supprimer un document
     * DELETE /api/v1/producer-profiles/producers/documents/{id}
     */
    async deleteDocument(documentId: string): Promise<{ message: string }> {
        const response = await api.delete(`/producer-profiles/producers/documents/${documentId}`);
        return response.data;
    },

    /**
     * Supprimer plusieurs documents
     * DELETE /api/v1/producer-profiles/producers/documents/batch
     */
    async deleteDocumentsBatch(documentIds: string[]): Promise<{ message: string; deleted_count: number }> {
        const response = await api.delete('/producer-profiles/producers/documents/batch', {
            data: { document_ids: documentIds }
        });
        return response.data;
    },

    /**
     * Télécharger le fichier du document
     * GET /api/v1/producer-profiles/producers/documents/{id}/download
     */
    async downloadDocument(documentId: string): Promise<Blob> {
        const response = await api.get(`/producer-profiles/producers/documents/${documentId}/download`, {
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Obtenir l'URL de prévisualisation d'un document
     * GET /api/v1/producer-profiles/producers/documents/{id}/preview
     */
    async getDocumentPreview(documentId: string): Promise<{ preview_url: string; expires_at: string }> {
        const response = await api.get(`/producer-profiles/producers/documents/${documentId}/preview`);
        return response.data;
    },

    // ============================================
    // GESTION DES EXPIRATIONS
    // ============================================

    /**
     * Obtenir les documents expirés ou bientôt expirés
     * GET /api/v1/producer-profiles/producers/documents/expiring
     */
    async getExpiringDocuments(params?: {
        days_threshold?: number;
        type?: DocumentType;
        page?: number;
        limit?: number;
    }): Promise<{
        expiring_soon: ProducerDocument[];
        expired: ProducerDocument[];
        total_count: number;
    }> {
        const response = await api.get('/producer-profiles/producers/documents/expiring', { params });
        return response.data;
    },

    /**
     * Renouveler un document expiré
     * POST /api/v1/producer-profiles/producers/documents/{id}/renew
     */
    async renewDocument(
        documentId: string,
        newFile: File,
        expiresAt?: Date
    ): Promise<ProducerDocument> {
        const formData = new FormData();
        formData.append('file', newFile);
        if (expiresAt) {
            formData.append('expires_at', expiresAt.toISOString());
        }

        const response = await api.post(
            `/producer-profiles/producers/documents/${documentId}/renew`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );

        return response.data;
    },

    // ============================================
    // VÉRIFICATION ET VALIDATION
    // ============================================

    /**
     * Soumettre un document pour vérification
     * POST /api/v1/producer-profiles/producers/documents/{id}/submit-verification
     */
    async submitDocumentForVerification(documentId: string): Promise<{ message: string; status: string }> {
        const response = await api.post(
            `/producer-profiles/producers/documents/${documentId}/submit-verification`
        );
        return response.data;
    },

    /**
     * Soumettre tous les documents pour vérification
     * POST /api/v1/producer-profiles/producers/documents/submit-all-verification
     */
    async submitAllDocumentsForVerification(): Promise<{
        message: string;
        submitted_count: number;
        documents: Array<{ id: string; type: string; status: string }>
    }> {
        const response = await api.post('/producer-profiles/producers/documents/submit-all-verification');
        return response.data;
    },

    /**
     * Obtenir le statut de vérification de tous les documents
     * GET /api/v1/producer-profiles/producers/documents/verification-status
     */
    async getVerificationStatus(): Promise<{
        total_documents: number;
        verified: number;
        pending: number;
        rejected: number;
        expired: number;
        documents: Array<{
            id: string;
            type: DocumentType;
            status: 'verified' | 'pending' | 'rejected' | 'expired';
            verified_at?: string;
            rejection_reason?: string;
        }>;
    }> {
        const response = await api.get('/producer-profiles/producers/documents/verification-status');
        return response.data;
    },

    /**
     * Obtenir les exigences de documents par type
     * GET /api/v1/producer-profiles/producers/documents/requirements
     */
    async getDocumentRequirements(): Promise<{
        required_documents: Array<{
            type: DocumentType;
            label: string;
            description: string;
            is_required: boolean;
            max_size: number; // en octets
            allowed_formats: string[];
            max_files?: number;
            expires_after_days?: number;
            template_url?: string;
        }>;
        optional_documents: Array<{
            type: string;
            label: string;
            description: string;
            recommended: boolean;
        }>;
    }> {
        const response = await api.get('/producer-profiles/producers/documents/requirements');
        return response.data;
    },

    /**
     * Vérifier si tous les documents requis sont présents
     * GET /api/v1/producer-profiles/producers/documents/compliance-check
     */
    async checkCompliance(): Promise<{
        is_compliant: boolean;
        missing_documents: Array<{
            type: DocumentType;
            label: string;
            is_critical: boolean;
        }>;
        expiring_documents: Array<{
            id: string;
            type: DocumentType;
            label: string;
            expires_in_days: number;
        }>;
        invalid_documents: Array<{
            id: string;
            type: DocumentType;
            label: string;
            reason: string;
        }>;
    }> {
        const response = await api.get('/producer-profiles/producers/documents/compliance-check');
        return response.data;
    },

    // ============================================
    // GESTION DES TYPES DE DOCUMENTS
    // ============================================

    /**
     * Obtenir les statistiques par type de document
     * GET /api/v1/producer-profiles/producers/documents/stats-by-type
     */
    async getStatsByType(): Promise<{
        [key in DocumentType]?: {
            count: number;
            verified: number;
            pending: number;
            expired: number;
        };
    }> {
        const response = await api.get('/producer-profiles/producers/documents/stats-by-type');
        return response.data;
    },

    /**
     * Obtenir les documents groupés par type
     * GET /api/v1/producer-profiles/producers/documents/grouped-by-type
     */
    async getDocumentsGroupedByType(): Promise<{
        [key in DocumentType]?: ProducerDocument[];
    }> {
        const response = await api.get('/producer-profiles/producers/documents/grouped-by-type');
        return response.data;
    },

    // ============================================
    // VALIDATION DE FICHIERS
    // ============================================

    /**
     * Valider un fichier avant téléchargement
     * POST /api/v1/producer-profiles/producers/documents/validate-file
     */
    async validateFile(file: File, documentType: DocumentType): Promise<{
        valid: boolean;
        errors?: string[];
        warnings?: string[];
        max_size: number;
        allowed_formats: string[];
        estimated_upload_time?: number; // en secondes
    }> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', documentType);

        const response = await api.post(
            '/producer-profiles/producers/documents/validate-file',
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );

        return response.data;
    },

    /**
     * Extraire les métadonnées d'un fichier
     * POST /api/v1/producer-profiles/producers/documents/extract-metadata
     */
    async extractFileMetadata(file: File): Promise<{
        file_name: string;
        file_size: number;
        mime_type: string;
        extension: string;
        dimensions?: { width: number; height: number };
        pages_count?: number;
        duration?: number; // pour les vidéos, en secondes
        metadata?: Record<string, any>;
    }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(
            '/producer-profiles/producers/documents/extract-metadata',
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );

        return response.data;
    },

    // ============================================
    // NOTIFICATIONS ET ALERTES
    // ============================================

    /**
     * Activer/désactiver les notifications d'expiration
     * PUT /api/v1/producer-profiles/producers/documents/expiration-notifications
     */
    async updateExpirationNotifications(settings: {
        enabled: boolean;
        notify_days_before: number[];
        email_notifications: boolean;
        push_notifications: boolean;
    }): Promise<void> {
        await api.put('/producer-profiles/producers/documents/expiration-notifications', settings);
    },

    /**
     * Obtenir les paramètres de notifications d'expiration
     * GET /api/v1/producer-profiles/producers/documents/expiration-notifications
     */
    async getExpirationNotificationsSettings(): Promise<{
        enabled: boolean;
        notify_days_before: number[];
        email_notifications: boolean;
        push_notifications: boolean;
        last_notification_sent?: string;
    }> {
        const response = await api.get('/producer-profiles/producers/documents/expiration-notifications');
        return response.data;
    },

    // ============================================
    // UTILITAIRES
    // ============================================

    /**
     * Obtenir l'historique des modifications d'un document
     * GET /api/v1/producer-profiles/producers/documents/{id}/history
     */
    async getDocumentHistory(documentId: string): Promise<Array<{
        id: string;
        action: 'uploaded' | 'updated' | 'verified' | 'rejected' | 'renewed' | 'deleted';
        performed_by: string;
        performed_at: string;
        changes?: Record<string, any>;
        notes?: string;
    }>> {
        const response = await api.get(`/producer-profiles/producers/documents/${documentId}/history`);
        return response.data;
    },

    /**
     * Rechercher dans les documents
     * GET /api/v1/producer-profiles/producers/documents/search
     */
    async searchDocuments(params: {
        query: string;
        type?: DocumentType;
        verified?: boolean;
        date_from?: string;
        date_to?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        documents: ProducerDocument[];
        total: number;
        pages: number;
    }> {
        const response = await api.get('/producer-profiles/producers/documents/search', { params });
        return response.data;
    },

    /**
     * Exporter la liste des documents
     * GET /api/v1/producer-profiles/producers/documents/export
     */
    async exportDocuments(params?: {
        format: 'csv' | 'excel' | 'pdf';
        include_files?: boolean;
        date_from?: string;
        date_to?: string;
    }): Promise<Blob> {
        const response = await api.get('/producer-profiles/producers/documents/export', {
            params,
            responseType: 'blob'
        });
        return response.data;
    }
};

// Types supplémentaires nécessaires pour le service
export type DocumentUploadProgress = {
    fileName: string;
    progress: number;
    documentId?: string;
};

export type DocumentValidationResult = {
    valid: boolean;
    errors: string[];
    warnings: string[];
};

// Helper pour formater la taille des fichiers
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper pour vérifier le type de fichier
export const isFileTypeAllowed = (
    file: File,
    allowedTypes: string[]
): boolean => {
    const fileType = file.type.toLowerCase();
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

    return allowedTypes.some(allowed => {
        const allowedLower = allowed.toLowerCase();
        // Vérifier le MIME type
        if (allowedLower.includes('/')) {
            if (allowedLower.endsWith('/*')) {
                const baseType = allowedLower.split('/')[0];
                return fileType.startsWith(baseType + '/');
            }
            return fileType === allowedLower;
        }
        // Vérifier l'extension
        return '.' + fileExtension === allowedLower;
    });
};
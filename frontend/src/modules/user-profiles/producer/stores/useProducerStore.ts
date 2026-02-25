import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';
import { getErrorMessage } from '@/shared/utils/error-handler';
import type {
    ProducerProfile,
    ProducerProfileCreate,
    ProducerProfileUpdate,
    ProducerDocument,
    ProducerDocumentUpload,
    PickupPoint,
    PickupPointCreate,
    PickupSlot,
    PickupSlotCreate,
    PickupSlotUpdate,
    PickupSchedule,
    PickupException,
    AvailableSlot,
    SlotReservation,
    ProductionType,
    DocumentType
} from '../types';
import {
    ProducerProfileService,
    ProducerDocumentService,
    PickupPointService,
    PickupSlotService
} from '../services';

export const useProducerStore = defineStore('producer', () => {
    // ============================================
    // ÉTAT
    // ============================================

    // Profil producteur
    const profile = ref<ProducerProfile | null>(null);
    const isProfileLoading = ref(false);
    const profileError = ref<string | null>(null);

    // Documents
    const documents = ref<ProducerDocument[]>([]);
    const isDocumentsLoading = ref(false);
    const documentsError = ref<string | null>(null);

    // Points de retrait
    const pickupPoints = ref<PickupPoint[]>([]);
    const isPickupPointsLoading = ref(false);
    const pickupPointsError = ref<string | null>(null);

    // Créneaux de retrait
    const slots = ref<PickupSlot[]>([]);
    const isSlotsLoading = ref(false);
    const slotsError = ref<string | null>(null);

    // Sélection actuelle
    const selectedPickupPoint = ref<PickupPoint | null>(null);
    const selectedSlot = ref<PickupSlot | null>(null);
    const selectedDocument = ref<ProducerDocument | null>(null);

    // Filtres et recherche
    const filters = reactive({
        productionType: [] as ProductionType[],
        verifiedOnly: false,
        searchQuery: '',
        dateFrom: null as string | null,
        dateTo: null as string | null,
        activeOnly: true
    });

    // Pagination
    const pagination = reactive({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });

    // Notifications
    const notifications = ref<Array<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
        timestamp: Date;
        read: boolean;
    }>>([]);

    // ============================================
    // GETTERS (Computed)
    // ============================================

    // Profil
    const isVerified = computed(() => profile.value?.verified || false);
    const verificationStatus = computed(() => profile.value?.verification_status || 'pending');
    const businessInfo = computed(() => ({
        name: profile.value?.business_name || '',
        siret: profile.value?.siret || '',
        tva: profile.value?.tva_number || '',
        iban: profile.value?.iban || ''
    }));

    // Documents
    const requiredDocuments = computed(() =>
        documents.value.filter(doc => ['kbis', 'insurance', 'identity'].includes(doc.type))
    );
    const verifiedDocuments = computed(() =>
        documents.value.filter(doc => doc.verified)
    );
    const pendingDocuments = computed(() =>
        documents.value.filter(doc => !doc.verified && (doc as any).verification_status === 'pending')
    );
    const expiringDocuments = computed(() =>
        documents.value.filter(doc => {
            if (!doc.expires_at) return false;
            const expireDate = new Date(doc.expires_at);
            const today = new Date();
            const daysDiff = Math.ceil((expireDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return daysDiff <= 30 && daysDiff > 0;
        })
    );
    const expiredDocuments = computed(() =>
        documents.value.filter(doc => {
            if (!doc.expires_at) return false;
            return new Date(doc.expires_at) < new Date();
        })
    );

    // Points de retrait
    const activePickupPoints = computed(() =>
        pickupPoints.value.filter(point => point.is_active)
    );
    const inactivePickupPoints = computed(() =>
        pickupPoints.value.filter(point => !point.is_active)
    );
    const pickupPointsWithSlots = computed(() =>
        pickupPoints.value.filter(point => {
            const pointSlots = slots.value.filter(slot => slot.pickup_point_id === point.id);
            return pointSlots.length > 0;
        })
    );

    // Créneaux
    const availableSlots = computed(() =>
        slots.value.filter(slot =>
            slot.is_active &&
            slot.bookings.current_orders < slot.capacity.max_orders &&
            !isSlotPast(slot)
        )
    );
    const fullSlots = computed(() =>
        slots.value.filter(slot => slot.bookings.current_orders >= slot.capacity.max_orders)
    );
    const upcomingSlots = computed(() =>
        slots.value.filter(slot => {
            if (!slot.date) return false;
            const slotDate = new Date(slot.date);
            const today = new Date();
            return slotDate >= today && slot.is_active;
        })
    );
    const todaySlots = computed(() =>
        slots.value.filter(slot => {
            if (!slot.date) return false;
            const slotDate = new Date(slot.date);
            const today = new Date();
            return slotDate.toDateString() === today.toDateString();
        })
    );

    // Statistiques
    const stats = computed(() => ({
        totalPickupPoints: pickupPoints.value.length,
        activePickupPoints: activePickupPoints.value.length,
        totalSlots: slots.value.length,
        availableSlots: availableSlots.value.length,
        bookedSlots: slots.value.reduce((sum, slot) => sum + slot.bookings.current_orders, 0),
        totalCapacity: slots.value.reduce((sum, slot) => sum + slot.capacity.max_orders, 0),
        occupancyRate: slots.value.length > 0
            ? (slots.value.reduce((sum, slot) => sum + slot.bookings.current_orders, 0) /
                slots.value.reduce((sum, slot) => sum + slot.capacity.max_orders, 0)) * 100
            : 0,
        verifiedDocuments: verifiedDocuments.value.length,
        pendingDocuments: pendingDocuments.value.length,
        totalDocuments: documents.value.length
    }));

    // ============================================
    // ACTIONS
    // ============================================

    // PROFIL PRODUCTEUR
    // ============================================

    /**
     * Charger le profil du producteur
     */
    async function fetchProfile() {
        try {
            isProfileLoading.value = true;
            profileError.value = null;

            const response = await ProducerProfileService.getCompleteProfile();
            profile.value = response.profile;
            documents.value = response.documents || [];
            pickupPoints.value = response.pickupPoints || [];

            // Charger les créneaux pour tous les points de retrait
            if (response.pickupPoints && response.pickupPoints.length > 0) {
                await fetchAllSlots();
            }

            return profile.value;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erreur lors du chargement du profil';
            profile.value = null;
            documents.value = [];
            pickupPoints.value = [];
            slots.value = [];
            profileError.value = errorMessage;
            throw error;
        } finally {
            isProfileLoading.value = false;
        }
    }

    /**
     * Créer le profil producteur
     */
    async function createProfile(profileData: ProducerProfileCreate) {
        try {
            isProfileLoading.value = true;
            profileError.value = null;

            profile.value = await ProducerProfileService.createProfile(profileData);
            return profile.value;
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error);
            profileError.value = errorMessage;
            throw error;
        } finally {
            isProfileLoading.value = false;
        }
    }

    /**
     * Mettre à jour le profil producteur
     */
    async function updateProfile(profileData: ProducerProfileUpdate) {
        try {
            isProfileLoading.value = true;
            profileError.value = null;

            profile.value = await ProducerProfileService.updateProfile(profileData);
            return profile.value;
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error);
            profileError.value = errorMessage;
            throw error;
        } finally {
            isProfileLoading.value = false;
        }
    }

    /**
     * Soumettre pour vérification
     */
    async function submitForVerification() {
        try {
            if (!profile.value) throw new Error('Profil non chargé');

            const result = await ProducerProfileService.submitForVerification();
            await fetchProfile(); // Recharger le profil pour avoir le nouveau statut

            addNotification({
                type: 'success',
                message: 'Votre demande de vérification a été soumise avec succès'
            });

            return result;
        } catch (error: unknown) {
            addNotification({
                type: 'error',
                message: getErrorMessage(error)
            });
            throw error;
        }
    }

    // DOCUMENTS
    // ============================================

    /**
     * Charger tous les documents
     */
    async function fetchDocuments() {
        try {
            isDocumentsLoading.value = true;
            documentsError.value = null;

            const response = await ProducerDocumentService.getDocuments();
            const normalizedDocuments = Array.isArray((response as any)?.documents)
                ? (response as any).documents
                : (Array.isArray(response as any) ? (response as any) : []);

            documents.value = normalizedDocuments;
            pagination.totalItems = Number((response as any)?.total ?? normalizedDocuments.length);
            pagination.totalPages = Number((response as any)?.pages ?? 1);

            return documents.value;
        } catch (error: unknown) {
            documents.value = [];
            documentsError.value = getErrorMessage(error);
            throw error;
        } finally {
            isDocumentsLoading.value = false;
        }
    }

    /**
     * Télécharger un document
     */
    async function uploadDocument(documentData: ProducerDocumentUpload) {
        try {
            isDocumentsLoading.value = true;
            documentsError.value = null;

            const document = await ProducerDocumentService.uploadDocument(documentData);
            documents.value.push(document);

            addNotification({
                type: 'success',
                message: 'Document téléchargé avec succès'
            });

            return document;
        } catch (error: unknown) {
            documentsError.value = getErrorMessage(error);
            addNotification({
                type: 'error',
                message: getErrorMessage(error)
            });
            throw error;
        } finally {
            isDocumentsLoading.value = false;
        }
    }

    /**
     * Supprimer un document
     */
    async function deleteDocument(documentId: string) {
        try {
            isDocumentsLoading.value = true;
            documentsError.value = null;

            await ProducerDocumentService.deleteDocument(documentId);
            documents.value = documents.value.filter(doc => doc.id !== documentId);

            addNotification({
                type: 'success',
                message: 'Document supprimé avec succès'
            });
        } catch (error: unknown) {
            documentsError.value = getErrorMessage(error);
            addNotification({
                type: 'error',
                message: getErrorMessage(error)
            });
            throw error;
        } finally {
            isDocumentsLoading.value = false;
        }
    }

    /**
     * Soumettre un document pour vérification
     */
    async function submitDocumentForVerification(documentId: string) {
        try {
            const result = await ProducerDocumentService.submitDocumentForVerification(documentId);

            // Mettre à jour le document localement
            const index = documents.value.findIndex(doc => doc.id === documentId);
            if (index !== -1) {
                // Note: Le type ProducerDocument n'a pas de verification_status
                // documents.value[index].verification_status = 'pending';
                documents.value[index].verified = false;
            }

            addNotification({
                type: 'success',
                message: 'Document soumis pour vérification'
            });

            return result;
        } catch (error: unknown) {
            addNotification({
                type: 'error',
                message: getErrorMessage(error)
            });
            throw error;
        }
    }

    // POINTS DE RETRAIT
    // ============================================

    /**
     * Charger tous les points de retrait
     */
    async function fetchPickupPoints() {
        try {
            isPickupPointsLoading.value = true;
            pickupPointsError.value = null;

            const response: any = await PickupPointService.getPickupPoints();
            const normalizedPoints = Array.isArray(response)
                ? response
                : (Array.isArray(response?.pickup_points) ? response.pickup_points : []);

            pickupPoints.value = normalizedPoints;
            pagination.totalItems = Number(response?.total ?? normalizedPoints.length);
            pagination.totalPages = Number(response?.pages ?? 1);

            return pickupPoints.value;
        } catch (error: unknown) {
            pickupPoints.value = [];
            pickupPointsError.value = getErrorMessage(error);
            throw error;
        } finally {
            isPickupPointsLoading.value = false;
        }
    }

    /**
     * Créer un point de retrait
     */
    async function createPickupPoint(pointData: PickupPointCreate) {
        try {
            isPickupPointsLoading.value = true;
            pickupPointsError.value = null;

            const point = await PickupPointService.createPickupPoint(pointData);
            pickupPoints.value.push(point);
            selectedPickupPoint.value = point;

            addNotification({
                type: 'success',
                message: 'Point de retrait créé avec succès'
            });

            return point;
        } catch (error: unknown) {
            pickupPointsError.value = getErrorMessage(error);
            addNotification({
                type: 'error',
                message: getErrorMessage(error)
            });
            throw error;
        } finally {
            isPickupPointsLoading.value = false;
        }
    }

    /**
     * Mettre à jour un point de retrait
     */
    async function updatePickupPoint(pointId: string, updateData: any) {
        try {
            isPickupPointsLoading.value = true;
            pickupPointsError.value = null;

            const updatedPoint = await PickupPointService.updatePickupPoint(pointId, updateData);

            // Mettre à jour localement
            const index = pickupPoints.value.findIndex(point => point.id === pointId);
            if (index !== -1) {
                pickupPoints.value[index] = updatedPoint;
            }

            if (selectedPickupPoint.value?.id === pointId) {
                selectedPickupPoint.value = updatedPoint;
            }

            addNotification({
                type: 'success',
                message: 'Point de retrait mis à jour avec succès'
            });

            return updatedPoint;
        } catch (error: unknown) {
            pickupPointsError.value = getErrorMessage(error);
            addNotification({
                type: 'error',
                message: getErrorMessage(error)
            });
            throw error;
        } finally {
            isPickupPointsLoading.value = false;
        }
    }

    /**
     * Supprimer un point de retrait
     */
    async function deletePickupPoint(pointId: string) {
        try {
            isPickupPointsLoading.value = true;
            pickupPointsError.value = null;

            await PickupPointService.deletePickupPoint(pointId);
            pickupPoints.value = pickupPoints.value.filter(point => point.id !== pointId);

            // Supprimer également les créneaux associés
            slots.value = slots.value.filter(slot => slot.pickup_point_id !== pointId);

            if (selectedPickupPoint.value?.id === pointId) {
                selectedPickupPoint.value = null;
            }

            addNotification({
                type: 'success',
                message: 'Point de retrait supprimé avec succès'
            });
        } catch (error: unknown) {
            pickupPointsError.value = getErrorMessage(error);
            addNotification({
                type: 'error',
                message: getErrorMessage(error)
            });
            throw error;
        } finally {
            isPickupPointsLoading.value = false;
        }
    }

    /**
     * Activer/désactiver un point de retrait
     */
    async function togglePickupPoint(pointId: string, isActive: boolean) {
        try {
            const updatedPoint = await PickupPointService.togglePickupPoint(pointId, isActive);

            // Mettre à jour localement
            const index = pickupPoints.value.findIndex(point => point.id === pointId);
            if (index !== -1) {
                pickupPoints.value[index] = updatedPoint;
            }

            if (selectedPickupPoint.value?.id === pointId) {
                selectedPickupPoint.value = updatedPoint;
            }

            addNotification({
                type: 'success',
                message: `Point de retrait ${isActive ? 'activé' : 'désactivé'} avec succès`
            });

            return updatedPoint;
        } catch (error: unknown) {
            addNotification({
                type: 'error',
                message: getErrorMessage(error) || `Erreur lors de la ${isActive ? 'activation' : 'désactivation'} du point de retrait`
            });
            throw error;
        }
    }

    // CRÉNEAUX DE RETRAIT
    // ============================================

    /**
     * Charger tous les créneaux
     */
    async function fetchAllSlots() {
        try {
            isSlotsLoading.value = true;
            slotsError.value = null;

            const allSlots: PickupSlot[] = [];

            // Charger les créneaux pour chaque point de retrait
            for (const point of pickupPoints.value) {
                try {
                    const response = await PickupPointService.getPickupSlots(String(point.id));
                    allSlots.push(...response.slots);
                } catch (error) {
                    console.error(`Erreur lors du chargement des créneaux pour le point ${point.id}:`, error);
                }
            }

            slots.value = allSlots;
            return slots.value;
        } catch (error: unknown) {
            slotsError.value = getErrorMessage(error);
            throw error;
        } finally {
            isSlotsLoading.value = false;
        }
    }

    /**
     * Charger les créneaux d'un point spécifique
     */
    async function fetchSlots(pickupPointId: string) {
        try {
            isSlotsLoading.value = true;
            slotsError.value = null;

            const response = await PickupPointService.getPickupSlots(String(pickupPointId));
            slots.value = response.slots;

            return slots.value;
        } catch (error: unknown) {
            slotsError.value = getErrorMessage(error);
            throw error;
        } finally {
            isSlotsLoading.value = false;
        }
    }

    /**
     * Créer un créneau
     */
    async function createSlot(pickupPointId: string, slotData: PickupSlotCreate) {
        try {
            isSlotsLoading.value = true;
            slotsError.value = null;

            const slot = await PickupPointService.createPickupSlot(String(pickupPointId), slotData);
            slots.value.push(slot);
            selectedSlot.value = slot;

            addNotification({
                type: 'success',
                message: 'Créneau créé avec succès'
            });

            return slot;
        } catch (error: unknown) {
            slotsError.value = getErrorMessage(error);
            addNotification({
                type: 'error',
                message: getErrorMessage(error)
            });
            throw error;
        } finally {
            isSlotsLoading.value = false;
        }
    }

    /**
     * Mettre à jour un créneau
     */
    async function updateSlot(slotId: string, updateData: PickupSlotUpdate) {
        try {
            isSlotsLoading.value = true;
            slotsError.value = null;

            const updatedSlot = await PickupSlotService.updateSlot(slotId, updateData);

            // Mettre à jour localement
            const index = slots.value.findIndex(slot => slot.id === slotId);
            if (index !== -1) {
                slots.value[index] = updatedSlot;
            }

            if (selectedSlot.value?.id === slotId) {
                selectedSlot.value = updatedSlot;
            }

            addNotification({
                type: 'success',
                message: 'Créneau mis à jour avec succès'
            });

            return updatedSlot;
        } catch (error: unknown) {
            slotsError.value = getErrorMessage(error);
            addNotification({
                type: 'error',
                message: getErrorMessage(error)
            });
            throw error;
        } finally {
            isSlotsLoading.value = false;
        }
    }

    /**
     * Supprimer un créneau
     */
    async function deleteSlot(slotId: string) {
        try {
            isSlotsLoading.value = true;
            slotsError.value = null;

            await PickupSlotService.deleteSlot(slotId);
            slots.value = slots.value.filter(slot => slot.id !== slotId);

            if (selectedSlot.value?.id === slotId) {
                selectedSlot.value = null;
            }

            addNotification({
                type: 'success',
                message: 'Créneau supprimé avec succès'
            });
        } catch (error: unknown) {
            slotsError.value = getErrorMessage(error);
            addNotification({
                type: 'error',
                message: getErrorMessage(error)
            });
            throw error;
        } finally {
            isSlotsLoading.value = false;
        }
    }

    /**
     * Réserver des places dans un créneau
     */
    async function reserveSlot(slotId: string, reservationData: SlotReservation) {
        try {
            const result = await PickupSlotService.reserveSlot(slotId, reservationData);

            // Mettre à jour localement
            const index = slots.value.findIndex(slot => slot.id === slotId);
            if (index !== -1) {
                slots.value[index].bookings.current_orders = result.new_current_orders;
            }

            addNotification({
                type: 'success',
                message: `${(reservationData as any).order_count} place(s) réservée(s) avec succès`
            });

            return result;
        } catch (error: unknown) {
            addNotification({
                type: 'error',
                message: getErrorMessage(error)
            });
            throw error;
        }
    }

    /**
     * Libérer des places réservées
     */
    async function releaseSlot(slotId: string, reservationId?: string, orderCount?: number) {
        try {
            const result = await PickupSlotService.releaseReservation(slotId, reservationId, orderCount);

            // Mettre à jour localement
            const index = slots.value.findIndex(slot => slot.id === slotId);
            if (index !== -1) {
                slots.value[index].bookings.current_orders = result.new_current_orders;
            }

            addNotification({
                type: 'success',
                message: 'Réservation libérée avec succès'
            });

            return result;
        } catch (error: unknown) {
            addNotification({
                type: 'error',
                message: getErrorMessage(error)
            });
            throw error;
        }
    }

    /**
     * Obtenir les créneaux disponibles pour une date
     */
    async function getAvailableSlots(pickupPointId: string, date: string) {
        try {
            const availableSlots = await PickupSlotService.getAvailableSlots({ pickup_point_id: pickupPointId, date });
            return availableSlots;
        } catch (error: unknown) {
            addNotification({
                type: 'error',
                message: getErrorMessage(error)
            });
            throw error;
        }
    }

    /**
     * Générer des créneaux récurrents
     */
    async function generateRecurringSlots(pickupPointId: string, pattern: Record<string, unknown>) {
        try {
            const result = await PickupSlotService.generateRecurringSlots(pickupPointId, pattern as any);

            // Ajouter les nouveaux créneaux localement
            slots.value.push(...result.slots);

            addNotification({
                type: 'success',
                message: `${result.generated_count} créneau(x) généré(s) avec succès`
            });

            return result;
        } catch (error: unknown) {
            addNotification({
                type: 'error',
                message: getErrorMessage(error)
            });
            throw error;
        }
    }

    // ============================================
    // UTILITAIRES ET HELPERS
    // ============================================

    /**
     * Vérifier si un créneau est passé
     */
    function isSlotPast(slot: PickupSlot): boolean {
        if (slot.date) {
            const slotDate = new Date(slot.date);
            const slotDateTime = new Date(
                slotDate.getFullYear(),
                slotDate.getMonth(),
                slotDate.getDate(),
                ...slot.start_time.split(':').map(Number)
            );
            return slotDateTime < new Date();
        }
        return false;
    }

    /**
     * Vérifier si un créneau est complet
     */
    function isSlotFull(slot: PickupSlot): boolean {
        return slot.bookings.current_orders >= slot.capacity.max_orders;
    }

    /**
     * Calculer le taux d'occupation d'un créneau
     */
    function calculateSlotOccupancy(slot: PickupSlot): number {
        if (slot.capacity.max_orders === 0) return 0;
        return (slot.bookings.current_orders / slot.capacity.max_orders) * 100;
    }

    /**
     * Obtenir le statut d'un créneau
     */
    function getSlotStatus(slot: PickupSlot): 'available' | 'full' | 'past' | 'inactive' {
        if (!slot.is_active) return 'inactive';
        if (isSlotPast(slot)) return 'past';
        if (isSlotFull(slot)) return 'full';
        return 'available';
    }

    /**
     * Obtenir les créneaux d'un point spécifique
     */
    function getSlotsByPickupPoint(pickupPointId: string): PickupSlot[] {
        return slots.value.filter(slot => slot.pickup_point_id === pickupPointId);
    }

    /**
     * Obtenir un point de retrait par son ID
     */
    function getPickupPointById(pickupPointId: string): PickupPoint | undefined {
        return pickupPoints.value.find(point => point.id === pickupPointId);
    }

    /**
     * Sélectionner un point de retrait
     */
    function selectPickupPoint(pointId: string | null) {
        if (!pointId) {
            selectedPickupPoint.value = null;
            return;
        }

        const point = pickupPoints.value.find(p => p.id === pointId);
        selectedPickupPoint.value = point || null;
    }

    /**
     * Sélectionner un créneau
     */
    function selectSlot(slotId: string | null) {
        if (!slotId) {
            selectedSlot.value = null;
            return;
        }

        const slot = slots.value.find(s => s.id === slotId);
        selectedSlot.value = slot || null;
    }

    /**
     * Sélectionner un document
     */
    function selectDocument(documentId: string | null) {
        if (!documentId) {
            selectedDocument.value = null;
            return;
        }

        const doc = documents.value.find(d => d.id === documentId);
        selectedDocument.value = doc || null;
    }

    /**
     * Ajouter une notification
     */
    function addNotification(notification: {
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
    }) {
        const newNotification = {
            id: Date.now().toString(),
            type: notification.type,
            message: notification.message,
            timestamp: new Date(),
            read: false
        };

        notifications.value.unshift(newNotification);

        // Limiter à 50 notifications maximum
        if (notifications.value.length > 50) {
            notifications.value = notifications.value.slice(0, 50);
        }
    }

    /**
     * Marquer une notification comme lue
     */
    function markNotificationAsRead(notificationId: string) {
        const notification = notifications.value.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
        }
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    function markAllNotificationsAsRead() {
        notifications.value.forEach(notification => {
            notification.read = true;
        });
    }

    /**
     * Supprimer une notification
     */
    function removeNotification(notificationId: string) {
        notifications.value = notifications.value.filter(n => n.id !== notificationId);
    }

    /**
     * Supprimer toutes les notifications
     */
    function clearNotifications() {
        notifications.value = [];
    }

    /**
     * Réinitialiser le store
     */
    function resetStore() {
        profile.value = null;
        documents.value = [];
        pickupPoints.value = [];
        slots.value = [];
        selectedPickupPoint.value = null;
        selectedSlot.value = null;
        selectedDocument.value = null;
        notifications.value = [];

        // Réinitialiser les erreurs
        profileError.value = null;
        documentsError.value = null;
        pickupPointsError.value = null;
        slotsError.value = null;

        // Réinitialiser les chargements
        isProfileLoading.value = false;
        isDocumentsLoading.value = false;
        isPickupPointsLoading.value = false;
        isSlotsLoading.value = false;
    }

    // ============================================
    // EXPORT
    // ============================================

    return {
        // État
        profile,
        documents,
        pickupPoints,
        slots,
        selectedPickupPoint,
        selectedSlot,
        selectedDocument,
        filters,
        pagination,
        notifications,

        // États de chargement
        isProfileLoading,
        isDocumentsLoading,
        isPickupPointsLoading,
        isSlotsLoading,

        // Erreurs
        profileError,
        documentsError,
        pickupPointsError,
        slotsError,

        // Getters
        isVerified,
        verificationStatus,
        businessInfo,
        requiredDocuments,
        verifiedDocuments,
        pendingDocuments,
        expiringDocuments,
        expiredDocuments,
        activePickupPoints,
        inactivePickupPoints,
        pickupPointsWithSlots,
        availableSlots,
        fullSlots,
        upcomingSlots,
        todaySlots,
        stats,

        // Actions - Profil
        fetchProfile,
        createProfile,
        updateProfile,
        submitForVerification,

        // Actions - Documents
        fetchDocuments,
        uploadDocument,
        deleteDocument,
        submitDocumentForVerification,

        // Actions - Points de retrait
        fetchPickupPoints,
        createPickupPoint,
        updatePickupPoint,
        deletePickupPoint,
        togglePickupPoint,

        // Actions - Créneaux
        fetchAllSlots,
        fetchSlots,
        createSlot,
        updateSlot,
        deleteSlot,
        reserveSlot,
        releaseSlot,
        getAvailableSlots,
        generateRecurringSlots,

        // Utilitaires
        isSlotPast,
        isSlotFull,
        calculateSlotOccupancy,
        getSlotStatus,
        getSlotsByPickupPoint,
        getPickupPointById,
        selectPickupPoint,
        selectSlot,
        selectDocument,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        removeNotification,
        clearNotifications,
        resetStore
    };
});

// Type pour l'utilisation du store
export type ProducerStore = ReturnType<typeof useProducerStore>;

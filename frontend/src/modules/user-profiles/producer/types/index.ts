// ============================================
// TYPES PRODUCTEUR - INDEX PRINCIPAL
// ============================================

// ==================== FORMULAIRES ====================
export type {
    PickupPointFormData,
    PickupSlotFormData,
    ProducerProfileFormData as ProducerFormData,
    ProducerVerificationFormData
} from './form.types'

// ==================== PROFIL PRODUCTEUR ====================
export type {
    ProducerProfile,
    ProducerProfileCreate,
    ProducerProfileUpdate,
    CompleteProducerProfile,
    VerifiedProducer,
    ProducerStats,
    ProducerFilters,
    ProducerProfileFormData,
    ProducerProfileValidation,
    ProducerState,
    CreateProducerProfile,
    UpdateProducerProfile,
    ApiResponse,
    ErrorResponse,
    PaginationParams,
    FullAddress
} from './ProducerProfile'

// ==================== DOCUMENTS ====================
export type {
    ProducerDocument,
    ProducerDocumentUpload,
    ProducerDocumentUpdate,
    UploadDocument,
    DocumentVerification,
    VerificationRequest
} from './ProducerProfile'

// ==================== POINTS DE RETRAIT ====================
export type {
    PickupPoint,
    CreatePickupPointRequest,
    UpdatePickupPointRequest,
    PickupPointImage,
    ImageUploadRequest,
    PickupPointSchedule,
    PickupPointAvailability,
    PickupPointCalendar,
    PickupPointStats,
    PickupPointListResponse,
    PickupPointDetailResponse,
    PickupPointSearchResponse,
    GeocodingResult,
    RouteCalculation,
    PickupPointConfig,
    PickupPointFilters,
    Coordinates,
    PickupSchedule,
    PickupException,
    PickupAnalytics,
    PickupPointWithSlots
} from './PickupPoint'

export type { PickupPointCreate } from './ProducerProfile'

// ==================== CRÉNEAUX ====================
export type {
    PickupSlot,
    AvailableSlot,
    CreatePickupSlotRequest,
    UpdatePickupSlotRequest,
    CreatePickupSlotsBatchRequest,
    UpdatePickupSlotsBatchRequest,
    RecurrencePatternConfig,
    GenerateRecurringSlotsRequest,
    SlotBooking,
    BookSlotRequest,
    UpdateBookingRequest,
    SlotAvailability,
    SlotAvailabilityFilters,
    SlotStatistics,
    SlotTemplate,
    SlotListResponse,
    AvailableSlotsResponse,
    SlotStatsResponse,
    BatchOperationResult,
    PickupSlotCreate,
    PickupSlotUpdate,
    PickupSlotBulkCreate,
    PickupSlotBulkUpdate,
    SlotReservation,
    SlotOccupancy,
    SlotValidationResult,
    SlotConflict,
    SlotAnalytics,
    SlotWaitlist,
    SlotNotificationSettings,
    SlotExportParams
} from './PickupSlot'

export type { PickupSlotCreate as SlotCreate } from './ProducerProfile'

// ==================== HORAIRES ====================
export type {
    ProducerSchedule,
    CreateScheduleRequest,
    UpdateScheduleRequest,
    ScheduleListResponse,
    RecurringSlotGeneration,
    AvailableSlot as ScheduleAvailableSlot,
    AvailableSlotsResponse as ScheduleAvailableSlotsResponse,
    SlotListResponse as ScheduleSlotListResponse,
    PaginatedSlots,
    SlotStatistics as ScheduleSlotStatistics,
    UpdatePickupSlotRequest as ScheduleUpdateSlotRequest,
    CalendarView
} from './ProducerSchedule'

export type { ProducerScheduleUpdate, CreateSchedule, UpdateSchedule } from './ProducerProfile'

// ==================== ENUMS ====================

// Enums du profil
export { ProductionType, CertificationType, DocumentType, VerificationStatus } from './ProducerProfile'

// Enums des points de retrait
export { PickupPointType, PickupPointStatus, AccessType, FacilityType, DayOfWeek } from './PickupPoint'

// Enums des créneaux
export { SlotStatus, SlotType, RecurrencePattern, BookingPriority, SlotCreationMethod } from './PickupSlot'

// Enums des horaires - Export unique
export { ScheduleType, TimeSlotType, RecurrenceType, DurationUnit } from './ProducerSchedule'

// ==================== ALIAS POUR COMPATIBILITÉ ====================
export type { Coordinates as GeoCoordinates } from './PickupPoint'
export type { DayOfWeek as WeekDay } from './PickupPoint'
export type { SlotStatus as CreneauStatus } from './PickupSlot'
export type { RecurrencePattern as PatternRecurrence } from './PickupSlot'
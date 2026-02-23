// User Profiles Module
// Export customer types
export type {
    CustomerProfile,
    CompleteCustomerProfile,
    Address as CustomerAddress,
    CreateCustomerProfileRequest,
    UpdateCustomerProfileRequest
} from './customer';

// Export producer types
export type {
    ProducerProfile,
    PickupPoint,
    PickupSlot,
    ProducerDocument
} from './producer';

// Export customer services
export { CustomerProfileService, CustomerAddressService } from './customer';

// Export producer services
export { ProducerProfileService, PickupPointService, PickupSlotService } from './producer';

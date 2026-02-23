import type { Coordinates } from '../types';

import { getErrorMessage } from '@/shared/utils/error-handler';
export interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}

export interface GeolocationResult {
    coordinates: Coordinates;
    accuracy: number;
    timestamp: number;
}

export class GeolocationService {
    static async getCurrentPosition(options?: GeolocationOptions): Promise<GeolocationResult> {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        coordinates: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        },
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    });
                },
                (error) => {
                    reject(new Error(`Geolocation error: ${getErrorMessage(error)}`));
                },
                {
                    enableHighAccuracy: options?.enableHighAccuracy ?? true,
                    timeout: options?.timeout ?? 10000,
                    maximumAge: options?.maximumAge ?? 300000
                }
            );
        });
    }

    static calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(coord2.latitude - coord1.latitude);
        const dLon = this.toRadians(coord2.longitude - coord1.longitude);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(coord1.latitude)) * Math.cos(this.toRadians(coord2.latitude)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private static toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
}
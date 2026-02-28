/**
 * Utilitaires pour la gestion d'erreurs TypeScript-safe
 */

/**
 * Extrait un message d'erreur de manière type-safe
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message || 'Une erreur inconnue s\'est produite';
    }
    
    if (typeof error === 'string') {
        return error;
    }

    // Gestion des erreurs HTTP (ex: Axios/FastAPI)
    if (error && typeof error === 'object') {
        const maybeResponse = (error as { response?: unknown }).response as
            | { data?: unknown; status?: number }
            | undefined;

        const responseData = maybeResponse?.data as
            | { detail?: unknown; message?: unknown }
            | undefined;

        if (responseData) {
            if (typeof responseData.detail === 'string') {
                return responseData.detail;
            }

            if (Array.isArray(responseData.detail) && responseData.detail.length > 0) {
                const first = responseData.detail[0] as { msg?: unknown };
                if (first && typeof first.msg === 'string') {
                    return first.msg;
                }
            }

            if (typeof responseData.message === 'string') {
                return responseData.message;
            }
        }
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as { message: unknown }).message;
        if (typeof message === 'string') {
            return message;
        }
    }
    
    return 'Une erreur inconnue s\'est produite';
}

/**
 * Vérifie si une erreur est une erreur HTTP avec un code de statut
 */
export function isHttpError(error: unknown): error is { status: number; message: string } {
    return error !== null &&
        typeof error === 'object' &&
        'status' in error &&
        typeof (error as any).status === 'number' &&
        'message' in error &&
        typeof (error as any).message === 'string';
}

/**
 * Extrait le code de statut HTTP d'une erreur
 */
export function getErrorStatus(error: unknown): number | null {
    if (isHttpError(error)) {
        return error.status;
    }
    return null;
}

/**
 * Formate une erreur pour l'affichage utilisateur
 */
export function formatErrorForUser(error: unknown): string {
    const message = getErrorMessage(error);
    const status = getErrorStatus(error);
    
    if (status) {
        switch (status) {
            case 400:
                return 'Données invalides. Veuillez vérifier votre saisie.';
            case 401:
                return 'Vous devez vous connecter pour effectuer cette action.';
            case 403:
                return 'Vous n\'avez pas les permissions nécessaires.';
            case 404:
                return 'Ressource non trouvée.';
            case 422:
                return 'Données de validation incorrectes.';
            case 500:
                return 'Erreur serveur. Veuillez réessayer plus tard.';
            default:
                return message;
        }
    }
    
    return message;
}

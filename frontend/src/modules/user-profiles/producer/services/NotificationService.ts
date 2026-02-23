export interface NotificationOptions {
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    persistent?: boolean;
}

export interface NotificationInstance {
    id: string;
    options: NotificationOptions;
    timestamp: number;
}

export class NotificationService {
    private static notifications: NotificationInstance[] = [];
    private static listeners: ((notifications: NotificationInstance[]) => void)[] = [];

    static show(options: NotificationOptions): string {
        const id = Math.random().toString(36).substr(2, 9);
        const notification: NotificationInstance = {
            id,
            options,
            timestamp: Date.now()
        };

        this.notifications.push(notification);
        this.notifyListeners();

        if (!options.persistent && options.duration !== 0) {
            setTimeout(() => {
                this.remove(id);
            }, options.duration || 5000);
        }

        return id;
    }

    static success(title: string, message: string, duration?: number): string {
        return this.show({
            title,
            message,
            type: 'success',
            duration
        });
    }

    static error(title: string, message: string, persistent = false): string {
        return this.show({
            title,
            message,
            type: 'error',
            persistent,
            duration: persistent ? 0 : 8000
        });
    }

    static warning(title: string, message: string, duration?: number): string {
        return this.show({
            title,
            message,
            type: 'warning',
            duration
        });
    }

    static info(title: string, message: string, duration?: number): string {
        return this.show({
            title,
            message,
            type: 'info',
            duration
        });
    }

    static remove(id: string): void {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index > -1) {
            this.notifications.splice(index, 1);
            this.notifyListeners();
        }
    }

    static clear(): void {
        this.notifications = [];
        this.notifyListeners();
    }

    static getAll(): NotificationInstance[] {
        return [...this.notifications];
    }

    static subscribe(listener: (notifications: NotificationInstance[]) => void): () => void {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    private static notifyListeners(): void {
        this.listeners.forEach(listener => listener([...this.notifications]));
    }
}
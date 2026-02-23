import { ref } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

const notifications = ref<Notification[]>([])

export function useNotification() {
  const show = (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000
    }
    
    notifications.value.push(newNotification)
    
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, newNotification.duration)
    }
    
    return id
  }
  
  const remove = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  const success = (title: string, message: string, duration?: number) => {
    return show({ type: 'success', title, message, duration })
  }
  
  const error = (title: string, message: string, duration?: number) => {
    return show({ type: 'error', title, message, duration })
  }
  
  const warning = (title: string, message: string, duration?: number) => {
    return show({ type: 'warning', title, message, duration })
  }
  
  const info = (title: string, message: string, duration?: number) => {
    return show({ type: 'info', title, message, duration })
  }
  
  const clear = () => {
    notifications.value = []
  }
  
  return {
    notifications,
    show,
    remove,
    success,
    error,
    warning,
    info,
    clear
  }
}

import { ref } from 'vue'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
  const show = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 3000
    }
    
    toasts.value.push(newToast)
    
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, newToast.duration)
    }
    
    return id
  }
  
  const remove = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const success = (message: string, duration?: number) => {
    return show({ type: 'success', message, duration })
  }
  
  const error = (message: string, duration?: number) => {
    return show({ type: 'error', message, duration })
  }
  
  const warning = (message: string, duration?: number) => {
    return show({ type: 'warning', message, duration })
  }
  
  const info = (message: string, duration?: number) => {
    return show({ type: 'info', message, duration })
  }
  
  const clear = () => {
    toasts.value = []
  }
  
  return {
    toasts,
    show,
    remove,
    success,
    error,
    warning,
    info,
    clear
  }
}

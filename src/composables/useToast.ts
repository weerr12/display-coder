import { toast } from 'vue3-toastify'

export const useToast = () => {
    const showSuccess = (message: string, onClose?: () => void) => {
        toast.success(message, {
            autoClose: 2000,
            position: 'top-right',
            onClose: onClose
        })
    }

    const showError = (message: string, onClose?: () => void) => {
        toast.error(message, {
            autoClose: 5000,
            position: 'top-right',
            onClose: onClose
        })
    }

    const showInfo = (message: string, onClose?: () => void) => {
        toast.info(message, {
            autoClose: 3000,
            position: 'top-right',
            onClose: onClose
        })
    }

    const showWarning = (message: string, onClose?: () => void) => {
        toast.warn(message, {
            autoClose: 4000,
            position: 'top-right',
            onClose: onClose
        })
    }

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', onClose?: () => void) => {
        switch (type) {
            case 'success':
                showSuccess(message, onClose)
                break
            case 'error':
                showError(message, onClose)
                break
            case 'warning':
                showWarning(message, onClose)
                break
            default:
                showInfo(message, onClose)
        }
    }

    return {
        showSuccess,
        showError,
        showInfo,
        showWarning,
        showToast
    }
}

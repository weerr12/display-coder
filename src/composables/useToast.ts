import { toast } from 'vue3-toastify'

export const useToast = () => {
    const showSuccess = (message: string) => {
        toast.success(message, {
            autoClose: 3000,
            position: 'top-right'
        })
    }

    const showError = (message: string) => {
        toast.error(message, {
            autoClose: 5000,
            position: 'top-right'
        })
    }

    const showInfo = (message: string) => {
        toast.info(message, {
            autoClose: 3000,
            position: 'top-right'
        })
    }

    const showWarning = (message: string) => {
        toast.warn(message, {
            autoClose: 4000,
            position: 'top-right'
        })
    }

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        switch (type) {
            case 'success':
                showSuccess(message)
                break
            case 'error':
                showError(message)
                break
            case 'warning':
                showWarning(message)
                break
            default:
                showInfo(message)
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

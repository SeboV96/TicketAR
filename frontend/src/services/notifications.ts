import Swal from 'sweetalert2';

/**
 * Servicio modular de notificaciones usando SweetAlert2
 * Personalizado con los estilos de la aplicación (TailwindCSS)
 */
class NotificationService {
  // Configuración base que combina con los estilos de la app
  private baseConfig = {
    customClass: {
      popup: 'rounded-lg shadow-lg',
      title: 'text-xl font-bold',
      confirmButton: 'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2',
      cancelButton: 'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2',
    },
    buttonsStyling: false,
    allowOutsideClick: false,
    allowEscapeKey: true,
  };

  /**
   * Muestra una notificación de éxito
   */
  success(title: string, message?: string, timer: number = 2000) {
    return Swal.fire({
      ...this.baseConfig,
      icon: 'success',
      title,
      text: message,
      iconColor: '#10b981', // green-500
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#2563eb', // blue-600
      timer,
      timerProgressBar: true,
      showClass: {
        popup: 'animate-fade-in',
      },
      hideClass: {
        popup: 'animate-fade-out',
      },
    });
  }

  /**
   * Muestra una notificación de error
   */
  error(title: string, message?: string) {
    return Swal.fire({
      ...this.baseConfig,
      icon: 'error',
      title,
      text: message,
      iconColor: '#ef4444', // red-500
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#dc2626', // red-600
      showClass: {
        popup: 'animate-fade-in',
      },
      hideClass: {
        popup: 'animate-fade-out',
      },
    });
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(title: string, message?: string) {
    return Swal.fire({
      ...this.baseConfig,
      icon: 'warning',
      title,
      text: message,
      iconColor: '#f59e0b', // amber-500
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#2563eb', // blue-600
      showClass: {
        popup: 'animate-fade-in',
      },
      hideClass: {
        popup: 'animate-fade-out',
      },
    });
  }

  /**
   * Muestra una notificación informativa
   */
  info(title: string, message?: string) {
    return Swal.fire({
      ...this.baseConfig,
      icon: 'info',
      title,
      text: message,
      iconColor: '#3b82f6', // blue-500
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#2563eb', // blue-600
      showClass: {
        popup: 'animate-fade-in',
      },
      hideClass: {
        popup: 'animate-fade-out',
      },
    });
  }

  /**
   * Muestra un diálogo de confirmación
   */
  confirm(
    title: string,
    message?: string,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ) {
    return Swal.fire({
      ...this.baseConfig,
      icon: 'question',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#2563eb', // blue-600
      cancelButtonColor: '#6b7280', // gray-500
      reverseButtons: true,
      showClass: {
        popup: 'animate-fade-in',
      },
      hideClass: {
        popup: 'animate-fade-out',
      },
    });
  }

  /**
   * Muestra un diálogo de carga
   */
  loading(title: string = 'Cargando...', message?: string) {
    return Swal.fire({
      ...this.baseConfig,
      title,
      text: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  /**
   * Cierra cualquier notificación activa
   */
  close() {
    Swal.close();
  }
}

// Exportar instancia única (patrón Singleton)
export const notifications = new NotificationService();

import { createContext, JSX, useContext, useState, type ReactNode } from 'react';

export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface ModalData {
  title?: string;
  message: string;
  type: ModalType;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface ModalContextType {
  isOpen: boolean;
  data: ModalData | null;
  openModal: (data: ModalData) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData | null>(null);

  const openModal = (modalData: ModalData) => {
    setData(modalData);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setData(null), 200);
  };

  return (
    <ModalContext.Provider value={{ isOpen, data, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }

  const { openModal, closeModal } = context;

  const showSuccess = (message: string, title?: string) => {
    openModal({ type: 'success', message, title: title || 'Éxito' });
  };

  const showError = (message: string, title?: string) => {
    openModal({ type: 'error', message, title: title || 'Error' });
  };

  const showWarning = (message: string, title?: string) => {
    openModal({ type: 'warning', message, title: title || 'Advertencia' });
  };

  const showInfo = (message: string, title?: string) => {
    openModal({ type: 'info', message, title: title || 'Información' });
  };

  const showConfirm = (
    message: string,
    onConfirm: () => void | Promise<void>,
    options?: {
      title?: string;
      confirmText?: string;
      cancelText?: string;
      onCancel?: () => void;
    }
  ) => {
    openModal({
      type: 'confirm',
      message,
      onConfirm,
      title: options?.title || 'Confirmar',
      confirmText: options?.confirmText || 'Confirmar',
      cancelText: options?.cancelText || 'Cancelar',
      onCancel: options?.onCancel,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    closeModal,
  };
};

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within ModalProvider');
  }
  return context;
}

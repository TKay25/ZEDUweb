// src/components/ui/Modal.tsx
import React, { useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

// Define BaseProps locally since it's not exported from types
interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  testId?: string;
}

interface ModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  footer?: React.ReactNode;
  children?: React.ReactNode; // Add children to props
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
  children,
  className = '',
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnOverlayClick) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnOverlayClick, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={closeOnOverlayClick ? onClose : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`
                  w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl
                  bg-white dark:bg-gray-800 text-left align-middle shadow-xl
                  transition-all ${className}
                `}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      {title && (
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-semibold leading-6 text-gray-900 dark:text-white"
                        >
                          {title}
                        </Dialog.Title>
                      )}
                      {description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {description}
                        </p>
                      )}
                    </div>
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}

                {/* Body */}
                <div className="p-6">{children}</div>

                {/* Footer */}
                {footer && (
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

interface ModalFooterProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children, align = 'right' }) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`flex items-center space-x-3 ${alignClasses[align]}`}>
      {children}
    </div>
  );
};

// Add Footer to Modal component
const ModalWithFooter = Modal as typeof Modal & {
  Footer: typeof ModalFooter;
};
ModalWithFooter.Footer = ModalFooter;

export default ModalWithFooter;
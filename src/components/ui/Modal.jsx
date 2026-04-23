import { useEffect } from 'react';
import Button from './Button';

function Modal({ isOpen, onClose, onConfirm, title, children, confirmText = 'Confirm', confirmVariant = 'primary', loading = false }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-dark-card border border-dark-border rounded-md p-6 w-full max-w-md shadow-card animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
        <div className="text-txt-secondary text-sm mb-6">{children}</div>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            size="md"
            onClick={onConfirm}
            className="flex-1"
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Modal;

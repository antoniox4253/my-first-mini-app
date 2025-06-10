// src/components/Modal.tsx

import React from 'react';

interface ModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
        <h3 className="text-xl font-bold mb-4">Mensaje</h3>
        <p className="text-sm mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-[#39aaff] text-white px-4 py-2 rounded-full"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Modal;

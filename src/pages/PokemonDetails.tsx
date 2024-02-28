// Modal.tsx
import React from 'react';
import '../styles/modal.css';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

const PokemonDetails: React.FC<ModalProps> = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={closeModal}>X</button>
        {children}
      </div>
    </div>
  );
};

export default PokemonDetails;

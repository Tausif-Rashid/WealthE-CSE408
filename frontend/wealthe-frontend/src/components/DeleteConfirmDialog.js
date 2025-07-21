import React from 'react';
import './MessageDialog.css';

const DeleteConfirmDialog = ({ isOpen, itemName, itemType, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-container">
        <div className="dialog-header">
          <h2>🗑️ Delete {itemType}</h2>
        </div>
        
        <div className="dialog-content">
          <p>Are you sure you want to delete "{itemName}"?</p>
          <p className="warning-text">⚠️ This action cannot be undone!</p>
        </div>
        
        <div className="dialog-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="cancel-button"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={onConfirm}
            className="delete-button"
          >
            Delete {itemType}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;

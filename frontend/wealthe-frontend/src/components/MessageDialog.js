import React from 'react';
import './MessageDialog.css';

const MessageDialog = ({ isOpen, type, title, message, onClose }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📝';
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <div className="message-dialog-overlay">
      <div className={`message-dialog-container ${getTypeClass()}`}>
        <div className="message-dialog-header">
          <span className="message-dialog-icon">{getIcon()}</span>
          <h3>{title}</h3>
        </div>
        
        <div className="message-dialog-content">
          <p>{message}</p>
        </div>
        
        <div className="message-dialog-actions">
          <button 
            type="button" 
            onClick={onClose}
            className="message-dialog-ok-button"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDialog;
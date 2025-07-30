import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  getBankAccounts, 
  getCars, 
  getFlats, 
  getJewellery, 
  getPlots,
  deleteBankAccount,
  deleteCar,
  deleteFlat,
  deleteJewellery,
  deletePlot
} from '../utils/api';
import MessageDialog from '../components/MessageDialog';
import './Assets.css';

const Assets = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Asset data states
  const [bankAccounts, setBankAccounts] = useState([]);
  const [cars, setCars] = useState([]);
  const [flats, setFlats] = useState([]);
  const [jewellery, setJewellery] = useState([]);
  const [plots, setPlots] = useState([]);

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState({
    show: false,
    assetType: '',
    assetId: null,
    assetName: ''
  });
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageDialogType, setMessageDialogType] = useState('');
  const [messageDialogTitle, setMessageDialogTitle] = useState('');
  const [messageDialogMessage, setMessageDialogMessage] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const [bankData, carData, flatData, jewelleryData, plotData] = await Promise.all([
          getBankAccounts(),
          getCars(),
          getFlats(),
          getJewellery(),
          getPlots()
        ]);

        setBankAccounts(bankData || []);
        setCars(carData || []);
        setFlats(flatData || []);
        setJewellery(jewelleryData || []);
        setPlots(plotData || []);
      } catch (err) {
        setError('Failed to load assets');
        console.error('Error fetching assets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const showMessageDialog = (type, title, message) => {
    setMessageDialogType(type);
    setMessageDialogTitle(title);
    setMessageDialogMessage(message);
    setMessageDialogOpen(true);
  };

  const handleMessageDialogClose = () => {
    setMessageDialogOpen(false);
  };

  const handleAddAsset = (assetType) => {
    navigate(`/add-asset-${assetType}`);
  };

  const handleEditAsset = (assetType, assetId) => {
    navigate(`/edit-asset-${assetType}`, { state: { assetId } });
  };

  const handleDeleteAsset = (assetType, assetId, assetName) => {
    setDeleteDialog({
      show: true,
      assetType,
      assetId,
      assetName
    });
  };

  const handleConfirmDelete = async () => {
    try {
      const { assetType, assetId } = deleteDialog;
      
      switch (assetType) {
        case 'bank-account':
          await deleteBankAccount(assetId);
          setBankAccounts(prev => prev.filter(item => item.id !== assetId));
          break;
        case 'car':
          await deleteCar(assetId);
          setCars(prev => prev.filter(item => item.id !== assetId));
          break;
        case 'flat':
          await deleteFlat(assetId);
          setFlats(prev => prev.filter(item => item.id !== assetId));
          break;
        case 'jewellery':
          await deleteJewellery(assetId);
          setJewellery(prev => prev.filter(item => item.id !== assetId));
          break;
        case 'plot':
          await deletePlot(assetId);
          setPlots(prev => prev.filter(item => item.id !== assetId));
          break;
        default:
          throw new Error('Unknown asset type');
      }

      setDeleteDialog({ show: false, assetType: '', assetId: null, assetName: '' });
      showMessageDialog('success', 'Success', 'Asset deleted successfully');
    } catch (error) {
      console.error('Error deleting asset:', error);
      showMessageDialog('error', 'Error', 'Failed to delete asset. Please try again.');
      setDeleteDialog({ show: false, assetType: '', assetId: null, assetName: '' });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ show: false, assetType: '', assetId: null, assetName: '' });
  };

  const formatAmount = (amount) => {
    if (!amount) return '৳0';
    return `৳${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const AssetCard = ({ asset, assetType, icon, onEdit, onDelete }) => {
    return (
      <div className="asset-card">
        <div className="asset-card-header">
          <div className="asset-icon">{icon}</div>
          <div className="asset-details">
            <h3 className="asset-title">{asset.title}</h3>
            {assetType === 'bank-account' && (
              <React.Fragment>
                <p className="asset-subtitle">{asset.bank_name}</p>
                <p className="asset-amount">{formatAmount(asset.amount)}</p>
                <p className="asset-info">Account: {asset.account}</p>
              </React.Fragment>
            )}
            {assetType === 'car' && (
              <React.Fragment>
                <p className="asset-subtitle">{asset.model}</p>
                <p className="asset-amount">{formatAmount(asset.cost)}</p>
                <p className="asset-info">Reg: {asset.reg_number}</p>
                <p className="asset-info">Engine: {asset.engine} cc</p>
              </React.Fragment>
            )}
            {assetType === 'flat' && (
              <React.Fragment>
                <p className="asset-subtitle">{asset.location}</p>
                <p className="asset-amount">{formatAmount(asset.cost)}</p>
                <p className="asset-info">Date: {formatDate(asset.date)}</p>
                <p className="asset-info">Acquisition: {asset.acquisition}</p>
              </React.Fragment>
            )}
            {assetType === 'jewellery' && (
              <React.Fragment>
                <p className="asset-amount">{formatAmount(asset.cost)}</p>
                <p className="asset-info">Weight: {asset.weight}g</p>
                <p className="asset-info">Acquisition: {asset.acquisition}</p>
              </React.Fragment>
            )}
            {assetType === 'plot' && (
              <React.Fragment>
                <p className="asset-subtitle">{asset.type}</p>
                <p className="asset-amount">{formatAmount(asset.cost)}</p>
                <p className="asset-info">Location: {asset.location}</p>
                <p className="asset-info">Date: {formatDate(asset.date)}</p>
              </React.Fragment>
            )}
          </div>
        </div>
        {asset.description && (
          <p className="asset-description">{asset.description}</p>
        )}
        <div className="asset-actions">
          <button 
            onClick={() => onEdit(assetType, asset.id)}
            className="asset-edit-btn"
          >
            ✏️ Edit
          </button>
          <button 
            onClick={() => onDelete(assetType, asset.id, asset.title)}
            className="asset-delete-btn"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    );
  };

  const AssetSection = ({ title, assets, assetType, icon, onAdd }) => {
    return (
      <div className="asset-section">
        <div className="asset-section-header">
          <h2 className="asset-section-title">
            <span className="asset-section-icon">{icon}</span>
            {title}
          </h2>
          <button onClick={() => onAdd(assetType)} className="add-asset-btn">
            ➕ Add {title.slice(0, -1)}
          </button>
        </div>
        <div className="asset-grid">
          {assets.length > 0 ? (
            assets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                assetType={assetType}
                icon={icon}
                onEdit={handleEditAsset}
                onDelete={handleDeleteAsset}
              />
            ))
          ) : (
            <div className="no-assets">
              <p>No {title.toLowerCase()} found. Click "Add {title.slice(0, -1)}" to get started!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="assets-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading assets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assets-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="assets-container">
      <div className="assets-header">
        <h1>💎 My Assets</h1>
        <p>Manage and track all your valuable assets</p>
      </div>

      <div className="assets-content">
        <AssetSection
          title="Bank Accounts"
          assets={bankAccounts}
          assetType="bank-account"
          icon="🏦"
          onAdd={handleAddAsset}
        />

        <AssetSection
          title="Cars"
          assets={cars}
          assetType="car"
          icon="🚗"
          onAdd={handleAddAsset}
        />

        <AssetSection
          title="Flats"
          assets={flats}
          assetType="flat"
          icon="🏠"
          onAdd={handleAddAsset}
        />

        <AssetSection
          title="Jewellery"
          assets={jewellery}
          assetType="jewellery"
          icon="💍"
          onAdd={handleAddAsset}
        />

        <AssetSection
          title="Plots"
          assets={plots}
          assetType="plot"
          icon="🏞️"
          onAdd={handleAddAsset}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.show && (
        <div className="assets-delete-dialog-overlay">
          <div className="assets-delete-dialog-container">
            <div className="assets-delete-dialog-header">
              <h2>🗑️ Delete Asset</h2>
            </div>
            
            <div className="assets-delete-dialog-content">
              <p>Are you sure you want to delete the asset "{deleteDialog.assetName}"?</p>
              <p className="assets-delete-warning-text">⚠️ This action cannot be undone!</p>
            </div>
            
            <div className="assets-delete-dialog-actions">
              <button 
                type="button" 
                onClick={handleCancelDelete}
                className="assets-delete-cancel-button"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleConfirmDelete}
                className="assets-delete-confirm-button"
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Dialog */}
      <MessageDialog
        isOpen={messageDialogOpen}
        type={messageDialogType}
        title={messageDialogTitle}
        message={messageDialogMessage}
        onClose={handleMessageDialogClose}
      />
    </div>
  );
};

export default Assets;

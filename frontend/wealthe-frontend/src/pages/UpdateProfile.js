import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { updateUserProfile, getAllTaxAreaList, getTaxZonesByArea, getTaxCirclesByZone } from '../utils/api';
import './UpdateProfile.css';

const UpdateProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [taxAreaOptions, setTaxAreaOptions] = useState([]);
  const [taxZoneOptions, setTaxZoneOptions] = useState([]);
  const [taxCircleOptions, setTaxCircleOptions] = useState([]);
  const { userInfo = {}, taxInfo = {} } = location.state || {};

  const [form, setForm] = useState({
    name: userInfo.name || '',
    phone: userInfo.phone || '',
    nid: userInfo.nid || '',
    dob: userInfo.dob ? userInfo.dob.substring(0, 10) : '',
    spouse_name: userInfo.spouse_name || '',
    spouse_tin: userInfo.spouse_tin || '',
    tin: taxInfo.tin || '',
    area_name: taxInfo.area_name || '',
    tax_zone: taxInfo.tax_zone || '',
    tax_circle: taxInfo.tax_circle || '',
    email: taxInfo.email || '',
    is_ff: taxInfo.is_ff || false,
    is_disabled: taxInfo.is_disabled || false,
    is_female: taxInfo.is_female || false,
    is_resident: taxInfo.is_resident || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
      const fetchData = async () => {
        try {
          const taxAreas = await getAllTaxAreaList();
          
          // Sort the tax zones before setting state
          setTaxAreaOptions(taxAreas);
        } catch (err) {
          setError('Failed to load tax zone data');
          console.error('Error fetching data:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add this new function to handle area change and fetch tax zones
  const handleAreaChange = async (e) => {
    const { name, value } = e.target;
    
    // Update the form state with the new area_name
    setForm(prev => ({ 
      ...prev, 
      [name]: value,
      tax_zone: '', // Reset tax zone when area changes
      tax_circle: '' // Reset tax circle when area changes
    }));
    
    // Reset tax zone and circle options
    // setTaxZoneOptions([]);
    // setTaxCircleOptions([]);
    
    // If an area is selected, fetch the tax zones for that area
    if (value) {
      try {
        setLoading(true);
        setError(''); // Clear any previous errors
        
        // Call the API to get tax zones by area
        const taxZones = await getTaxZonesByArea(value);
        setTaxZoneOptions(taxZones || []);
        
        console.log('Tax zones fetched for area:', value, taxZones);
      } catch (err) {
        setError('Failed to fetch tax zones for the selected area');
        console.error('Error fetching tax zones:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Add this new function to handle tax zone change and fetch tax circles
  const handleTaxZoneChange = async (e) => {
    const { name, value } = e.target;
    
    // Update the form state with the new tax_zone
    setForm(prev => ({ 
      ...prev, 
      [name]: value,
      tax_circle: '' // Reset tax circle when zone changes
    }));
    
    // Reset tax circle options
    setTaxCircleOptions([]);
    
    // If a tax zone is selected, fetch the tax circles for that zone
    if (value) {
      try {
        setLoading(true);
        setError(''); // Clear any previous errors
        
        // Call the API to get tax circles by zone
        const taxCircles = await getTaxCirclesByZone(value);
        setTaxCircleOptions(taxCircles || []);
        
        console.log('Tax circles fetched for zone:', value, taxCircles);
      } catch (err) {
        setError('Failed to fetch tax circles for the selected zone');
        console.error('Error fetching tax circles:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Prepare payload as per backend expectation
      const payload = {
        ...form,
        is_ff: form.is_ff,
        is_disabled: form.is_disabled,
        is_female: form.is_female,
        is_resident: form.is_resident,
      };
      await updateUserProfile(payload);
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-profile-container">
      <h1>Edit Profile</h1>
      <form className="update-profile-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>NID</label>
          <input name="nid" value={form.nid} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>Date of Birth</label>
          <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>Spouse Name</label>
          <input name="spouse_name" value={form.spouse_name} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label>Spouse TIN</label>
          <input name="spouse_tin" value={form.spouse_tin} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label>TIN</label>
          <input name="tin" value={form.tin} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <div className= "form-group">
          <label>Area Name</label>
          <select
                  name="area_name"
                  value={form.area_name}
                  onChange={handleAreaChange}
                  
                >
                  <option value="">Select an area</option>
                  {taxAreaOptions.map((area, index) => (
                    <option key={index} value={area.area_name}>
                      {area.area_name}
                    </option>
                  ))}
                </select></div>
                </div>
        <div className="form-row">
          <div className="form-group">
          <label>Tax Zone</label>
          <select
            name="tax_zone"
            value={form.tax_zone}
            onChange={handleTaxZoneChange}
            required
            disabled={!form.area_name || taxZoneOptions.length === 0}
          >
            <option value="">Select a tax zone</option>
            {taxZoneOptions.map((zone, index) => (
              <option key={index} value={zone.tax_zone}>
                {zone.zone_no}
              </option>
            ))}
          </select>
        </div>
        </div>
        <div className="form-row">
          <div className="form-group">
          <label>Tax Circle</label>
          <select
            name="tax_circle"
            value={form.tax_circle}
            onChange={handleChange}
            
            disabled={!form.tax_zone || taxCircleOptions.length === 0}
          >
            <option value="">Select a tax circle</option>
            {taxCircleOptions.map((circle, index) => (
              <option key={index} value={circle.tax_circle}>
                {circle.circle_no}
              </option>
            ))}
          </select>
        </div>
        </div>
        <div className="form-row">
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label className="privileged-label">Privileged</label>
        </div>
        <div className="form-row privileged-row">
          <div className="privileged-checkboxes">
            <div className="privileged-checkbox-row">
              <label>
                <input type="checkbox" name="is_ff" checked={form.is_ff} onChange={handleCheckbox} /> Freedom Fighter
              </label>
            </div>
            <div className="privileged-checkbox-row">
              <label>
                <input type="checkbox" name="is_disabled" checked={form.is_disabled} onChange={handleCheckbox} /> Disabled
              </label>
            </div>
            <div className="privileged-checkbox-row">
              <label>
                <input type="checkbox" name="is_female" checked={form.is_female} onChange={handleCheckbox} /> Female
              </label>
            </div>
            <div className="privileged-checkbox-row">
              <label>
                <input type="checkbox" name="is_resident" checked={form.is_resident} onChange={handleCheckbox} /> Resident
              </label>
            </div>
          </div>
        </div>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile; 
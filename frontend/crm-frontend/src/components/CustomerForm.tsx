import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Customer } from '../types';

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit: (customer: Omit<Customer, 'id'> | Customer) => Promise<void>;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    region: '',
    registrationDate: new Date().toISOString().split('T')[0]
  });

  // Get today's date (YYYY-MM-DD format)
  const today = new Date().toISOString().split('T')[0];
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string, 
    lastName?: string, 
    email?: string, 
    region?: string
  }>({});

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        region: customer.region,
        registrationDate: customer.registrationDate.split('T')[0]
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

    try {
      if (customer) {
        await onSubmit({ ...customer, ...formData });
      } else {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Character limit validation
    const maxLengths: { [key: string]: number } = {
      firstName: 50,
      lastName: 50,
      email: 100,
      region: 100
    };

    if (value.length > maxLengths[name]) {
      const errorMessages: { [key: string]: string } = {
        firstName: 'First name cannot exceed 50 characters',
        lastName: 'Last name cannot exceed 50 characters',
        email: 'Email cannot exceed 100 characters',
        region: 'Region cannot exceed 100 characters'
      };
      setFieldErrors(prev => ({...prev, [name]: errorMessages[name]}));
    } else {
      setFieldErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  return (
    <Modal show={true} onHide={onCancel} size="lg" centered contentClassName="modern-customer-modal">
      <Modal.Header closeButton style={{
        border: 'none',
        background: 'linear-gradient(135deg, #184e77 0%, #1e5a8a 100%)',
        color: 'white',
        padding: '32px 32px 32px 32px',
        alignItems: 'center',
        gap: 16
      }} className="customer-form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="header-content">
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            color: 'white',
            boxShadow: '0 2px 8px rgba(24, 78, 119, 0.08)'
          }} className="header-icon">
            <i className={`bi ${customer ? 'bi-pencil-fill' : 'bi-person-plus-fill'}`}></i>
          </div>
          <Modal.Title style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'white',
            margin: 0,
            letterSpacing: 0.5
          }} className="header-title">
            {customer ? 'Update Customer' : 'Add New Customer'}
          </Modal.Title>
        </div>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body style={{
          background: '#fff',
          borderRadius: 0,
          padding: '32px',
          boxShadow: '0 4px 24px 0 rgba(60,72,88,0.08)'
        }} className="customer-form-body">
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }} className="form-row">
            <div style={{ flex: 1, minWidth: 220 }}>
              <Form.Label style={{ fontWeight: 600, color: '#184e77', fontSize: 15 }}>First Name *</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                maxLength={50}
                style={{
                  borderRadius: 12,
                  fontSize: 16,
                  padding: '14px 16px',
                  border: fieldErrors.firstName ? '2px solid #dc3545' : '2px solid #e9ecef',
                  marginBottom: fieldErrors.firstName ? 8 : 18,
                  background: '#f8f9fa',
                  color: '#184e77',
                  boxShadow: '0 1px 4px rgba(30,96,145,0.04)'
                }}
              />
              {fieldErrors.firstName && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '12px',
                  marginBottom: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <i className="bi bi-exclamation-circle-fill"></i>
                  {fieldErrors.firstName}
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <Form.Label style={{ fontWeight: 600, color: '#184e77', fontSize: 15 }}>Last Name *</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                maxLength={50}
                style={{
                  borderRadius: 12,
                  fontSize: 16,
                  padding: '14px 16px',
                  border: fieldErrors.lastName ? '2px solid #dc3545' : '2px solid #e9ecef',
                  marginBottom: fieldErrors.lastName ? 8 : 18,
                  background: '#f8f9fa',
                  color: '#184e77',
                  boxShadow: '0 1px 4px rgba(30,96,145,0.04)'
                }}
              />
              {fieldErrors.lastName && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '12px',
                  marginBottom: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <i className="bi bi-exclamation-circle-fill"></i>
                  {fieldErrors.lastName}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }} className="form-row">
            <div style={{ flex: 1, minWidth: 220 }}>
              <Form.Label style={{ fontWeight: 600, color: '#184e77', fontSize: 15 }}>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                maxLength={100}
                style={{
                  borderRadius: 12,
                  fontSize: 16,
                  padding: '14px 16px',
                  border: fieldErrors.email ? '2px solid #dc3545' : '2px solid #e9ecef',
                  marginBottom: fieldErrors.email ? 8 : 18,
                  background: '#f8f9fa',
                  color: '#184e77',
                  boxShadow: '0 1px 4px rgba(30,96,145,0.04)'
                }}
              />
              {fieldErrors.email && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '12px',
                  marginBottom: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <i className="bi bi-exclamation-circle-fill"></i>
                  {fieldErrors.email}
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <Form.Label style={{ fontWeight: 600, color: '#184e77', fontSize: 15 }}>Region *</Form.Label>
              <Form.Control
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                maxLength={100}
                style={{
                  borderRadius: 12,
                  fontSize: 16,
                  padding: '14px 16px',
                  border: fieldErrors.region ? '2px solid #dc3545' : '2px solid #e9ecef',
                  marginBottom: fieldErrors.region ? 8 : 18,
                  background: '#f8f9fa',
                  color: '#184e77',
                  boxShadow: '0 1px 4px rgba(30,96,145,0.04)'
                }}
              />
              {fieldErrors.region && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '12px',
                  marginBottom: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <i className="bi bi-exclamation-circle-fill"></i>
                  {fieldErrors.region}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }} className="form-row">
            <div style={{ flex: 1, minWidth: 220 }}>
              <Form.Label style={{ fontWeight: 600, color: '#184e77', fontSize: 15 }}>Registration Date *</Form.Label>
              <Form.Control
                type="date"
                name="registrationDate"
                value={formData.registrationDate}
                onChange={handleChange}
                required
                min="1900-01-01"
                max={today}
                onKeyDown={e => { e.preventDefault(); }}
                onPaste={e => { e.preventDefault(); }}
                onInput={e => { e.preventDefault(); }}
                onClick={e => {
                  const input = e.currentTarget as HTMLInputElement;
                  if (input.showPicker) input.showPicker();
                }}
                style={{
                  borderRadius: 12,
                  fontSize: 16,
                  padding: '14px 16px',
                  border: '2px solid #e9ecef',
                  marginBottom: 18,
                  background: '#f8f9fa',
                  color: '#184e77',
                  boxShadow: '0 1px 4px rgba(30,96,145,0.04)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none'
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{
          background: '#fff',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          border: 'none',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 16
        }} className="customer-form-footer">
          <Button 
            variant="secondary" 
            onClick={onCancel}
            style={{
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 15,
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #184e77 0%, #1e5a8a 100%)',
              color: 'white',
              border: 'none',
              boxShadow: '0 2px 8px rgba(24, 78, 119, 0.12)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #1e5a8a 0%, #184e77 100%)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #184e77 0%, #1e5a8a 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            style={{
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15,
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #184e77 0%, #1e5a8a 100%)',
              color: 'white',
              border: 'none',
              boxShadow: '0 2px 8px rgba(24, 78, 119, 0.12)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #1e5a8a 0%, #184e77 100%)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #184e77 0%, #1e5a8a 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? 'Saving...' : (customer ? 'Update' : 'Save')}
          </Button>
        </Modal.Footer>
      </Form>
      <style>{`
        .modern-customer-modal .modal-content {
          border-radius: 24px !important;
          box-shadow: 0 8px 40px 0 rgba(30,96,145,0.10) !important;
          border: none !important;
          background: transparent !important;
        }
      `}</style>
    </Modal>
  );
};

export default CustomerForm; 
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Table, Button, Form, Row, Col, Card, Spinner, Toast, ToastContainer, Dropdown, DropdownButton } from 'react-bootstrap';
import { Customer, CustomerFilter } from '../types';
import { apiService } from '../services/api';
import CustomerForm from './CustomerForm';
import { useAuth } from '../contexts/AuthContext';

interface CustomerListProps {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  onAddCustomer: () => void;
}

const filterOptions = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'region', label: 'Region' },
  { key: 'registrationDate', label: 'Registration Date' },
];

const CustomerList: React.FC<CustomerListProps> = ({ showForm, setShowForm, onAddCustomer }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState<'name' | 'email' | 'region' | 'registrationDate'>('name');
  const [isSearching, setIsSearching] = useState(false);
  const { isAdmin, user } = useAuth();
  
  // Add console.log for debugging
  console.log('Current user:', user);
  console.log('Is admin:', isAdmin());
  
  // Get today's date (YYYY-MM-DD format)
  const today = new Date().toISOString().split('T')[0];
  
  // Refs for debounce
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const setErrorWithToast = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setShowErrorToast(true);
    setTimeout(() => {
      setShowErrorToast(false);
      setError('');
    }, 5000);
  }, []);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getCustomers();
      setCustomers(data);
      setError('');
    } catch (err: any) {
      setErrorWithToast('Error loading customers');
    } finally {
      setLoading(false);
    }
  }, [setErrorWithToast]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Filter operation with debounce
  const debouncedFilter = useCallback((searchValue: string, field: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (!searchValue) {
        setIsSearching(false);
        loadCustomers();
        return;
      }
      
      const performFilter = async () => {
        try {
          setIsSearching(true);
          setLoading(true);
          const filter: any = {};
          filter[field] = searchValue;
          const data = await apiService.filterCustomers(filter);
          setCustomers(data);
          setError('');
        } catch (err: any) {
          setErrorWithToast('Error during filtering');
        } finally {
          setLoading(false);
        }
      };

      performFilter();
    }, 300); // 300ms debounce delay
  }, [loadCustomers, setErrorWithToast]);

  // Call debounced filter when search changes
  useEffect(() => {
    debouncedFilter(search, searchField);
  }, [search, searchField, debouncedFilter]);

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleEdit = (customer: Customer) => {
    if (!isAdmin()) {
      setErrorWithToast('You do not have permission to edit customers');
      return;
    }
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin()) {
      setErrorWithToast('You do not have permission to delete customers');
      return;
    }
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await apiService.deleteCustomer(id);
        setCustomers(customers.filter(c => c.id !== id));
      } catch (err: any) {
        setErrorWithToast('Error deleting customer');
      }
    }
  };

  const handleFormSubmit = async (customer: Omit<Customer, 'id'> | Customer) => {
    if (!isAdmin()) {
      setErrorWithToast('You do not have permission to create or update customers');
      return;
    }
    try {
      if ('id' in customer) {
        await apiService.updateCustomer(customer);
        setCustomers(customers.map(c => c.id === customer.id ? customer : c));
      } else {
        const newCustomer = await apiService.createCustomer(customer);
        setCustomers([...customers, newCustomer]);
      }
      setShowForm(false);
      setEditingCustomer(null);
    } catch (err: any) {
      setErrorWithToast('Error saving customer');
    }
  };

  return (
    <div style={{
      background: '#f8f9fa',
      minHeight: '100vh',
      paddingTop: '4px',
      paddingBottom: 0,
      position: 'relative'
    }}>
  

      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {/* Modern Search Card */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 24px 0 rgba(60,72,88,0.08)',
          border: '1px solid #ececec',
          marginBottom: '28px',
          transition: 'box-shadow 0.2s',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #184e77 0%, #1e5a8a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
                boxShadow: '0 4px 12px rgba(24, 78, 119, 0.3)'
              }}>
                <i className="bi bi-people-fill"></i>
              </div>
              <div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#184e77',
                  margin: '0 0 4px 0',
                  letterSpacing: '0.5px'
                }}>
                  Customer Management
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: '#6c757d',
                  margin: 0,
                  fontWeight: '400'
                }}>
                  Access and manage customer information.
                </p>
              </div>
            </div>
            
            {isAdmin() && (
              <button
                onClick={onAddCustomer}
                style={{
                  background: 'linear-gradient(135deg, #184e77 0%, #1e5a8a 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(24, 78, 119, 0.2)',
                  minWidth: 'fit-content'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(24, 78, 119, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 78, 119, 0.2)';
                }}
              >
                <i className="bi bi-person-plus-fill sidebar-icon" style={{ color: 'white' }}></i>
                Add Customer
              </button>
            )}
          </div>

          {/* Search Controls */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            {searchField === 'registrationDate' ? (
              <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                <i className="bi bi-calendar3-fill sidebar-icon" style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c757d',
                  fontSize: '16px',
                  zIndex: 1
                }}></i>
                <Form.Control
                  ref={searchInputRef}
                  type="date"
                  placeholder="Select date"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  max={today}
                  onKeyDown={e => { e.preventDefault(); }}
                  onPaste={e => { e.preventDefault(); }}
                  onInput={e => { e.preventDefault(); }}
                  onClick={e => {
                    const input = e.currentTarget as HTMLInputElement;
                    if (input.showPicker) input.showPicker();
                  }}
                  style={{ 
                    padding: '14px 16px 14px 48px',
                    fontSize: '16px',
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    background: '#fff',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4facfe';
                    e.target.style.boxShadow = '0 0 0 3px rgba(79, 172, 254, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  }}
                />
              </div>
            ) : (
              <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                <i className="bi bi-search sidebar-icon" style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c757d',
                  fontSize: '16px',
                  zIndex: 1
                }}></i>
                <Form.Control
                  ref={searchInputRef}
                  type="text"
                  placeholder={`Search by ${filterOptions.find(opt => opt.key === searchField)?.label?.toLowerCase()}`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ 
                    padding: '14px 16px 14px 48px',
                    fontSize: '16px',
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    background: '#fff',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4facfe';
                    e.target.style.boxShadow = '0 0 0 3px rgba(79, 172, 254, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  }}
                />
              </div>
            )}
            
            <DropdownButton
              id="dropdown-filter-field"
              title={filterOptions.find(opt => opt.key === searchField)?.label}
              variant="outline-secondary"
              style={{
                height: '48px',
                background: 'linear-gradient(135deg, #184e77 0%, #1e5a8a 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                boxShadow: '0 4px 12px rgba(24, 78, 119, 0.2)',
                transition: 'all 0.2s ease'
              }}
              menuVariant="dark"
            >
              {filterOptions.map(opt => (
                <Dropdown.Item
                  key={opt.key}
                  active={searchField === opt.key}
                  onClick={() => {
                    setSearchField(opt.key as any);
                    setSearch(''); // Reset filter text
                  }}
                  style={{ 
                    background: searchField === opt.key ? '#1e6091' : '#184e77', 
                    color: 'white', 
                    fontWeight: '500',
                    padding: '12px 20px'
                  }}
                >
                  {opt.label}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
        </div>

        {/* Modern Table Card */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '10px',
          boxShadow: '0 4px 24px 0 rgba(60,72,88,0.08)',
          border: '1px solid #ececec',
          overflow: 'hidden',
        }}>
          <div style={{
            maxHeight: '600px',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {loading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                backdropFilter: 'blur(4px)'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid rgba(24, 78, 119, 0.1)',
                    borderTop: '3px solid #184e77',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span style={{ color: '#184e77', fontWeight: '500' }}>Loading customers...</span>
                </div>
              </div>
            )}
            
            <Table style={{ margin: 0, border: 'none' }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  color: '#495057',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1
                }}>
                  <th style={{
                    padding: '20px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    border: 'none',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2
                  }}>ID</th>
                  <th style={{
                    padding: '20px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    border: 'none',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2
                  }}>First Name</th>
                  <th style={{
                    padding: '20px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    border: 'none',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2
                  }}>Last Name</th>
                  <th style={{
                    padding: '20px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    border: 'none',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2
                  }}>Email</th>
                  <th style={{
                    padding: '20px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    border: 'none',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2
                  }}>Region</th>
                  <th style={{
                    padding: '20px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    border: 'none',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2
                  }}>Registration Date</th>
                  <th style={{
                    padding: '20px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    border: 'none',
                    textAlign: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={customer.id} style={{
                    background: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                    transition: 'all 0.2s ease',
                    borderBottom: '1px solid #e9ecef'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e3f2fd';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  >
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#184e77',
                      border: 'none'
                    }}>#{customer.id}</td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#495057',
                      border: 'none',
                      fontWeight: '500'
                    }}>{customer.firstName}</td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#495057',
                      border: 'none',
                      fontWeight: '500'
                    }}>{customer.lastName}</td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#495057',
                      border: 'none'
                    }}>
                      <span style={{
                        color: '#184e77',
                        textDecoration: 'none'
                      }}>{customer.email}</span>
                    </td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#495057',
                      border: 'none'
                    }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                        color: '#1565c0',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}>
                        {customer.region}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px',
                      fontSize: '14px',
                      color: '#6c757d',
                      border: 'none'
                    }}>
                      <i className="bi bi-calendar3" style={{ marginRight: '8px', color: '#184e77', fontSize: '18px', verticalAlign: 'middle' }}></i>
                      {new Date(customer.registrationDate).toLocaleDateString('en-US')}
                    </td>
                    <td style={{
                      padding: '16px',
                      border: 'none',
                      textAlign: 'center'
                    }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleEdit(customer)}
                            style={{
                              background: 'linear-gradient(135deg, #184e77 0%, #1e5a8a 100%)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              color: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              minWidth: '36px',
                              minHeight: '36px',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 78, 119, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                            title="Edit"
                          >
                            <i className="bi bi-pencil-square" style={{ 
                              color: 'white', 
                              fontSize: '16px',
                              display: 'block',
                              lineHeight: '1'
                            }}></i>
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            style={{
                              background: 'linear-gradient(135deg, #184e77 0%, #1e5a8a 100%)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              color: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              minWidth: '36px',
                              minHeight: '36px',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 78, 119, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                            title="Delete"
                          >
                            <i className="bi bi-trash" style={{ 
                              color: 'white', 
                              fontSize: '16px',
                              display: 'block',
                              lineHeight: '1'
                            }}></i>
                          </button>
                        </div>
                      </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            {customers.length === 0 && !loading && (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: '#6c757d',
                background: '#f8f9fa'
              }}>
                {isSearching ? (
                  <>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '28px',
                      color: '#6c757d'
                    }}>
                      <i className="bi bi-search sidebar-icon"></i>
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#184e77', fontSize: '18px' }}>No Results Found</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>Try changing your search criteria</p>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '28px',
                      color: '#6c757d'
                    }}>
                      <i className="bi bi-people-fill sidebar-icon"></i>
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#184e77', fontSize: '18px' }}>No Customers Yet</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>Start by adding your first customer</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && isAdmin() && (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {/* Error Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showErrorToast} 
          onClose={() => setShowErrorToast(false)}
          delay={5000}
          autohide
          bg="danger"
        >
          <Toast.Header closeButton>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {error}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .dropdown-menu {
          z-index: 2000 !important;
        }
        .dropdown-toggle,
        .dropdown-toggle:focus,
        .dropdown-toggle:active {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default CustomerList; 
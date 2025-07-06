import React, { useState } from 'react';
import CustomerList from './CustomerList';
import '../App.css';
import Overview from './Overview';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'overview'>('customers');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const { isAdmin, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Get user initials for avatar
  const getUserInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 280,
        background: 'linear-gradient(180deg, #184e77 0%, #1e5a8a 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        boxShadow: '2px 0 12px rgba(0,0,0,0.1)',
        position: 'relative',
      }}>
        {/* Top User Section */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)',
        }}>
          {/* Logout Button */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-start', 
            marginBottom: '16px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              <i className="bi bi-box-arrow-right sidebar-icon" style={{ fontSize: '14px' }}></i>
              Logout
            </button>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* User Avatar */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#6c757d',
              boxShadow: '0 4px 12px rgba(233, 236, 239, 0.3)',
            }}>
              <i className="bi bi-person-fill sidebar-icon"></i>
            </div>
            <div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '2px',
                maxWidth: '165px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
              title={user?.username || 'User'}
              >
                {user?.username || 'User'}
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#f8f9fa',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {user?.role || 'User'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div style={{ flex: 1, padding: '24px 0' }}>
          <nav>
            <div
              onClick={() => setActiveTab('customers')}
              className="sidebar-nav-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 24px',
                background: activeTab === 'customers' ? 'rgba(255,255,255,0.15)' : 'none',
                borderLeft: activeTab === 'customers' ? '4px solid #f8f9fa' : '4px solid transparent',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '16px',
                marginBottom: '4px',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'customers') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'customers') {
                  e.currentTarget.style.background = 'none';
                }
              }}
            >
              <span style={{ 
                marginRight: '16px', 
                fontSize: '18px',
                color: activeTab === 'customers' ? '#adb5bd' : 'rgba(255,255,255,0.8)'
              }}>
                <i className={`bi bi-people-fill ${activeTab === 'customers' ? 'active-tab-icon' : 'sidebar-icon'}`} />
              </span>
              Customers
            </div>
            <div
              onClick={() => setActiveTab('overview')}
              className="sidebar-nav-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 24px',
                background: activeTab === 'overview' ? 'rgba(255,255,255,0.15)' : 'none',
                borderLeft: activeTab === 'overview' ? '4px solid #adb5bd' : '4px solid transparent',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '16px',
                marginBottom: '4px',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'overview') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'overview') {
                  e.currentTarget.style.background = 'none';
                }
              }}
            >
              <span style={{ 
                marginRight: '16px', 
                fontSize: '18px',
                color: activeTab === 'overview' ? '#adb5bd' : 'rgba(255,255,255,0.8)'
              }}>
                <i className={`bi bi-bar-chart-fill ${activeTab === 'overview' ? 'active-tab-icon' : 'sidebar-icon'}`} />
              </span>
              Overview
            </div>
          </nav>
        </div>

        {/* Bottom Info */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'center'
        }}>
          CRM System v1.0
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, background: '#f8f9fa', padding: '48px 40px' }}>
        {activeTab === 'customers' && (
          <div>
            <CustomerList 
              showForm={showCustomerForm} 
              setShowForm={setShowCustomerForm} 
              onAddCustomer={() => setShowCustomerForm(true)}
            />
          </div>
        )}
        {activeTab === 'overview' && (
          <Overview />
        )}
      </main>
    </div>
  );
};

export default Dashboard; 
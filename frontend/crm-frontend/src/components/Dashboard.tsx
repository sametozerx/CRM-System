import React, { useState } from 'react';
import CustomerList from './CustomerList';
import '../App.css';
import Overview from './Overview';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'overview'>('customers');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998,
            display: 'none'
          }}
        />
      )}

      {/* Mobile Header */}
      <div className="mobile-header" style={{
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'linear-gradient(180deg, #184e77 0%, #1e5a8a 100%)',
        color: 'white',
        zIndex: 999,
        padding: '0 16px',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'white',
            borderRadius: '8px',
            padding: '8px',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px'
          }}
        >
          <i className="bi bi-list"></i>
        </button>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>
          CRM System
        </div>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Sidebar */}
      <aside 
        className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
        style={{
          width: 280,
          background: 'linear-gradient(180deg, #184e77 0%, #1e5a8a 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          boxShadow: '2px 0 12px rgba(0,0,0,0.1)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 999,
          transition: 'transform 0.3s ease',
          height: '100vh',
          overflowY: 'auto'
        }}
      >
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
                fontSize: '11px',
                fontWeight: '500',
                color: 'rgba(255,255,255,0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                background: 'rgba(255,255,255,0.1)',
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'inline-block',
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
              onClick={() => {
                setActiveTab('customers');
                closeSidebar();
              }}
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
              onClick={() => {
                setActiveTab('overview');
                closeSidebar();
              }}
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
      <main className="main-content" style={{ 
        flex: 1, 
        background: '#f8f9fa', 
        padding: '48px 40px',
        marginLeft: '280px',
        transition: 'margin-left 0.3s ease'
      }}>
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
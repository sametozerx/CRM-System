import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{username?: string, password?: string}>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
        // Clear error message after 5 seconds
        setTimeout(() => setError(''), 5000);
      }
    } catch (err: any) {
      if (err.response?.data) {
        // Convert API error message to string
        const errorMessage = typeof err.response.data === 'string' 
          ? err.response.data 
          : err.response.data.title || err.response.data.message || 'Login failed';
        setError(errorMessage);
        setTimeout(() => setError(''), 5000);
      } else {
        setError('An error occurred during login');
        setTimeout(() => setError(''), 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #184e77 0%, #1e5a8a 50%,rgb(45, 88, 125) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }} className="login-container">
      <div style={{
        maxWidth: '420px',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }} className="login-wrapper">
        {/* Login Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }} className="login-card">
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '32px'
          }} className="login-header">
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
              color: '#6c757d',
              boxShadow: '0 4px 12px rgba(233, 236, 239, 0.3)'
            }} className="login-icon">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#184e77',
              margin: '0 0 8px 0',
              letterSpacing: '0.5px'
            }} className="login-title">
              Welcome Back
            </h1>
                         <p style={{
               fontSize: '16px',
               color: '#6c757d',
               margin: 0,
               fontWeight: '400'
             }} className="login-subtitle">
               Login to your CRM account
             </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
              border: '1px solid #f5c6cb',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <i className="bi bi-exclamation-triangle-fill" style={{ color: '#721c24', fontSize: '18px' }}></i>
              <span style={{ color: '#721c24', fontSize: '14px', fontWeight: '500' }}>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '8px',
                textAlign: 'left'
              }}>
                Username
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="bi bi-person-fill sidebar-icon" style={{
                  position: 'absolute',
                  left: '16px',
                  color: '#6c757d',
                  fontSize: '16px',
                  zIndex: 1
                }}></i>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUsername(value);
                    if (value.length > 32) {
                      setFieldErrors(prev => ({...prev, username: 'Username cannot exceed 32 characters'}));
                    } else {
                      setFieldErrors(prev => ({...prev, username: undefined}));
                    }
                  }}
                  required
                  maxLength={32}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: '#fff',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4facfe';
                    e.target.style.boxShadow = '0 0 0 3px rgba(79, 172, 254, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your username"
                />
                {fieldErrors.username && (
                  <div style={{
                    color: '#dc3545',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <i className="bi bi-exclamation-circle-fill"></i>
                    {fieldErrors.username}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '8px',
                textAlign: 'left'
              }}>
                Password
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="bi bi-lock-fill sidebar-icon" style={{
                  position: 'absolute',
                  left: '16px',
                  color: '#6c757d',
                  fontSize: '16px',
                  zIndex: 1
                }}></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);
                    if (value.length > 32) {
                      setFieldErrors(prev => ({...prev, password: 'Password cannot exceed 32 characters'}));
                    } else {
                      setFieldErrors(prev => ({...prev, password: undefined}));
                    }
                  }}
                  required
                  maxLength={32}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: '#fff',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4facfe';
                    e.target.style.boxShadow = '0 0 0 3px rgba(79, 172, 254, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your password"
                />
                {fieldErrors.password && (
                  <div style={{
                    color: '#dc3545',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <i className="bi bi-exclamation-circle-fill"></i>
                    {fieldErrors.password}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #184e77 0%, #1e5a8a 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(24, 78, 119, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Signing in...
                </>
                             ) : (
                 <>
                   <i className="bi bi-box-arrow-in-right sidebar-icon"></i>
                   Login
                 </>
               )}
            </button>
          </form>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #e9ecef'
          }}>
            <p style={{
              fontSize: '12px',
              color: '#6c757d',
              margin: 0
            }}>
              CRM System v1.0 • Secure Login
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login; 
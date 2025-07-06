import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Customer } from '../types';

const Overview: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await apiService.getCustomers();
        setCustomers(data);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Total customers
  const totalCustomers = customers.length;

  // Current date
  const now = new Date();

  // This year's registrations
  const thisYearRegistrations = customers.filter(c => {
    const regDate = new Date(c.registrationDate);
    return regDate.getFullYear() === now.getFullYear();
  }).length;

  // This month's registrations
  const thisMonthRegistrations = customers.filter(c => {
    const regDate = new Date(c.registrationDate);
    return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
  }).length;

  // This week's registrations (Monday to Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday is 1, Sunday is 0
    return new Date(d.setDate(diff));
  };
  
  const weekStart = getWeekStart(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const thisWeekRegistrations = customers.filter(c => {
    const regDate = new Date(c.registrationDate);
    return regDate >= weekStart && regDate <= weekEnd;
  }).length;

  // Region statistics (customer count per region)
  const regionCounts: { [region: string]: number } = {};
  customers.forEach(c => {
    regionCounts[c.region] = (regionCounts[c.region] || 0) + 1;
  });
  
  // Sort regions by count
  const sortedRegions = Object.entries(regionCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([region, count]) => ({ region, count }));

  const maxCount = Math.max(...Object.values(regionCounts), 1);
  
  // Calculate percentage distributions
  const calculatePercentage = (count: number) => {
    return ((count / totalCustomers) * 100).toFixed(1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="overview-container">
      {/* Top cards */}
      <div style={{ display: 'flex', gap: 24 }} className="stats-cards">
        {/* Total Customers */}
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: 32, minWidth: 180, flex: 1 }} className="stat-card">
          <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, color: '#184e77' }}>Total Customers</div>
          <div style={{ fontSize: 38, fontWeight: 700, color: '#184e77' }}>{totalCustomers}</div>
        </div>
        {/* This Year's Registrations */}
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: 32, minWidth: 180, flex: 1 }} className="stat-card">
          <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, color: '#184e77' }}>This Year's Registrations</div>
          <div style={{ fontSize: 38, fontWeight: 700, color: '#184e77' }}>{thisYearRegistrations}</div>
        </div>
        {/* This Month's Registrations */}
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: 32, minWidth: 180, flex: 1 }} className="stat-card">
          <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, color: '#184e77' }}>This Month's Registrations</div>
          <div style={{ fontSize: 38, fontWeight: 700, color: '#184e77' }}>{thisMonthRegistrations}</div>
        </div>
        {/* This Week's Registrations */}
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: 32, minWidth: 180, flex: 1 }} className="stat-card">
          <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, color: '#184e77' }}>This Week's Registrations</div>
          <div style={{ fontSize: 38, fontWeight: 700, color: '#184e77' }}>{thisWeekRegistrations}</div>
        </div>
      </div>

      {/* Regions Chart */}
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: 32 }} className="chart-container">
        <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 40, color: '#184e77', textAlign: 'center' }}>Customer Distribution by Region</div>
        {sortedRegions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                            <i className="bi bi-bar-chart-fill sidebar-icon" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }}></i>
            <p>No region data available yet</p>
          </div>
        ) : (
          <div style={{ position: 'relative', height: 260, paddingLeft: 20, paddingRight: 20, paddingTop: 40, marginBottom: 24 }} className="chart-area">
            {/* Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', zIndex: 2, position: 'relative' }}>
              {sortedRegions.map((item, index) => (
                <div key={index} style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: '100%'
                }}>
                  <div style={{
                    width: 40,
                    height: '100%',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: `${(item.count / maxCount) * 100}%`,
                      background: 'linear-gradient(180deg, #386D9A 0%, #184e77 100%)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.5s',
                      boxShadow: '0 2px 8px rgba(56,109,154,0.2)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: '100%',
                        transform: 'translate(-50%, -6px)',
                        background: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: 4,
                        padding: '4px 6px',
                        fontSize: 10,
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1px',
                        minWidth: '50px'
                      }}>
                        <span style={{
                          color: '#184e77',
                          fontSize: 11,
                          fontWeight: 600
                        }}>{calculatePercentage(item.count)}%</span>
                        <span style={{
                          color: '#888',
                          fontSize: 9
                        }}>{item.count}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    marginTop: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#184e77',
                    textAlign: 'center',
                    minHeight: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>{item.region}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Chart description */}
        <div style={{ 
          marginTop: 24, 
          padding: '20px 24px', 
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
          borderRadius: 12,
          fontSize: 14,
          color: '#495057',
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ 
            fontWeight: 600, 
            marginBottom: 12, 
            color: '#184e77',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className="bi bi-info-circle-fill" style={{ fontSize: '16px' }}></i>
            Chart Summary
          </div>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px',
            lineHeight: '1.5'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '6px 0'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#184e77'
              }}></div>
              <span>Total <strong>{totalCustomers}</strong> customers distributed across <strong>{sortedRegions.length}</strong> different regions</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '6px 0'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#184e77'
              }}></div>
              <span>Most customers: <strong style={{ color: '#184e77' }}>{sortedRegions[0]?.region}</strong> (<strong>{sortedRegions[0]?.count}</strong> customers)</span>
            </div>
            {sortedRegions.length > 1 && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '6px 0'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#184e77'
                }}></div>
                <span>Least customers: <strong style={{ color: '#184e77' }}>{sortedRegions[sortedRegions.length - 1]?.region}</strong> (<strong>{sortedRegions[sortedRegions.length - 1]?.count}</strong> customers)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 
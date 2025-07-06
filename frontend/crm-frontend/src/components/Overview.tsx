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
  const yTicks = [maxCount, Math.ceil(maxCount * 0.75), Math.ceil(maxCount * 0.5), Math.ceil(maxCount * 0.25), 0];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top cards */}
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Total Customers */}
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: 32, minWidth: 180, flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 12 }}>Total Customers</div>
          <div style={{ fontSize: 38, fontWeight: 700 }}>{totalCustomers}</div>
        </div>
        {/* This Year's Registrations */}
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: 32, minWidth: 180, flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 12 }}>This Year's Registrations</div>
          <div style={{ fontSize: 38, fontWeight: 700 }}>{thisYearRegistrations}</div>
        </div>
        {/* This Month's Registrations */}
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: 32, minWidth: 180, flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 12 }}>This Month's Registrations</div>
          <div style={{ fontSize: 38, fontWeight: 700 }}>{thisMonthRegistrations}</div>
        </div>
        {/* This Week's Registrations */}
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: 32, minWidth: 180, flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 12 }}>This Week's Registrations</div>
          <div style={{ fontSize: 38, fontWeight: 700 }}>{thisWeekRegistrations}</div>
        </div>
      </div>

      {/* Regions Chart */}
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: 32 }}>
        <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 24, color: '#184e77', textAlign: 'center' }}>Customer Distribution by Region</div>
        {sortedRegions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                            <i className="bi bi-bar-chart-fill sidebar-icon" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }}></i>
            <p>No region data available yet</p>
          </div>
        ) : (
          <div style={{ position: 'relative', height: 260, paddingLeft: 60, paddingRight: 20, marginBottom: 24 }}>
            {/* Y-axis and grid lines */}
            {yTicks.slice().reverse().map((value, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: `${(i / (yTicks.length - 1)) * 100}%`,
                height: 1,
                background: i === 0 ? '#e0e0e0' : '#f0f0f0',
                zIndex: 1
              }}>
                <span style={{
                  position: 'absolute',
                  left: -50,
                  top: -10,
                  fontSize: 12,
                  color: '#666',
                  fontWeight: 500,
                  width: 40,
                  textAlign: 'right',
                  zIndex: 2
                }}>{value}</span>
              </div>
            ))}
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
                    height: `${(item.count / maxCount) * 100}%`,
                    background: 'linear-gradient(180deg, #386D9A 0%, #184e77 100%)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.5s',
                    boxShadow: '0 2px 8px rgba(56,109,154,0.2)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      top: -24,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#184e77',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 1px 4px rgba(30,96,145,0.08)'
                    }}>{item.count}</span>
                  </div>
                  <div style={{
                    marginTop: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#184e77',
                    textAlign: 'center'
                  }}>{item.region}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Chart description */}
        <div style={{ 
          marginTop: 16, 
          padding: '16px 20px', 
          background: '#f8f9fa', 
          borderRadius: 8,
          fontSize: 14,
          color: '#666'
        }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Chart Description:</div>
          <div>• Total {totalCustomers} customers distributed across {sortedRegions.length} different regions</div>
          <div>• Most customers: <strong>{sortedRegions[0]?.region}</strong> ({sortedRegions[0]?.count} customers)</div>
          {sortedRegions.length > 1 && (
            <div>• Least customers: <strong>{sortedRegions[sortedRegions.length - 1]?.region}</strong> ({sortedRegions[sortedRegions.length - 1]?.count} customers)</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview; 
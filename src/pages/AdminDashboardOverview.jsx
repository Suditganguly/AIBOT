import React from 'react';

const AdminDashboardOverview = ({ summaryCards, analytics, recentActivity }) => (
  <div style={{ width: '100%', maxWidth: 1100 }}>
    <h2 className="text-2xl font-bold text-primary mb-6">Overview</h2>
    <div
      className="overview-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '32px',
        marginBottom: '36px',
        width: '100%',
        justifyItems: 'center',
        alignItems: 'stretch',
      }}
    >
      {summaryCards.map((card, idx) => (
        <div
          key={idx}
          className="card card-stat animate-slideInUp"
          style={{
            animationDelay: `${0.1 * idx}s`,
            minWidth: 0,
            width: '100%',
            maxWidth: '240px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="stat-value">{card.value}</div>
          <div className="stat-label">{card.label}</div>
        </div>
      ))}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: 32 }}>
      <div className="card card-accent animate-slideInUp" style={{animationDelay: '0.5s', width: '100%'}}>
        <div className="card-header">
          <h3 className="card-title">Recent Activity</h3>
        </div>
        <ul className="list">
          {recentActivity && recentActivity.map((activity, idx) => (
            <li key={idx} className="list-item">{activity}</li>
          ))}
        </ul>
      </div>
      <div className="card animate-slideInUp" style={{animationDelay: '0.6s', width: '100%'}}>
        <div className="card-header">
          <h3 className="card-title">System Health</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Server Status</span>
            <span className="badge badge-success">{analytics?.systemHealth?.serverStatus || 'Online'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>API Response</span>
            <span className="badge badge-primary">{analytics?.systemHealth?.apiResponse || '120ms'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Database</span>
            <span className="badge badge-success">{analytics?.systemHealth?.database || 'Connected'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Storage Used</span>
            <span className="badge badge-warning">{analytics?.systemHealth?.storageUsed || '68%'}</span>
          </div>
        </div>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
      <div className="card animate-slideInUp" style={{animationDelay: '0.7s', width: '100%'}}>
        <div className="card-header">
          <h3 className="card-title">Active Users</h3>
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#2563eb', marginBottom: 8 }}>
          {analytics?.activeUsers || 0}
        </div>
        <div style={{ color: '#4b5563', fontSize: 16 }}>Users active in the last 24 hours</div>
      </div>
      <div className="card animate-slideInUp" style={{animationDelay: '0.8s', width: '100%'}}>
        <div className="card-header">
          <h3 className="card-title">User Growth</h3>
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#10b981', marginBottom: 8 }}>
          +{analytics?.userGrowthRate || 0}%
        </div>
        <div style={{ color: '#4b5563', fontSize: 16 }}>Growth in the last 30 days</div>
      </div>
    </div>
  </div>
);

export default AdminDashboardOverview;

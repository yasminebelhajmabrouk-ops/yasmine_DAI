import React from 'react';
import './Dashboard.css';

const StatCard = ({ title, value, unit, trend, trendValue, icon, color }) => {
  return (
    <div className={`stat-card glass-card animate-fade-in-up`}>
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <span className={`stat-icon ${color}`}>{icon}</span>
      </div>
      <div className="stat-body">
        <span className="stat-value">{value}</span>
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
      {trend && (
        <div className="stat-footer">
          <span className={`stat-trend ${trend}`}>{trend === 'up' ? '↗' : '↘'} {trendValue}</span>
          <span className="stat-period">vs dernier mois</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;

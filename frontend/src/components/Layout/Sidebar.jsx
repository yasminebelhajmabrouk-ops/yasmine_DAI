import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { path: '/', label: 'Tableau de Bord', icon: '📊' },
    { path: '/preop', label: 'Pré-opératoire', icon: '📋' },
    { path: '/cases', label: 'Dossiers', icon: '📁' },
    { path: '/patients', label: 'Patients', icon: '👥' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">DAI</div>
        <span className="brand-name">DAI</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.username ? user.username[0].toUpperCase() : 'M'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username || 'Médecin'}</span>
            <span className="user-role">Anesthésiste</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

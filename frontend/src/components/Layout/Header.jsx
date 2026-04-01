import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = ({ title }) => {
  const { logout, user } = useAuth();

  return (
    <header className="header animate-fade-in">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        <div className="header-actions">
          <button className="btn btn-primary btn-sm">
            <span>+</span> Nouveau Cas
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

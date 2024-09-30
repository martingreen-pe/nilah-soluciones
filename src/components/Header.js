import React, { useState } from 'react';
import './Header.css';

function Header({ onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header__content">
        <h1 className="header__title">Mi Software</h1>
        <button className="menu-button" onClick={toggleMenu} aria-label="Abrir menú">
          <span className={`menu-icon ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`menu-icon ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`menu-icon ${isMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>
      
      <nav className={`menu ${isMenuOpen ? 'menu--open' : ''}`}>
        <ul className="menu__list">
          <li className="menu__item"><a href="#funcionalidad1">Funcionalidad 1</a></li>
          <li className="menu__item"><a href="#funcionalidad2">Funcionalidad 2</a></li>
          <li className="menu__item"><a href="#funcionalidad3">Funcionalidad 3</a></li>
        </ul>
        <button className="logout-button" onClick={onLogout}>Cerrar Sesión</button>
      </nav>
    </header>
  );
}

export default Header;

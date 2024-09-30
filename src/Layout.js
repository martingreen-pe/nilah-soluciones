// src/components/Layout.js
import React from 'react';
import './index.css'; // Importar estilos globales
import Header from './components/Header';

function Layout({ children, onLogout }) {
  return (
    <div className="container">
      <Header onLogout={onLogout} />
      <main>{children}</main>
      <footer>
        <p>© 2024 Todos los derechos reservados</p>
      </footer>
    </div>
  );
}

export default Layout;
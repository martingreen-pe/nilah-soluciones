import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Formulario from './components/Formulario';
import ListaCitas from './components/ListaCitas';
import Buscador from './components/Buscador';
import { getCitas, createCita, deleteCita } from './services/citasService';
import Login from './components/Login';
import './App.css';

function App() {
  const [citas, setCitas] = useState([]);
  const [citasFiltradas, setCitasFiltradas] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [mostrarBuscador, setMostrarBuscador] = useState(false); // Estado para mostrar/ocultar buscador

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // Obtener citas y asignarlas al estado
  useEffect(() => {
    if (isAuthenticated) {  // Solo obtener las citas si el usuario está autenticado
      const fetchCitas = async () => {
        try {
          const citasData = await getCitas();
          setCitas(citasData.results || []);  // Asignamos las citas al estado original
          setCitasFiltradas(citasData.results || []);  // Asignamos también a las citas filtradas
        } catch (error) {
          console.error('Error al obtener citas:', error);
        }
      };
      fetchCitas();  // Llamamos la función al montar el componente
    }
  }, [isAuthenticated]);

  // Función para agregar una nueva cita
  const handleCitaCreada = async (nuevaCita) => {
    const citaCreada = await createCita(nuevaCita);
    const nuevasCitas = [...citas, citaCreada];
    setCitas(nuevasCitas);
    setCitasFiltradas(nuevasCitas);  // Actualizamos tanto citas como citas filtradas
  };

  // Función para eliminar una cita
  const handleDeleteCita = async (id) => {
    await deleteCita(id);
    const nuevasCitas = citas.filter(cita => cita.id !== id);
    setCitas(nuevasCitas);
    setCitasFiltradas(nuevasCitas);  // Actualizamos tanto citas como citas filtradas
  };

  // Función para filtrar las citas
  const handleFiltrarCitas = (citasFiltradas) => {
    setCitasFiltradas(citasFiltradas);  // Actualizamos el estado con las citas filtradas
  };

  // Función que se ejecuta cuando el login es exitoso
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);  // El usuario está autenticado
  };

  // Si el usuario no está autenticado, mostramos el login
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Layout onLogout={handleLogout}>
      <div className="app">
        <h1 className="app__title">Gestión de Citas</h1>
        <Formulario onCitaCreada={handleCitaCreada} />

        {/* Botón para mostrar/ocultar el Buscador */}
        <div className="buscador-toggle">
          <button 
            className="toggle-button" 
            onClick={() => setMostrarBuscador(!mostrarBuscador)}
          >
            {mostrarBuscador ? 'Ocultar Buscador' : 'Mostrar Buscador'}
          </button>
        </div>

        {/* Mostrar el componente Buscador si el estado es verdadero */}
        {mostrarBuscador && (
          <Buscador citas={citas} onFiltrar={handleFiltrarCitas} />
        )}

        <ListaCitas citas={citasFiltradas} onDeleteCita={handleDeleteCita} />
      </div>
    </Layout>
  );
}

export default App;

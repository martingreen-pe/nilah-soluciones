import React, { useState, useEffect } from 'react';
import './Buscador.css';

function Buscador({ citas, onFiltrar }) {
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroServicio, setFiltroServicio] = useState('');
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);

  useEffect(() => {
    const servicios = [...new Set(citas.map(cita => cita.field_2717668))];
    setServiciosDisponibles(servicios);
  }, [citas]);

  const manejarFiltro = () => {
    const citasFiltradas = citas.filter(cita => {
      const coincideFecha = filtroFecha === '' || cita.field_2717666 === filtroFecha;
      const coincideNombre = filtroNombre === '' || cita.field_2717667.toLowerCase().includes(filtroNombre.toLowerCase());
      const coincideServicio = filtroServicio === '' || cita.field_2717668.toLowerCase().includes(filtroServicio.toLowerCase());
      return coincideFecha && coincideNombre && coincideServicio;
    });
    onFiltrar(citasFiltradas); 
  };

  return (
    <div className="buscador">
      <h3 className="buscador__titulo">Buscar Citas</h3>
      
      <div className="buscador__campo">
        <label className="buscador__label">Filtrar por Fecha:</label>
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
          className="buscador__input"
        />
      </div>
      
      <div className="buscador__campo">
        <label className="buscador__label">Filtrar por Nombre del Cliente:</label>
        <input
          type="text"
          placeholder="Escribe el nombre del cliente"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="buscador__input"
        />
      </div>
      
      <div className="buscador__campo">
        <label className="buscador__label">Filtrar por Servicio:</label>
        <input
          type="text"
          placeholder="Escribe el nombre del servicio"
          list="servicios-list"
          value={filtroServicio}
          onChange={(e) => setFiltroServicio(e.target.value)}
          className="buscador__input"
        />
        <datalist id="servicios-list">
          {serviciosDisponibles.map(servicio => (
            <option key={servicio} value={servicio} />
          ))}
        </datalist>
      </div>
      
      <button className="buscador__boton" onClick={manejarFiltro}>Buscar</button>
    </div>
  );
}

export default Buscador;

import React, { useState, useEffect } from 'react';
import './ListaCitas.css'; // Importar el CSS

function ListaCitas({ citas, onDeleteCita }) {
  const [paginaActual, setPaginaActual] = useState(1); // Estado para la página actual
  const citasPorPagina = 3; // Número de citas por página
  const [citasOrdenadas, setCitasOrdenadas] = useState([]);

  // Ordenar citas por fecha antes de renderizarlas
  useEffect(() => {
    const citasOrdenadasPorFecha = [...citas].sort((a, b) => new Date(a.field_2717666) - new Date(b.field_2717666));
    setCitasOrdenadas(citasOrdenadasPorFecha);
  }, [citas]);

  // Calcular el índice de las citas que se van a mostrar
  const indiceUltimaCita = paginaActual * citasPorPagina;
  const indicePrimeraCita = indiceUltimaCita - citasPorPagina;
  const citasActuales = citasOrdenadas.slice(indicePrimeraCita, indiceUltimaCita); // Citas en la página actual

  // Cambiar página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const totalPaginas = Math.ceil(citas.length / citasPorPagina);
  const paginas = []; // Array para los números de páginas

  // Limitar el número de botones de paginación a 5
  const maxPaginasMostrar = 5;
  const inicioPagina = Math.max(1, paginaActual - Math.floor(maxPaginasMostrar / 2));
  const finPagina = Math.min(totalPaginas, inicioPagina + maxPaginasMostrar - 1);

  for (let i = inicioPagina; i <= finPagina; i++) {
    paginas.push(i);
  }

  if (!citas || citas.length === 0) {
    return <p className="citas-list__empty">No hay citas disponibles.</p>;
  }

  // Función para convertir fecha a formato dd-mm-yyyy y agregar el día de la semana y la hora
  const formatearFechaConHora = (fechaISO) => {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const fecha = new Date(fechaISO);
    const diaSemana = diasSemana[fecha.getUTCDay()];
    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Meses en JS empiezan en 0
    const anio = fecha.getUTCFullYear();
  
    // Obtener la hora y minutos
    const horas = String(fecha.getUTCHours()).padStart(2, '0');
    const minutos = String(fecha.getUTCMinutes()).padStart(2, '0');
    
    const fechaCompleta = `${dia}-${mes}-${anio}`;
    const hora = `${horas}:${minutos}`;
  
    return { diaSemana, fechaCompleta, hora };
  }

  return (
    <div className="citas-list">
      <h2>Lista de Citas</h2>
      <ul className="citas-list__items">
        {citasActuales.map((cita) => {
          const { diaSemana, fechaCompleta, hora } = formatearFechaConHora(cita.field_2717666);
          return (
            <li key={cita.id} className="citas-list__item">
              <div className="citas-list__info">
                {/* Día de la semana */}
                <button className="citas-list__day">{diaSemana}</button> <br />
  
                {/* Fecha completa */}
                <strong className="citas-list__date">Fecha: {fechaCompleta}</strong> <br />
  
                {/* Hora */}
                <strong className="citas-list__hour">Hora: {hora}</strong> <br />
  
                {/* Cliente */}
                <strong>Cliente:</strong> {cita.field_2717667 || 'No especificado'} <br />
  
                {/* Servicios Solicitados */}
                <strong>Servicios Solicitados:</strong> {cita.field_2717668 || 'No especificado'} <br />
  
                {/* Aviso del Retoque */}
                {cita.field_2717672 && (
                  <>
                    <strong>Aviso del Retoque:</strong> {cita.field_2717672} <br />
                  </>
                )}
  
                {/* Precio Final */}
                <div className="citas-list__prices">
                  <div className="info-box">
                    <strong>Precio Final:</strong> {cita.field_2717675 !== null ? cita.field_2717675 : 'No especificado'}
                  </div>
                </div>
              </div>
  
              {/* Botón de eliminar */}
              <button className="citas-list__button" onClick={() => onDeleteCita(cita.id)}>
                Eliminar Cita
              </button>
            </li>
          );
        })}
      </ul>
  
      {/* Paginación */}
      <div className="pagination">
        {inicioPagina > 1 && <span>...</span>}
        {paginas.map(numero => (
          <button
            key={numero}
            onClick={() => cambiarPagina(numero)}
            className={`pagination__button ${numero === paginaActual ? 'active' : ''}`}
          >
            {numero}
          </button>
        ))}
        {finPagina < totalPaginas && <span>...</span>}
      </div>
    </div>
  );
}

export default ListaCitas;

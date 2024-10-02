import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import { getClientes, createCita } from '../services/citasService';
import serviciosData from '../data/servicios.json'; 
import tecnicasPrecios from '../data/tecnicas_extensiones.json';
import './Formulario.css';

function Formulario({ onCitaCreada }) {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [clienteSugerencias, setClienteSugerencias] = useState([]);
  const [fechaHora, setFechaHora] = useState(''); 
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [precioPersonalizado, setPrecioPersonalizado] = useState(''); 
  const [tecnicaSeleccionada, setTecnicaSeleccionada] = useState('');
  const [precioTecnica, setPrecioTecnica] = useState(0);
  const [esNuevoCliente, setEsNuevoCliente] = useState(false);
  const [nombreCliente, setNombreCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // Obtener clientes desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesData = await getClientes();
        setClientes(clientesData.results || []);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    fetchData();
  }, []);

  // Recalcular el precio total cada vez que cambian los servicios, la técnica o el precio personalizado
  useEffect(() => {
    let totalBase = serviciosSeleccionados.reduce((acc, servicioNombre) => {
      const servicio = serviciosData.find(s => s['Nombre del servicio'] === servicioNombre);
      if (servicioNombre === 'Extensiones de Pestañas') {
        return acc;  // No incluir el precio base de extensiones de pestañas
      }
      return acc + (servicio ? servicio['Precio Base'] || 0 : 0);
    }, 0);

    // Añadir precio personalizado si "Uñas" está seleccionado
    if (serviciosSeleccionados.includes('Uñas')) {
      totalBase += parseFloat(precioPersonalizado) || 0;
    }

    // Añadir precio de técnica si "Extensiones de Pestañas" está seleccionado
    if (serviciosSeleccionados.includes('Extensiones de Pestañas') && precioTecnica) {
      totalBase += parseFloat(precioTecnica) || 0;
    }

    setPrecioTotal(totalBase);
  }, [serviciosSeleccionados, precioPersonalizado, precioTecnica]);


  // Manejar la selección del cliente existente o nuevo
  const obtenerSugerencias = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : clientes.filter(
          (cliente) =>
            cliente.field_2717667.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const manejarSugerenciaSeleccionada = (event, { suggestion }) => {
    setClienteSeleccionado(suggestion.field_2717667);
    setTelefonoCliente(suggestion.field_2738060); 
  };

  const manejarCambiosCliente = (event, { newValue }) => {
    setClienteSeleccionado(newValue);
  };

  // Manejar la selección múltiple de servicios
  const handleServicioChange = (e) => {
    const opcionesSeleccionadas = Array.from(e.target.selectedOptions, option => option.value);
    setServiciosSeleccionados(opcionesSeleccionadas);
  };

  // Manejar la selección de técnica de pestañas
  const handleTecnicaChange = (e) => {
    const tecnicaId = e.target.value;
    const tecnica = tecnicasPrecios.find(t => t.id === parseInt(tecnicaId));
    const nuevoPrecioTecnica = tecnica ? tecnica.Precio : 0;
    setTecnicaSeleccionada(tecnicaId);
    setPrecioTecnica(nuevoPrecioTecnica);
  };

  // Manejar el cambio en el precio personalizado
  const handlePrecioPersonalizadoChange = (e) => {
    setPrecioPersonalizado(e.target.value); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prevenir múltiples envíos
    if (isSubmitting) return;
    setIsSubmitting(true);  // Marcar como enviando
  
    // Validar que los datos obligatorios estén presentes antes de proceder
    if (!clienteSeleccionado && !esNuevoCliente) {
      alert('Por favor selecciona un cliente.');
      setIsSubmitting(false);
      return;
    }
  
    if (!nombreCliente && esNuevoCliente) {
      alert('Por favor ingresa el nombre del nuevo cliente.');
      setIsSubmitting(false);
      return;
    }
  
    if (!fechaHora) {
      alert('Por favor selecciona una fecha y hora.');
      setIsSubmitting(false);
      return;
    }
  
    if (!serviciosSeleccionados.length) {
      alert('Por favor selecciona al menos un servicio.');
      setIsSubmitting(false);
      return;
    }
  
    const nombreClienteFinal = esNuevoCliente ? nombreCliente : clienteSeleccionado;
    const telefonoClienteFinal = esNuevoCliente ? telefonoCliente : telefonoCliente;
  
    // Convertir los servicios seleccionados en un string separado por comas
    const serviciosSeleccionadosString = serviciosSeleccionados.join(', ');
  
    // Buscar el nombre de la técnica de pestañas seleccionada basado en el ID
    const tecnicaPestanasNombre = tecnicasPrecios.find(tecnica => tecnica.id === parseInt(tecnicaSeleccionada))?.Técnica || null;
  
    // Preparar el objeto de la nueva cita
    const nuevaCita = {
      fecha: fechaHora,
      cliente: nombreClienteFinal,
      telefono: telefonoClienteFinal, // Incluimos el teléfono del cliente
      servicios: serviciosSeleccionadosString,
      precioBase: serviciosSeleccionados.reduce((acc, servicioNombre) => {
        const servicio = serviciosData.find(s => s['Nombre del servicio'] === servicioNombre);
        if (servicioNombre !== 'Extensiones de Pestañas' && servicioNombre !== 'Uñas') {
          return acc + (servicio ? servicio['Precio Base'] || 0 : 0);
        }
        return acc;
      }, 0),
      precioPersonalizado: parseFloat(precioPersonalizado) || 0,
      precioTecnica: parseFloat(precioTecnica) || 0,
      tecnicaPestanas: tecnicaPestanasNombre,  // Enviar el nombre de la técnica en lugar del ID
      precioTotal: precioTotal
    };
  
    // Validar nuevamente antes de enviar
    if (!nuevaCita.cliente || !nuevaCita.fecha || !nuevaCita.servicios || nuevaCita.precioTotal <= 0) {
      alert('Faltan datos obligatorios para crear la cita. Verifica los campos.');
      setIsSubmitting(false);
      return;
    }
  
    console.log('Cita a crear:', nuevaCita);
  
    try {
      // Enviar la nueva cita a la API
      const citaCreada = await createCita(nuevaCita);
      if (citaCreada && citaCreada.id) {
        console.log('Cita creada exitosamente:', citaCreada);
        //onCitaCreada(citaCreada);  // Llamar a la función de callback con la cita creada
      } else {
        console.error('Error: La cita fue creada, pero no se obtuvo un ID.');
        alert('Hubo un error al crear la cita. Intenta nuevamente.');
      }
  
      // Limpiar el formulario después de la creación exitosa
      resetForm();
    } catch (error) {
      console.error('Error al crear la cita:', error.response?.data || error.message);
      alert('Hubo un error al crear la cita. Por favor, revisa los datos.');
    } finally {
      setIsSubmitting(false);  // Habilitar el botón para el siguiente envío
    }
  };
  
  // Función para limpiar el formulario después de una creación exitosa
  const resetForm = () => {
    setClienteSeleccionado('');
    setFechaHora('');
    setServiciosSeleccionados([]);
    setPrecioTotal(0);
    setPrecioPersonalizado('');
    setTecnicaSeleccionada('');
    setPrecioTecnica(0);
    setNombreCliente('');
    setTelefonoCliente(''); // Limpiar el teléfono del cliente
    setEsNuevoCliente(false);
  };
  

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Cliente:</label>
        {esNuevoCliente ? (
          <>
            <input
              type="text"
              className="form-input"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              placeholder="Ingresa el nombre del cliente"
              required
            />
            <input
              type="tel"
              className="form-input"
              value={telefonoCliente}
              onChange={(e) => setTelefonoCliente(e.target.value)}
              placeholder="Ingresa el teléfono del cliente"
              required
            />
          </>
        ) : (
          <Autosuggest
          suggestions={clienteSugerencias}
          onSuggestionsFetchRequested={({ value }) => setClienteSugerencias(obtenerSugerencias(value))}
          onSuggestionsClearRequested={() => setClienteSugerencias([])}
          getSuggestionValue={(sugerencia) => sugerencia.field_2717667}
          renderSuggestion={(sugerencia) => (
            <div className="suggestion-item">
              <span className="suggestion-name">{sugerencia.field_2717667}</span> - <span className="suggestion-phone">{sugerencia.field_2738060}</span>
            </div>
          )}
          inputProps={{
            placeholder: 'Busca un cliente',
            value: clienteSeleccionado,
            onChange: manejarCambiosCliente,
            className: 'autosuggest-input',  // Aplicamos la clase para los estilos
          }}
          onSuggestionSelected={manejarSugerenciaSeleccionada}
        />
        
        )}
        <button
          type="button"
          className="form-button-toggle"
          onClick={() => setEsNuevoCliente(!esNuevoCliente)}
        >
          {esNuevoCliente ? "Usar Cliente Existente" : "Agregar Nuevo Cliente"}
        </button>
      </div>

      <div className="form-group">
        <label className="form-label">Fecha y Hora de la Cita:</label>
        <input
          type="datetime-local"
          className="form-input"
          value={fechaHora}
          onChange={(e) => setFechaHora(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Servicios Solicitados:</label>
        <select
          multiple
          className="form-input"
          value={serviciosSeleccionados}
          onChange={handleServicioChange}
          required
        >
          {serviciosData.map((servicio) => (
            <option key={servicio.id} value={servicio["Nombre del servicio"]}>
              {servicio["Nombre del servicio"]} -{" "}
              {servicio["Precio Base"] ? `${servicio["Precio Base"]} soles` : "Precio no disponible"}
            </option>
          ))}
        </select>
      </div>

      {serviciosSeleccionados.includes("Uñas") && (
        <div className="form-group">
          <label className="form-label">Precio Personalizado (Uñas):</label>
          <input
            type="number"
            className="form-input"
            value={precioPersonalizado}
            onChange={handlePrecioPersonalizadoChange}
            placeholder="Ingresa el precio personalizado"
            min="0"
          />
        </div>
      )}

      {serviciosSeleccionados.includes("Extensiones de Pestañas") && (
        <div className="form-group">
          <label className="form-label">Técnica de Extensiones de Pestañas:</label>
          <select
            className="form-input"
            value={tecnicaSeleccionada}
            onChange={handleTecnicaChange}
            required
          >
            <option value="">Selecciona una técnica</option>
            {tecnicasPrecios.map((tecnica) => (
              <option key={tecnica.id} value={tecnica.id}>
                {tecnica.Técnica} - {tecnica.Precio} soles
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <strong className="form-total">Precio Total: {precioTotal} soles</strong>
      </div>

      <button type="submit" className="form-button-submit">
        Crear Cita
      </button>
    </form>
  );
}


export default Formulario;

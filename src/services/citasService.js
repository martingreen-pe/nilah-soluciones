import axios from 'axios';

const API_URL = 'https://api.baserow.io/api/database/rows/table/';
const API_TOKEN = '8FFbA6hV84faBnyiZ8j9ErO3UneUiTEm'; // Reemplaza con tu token de Baserow

// Función para obtener las citas (de otra tabla, por ejemplo, la de citas pasadas si es necesario)
export const getCitas = async () => {
  try {
    const response = await axios.get(`${API_URL}362575/`, {
      headers: {
        Authorization: `Token ${API_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener citas:', error);
    throw error;
  }
};

// Función para crear una nueva cita
export const createCita = async (nuevaCita) => {
  try {
    console.log('Datos enviados a la API:', nuevaCita);  // Verificar datos enviados

    const data = {
      "field_2717666": nuevaCita.fecha,  // Fecha de la cita
      "field_2717667": nuevaCita.cliente,  // Nombre del cliente
      "field_2717668": nuevaCita.servicios,  // Servicios seleccionados
      "field_2717670": nuevaCita.tecnicaPestanas !== null ? nuevaCita.tecnicaPestanas : "",  // Técnica de pestañas como string
      "field_2717674": nuevaCita.precioTecnica !== null ? nuevaCita.precioTecnica : 0,  // Precio de la técnica
      "field_2717671": nuevaCita.precioPersonalizado !== null ? nuevaCita.precioPersonalizado : 0,  // Precio personalizado
      "field_2717673": nuevaCita.precioBase,  // Precio base
      "field_2717675": nuevaCita.precioTotal  // Precio total
    };

    // Verificar datos antes de enviar
    console.log('Datos preparados para la API:', data);

    // Enviar los datos a la API
    const response = await axios({
      method: 'POST',
      url: `${API_URL}362575/`,  // URL de la tabla de citas
      headers: {
        Authorization: `Token ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: data
    });

    console.log('Respuesta de la API:', response.data);  // Verificar respuesta de la API
    return response.data;  // Devolver la respuesta
  } catch (error) {
    console.error('Error al crear cita:', error.response ? error.response.data : error.message);
    throw error;  // Lanzar el error
  }
};


  
  

// Función para eliminar una cita
export const deleteCita = async (id) => {
  try {
    await axios.delete(`${API_URL}362575/${id}/`, {
      headers: {
        Authorization: `Token ${API_TOKEN}`
      }
    });
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    throw error;
  }
};

// Función para obtener clientes
export const getClientes = async () => {
  try {
    const response = await axios.get(`${API_URL}361392/`, {
      headers: {
        Authorization: `Token ${API_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
};

// Función para obtener servicios
export const getServicios = async () => {
  try {
    const response = await axios.get(`${API_URL}361394/`, {
      headers: {
        Authorization: `Token ${API_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    throw error;
  }
};

// Función para obtener técnicas de pestañas
export const getTecnicas = async () => {
  try {
    const response = await axios.get(`${API_URL}361418/`, {
      headers: {
        Authorization: `Token ${API_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener técnicas de pestañas:', error);
    throw error;
  }
};

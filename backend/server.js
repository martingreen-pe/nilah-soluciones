const express = require('express');
const cors = require('cors');  
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000;

// Habilitar CORS para todas las rutas
app.use(cors());

// Middleware para permitir el manejo de JSON
app.use(express.json());

// Ruta para crear una cita (POST)
app.post('/citas', async (req, res) => {
  const { fecha, cliente, servicio, tecnica, precioBase, precioPersonalizado, precioPestanas, precioFinal } = req.body;

  // Validación para evitar enviar datos vacíos a Baserow
  if (!cliente || !fecha || !servicio || precioFinal === null || precioFinal === undefined) {
    return res.status(400).json({ message: 'Datos incompletos: Cliente, fecha, servicio y precio final son obligatorios.' });
  }

  try {
    const response = await axios.post('https://api.baserow.io/api/database/rows/table/361392/', {
      fecha,
      cliente,
      servicio,
      tecnica,
      precioBase,
      precioPersonalizado,
      precioPestanas,
      precioFinal
    }, {
      headers: {
        Authorization: `Token 8FFbA6hV84faBnyiZ8j9ErO3UneUiTEm`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ message: 'Cita creada exitosamente', data: response.data });
  } catch (error) {
    console.error('Error al crear la cita:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error al crear la cita', error: error.message });
  }
});

// Ruta para obtener todas las citas (GET)
app.get('/citas', async (req, res) => {
  try {
    const response = await axios.get('https://api.baserow.io/api/database/rows/table/361392/', {
      headers: {
        Authorization: `Token 8FFbA6hV84faBnyiZ8j9ErO3UneUiTEm`
      }
    });
    res.json({ data: response.data });
  } catch (error) {
    console.error('Error al obtener citas:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error al obtener citas', error: error.message });
  }
});

// Ruta para actualizar una cita (PUT)
app.put('/citas/:id', async (req, res) => {
  const { id } = req.params;
  const { fecha, cliente, servicio, tecnica, precioBase, precioPersonalizado, precioPestanas, precioFinal } = req.body;

  try {
    const response = await axios.patch(`https://api.baserow.io/api/database/rows/table/361392/${id}/`, {
      fecha,
      cliente,
      servicio,
      tecnica,
      precioBase,
      precioPersonalizado,
      precioPestanas,
      precioFinal
    }, {
      headers: {
        Authorization: `Token 8FFbA6hV84faBnyiZ8j9ErO3UneUiTEm`
      }
    });

    res.json({ message: `Cita con ID ${id} actualizada`, data: response.data });
  } catch (error) {
    console.error('Error al actualizar la cita:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error al actualizar la cita', error: error.message });
  }
});

// Ruta para eliminar una cita (DELETE)
app.delete('/citas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await axios.delete(`https://api.baserow.io/api/database/rows/table/361392/${id}/`, {
      headers: {
        Authorization: `Token 8FFbA6hV84faBnyiZ8j9ErO3UneUiTEm`
      }
    });

    res.json({ message: `Cita con ID ${id} eliminada` });
  } catch (error) {
    console.error('Error al eliminar la cita:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error al eliminar la cita', error: error.message });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

// Ruta de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hacer una petición a la tabla de usuarios en Baserow
    const response = await axios.get('https://api.baserow.io/api/database/rows/table/364205/', {
      headers: {
        Authorization: `Token 8FFbA6hV84faBnyiZ8j9ErO3UneUiTEm`
      }
    });

    // Buscar si el usuario existe
    const usuarios = response.data.results;
    const usuarioEncontrado = usuarios.find(u => u.field_2731981 === username && u.field_2731982 === password);

    if (usuarioEncontrado) {
      // Si se encuentra, devolver un token (o simplemente confirmar el login)
      res.json({ message: 'Login exitoso', token: 'some-token' });  // Aquí podrías generar un JWT en lugar del "some-token"
    } else {
      // Si no se encuentra el usuario o la contraseña es incorrecta
      res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al realizar login:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error al realizar login', error: error.message });
  }
});
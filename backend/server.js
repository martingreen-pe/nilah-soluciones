require('dotenv').config(); // Cargar variables de entorno desde .env

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

// Habilitar CORS para todas las rutas
app.use(cors({
  origin: 'http://localhost:3000', // Permitir solicitudes desde el frontend
}));

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
    const response = await axios.post(`${process.env.BASEROW_API_URL}/361392/`, {
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
        Authorization: `Token ${process.env.API_TOKEN}`,
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
    const response = await axios.get(`${process.env.BASEROW_API_URL}/361392/`, {
      headers: {
        Authorization: `Token ${process.env.API_TOKEN}`
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
    const response = await axios.patch(`${process.env.BASEROW_API_URL}/361392/${id}/`, {
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
        Authorization: `Token ${process.env.API_TOKEN}`
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
    await axios.delete(`${process.env.BASEROW_API_URL}/361392/${id}/`, {
      headers: {
        Authorization: `Token ${process.env.API_TOKEN}`
      }
    });

    res.json({ message: `Cita con ID ${id} eliminada` });
  } catch (error) {
    console.error('Error al eliminar la cita:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error al eliminar la cita', error: error.message });
  }
});

// Ruta de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await axios.get(`${process.env.BASEROW_API_URL}/364205/`, {
      headers: {
        Authorization: `Token ${process.env.API_TOKEN}`
      }
    });

    const usuarios = response.data.results;
    const usuarioEncontrado = usuarios.find(u => u.field_2731981 === username && u.field_2731982 === password);

    if (usuarioEncontrado) {
      res.json({ message: 'Login exitoso', token: 'some-token' });
    } else {
      res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al realizar login:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error al realizar login', error: error.message });
  }
});

// Servir archivos estáticos si tienes un frontend construido
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

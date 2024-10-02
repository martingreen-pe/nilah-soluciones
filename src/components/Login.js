import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';  // Asegúrate de que el archivo CSS esté correcto

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    // Verificar si los campos están vacíos
    if (!username || !password) {
      setError('Por favor, ingresa tanto usuario como contraseña.');
      return;
    }

    console.log('Datos que se envían:', { username, password });  // Depuración para ver lo que se envía
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      
      console.log('Respuesta del servidor:', response.data);  // Depuración para ver la respuesta del servidor

      // Verificar si se recibe un token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        onLoginSuccess();
      } else {
        setError('Error en el servidor, no se recibió un token.');
      }
    } catch (err) {
      console.error('Error en el login:', err);

      // Diferenciar entre error de credenciales y error de servidor
      if (err.response && err.response.status === 401) {
        setError('Usuario o contraseña incorrectos');
      } else {
        setError('Hubo un problema con el servidor. Intenta nuevamente más tarde.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button className="login-button" onClick={handleLogin}>
          Ingresar
        </button>
      </div>
    </div>
  );
}

export default Login;

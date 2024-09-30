import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';  // Asegúrate de que esta línea esté bien

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    console.log('Datos que se envían:', { username, password });  // Verificar lo que se envía
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      console.log('Respuesta del servidor:', response.data);  // Verificar la respuesta del servidor
      localStorage.setItem('token', response.data.token);
      onLoginSuccess();
    } catch (err) {
      console.error('Error en el login:', err);  // Mostrar error en consola si ocurre algo
      setError('Usuario o contraseña incorrectos');
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
        <button className="login-button" onClick={handleLogin}>Ingresar</button>
      </div>
    </div>
  );
}

export default Login;
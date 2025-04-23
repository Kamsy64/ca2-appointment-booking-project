import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './Dashboard';

function App() {
  const [appointments, setAppointments] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [appointmentSubmitted, setAppointmentSubmitted] = useState(false);

  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/appointments');
      setAppointments(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Could not fetch appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Add new appointment
  const addAppointment = async (e) => {
    e.preventDefault();
    if (!name || !date || !time) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const newAppointment = {
        name,
        date,
        time,
        confirmed: false, // default to false
      };
      const response = await axios.post('http://localhost:3000/appointments', newAppointment);
      setAppointments([...appointments, response.data]);
      setName('');
      setDate('');
      setTime('');
      setAppointmentSubmitted(true); // track submission
      setError('');
    } catch (error) {
      console.error('Error adding appointment:', error);
      setError('Error adding appointment');
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
      });
      if (response.data.success) {
        setIsAuthenticated(true);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      // fallback login for now
      if (username === 'client' && password === 'password') {
        setIsAuthenticated(true);
      } else {
        alert('Invalid credentials');
      }
    }
  };

  // Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsGuest(false);
    setUsername('');
    setPassword('');
    setAppointments([]);
    setAppointmentSubmitted(false);
  };

  // Guest login
  const handleGuestLogin = () => {
    setIsGuest(true);
  };

  // Delete an appointment
  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/appointments/${id}`);
      setAppointments(appointments.filter((appointment) => appointment.id !== id));
      setError('');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setError('Error deleting appointment');
    }
  };

  useEffect(() => {
    if (isAuthenticated || isGuest) {
      fetchAppointments();
    }
  }, [isAuthenticated, isGuest]);

  // Find matching appointment (based on name, date, time)
  const userAppointment = appointments.find(
    (app) => app.name === name && app.date === date && app.time === time
  );

  return (
    <div className="App">
      <h1>Hair Appointment Booking</h1>

      {!isAuthenticated && !isGuest ? (
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
          <button onClick={handleGuestLogin}>Continue as Guest</button>
        </div>
      ) : (
        <div>
          <h2>{isAuthenticated ? 'Dashboard' : ''}</h2>
          {isAuthenticated && <Dashboard fetchAppointments={fetchAppointments} />}
          <button className="exit-btn" onClick={handleLogout}>Exit</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {!isAuthenticated && (
            <form onSubmit={addAppointment}>
              <input
                type="text"
                placeholder="Client's Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <button type="submit" disabled={loading}>Book Appointment</button>
            </form>
          )}

          {appointmentSubmitted && isGuest && (
            userAppointment ? (
              userAppointment.confirmed ? (
                <p style={{ color: 'green' }}>Your appointment has been confirmed!</p>
              ) : (
                <p style={{ color: 'orange' }}>Your appointment is pending confirmation.</p>
              )
            ) : (
              <p style={{ color: 'gray' }}>Appointment submitted. Waiting for response...</p>
            )
          )}

          <h2>Your Appointments</h2>
          {loading ? (
            <p>Loading your appointments...</p>
          ) : (
            <ul>
              {appointments.map((appointment) => (
                <li key={appointment.id}>
                  {appointment.name} - {appointment.date} - {appointment.time} - {appointment.confirmed ? '✅ Confirmed' : '⌛ Pending'}
                  {isAuthenticated && (
                    <button onClick={() => deleteAppointment(appointment.id)}>Cancel</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;





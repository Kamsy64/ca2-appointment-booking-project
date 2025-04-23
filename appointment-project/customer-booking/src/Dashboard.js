import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, name: 'John Doe', date: '2025-04-25', time: '10:00 AM', status: 'Pending' },
    { id: 2, name: 'Jane Smith', date: '2025-04-27', time: '12:00 PM', status: 'Pending' },
    { id: 3, name: 'Michael Johnson', date: '2025-04-30', time: '09:00 AM', status: 'Confirmed' },
  ]);

  const [activeCard, setActiveCard] = useState(null);

  const handleCardClick = (card) => {
    setActiveCard(card);
  };

  const handleConfirmAppointment = (id) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status: 'Confirmed' } : appointment
      )
    );
  };

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id));
  };

  const handleExit = () => {
    setActiveCard(null); // Resets to dashboard view
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome to Your Dashboard</h2>
        <p>Your appointments and actions are listed here.</p>
      </div>

      <div className="dashboard-cards">
        <div
          className={`card ${activeCard === 'upcomingAppointments' ? 'active' : ''}`}
          onClick={() => handleCardClick('upcomingAppointments')}
        >
          <h3>Upcoming Appointments</h3>
          <p>{appointments.filter((a) => a.status === 'Pending' || a.status === 'Confirmed').length}</p>
        </div>

        <div
          className={`card ${activeCard === 'pendingActions' ? 'active' : ''}`}
          onClick={() => handleCardClick('pendingActions')}
        >
          <h3>Pending Actions</h3>
          <p>{appointments.filter((a) => a.status === 'Pending').length}</p>
        </div>
      </div>

      <div className="dashboard-content">
        {activeCard === 'upcomingAppointments' && (
          <div className="card-details">
            <h3>Upcoming Appointments</h3>
            <ul>
              {appointments
                .filter((a) => a.status === 'Pending' || a.status === 'Confirmed')
                .map((appointment) => (
                  <li key={appointment.id} className={`status-${appointment.status.toLowerCase()}`}>
                    <strong>{appointment.name}</strong> — {appointment.date} at {appointment.time}
                    
                    {appointment.status === 'Pending' && (
                      <button onClick={() => handleConfirmAppointment(appointment.id)}>
                        Confirm
                      </button>
                    )}

                    {appointment.status === 'Confirmed' && (
                      <>
                        <span className="confirmed-tag"> ✅ Confirmed</span>
                        <p className="confirmation-message">Your appointment has been confirmed!</p>
                      </>
                    )}

                    <button className="delete-btn" onClick={() => handleDeleteAppointment(appointment.id)}>
                      ❌ Delete
                    </button>
                  </li>
                ))}
            </ul>
            <button className="exit-btn" onClick={handleExit}>Exit</button>
          </div>
        )}

        {activeCard === 'pendingActions' && (
          <div className="card-details">
            <h3>Pending Appointments To Confirm</h3>
            <ul>
              {appointments
                .filter((a) => a.status === 'Pending')
                .map((appointment) => (
                  <li key={appointment.id}>
                    <strong>{appointment.name}</strong> — {appointment.date} at {appointment.time}
                    <button onClick={() => handleConfirmAppointment(appointment.id)}>
                      Confirm
                    </button>
                  </li>
                ))}
              {appointments.filter((a) => a.status === 'Pending').length === 0 && (
                <li>🎉 No pending actions!</li>
              )}
            </ul>
            <button className="exit-btn" onClick={handleExit}>Exit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;





import React, { useState, useEffect } from 'react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  // Fetching data from the backend API when the component mounts
  useEffect(() => {
    fetch('http://localhost:3000/appointments')  // Backend API URL
      .then(response => response.json())
      .then(data => setAppointments(data))
      .catch(error => console.error('Error fetching appointments:', error));
  }, []);  // Empty dependency array means it runs only once when the component mounts

  return (
    <div>
      <h1>Book an Appointment</h1>
      <ul>
        {appointments.length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          appointments.map(appointment => (
            <li key={appointment.id}>
              {appointment.name} - {appointment.date} at {appointment.time}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Appointments;


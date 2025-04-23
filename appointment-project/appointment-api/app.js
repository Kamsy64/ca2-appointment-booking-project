const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let appointments = [];

app.get('/appointments', (req, res) => {
  res.json(appointments);
});

app.post('/appointments', (req, res) => {
  const { name, date, time } = req.body;
  const newAppointment = {
    id: appointments.length + 1,
    name,
    date,
    time
  };
  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

app.delete('/appointments/:id', (req, res) => {
  const { id } = req.params;

                  
  
  appointments = appointments.filter(appointment => appointment.id != id);
  res.json({ message: 'Appointment deleted' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

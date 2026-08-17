const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { getIsConnected } = require('../config/db');

let inMemoryAppointments = [
  {
    _id: 'a1',
    patientName: 'Sophia Martinez',
    doctorName: 'Dr. Emily Watson',
    department: 'Neurology',
    appointmentDate: '2026-08-17',
    appointmentTime: '10:30 AM',
    reason: 'Severe Migraine Follow-up',
    status: 'In-Progress',
    priority: 'Urgent'
  },
  {
    _id: 'a2',
    patientName: 'Arthur Pendelton',
    doctorName: 'Dr. Robert Chen',
    department: 'Cardiology',
    appointmentDate: '2026-08-17',
    appointmentTime: '11:45 AM',
    reason: 'Routine Cardiac Checkup & Lipid Profile',
    status: 'Scheduled',
    priority: 'Normal'
  },
  {
    _id: 'a3',
    patientName: 'Chloe Bennett',
    doctorName: 'Dr. Olivia Thorne',
    department: 'Pediatrics',
    appointmentDate: '2026-08-17',
    appointmentTime: '02:00 PM',
    reason: 'Pediatric Immunization booster',
    status: 'Scheduled',
    priority: 'Normal'
  },
  {
    _id: 'a4',
    patientName: 'Jameson Locke',
    doctorName: 'Dr. Sarah Jenkins',
    department: 'Surgery',
    appointmentDate: '2026-08-16',
    appointmentTime: '09:00 AM',
    reason: 'Abdominal Pain Evaluation',
    status: 'Completed',
    priority: 'Emergency'
  }
];

// GET all appointments
router.get('/', async (req, res) => {
  try {
    if (getIsConnected()) {
      const appointments = await Appointment.find().sort({ createdAt: -1 });
      return res.json(appointments);
    }
    return res.json(inMemoryAppointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// CREATE appointment
router.post('/', async (req, res) => {
  try {
    if (getIsConnected()) {
      const newAppt = new Appointment(req.body);
      const saved = await newAppt.save();
      return res.status(201).json(saved);
    }
    const newAppt = {
      _id: 'a' + (inMemoryAppointments.length + 1) + '_' + Date.now(),
      ...req.body
    };
    inMemoryAppointments.unshift(newAppt);
    return res.status(201).json(newAppt);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// UPDATE appointment status / details
router.put('/:id', async (req, res) => {
  try {
    if (getIsConnected()) {
      const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(updated);
    }
    const index = inMemoryAppointments.findIndex(a => a._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Appointment not found' });
    inMemoryAppointments[index] = { ...inMemoryAppointments[index], ...req.body };
    return res.json(inMemoryAppointments[index]);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE appointment
router.delete('/:id', async (req, res) => {
  try {
    if (getIsConnected()) {
      await Appointment.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Appointment deleted' });
    }
    inMemoryAppointments = inMemoryAppointments.filter(a => a._id !== req.params.id);
    return res.json({ message: 'Appointment deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;

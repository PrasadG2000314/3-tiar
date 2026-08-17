const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { getIsConnected } = require('../config/db');

// In-Memory Fallback Store
let inMemoryPatients = [
  {
    _id: 'p1',
    name: 'Eleanor Vance',
    age: 42,
    gender: 'Female',
    bloodGroup: 'O+',
    phone: '+1 555-0192',
    email: 'eleanor.vance@example.com',
    disease: 'Acute Appendicitis',
    doctorAssigned: 'Dr. Sarah Jenkins',
    roomNo: 'ICU-104',
    admissionDate: '2026-08-15',
    status: 'ICU',
    notes: 'Post-operative monitoring required.'
  },
  {
    _id: 'p2',
    name: 'Marcus Brody',
    age: 58,
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '+1 555-0344',
    email: 'marcus.brody@example.com',
    disease: 'Hypertension & Cardiac Arrhythmia',
    doctorAssigned: 'Dr. Robert Chen',
    roomNo: 'Ward-202',
    admissionDate: '2026-08-14',
    status: 'Admitted',
    notes: 'BP stabilized. Regular ECG check scheduled.'
  },
  {
    _id: 'p3',
    name: 'Sophia Martinez',
    age: 29,
    gender: 'Female',
    bloodGroup: 'B-',
    phone: '+1 555-0811',
    email: 'sophia.m@example.com',
    disease: 'Migraine & Vertigo',
    doctorAssigned: 'Dr. Emily Watson',
    roomNo: 'Outpatient',
    admissionDate: '2026-08-17',
    status: 'Outpatient',
    notes: 'Prescribed Sumatriptan. Follow up in 1 week.'
  },
  {
    _id: 'p4',
    name: 'David Kim',
    age: 35,
    gender: 'Male',
    bloodGroup: 'AB+',
    phone: '+1 555-0677',
    email: 'david.kim@example.com',
    disease: 'Fractured Femur',
    doctorAssigned: 'Dr. Michael Chang',
    roomNo: 'Ward-108',
    admissionDate: '2026-08-10',
    status: 'Discharged',
    notes: 'Cast applied. Physical therapy scheduled.'
  }
];

// GET all patients
router.get('/', async (req, res) => {
  try {
    if (getIsConnected()) {
      const patients = await Patient.find().sort({ createdAt: -1 });
      return res.json(patients);
    }
    return res.json(inMemoryPatients);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET single patient
router.get('/:id', async (req, res) => {
  try {
    if (getIsConnected()) {
      const patient = await Patient.findById(req.params.id);
      if (!patient) return res.status(404).json({ message: 'Patient not found' });
      return res.json(patient);
    }
    const patient = inMemoryPatients.find(p => p._id === req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    return res.json(patient);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// CREATE patient
router.post('/', async (req, res) => {
  try {
    if (getIsConnected()) {
      const newPatient = new Patient(req.body);
      const saved = await newPatient.save();
      return res.status(201).json(saved);
    }
    const newPatient = {
      _id: 'p' + (inMemoryPatients.length + 1) + '_' + Date.now(),
      ...req.body,
      admissionDate: req.body.admissionDate || new Date().toISOString().split('T')[0]
    };
    inMemoryPatients.unshift(newPatient);
    return res.status(201).json(newPatient);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// UPDATE patient
router.put('/:id', async (req, res) => {
  try {
    if (getIsConnected()) {
      const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(updated);
    }
    const index = inMemoryPatients.findIndex(p => p._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Patient not found' });
    inMemoryPatients[index] = { ...inMemoryPatients[index], ...req.body };
    return res.json(inMemoryPatients[index]);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE patient
router.delete('/:id', async (req, res) => {
  try {
    if (getIsConnected()) {
      await Patient.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Patient deleted successfully' });
    }
    inMemoryPatients = inMemoryPatients.filter(p => p._id !== req.params.id);
    return res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;

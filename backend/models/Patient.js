const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  disease: { type: String, required: true },
  doctorAssigned: { type: String, default: 'Unassigned' },
  roomNo: { type: String, default: 'N/A' },
  admissionDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, enum: ['Admitted', 'Outpatient', 'Discharged', 'ICU'], default: 'Admitted' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);

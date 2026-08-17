import React, { useState } from 'react';
import { Plus, Search, Eye, Trash2, UserPlus, HeartPulse } from 'lucide-react';
import Modal from '../components/Modal';

export default function Patients({ patients, onAddPatient, onDeletePatient, searchTerm }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    disease: '',
    doctorAssigned: 'Dr. Sarah Jenkins',
    roomNo: 'Ward-101',
    status: 'Admitted',
    notes: ''
  });

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.doctorAssigned.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPatient({
      ...formData,
      age: Number(formData.age)
    });
    setIsModalOpen(false);
    setFormData({
      name: '', age: '', gender: 'Male', bloodGroup: 'O+', phone: '', email: '', disease: '', doctorAssigned: 'Dr. Sarah Jenkins', roomNo: 'Ward-101', status: 'Admitted', notes: ''
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Patient Management</h1>
          <p className="page-subtitle">Track admissions, medical records, and bed allocations</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} /> Register Patient
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-bar">
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Admitted">Admitted</option>
          <option value="ICU">ICU</option>
          <option value="Outpatient">Outpatient</option>
          <option value="Discharged">Discharged</option>
        </select>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: 'auto' }}>
          Showing <strong>{filteredPatients.length}</strong> patient records
        </div>
      </div>

      {/* Patient Table */}
      <div className="card-table">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Patient Information</th>
              <th>Vitals / Blood</th>
              <th>Diagnosis & Notes</th>
              <th>Assigned Doctor</th>
              <th>Room No</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No patients found matching your search criteria.
                </td>
              </tr>
            ) : (
              filteredPatients.map(p => (
                <tr key={p._id || p.name}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                    <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{p.phone} • {p.gender}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.age} Yrs</div>
                    <span className="badge badge-info">{p.bloodGroup}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.disease}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Admitted: {p.admissionDate || '2026-08-15'}</div>
                  </td>
                  <td>{p.doctorAssigned}</td>
                  <td><strong>{p.roomNo}</strong></td>
                  <td>
                    <span className={`badge ${
                      p.status === 'ICU' ? 'badge-danger' : 
                      p.status === 'Admitted' ? 'badge-warning' : 
                      p.status === 'Outpatient' ? 'badge-info' : 'badge-success'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setSelectedPatient(p)}
                        title="View Medical Note"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ color: '#ef4444' }}
                        onClick={() => onDeletePatient(p._id)}
                        title="Delete Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Patient Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Patient">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Patient Name</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Johnathan Vance"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                className="form-control"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="45"
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                className="form-control"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Blood Group</label>
              <select
                className="form-control"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-0199"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Disease / Condition</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.disease}
              onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
              placeholder="e.g. Acute Bronchitis"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Assigned Doctor</label>
              <select
                className="form-control"
                value={formData.doctorAssigned}
                onChange={(e) => setFormData({ ...formData, doctorAssigned: e.target.value })}
              >
                <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Surgery)</option>
                <option value="Dr. Robert Chen">Dr. Robert Chen (Cardiology)</option>
                <option value="Dr. Emily Watson">Dr. Emily Watson (Neurology)</option>
                <option value="Dr. Michael Chang">Dr. Michael Chang (Orthopedics)</option>
                <option value="Dr. Olivia Thorne">Dr. Olivia Thorne (Pediatrics)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Admission Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Admitted">Admitted</option>
                <option value="ICU">ICU</option>
                <option value="Outpatient">Outpatient</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Medical & Clinical Notes</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Allergies, surgical history, dosage instructions..."
            ></textarea>
          </div>

          <div className="modal-footer" style={{ margin: '-24px -24px -24px -24px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Patient Record</button>
          </div>
        </form>
      </Modal>

      {/* Patient View Note Modal */}
      {selectedPatient && (
        <Modal isOpen={!!selectedPatient} onClose={() => setSelectedPatient(null)} title={`Patient Profile: ${selectedPatient.name}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedPatient.name}</span>
                <span className={`badge ${selectedPatient.status === 'ICU' ? 'badge-danger' : 'badge-success'}`}>{selectedPatient.status}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Age: {selectedPatient.age} | Gender: {selectedPatient.gender} | Blood: {selectedPatient.bloodGroup}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                Contact: {selectedPatient.phone} {selectedPatient.email && `| ${selectedPatient.email}`}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Diagnosis</h4>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>{selectedPatient.disease}</div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Clinical Observations</h4>
              <p style={{ background: '#fffbe8', border: '1px solid #fef08a', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                {selectedPatient.notes || 'No specific clinical notes documented yet.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <span>Doctor: <strong>{selectedPatient.doctorAssigned}</strong></span>
              <span>Room: <strong>{selectedPatient.roomNo}</strong></span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { UserCheck, Plus, Mail, Phone, Calendar, Clock, Award } from 'lucide-react';
import Modal from '../components/Modal';

export default function Doctors({ doctors, onAddDoctor, searchTerm }) {
  const [deptFilter, setDeptFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    qualification: 'MD',
    experience: '5 Years',
    phone: '',
    email: '',
    department: 'Cardiology',
    timing: '09:00 AM - 05:00 PM',
    status: 'Available',
    avatarUrl: ''
  });

  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || d.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddDoctor({
      ...formData,
      avatarUrl: formData.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
    });
    setIsModalOpen(false);
    setFormData({ name: '', specialization: '', qualification: 'MD', experience: '5 Years', phone: '', email: '', department: 'Cardiology', timing: '09:00 AM - 05:00 PM', status: 'Available', avatarUrl: '' });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Doctor Roster & Specialists</h1>
          <p className="page-subtitle">Manage medical personnel, shift timings, and department assignments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Doctor Profile
        </button>
      </div>

      <div className="filter-bar">
        <select
          className="filter-select"
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
        >
          <option value="All">All Departments</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Surgery">Surgery</option>
          <option value="Neurology">Neurology</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="Pediatrics">Pediatrics</option>
        </select>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: 'auto' }}>
          <strong>{filteredDoctors.length}</strong> active medical specialists
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredDoctors.map(doc => (
          <div key={doc._id || doc.name} className="card-table" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <img
                src={doc.avatarUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200'}
                alt={doc.name}
                style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover', border: '2px solid #e2e8f0' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${
                    doc.status === 'Available' ? 'badge-success' : 
                    doc.status === 'In Surgery' ? 'badge-danger' : 'badge-warning'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{doc.name}</h3>
                <div style={{ fontSize: '0.825rem', color: '#0d9488', fontWeight: 600 }}>{doc.specialization}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={15} color="#64748b" />
                <span>{doc.qualification} ({doc.experience} exp)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={15} color="#64748b" />
                <span>Shift: {doc.timing}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="#64748b" />
                <span>{doc.phone}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                <Mail size={14} /> Contact
              </button>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                View Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Doctor Profile">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Doctor Full Name</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Alexander Fleming"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Specialization</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g. Interventional Cardiology"
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select
                className="form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Surgery">Surgery</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Qualifications</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="MD, FACC"
              />
            </div>
            <div className="form-group">
              <label>Years Experience</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="10 Years"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-9088"
              />
            </div>
            <div className="form-group">
              <label>Work Email</label>
              <input
                type="email"
                className="form-control"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="doctor@hospital.org"
              />
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '-24px -24px -24px -24px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Doctor Profile</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import React from 'react';
import { Users, UserCheck, Calendar, DollarSign, Activity, AlertTriangle, ArrowUpRight, BedDouble } from 'lucide-react';

export default function Dashboard({ stats, patients, doctors, appointments, setActiveTab }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Hospital Overview</h1>
          <p className="page-subtitle">Real-time stats and operational analytics for St. Jude Memorial</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('patients')}>
            + New Admission
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('appointments')}>
            Book Appointment
          </button>
        </div>
      </div>

      {/* Emergency Alert Banner */}
      <div className="alert-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={20} color="#e11d48" />
          <span><strong>ICU Advisory:</strong> 2 critical cases admitted in ICU Wing 4. Emergency surgeon Dr. Sarah Jenkins on standby.</span>
        </div>
        <span className="badge badge-danger">Live Alert</span>
      </div>

      {/* Key Metric Stats Cards */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ccfbf1', color: '#0d9488' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.totalPatients || patients.length}</div>
            <div className="stat-label">Total Patients</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.availableDoctors || doctors.length}</div>
            <div className="stat-label">Doctors Available</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.pendingAppointments || appointments.length}</div>
            <div className="stat-label">Appointments Today</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="stat-val">${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '48,920'}</div>
            <div className="stat-label">Revenue (This Month)</div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Recent Patients & Doctor Availability */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Patients Table */}
        <div className="card-table">
          <div className="table-header">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recently Admitted Patients</h3>
            <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('patients')}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Disease / Diagnosis</th>
                <th>Assigned Doctor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.slice(0, 4).map(p => (
                <tr key={p._id || p.name}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{p.age} yrs • {p.bloodGroup}</div>
                  </td>
                  <td>{p.disease}</td>
                  <td>{p.doctorAssigned}</td>
                  <td>
                    <span className={`badge ${
                      p.status === 'ICU' ? 'badge-danger' : 
                      p.status === 'Admitted' ? 'badge-warning' : 
                      p.status === 'Outpatient' ? 'badge-info' : 'badge-success'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Hospital Occupancy & Quick Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-table" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Bed Occupancy</h3>
              <BedDouble size={20} color="#0d9488" />
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a' }}>
              {stats.bedOccupancyRate || '78%'}
            </div>
            <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '4px' }}>
              156 of 200 Inpatient Beds Occupied
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginTop: '16px', overflow: 'hidden' }}>
              <div style={{ width: '78%', height: '100%', backgroundColor: '#0d9488', borderRadius: '4px' }}></div>
            </div>
          </div>

          {/* On Call Doctors */}
          <div className="card-table" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Doctors On Call</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {doctors.slice(0, 3).map(d => (
                <div key={d._id || d.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={d.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
                    alt={d.name}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{d.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{d.specialization}</div>
                  </div>
                  <span className={`badge ${d.status === 'Available' ? 'badge-success' : 'badge-warning'}`}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

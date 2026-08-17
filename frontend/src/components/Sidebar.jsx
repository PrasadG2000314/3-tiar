import React from 'react';
import { LayoutDashboard, Users, UserCheck, Calendar, Receipt, Package, Stethoscope, Activity } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'doctors', label: 'Doctor Roster', icon: UserCheck },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'billing', label: 'Billing & Invoices', icon: Receipt },
  { id: 'inventory', label: 'Pharmacy & Stock', icon: Package }
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">
          <Stethoscope size={24} />
        </div>
        <div>
          <div className="brand-name">CarePulse</div>
          <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>HOSPITAL MANAGEMENT</div>
        </div>
      </div>

      <ul className="sidebar-menu">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                style={{ width: '100%', border: 'none', background: 'transparent' }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <div className="hospital-badge">
          <Activity size={20} color="#14b8a6" />
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>St. Jude Memorial</div>
            <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Node + MongoDB Live</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

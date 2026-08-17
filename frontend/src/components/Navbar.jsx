import React from 'react';
import { Search, Bell, ShieldCheck, Database } from 'lucide-react';

export default function Navbar({ searchTerm, setSearchTerm, isMongoConnected }) {
  return (
    <header className="topbar">
      <div className="search-box">
        <Search size={18} color="#64748b" />
        <input
          type="text"
          placeholder="Search patients, doctors, medical records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="topbar-actions">
        <div 
          className={`badge ${isMongoConnected ? 'badge-success' : 'badge-warning'}`}
          title={isMongoConnected ? 'Connected to local MongoDB' : 'Running Backend with In-Memory MongoDB Fallback'}
        >
          <Database size={13} />
          {isMongoConnected ? 'MongoDB Connected' : 'Mock DB Active'}
        </div>

        <button 
          style={{ background: '#f1f5f9', border: 'none', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          title="Notifications"
        >
          <Bell size={18} color="#475569" />
        </button>

        <div className="user-profile">
          <div className="avatar">AD</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2 }}>Dr. Alex Drake</div>
            <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Chief Medical Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
}

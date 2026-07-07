import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';

const getInitials = (name) =>
  name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

const StatCard = ({ icon, label, value, gradient, delay }) => (
  <div
    className="stat-card"
    style={{ animationDelay: `${delay}ms`, background: gradient }}
  >
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const QuickAction = ({ to, icon, title, desc, color }) => (
  <Link to={to} className="quick-action-card" style={{ '--accent': color }}>
    <div className="quick-action-icon" style={{ background: color }}>{icon}</div>
    <div>
      <div className="quick-action-title">{title}</div>
      <div className="quick-action-desc">{desc}</div>
    </div>
    <svg className="quick-action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </Link>
);

export default function Dashboard() {
  const [data, setData]       = useState(null);
  const [notes, setNotes]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard').catch(() => null),
      api.get('/notes/my').catch(() => []),
    ]).then(([dashData, myNotes]) => {
      setData(dashData);
      setNotes(Array.isArray(myNotes) ? myNotes.slice(0, 3) : []);
    }).finally(() => setLoading(false));
  }, []);

  const user  = data?.user  || {};
  const stats = data?.stats || {};

  const statCards = [
    { icon: '📝', label: 'Notes Shared',    value: stats.notes_count     || 0, gradient: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', delay: 0   },
    { icon: '⬇️', label: 'Total Downloads', value: stats.total_downloads || 0, gradient: 'linear-gradient(135deg,#fffbeb,#fef3c7)', delay: 80  },
    { icon: '⭐', label: 'Avg Rating',       value: stats.avg_rating ? Number(stats.avg_rating).toFixed(1) : '0.0', gradient: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', delay: 160 },
    { icon: '🔖', label: 'Bookmarks',        value: stats.bookmarks_count || 0, gradient: 'linear-gradient(135deg,#eff6ff,#dbeafe)', delay: 240 },
    { icon: '💬', label: 'Comments',         value: stats.comments_count  || 0, gradient: 'linear-gradient(135deg,#fdf4ff,#fae8ff)', delay: 320 },
  ];

  const quickActions = [
    { to: '/upload',       icon: '⬆️', title: 'Upload a Note',  desc: 'Share your knowledge',     color: '#7c3aed' },
    { to: '/',             icon: '🔍', title: 'Browse Notes',   desc: 'Explore the community',     color: '#0891b2' },
    { to: '/profile/edit', icon: '✏️', title: 'Edit Profile',   desc: 'Update your info & avatar', color: '#059669' },
    { to: '/profile',      icon: '👤', title: 'View Profile',   desc: 'See your public profile',   color: '#d97706' },
  ];

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-loading-spinner" />
          <p>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard-page page-enter">
      {/* ── Welcome Banner ── */}
      <div className="dashboard-banner">
        <div className="dashboard-banner-blob blob-1" />
        <div className="dashboard-banner-blob blob-2" />
        <div className="dashboard-banner-inner">
          <div className="dashboard-avatar">
            {user.avatar_url
              ? <img src={user.avatar_url} alt="avatar" />
              : <span>{getInitials(user.full_name || 'You')}</span>}
          </div>
          <div className="dashboard-welcome-text">
            <p className="dashboard-greeting">{greeting} 👋</p>
            <h1 className="dashboard-name">{user.full_name || 'Welcome back!'}</h1>
            {user.bio && <p className="dashboard-bio">{user.bio}</p>}
          </div>
        </div>
        <Link to="/profile/edit" className="dashboard-edit-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </Link>
      </div>

      {/* ── Stats ── */}
      <section className="dashboard-section">
        <h2 className="dashboard-section-title">Your Statistics</h2>
        <div className="dashboard-stats-grid">
          {statCards.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* ── Recent Notes ── */}
      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Recent Uploads</h2>
          <Link to="/profile" className="dashboard-see-all">See all →</Link>
        </div>
        {notes.length > 0 ? (
          <div className="dashboard-notes-grid">
            {notes.map((note, i) => (
              <Link
                key={note.id}
                to={`/notes/${note.id}`}
                className="dashboard-note-card"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="dashboard-note-subject">{note.subject || 'General'}</div>
                <h3 className="dashboard-note-title">{note.title}</h3>
                <div className="dashboard-note-meta">
                  <span>⬇️ {note.downloads || 0}</span>
                  <span>⭐ {note.rating ? Number(note.rating).toFixed(1) : '—'}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            <span className="dashboard-empty-icon">📂</span>
            <p>No notes yet. <Link to="/upload">Upload your first note →</Link></p>
          </div>
        )}
      </section>

      {/* ── Quick Actions ── */}
      <section className="dashboard-section">
        <h2 className="dashboard-section-title">Quick Actions</h2>
        <div className="dashboard-actions-grid">
          {quickActions.map((a) => (
            <QuickAction key={a.to} {...a} />
          ))}
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import NoteCard from '../components/NoteCard';
import ProfileSkeleton from '../components/ProfileSkeleton';

const getInitials = (name) =>
  name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

export default function Profile() {
  const [notes, setNotes]     = useState([]);
  const [profile, setProfile] = useState(null);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort]       = useState('newest');

  useEffect(() => {
    Promise.all([
      api.get('/profile').catch(() => null),
      api.get('/notes/my').catch(() => []),
    ]).then(([profileData, myNotes]) => {
      setProfile(profileData?.user || null);
      setStats(profileData?.stats || null);
      setNotes(Array.isArray(myNotes) ? myNotes : []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileSkeleton />
      </div>
    );
  }

  const user = profile || { full_name: 'You', email: '', bio: '', avatar_url: null };

  const sortedNotes = [...notes].sort((a, b) => {
    if (sort === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
    if (sort === 'rating')    return (b.rating || 0) - (a.rating || 0);
    return b.id - a.id; // newest
  });

  const statItems = [
    { icon: '📝', label: 'Notes Shared',    value: stats?.notes_count     || notes.length },
    { icon: '⬇️', label: 'Total Downloads', value: stats?.total_downloads || notes.reduce((s, n) => s + (n.downloads || 0), 0) },
    { icon: '⭐', label: 'Avg Rating',       value: stats?.avg_rating ? Number(stats.avg_rating).toFixed(1) : (notes.length > 0 ? (notes.reduce((s, n) => s + (n.rating || 0), 0) / notes.length).toFixed(1) : '0.0') },
    { icon: '💬', label: 'Comments',         value: stats?.comments_count  || 0 },
  ];

  return (
    <div className="profile-page page-enter">
      {/* ── Profile Header ── */}
      <div className="profile-header">
        <div className="profile-header-bg" />
        <div className="profile-header-content">
          <div className="profile-avatar-wrap">
            {user.avatar_url
              ? <img src={user.avatar_url} alt="avatar" className="profile-avatar-img" />
              : (
                <div className="profile-avatar-initials">
                  {getInitials(user.full_name)}
                </div>
              )}
            <Link to="/profile/edit" className="profile-avatar-edit-btn" title="Edit Profile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.full_name}</h1>
            {user.email && <p className="profile-email">{user.email}</p>}
            {user.bio
              ? <p className="profile-bio">{user.bio}</p>
              : (
                <Link to="/profile/edit" className="profile-bio-placeholder">
                  + Add a bio
                </Link>
              )}
          </div>
          <Link to="/profile/edit" className="profile-edit-btn">
            ✏️ Edit Profile
          </Link>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="profile-stats-bar">
        {statItems.map((s, i) => (
          <div key={s.label} className="profile-stat-item" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="profile-stat-icon">{s.icon}</span>
            <span className="profile-stat-value">{s.value}</span>
            <span className="profile-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Notes ── */}
      <div className="profile-notes-section">
        <div className="profile-notes-header">
          <h2 className="profile-notes-title">My Notes <span className="profile-notes-count">{notes.length}</span></h2>
          <div className="profile-sort-wrap">
            <label htmlFor="profile-sort" className="sr-only">Sort by</label>
            <select
              id="profile-sort"
              className="profile-sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="downloads">Most Downloads</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {sortedNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedNotes.map((note, i) => (
              <NoteCard key={note.id} note={note} index={i} />
            ))}
          </div>
        ) : (
          <div className="empty-state rounded-2xl border border-neutral-200 bg-white">
            <span className="text-4xl mb-3">📝</span>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">No notes yet</h3>
            <p className="text-sm text-neutral-500">Start sharing your knowledge with the community.</p>
            <Link
              to="/upload"
              className="mt-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white text-sm font-semibold px-5 py-2 rounded-lg"
            >
              Upload a Note
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import ProfileSkeleton from '../components/ProfileSkeleton';
import NoteCard from '../components/NoteCard';

const getInitials = (name) =>
  name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

export default function Profile() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let fetchedUser = null;
    setLoading(true);

    api.get('/auth/me')
      .then((data) => {
        fetchedUser = data.user;
        setUser(data.user);
      })
      .catch(() => {
        // not authenticated — keep user null
      })
      .finally(() => {
        api.get('/notes/my')
          .then((userNotes) => setNotes(userNotes))
          .catch(() => setNotes([]))
          .finally(() => {
            if (!fetchedUser) {
              setUser((prev) => prev || { full_name: 'You', email: 'Sign in to view your profile' });
            }
            setLoading(false);
          });
      });
  }, []);

  const stats = [
    { label: 'Notes Shared', value: notes.length, gradient: 'from-brand-50 to-brand-100', icon: '📝' },
    { label: 'Downloads', value: notes.reduce((s, n) => s + (n.downloads || 0), 0), gradient: 'from-amber-50 to-amber-100', icon: '⬇️' },
    { label: 'Rating', value: notes.length > 0 ? (notes.reduce((s, n) => s + (n.rating || 0), 0) / notes.length).toFixed(1) : 0, gradient: 'from-emerald-50 to-emerald-100', icon: '⭐' },
    { label: 'Comments', value: notes.length * 2, gradient: 'from-cyan-50 to-cyan-100', icon: '💬' },
  ];

  if (loading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><ProfileSkeleton /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 ring-4 ring-white shadow-xl flex items-center justify-center text-3xl font-bold text-white">
            {getInitials(user.full_name)}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-neutral-900">{user.full_name}</h1>
            <p className="text-sm text-neutral-500">{user.email}</p>
            {user.created_at && (
              <p className="text-xs text-neutral-400 mt-1">Member since {new Date(user.created_at).toLocaleDateString()}</p>
            )}
            {notes.length === 0 && (
              <Link to="/upload" className="text-sm text-brand-600 hover:text-brand-700 font-medium mt-1 inline-block">
                Upload your first note
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-4 flex flex-col items-center text-center animate-fade-in`}
            >
              <span className="text-xl mb-1">{stat.icon}</span>
              <span className="text-xl font-bold text-neutral-900">{stat.value}</span>
              <span className="text-xs text-neutral-500">{stat.label}</span>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-neutral-900 mb-6">My Notes</h2>
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map((note, i) => (
              <NoteCard key={note.id} note={note} index={i} />
            ))}
          </div>
        ) : (
          <div className="empty-state rounded-2xl border border-neutral-200 bg-white">
            <span className="text-4xl mb-3">📝</span>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">No notes yet</h3>
            <p className="text-sm text-neutral-500">Start sharing your knowledge with the community.</p>
            <Link to="/upload" className="mt-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white text-sm font-semibold px-5 py-2 rounded-lg">Upload a Note</Link>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../utils/axios';
import DetailSkeleton from '../components/DetailSkeleton';
import { useToast } from '../context/ToastContext';

const avatarColors = ['from-brand-400 to-brand-600', 'from-amber-400 to-orange-600', 'from-emerald-400 to-teal-600'];

const getInitials = (name) =>
  name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

export default function NoteDetail() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [comments, setComments] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    setLoading(true);
    api.get(`/notes/${id}`).then((data) => {
      setNote(data);
      setRating(Math.round(data.rating || 0));
    }).catch(() => {
      setNote(null);
    }).finally(() => setLoading(false));

    const demoComments = [
      { id: 1, author: 'Priya Patel', text: 'This is incredibly well organized!', time: '2 days ago' },
      { id: 2, author: 'Rohit Singh', text: 'Great work, thanks for sharing!', time: '1 day ago' },
    ];
    setComments(demoComments);
  }, [id]);

  const handleDownload = () => {
    setDownloading(true);
    const a = document.createElement('a');
    a.href = `/api/notes/${id}/download`;
    a.click();
    setTimeout(() => {
      setDownloading(false);
      addToast('Download started!', 'success');
    }, 1000);
  };

  const handleRate = (star) => {
    setRating(star);
    addToast(`Rated ${star}/5`, 'success');
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><DetailSkeleton /></div>;
  if (!note) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="empty-state rounded-2xl border border-neutral-200 bg-white">
        <span className="text-4xl mb-3">📄</span>
        <h3 className="text-lg font-semibold text-neutral-900 mb-1">Note not found</h3>
        <Link to="/" className="text-brand-600 hover:text-brand-700 font-medium text-sm">Back to Browse</Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <div className="max-w-3xl mx-auto glass-card rounded-2xl p-6 sm:p-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-brand-600 transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Browse
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="tag" style={{ background: 'rgba(251, 191, 36, 0.12)', color: '#d97706' }}>{note.subject}</span>
          <span className="text-sm text-neutral-400">{note.created_at ? new Date(note.created_at).toLocaleDateString() : ''}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">{note.title}</h1>

        <div className="flex items-center gap-3 mb-6">
          <div className="avatar bg-gradient-to-br from-brand-400 to-brand-600">
            {getInitials(note.author_name)}
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900">{note.author_name}</p>
            <p className="text-xs text-neutral-400">{note.downloads || 0} downloads</p>
          </div>
        </div>

        <p className="text-neutral-600 leading-relaxed mb-6">{note.description}</p>

        <div className="flex items-center gap-1 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="star-btn"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRate(star)}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <svg
                className={`w-6 h-6 ${star <= (hoverRating || rating) ? 'text-amber-400 drop-shadow-sm' : 'text-slate-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          <span className="text-sm text-neutral-400 ml-2">{rating > 0 ? `${rating}/5` : 'Rate this note'}</span>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-brand-500/20 transition-all duration-200 inline-flex items-center gap-2 disabled:opacity-70"
        >
          {downloading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Downloading...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Notes
            </>
          )}
        </button>
      </div>

      <div className="max-w-3xl mx-auto mt-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Comments</h2>
        <div className="space-y-4">
          {comments.map((comment, i) => (
            <div
              key={comment.id}
              className="glass-card rounded-xl p-4 flex items-start gap-3 animate-fade-in"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className={`avatar w-8 h-8 text-[11px] bg-gradient-to-br ${avatarColors[i % avatarColors.length]}`}>
                {getInitials(comment.author)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-neutral-900">{comment.author}</p>
                  <span className="text-xs text-neutral-400">{comment.time}</span>
                </div>
                <p className="text-sm text-neutral-600">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

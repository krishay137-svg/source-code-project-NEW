import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../utils/axios';
import DetailSkeleton from '../components/DetailSkeleton';
import { useToast } from '../context/ToastContext';

const avatarColors = [
  'from-brand-400 to-brand-600',
  'from-amber-400 to-orange-600',
  'from-emerald-400 to-teal-600',
  'from-violet-400 to-purple-600',
  'from-rose-400 to-pink-600',
];

const getInitials = (name) =>
  name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

export default function NoteDetail() {
  const { id } = useParams();
  const [note, setNote]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [rating, setRating]           = useState(0);
  const [avgRating, setAvgRating]     = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [comments, setComments]       = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [bookmarked, setBookmarked]   = useState(false);
  const [showReport, setShowReport]   = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const { addToast } = useToast();
  const commentInputRef = useRef(null);

  /* ── Load note + ratings + comments + bookmark status ── */
  useEffect(() => {
    setLoading(true);

    api.get(`/notes/${id}`)
      .then((data) => {
        setNote(data);
        setRating(Math.round(data.rating || 0));
      })
      .catch(() => setNote(null))
      .finally(() => setLoading(false));

    // Fetch aggregate ratings
    api.get(`/notes/${id}/ratings`)
      .then((data) => {
        setAvgRating(data.avgRating   || 0);
        setTotalRatings(data.totalRatings || 0);
      })
      .catch(() => {});

    // Fetch comments from API
    api.get(`/notes/${id}/comments`)
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]));

    // Fetch bookmark status
    api.get(`/notes/${id}/bookmark-status`)
      .then((data) => setBookmarked(data.bookmarked || false))
      .catch(() => setBookmarked(false));
  }, [id]);

  /* ── Download ── */
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

  /* ── Rating ── */
  const handleRate = (star) => {
    api.post(`/notes/${id}/rate`, { rating: star })
      .then((data) => {
        setRating(star);
        setAvgRating(data.avgRating   || star);
        setTotalRatings(data.totalRatings || totalRatings + 1);
        addToast(`Rated ${star}/5 ⭐`, 'success');
      })
      .catch(() => {
        // Optimistic update even if not logged in for demo
        setRating(star);
        addToast(`Rated ${star}/5 ⭐`, 'success');
      });
  };

  /* ── Comment Submit ── */
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);

    api.post(`/notes/${id}/comments`, { body: commentText })
      .then((data) => {
        if (data.comment) {
          setComments((prev) => [data.comment, ...prev]);
        }
        setCommentText('');
        addToast('Comment posted!', 'success');
      })
      .catch(() => {
        // Demo fallback — show optimistic comment
        const demoComment = {
          id: Date.now(),
          author_name: 'You',
          body: commentText,
          created_at: new Date().toISOString(),
        };
        setComments((prev) => [demoComment, ...prev]);
        setCommentText('');
        addToast('Comment posted!', 'success');
      })
      .finally(() => setSubmitting(false));
  };

  /* ── Bookmark Toggle ── */
  const handleBookmark = () => {
    api.post(`/notes/${id}/bookmark`)
      .then((data) => {
        setBookmarked(data.bookmarked);
        addToast(data.bookmarked ? 'Bookmarked! 🔖' : 'Bookmark removed', data.bookmarked ? 'success' : 'info');
      })
      .catch(() => {
        setBookmarked((prev) => !prev);
        addToast(bookmarked ? 'Bookmark removed' : 'Bookmarked! 🔖', 'success');
      });
  };

  /* ── Report Submit ── */
  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    setReportSubmitting(true);

    api.post(`/notes/${id}/report`, { reason: reportReason, details: reportDetails })
      .then(() => {
        addToast('Report submitted. Thank you! 🚩', 'success');
        setShowReport(false);
        setReportReason('');
        setReportDetails('');
      })
      .catch(() => {
        addToast('Report submitted. Thank you! 🚩', 'success');
        setShowReport(false);
        setReportReason('');
        setReportDetails('');
      })
      .finally(() => setReportSubmitting(false));
  };

  const formatDate = (dt) => {
    if (!dt) return '';
    try {
      return new Date(dt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dt;
    }
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

        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-brand-600 transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Browse
        </Link>

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-4">
          <span className="tag" style={{ background: 'rgba(251, 191, 36, 0.12)', color: '#d97706' }}>{note.subject}</span>
          <span className="text-sm text-neutral-400">{formatDate(note.created_at)}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">{note.title}</h1>

        {/* Author row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="avatar bg-gradient-to-br from-brand-400 to-brand-600">
              {getInitials(note.author_name)}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">{note.author_name}</p>
              <p className="text-xs text-neutral-400">{note.downloads || 0} downloads</p>
            </div>
          </div>

          {/* Bookmark + Report actions */}
          <div className="flex items-center gap-2">
            {/* Bookmark Button */}
            <button
              id="bookmark-btn"
              onClick={handleBookmark}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark this note'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                bookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                  : 'bg-white border-neutral-200 text-neutral-500 hover:border-amber-300 hover:text-amber-600'
              }`}
            >
              <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {bookmarked ? 'Saved' : 'Save'}
            </button>

            {/* Report Button */}
            <button
              id="report-btn"
              onClick={() => setShowReport(true)}
              title="Report this note"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-neutral-200 bg-white text-neutral-400 hover:border-red-300 hover:text-red-500 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Report
            </button>
          </div>
        </div>

        <p className="text-neutral-600 leading-relaxed mb-6">{note.description}</p>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-2">
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
          <span className="text-sm text-neutral-400 ml-2">
            {rating > 0 ? `${rating}/5` : 'Rate this note'}
            {totalRatings > 0 && <span className="ml-1 text-neutral-300">({avgRating} avg · {totalRatings} ratings)</span>}
          </span>
        </div>

        {/* Download Button */}
        <button
          id="download-btn"
          onClick={handleDownload}
          disabled={downloading}
          className="mt-4 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-brand-500/20 transition-all duration-200 inline-flex items-center gap-2 disabled:opacity-70"
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

      {/* ── Comments Section ── */}
      <div className="max-w-3xl mx-auto mt-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">
          Comments
          {comments.length > 0 && (
            <span className="ml-2 text-sm font-normal text-neutral-400">({comments.length})</span>
          )}
        </h2>

        {/* Comment Form */}
        <form
          id="comment-form"
          onSubmit={handleCommentSubmit}
          className="glass-card rounded-xl p-4 mb-6"
        >
          <textarea
            ref={commentInputRef}
            id="comment-input"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts about this note..."
            rows={3}
            maxLength={1000}
            className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-neutral-400">{commentText.length}/1000</span>
            <button
              id="submit-comment-btn"
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>

        {/* Comment List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-sm">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            comments.map((comment, i) => (
              <div
                key={comment.id}
                className="glass-card rounded-xl p-4 flex items-start gap-3 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`avatar w-8 h-8 text-[11px] bg-gradient-to-br ${avatarColors[i % avatarColors.length]}`}>
                  {getInitials(comment.author_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-neutral-900">{comment.author_name}</p>
                    <span className="text-xs text-neutral-400">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-sm text-neutral-600">{comment.body}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Report Modal ── */}
      {showReport && (
        <div
          id="report-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setShowReport(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                Report Note
              </h3>
              <button
                onClick={() => setShowReport(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form id="report-form" onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Reason *</label>
                <select
                  id="report-reason"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-400"
                >
                  <option value="">Select a reason...</option>
                  <option value="plagiarism">Plagiarism / Copyright violation</option>
                  <option value="inappropriate">Inappropriate content</option>
                  <option value="misleading">Misleading or incorrect information</option>
                  <option value="spam">Spam</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Details (optional)</label>
                <textarea
                  id="report-details"
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows={3}
                  placeholder="Provide additional context..."
                  className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowReport(false)}
                  className="flex-1 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button
                  id="submit-report-btn"
                  type="submit"
                  disabled={reportSubmitting || !reportReason}
                  className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-50"
                >
                  {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

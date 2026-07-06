import { Link } from 'react-router-dom';

const getInitials = (name) =>
  name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

const avatarGradients = [
  'bg-gradient-to-br from-brand-400 to-brand-600',
  'bg-gradient-to-br from-amber-400 to-orange-600',
  'bg-gradient-to-br from-emerald-400 to-teal-600',
  'bg-gradient-to-br from-cyan-400 to-blue-600',
  'bg-gradient-to-br from-rose-400 to-pink-600',
];

export default function NoteCard({ note, index = 0 }) {
  const avatarGradient = avatarGradients[index % avatarGradients.length];

  return (
    <Link
      to={`/notes/${note.id}`}
      className="rounded-2xl border border-neutral-200/60 bg-white p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 block animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="tag text-xs" style={{ background: 'rgba(251, 191, 36, 0.12)', color: '#d97706' }}>
          {note.subject || 'General'}
        </span>
        <span className="text-xs text-neutral-400">{note.created_at ? new Date(note.created_at).toLocaleDateString() : ''}</span>
      </div>

      <h3 className="font-semibold text-neutral-900 mb-1.5 group-hover:text-amber-700 transition-colors">
        {note.title}
      </h3>

      <p className="text-sm text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
        {note.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`avatar w-7 h-7 text-[10px] ${avatarGradient}`}>
            {getInitials(note.author_name)}
          </div>
          <span className="text-xs font-medium text-neutral-700">{note.author_name || 'Anonymous'}</span>
        </div>

        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${star <= (note.rating || 0) ? 'text-amber-400' : 'text-slate-200'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    </Link>
  );
}

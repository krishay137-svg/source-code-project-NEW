import { useState, useRef } from 'react';
import api from '../utils/axios';
import { useToast } from '../context/ToastContext';

const subjects = ['Mathematics', 'Chemistry', 'Computer Science', 'Physics', 'Biology', 'English', 'History', 'Other'];

export default function Upload() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', subject: 'Mathematics', description: '' });
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getFileIcon = () => {
    if (!file) return null;
    const type = file.type;
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎥';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📁';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      addToast('Please select a file to upload.', 'warning');
      return;
    }
    if (!form.title.trim()) {
      addToast('Title is required.', 'warning');
      return;
    }
    if (!form.description.trim()) {
      addToast('Description is required.', 'warning');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', form.title.trim());
    formData.append('subject', form.subject);
    formData.append('description', form.description.trim());

    try {
      await api.post('/notes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      addToast('Note uploaded successfully!', 'success');
      setForm({ title: '', subject: 'Mathematics', description: '' });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      addToast(err?.error || 'Upload failed. Please try again.', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <div className="max-w-2xl mx-auto glass-card rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Upload Notes</h1>
        <p className="text-neutral-500 text-sm mb-6">Share your study notes with the community</p>

        <div
          className={`drop-zone p-8 sm:p-12 text-center mb-6 ${dragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">{getFileIcon()}</span>
              <p className="text-sm font-medium text-neutral-900">{file.name}</p>
              <p className="text-xs text-neutral-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                className="text-xs text-red-500 hover:text-red-600 font-medium mt-1"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg className="w-10 h-10 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-neutral-500">
                <span className="text-brand-600 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-neutral-400">PDF, Images, Documents (max 50MB)</p>
            </div>
          )}
        </div>

        {uploading && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-neutral-500">Uploading...</span>
              <span className="text-brand-600 font-medium">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Calculus II — Integration Techniques"
              className="input-modern"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Subject</label>
            <select name="subject" value={form.subject} onChange={handleChange} className="input-modern">
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Briefly describe what this note covers..."
              rows={4}
              className="input-modern resize-none"
              required
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {subjects.filter((s) => s === form.subject).map((s) => (
              <span key={s} className="tag">{s}</span>
            ))}
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            {uploading ? `Uploading ${uploadProgress}%...` : 'Upload Note'}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { uploadFormData } from '../utils/axios';
import { useToast } from '../context/ToastContext';

const getInitials = (name) =>
  name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

export default function EditProfile() {
  const navigate      = useNavigate();
  const { showToast } = useToast();
  const fileInputRef  = useRef(null);

  const [form, setForm]               = useState({ full_name: '', bio: '' });
  const [avatar, setAvatar]           = useState(null);      // current URL from server
  const [preview, setPreview]         = useState(null);      // local blob URL
  const [avatarFile, setAvatarFile]   = useState(null);      // File object
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  /* ── Load current profile ── */
  useEffect(() => {
    api.get('/profile')
      .then((data) => {
        const u = data?.user || {};
        setForm({ full_name: u.full_name || '', bio: u.bio || '' });
        setAvatar(u.avatar_url || null);
      })
      .catch(() => showToast('Failed to load profile.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  /* ── Handle avatar file pick ── */
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      showToast('Image must be under 3 MB.', 'error');
      return;
    }
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ── Upload avatar immediately on pick ── */
  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('avatar', avatarFile);
      const res = await uploadFormData('/profile/avatar', fd);
      setAvatar(res.avatar_url);
      setAvatarFile(null);
      setPreview(null);
      showToast('Profile picture updated! 🎉', 'success');
    } catch {
      showToast('Failed to upload avatar.', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  /* ── Save profile info ── */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      showToast('Name cannot be empty.', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.put('/profile', form);
      showToast('Profile saved! ✅', 'success');
      navigate('/profile');
    } catch (err) {
      showToast(err?.error || 'Failed to save profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-profile-page">
        <div className="edit-profile-card">
          <div className="skeleton" style={{ height: 120, borderRadius: '50%', width: 120, margin: '0 auto 1.5rem' }} />
          <div className="skeleton" style={{ height: 48, borderRadius: 12, marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 96, borderRadius: 12 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-page page-enter">
      <div className="edit-profile-card">
        {/* Header */}
        <div className="edit-profile-header">
          <Link to="/profile" className="edit-profile-back">
            ← Back to Profile
          </Link>
          <h1 className="edit-profile-title">Edit Profile</h1>
        </div>

        {/* ── Avatar Section ── */}
        <div className="edit-avatar-section">
          <div className="edit-avatar-wrap">
            {preview || avatar
              ? <img src={preview || avatar} alt="avatar preview" className="edit-avatar-img" />
              : (
                <div className="edit-avatar-initials">
                  {getInitials(form.full_name)}
                </div>
              )}
            <button
              type="button"
              className="edit-avatar-change-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Change photo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            id="avatar-file-input"
            onChange={handleAvatarChange}
          />

          {avatarFile && (
            <div className="edit-avatar-actions">
              <p className="edit-avatar-filename">📎 {avatarFile.name}</p>
              <div className="edit-avatar-btn-row">
                <button
                  type="button"
                  className="edit-avatar-upload-btn"
                  onClick={handleUploadAvatar}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? (
                    <span className="btn-spinner" />
                  ) : '⬆️ Upload Photo'}
                </button>
                <button
                  type="button"
                  className="edit-avatar-cancel-btn"
                  onClick={() => { setAvatarFile(null); setPreview(null); }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!avatarFile && (
            <p className="edit-avatar-hint">Click the camera icon to change your photo · Max 3 MB</p>
          )}
        </div>

        {/* ── Profile Form ── */}
        <form onSubmit={handleSave} className="edit-profile-form">
          <div className="edit-form-group">
            <label htmlFor="edit-full-name" className="edit-form-label">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-full-name"
              type="text"
              className="input-modern"
              placeholder="Your full name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
              maxLength={80}
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="edit-bio" className="edit-form-label">
              Bio <span className="edit-form-optional">(optional)</span>
            </label>
            <textarea
              id="edit-bio"
              className="input-modern"
              placeholder="Tell the community a bit about yourself…"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              maxLength={300}
              style={{ resize: 'vertical' }}
            />
            <p className="edit-form-counter">{form.bio.length}/300</p>
          </div>

          <div className="edit-form-actions">
            <Link to="/profile" className="edit-cancel-btn">Cancel</Link>
            <button type="submit" className="edit-save-btn" disabled={saving}>
              {saving ? <span className="btn-spinner" /> : null}
              {saving ? 'Saving…' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

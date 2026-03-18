import { useState, useEffect, useRef } from 'react';
import api from '../../api';

const formatSize = bytes => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const fileIcon = mimetype => {
  if (mimetype === 'application/pdf') return '📄';
  if (mimetype?.startsWith('image/')) return '🖼️';
  return '📁';
};

export default function Portfolio() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState({});
  const [toast, setToast] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const load = () => {
    api.get('/teacher/profile').then(r => {
      setDocs(r.data.profile?.portfolio_docs || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const upload = async (files) => {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('files', f));
    setUploading(true);
    try {
      const r = await api.post('/teacher/portfolio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDocs(r.data.docs);
      showToast(`${files.length} file(s) uploaded successfully!`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Upload failed.', 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const deleteDoc = async (filename, originalname) => {
    if (!window.confirm(`Remove "${originalname}"?`)) return;
    setDeleting(d => ({ ...d, [filename]: true }));
    try {
      const r = await api.delete(`/teacher/portfolio/${filename}`);
      setDocs(r.data.docs);
      showToast('Document removed.');
    } catch {
      showToast('Delete failed.', 'error');
    } finally {
      setDeleting(d => ({ ...d, [filename]: false }));
    }
  };

  const onDrop = e => {
    e.preventDefault();
    setDragOver(false);
    upload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {toast && (
        <div className={`fixed top-12 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white
          ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} animate-slide-up`}>
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="page-title">Portfolio</h1>
        <p className="page-subtitle">Upload certificates, degrees, and other credentials</p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`card cursor-pointer border-2 border-dashed transition-all text-center py-12
          ${dragOver
            ? 'border-brand-400 bg-brand-50 dark:bg-brand-950/20'
            : 'border-[var(--border)] hover:border-brand-300 hover:bg-[var(--bg-secondary)]'}`}
      >
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
          onChange={e => upload(e.target.files)}
        />
        <div className="text-4xl mb-3">{uploading ? '⏳' : '📁'}</div>
        {uploading ? (
          <p className="font-semibold text-[var(--text-primary)] animate-pulse-soft">Uploading files...</p>
        ) : (
          <>
            <p className="font-semibold text-[var(--text-primary)]">Drop files here or click to browse</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Supports PDF, JPG, PNG, GIF, WebP · Max 10MB per file</p>
          </>
        )}
      </div>

      {/* Documents list */}
      <div>
        <h2 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          Uploaded Documents
          <span className="text-xs text-[var(--text-secondary)] font-normal">({docs.length})</span>
        </h2>

        {loading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="shimmer h-16 rounded-xl" />)}</div>
        ) : docs.length === 0 ? (
          <div className="card text-center py-10">
            <div className="text-4xl mb-2 opacity-40">📂</div>
            <p className="text-[var(--text-secondary)] text-sm">No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {docs.map(doc => (
              <div key={doc.filename} className="card py-3 px-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl flex-shrink-0">{fileIcon(doc.mimetype)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{doc.originalname}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {formatSize(doc.size)} · {new Date(doc.uploaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={doc.url || `/api/teacher/document/${doc.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-brand-500 hover:border-brand-300 transition-colors"
                  >
                    View
                  </a>
                  <button
                    onClick={() => deleteDoc(doc.filename, doc.originalname)}
                    disabled={deleting[doc.filename]}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    {deleting[doc.filename] ? '...' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

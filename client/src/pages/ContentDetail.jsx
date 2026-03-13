import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getContentById, deleteContent, downloadContent } from '../services/contentApi';

const isSafeMediaUrl = (url) => typeof url === 'string' && url.startsWith('/uploads/');

export default function ContentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getContentById(id)
      .then(({ data }) => setContent(data.data))
      .catch(() => setError('Content not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this content?')) return;
    try {
      await deleteContent(id);
      navigate('/history');
    } catch {
      setError('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{error || 'Content not found'}</p>
        <Link
          to="/history"
          className="inline-block gradient-bg text-white font-semibold px-6 py-2.5 rounded-full shadow-md shadow-purple-500/20 transition-all"
        >
          Back to History
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            to="/history"
            className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-3 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to History
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Detail</h1>
        </div>
        <button
          onClick={handleDelete}
          className="text-sm font-medium text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-800/50 cursor-pointer transition-all"
        >
          Delete
        </button>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/30">
          {content.type === 'POST' ? 'Post' : 'Video'}
        </span>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border border-green-200/50 dark:border-green-800/30">
          {content.status.charAt(0) + content.status.slice(1).toLowerCase()}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {new Date(content.createdAt).toLocaleString()}
        </span>
      </div>

      {/* Prompt */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Prompt</h2>
        <p className="text-gray-900 dark:text-white leading-relaxed">{content.prompt}</p>
      </div>

      {/* Media + Text */}
      <div className={content.type === 'POST' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-6'}>
        {/* Media */}
        {content.mediaUrl && isSafeMediaUrl(content.mediaUrl) && (
          <div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {content.type === 'VIDEO' ? (
                <video
                  src={`${import.meta.env.VITE_API_URL}${content.mediaUrl}`}
                  controls
                  className="w-full"
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_API_URL}${content.mediaUrl}`}
                  alt="Generated content"
                  className="w-full"
                />
              )}
            </div>
            <button
              onClick={() => downloadContent(content.id, content.type === 'VIDEO' ? 'aima-video.mp4' : 'aima-image.png')}
              className="mt-3 inline-flex items-center gap-2 gradient-bg text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/25 cursor-pointer transition-all text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download {content.type === 'VIDEO' ? 'Video' : 'Image'}
            </button>
          </div>
        )}

        {/* Generated Text */}
        {content.generatedText && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Generated Text</h2>
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {content.generatedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

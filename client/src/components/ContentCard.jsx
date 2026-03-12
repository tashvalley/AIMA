import { Link } from 'react-router-dom';

const isSafeMediaUrl = (url) => typeof url === 'string' && url.startsWith('/uploads/');

const statusColors = {
  COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  GENERATING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  PENDING: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  FAILED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const typeLabels = {
  POST: 'Post',
  VIDEO: 'Video',
};

export default function ContentCard({ content, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Media preview */}
      {content.mediaUrl && content.status === 'COMPLETED' && isSafeMediaUrl(content.mediaUrl) && (
        <div className="aspect-video bg-gray-100 dark:bg-gray-700">
          {content.type === 'VIDEO' ? (
            <video
              src={`${import.meta.env.VITE_API_URL}${content.mediaUrl}`}
              className="w-full h-full object-cover"
              controls
            />
          ) : (
            <img
              src={`${import.meta.env.VITE_API_URL}${content.mediaUrl}`}
              alt="Generated content"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
            {typeLabels[content.type]}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[content.status]}`}>
            {content.status.toLowerCase()}
          </span>
        </div>
        <p className="text-sm text-gray-900 dark:text-white font-medium line-clamp-2">
          {content.prompt}
        </p>
        {content.generatedText && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">
            {content.generatedText}
          </p>
        )}
        {content.errorMessage && (
          <p className="text-xs text-red-500 mt-2">{content.errorMessage}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400">
            {new Date(content.createdAt).toLocaleDateString()}
          </span>
          {onDelete && (
            <button
              onClick={() => onDelete(content.id)}
              className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

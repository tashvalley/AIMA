const isSafeMediaUrl = (url) => typeof url === 'string' && url.startsWith('/uploads/');

const statusColors = {
  COMPLETED: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border border-green-200/50 dark:border-green-800/30',
  GENERATING: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-800/30',
  PENDING: 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700',
  FAILED: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200/50 dark:border-red-800/30',
};

const typeLabels = {
  POST: 'Post',
  VIDEO: 'Video',
};

export default function ContentCard({ content, onDelete }) {
  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden hover:border-purple-200 dark:hover:border-purple-800/50 hover:shadow-lg hover:shadow-purple-500/[0.05] transition-all">
      {/* Media preview */}
      {content.mediaUrl && content.status === 'COMPLETED' && isSafeMediaUrl(content.mediaUrl) && (
        <div className="aspect-video bg-gray-100 dark:bg-gray-800">
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
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/30">
            {typeLabels[content.type]}
          </span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[content.status]}`}>
            {content.status.charAt(0) + content.status.slice(1).toLowerCase()}
          </span>
        </div>
        <p className="text-sm text-gray-900 dark:text-white font-medium line-clamp-2 leading-relaxed">
          {content.prompt}
        </p>
        {content.generatedText && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-3 leading-relaxed">
            {content.generatedText}
          </p>
        )}
        {content.errorMessage && (
          <p className="text-xs text-red-500 mt-2">{content.errorMessage}</p>
        )}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(content.createdAt).toLocaleDateString()}
          </span>
          {onDelete && (
            <button
              onClick={() => onDelete(content.id)}
              className="text-xs font-medium text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 cursor-pointer transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

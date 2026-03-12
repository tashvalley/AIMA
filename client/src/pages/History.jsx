import { useState, useEffect, useCallback } from 'react';
import { getContentHistory, deleteContent } from '../services/contentApi';
import ContentCard from '../components/ContentCard';

const filters = [
  { key: '', label: 'All' },
  { key: 'POST', label: 'Posts' },
  { key: 'VIDEO', label: 'Videos' },
];

export default function History() {
  const [contents, setContents] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (filter) params.type = filter;
      const { data } = await getContentHistory(params);
      setContents(data.data.contents);
      setTotalPages(data.data.totalPages);
    } catch {
      // handled silently
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this content?')) return;
    try {
      await deleteContent(id);
      setContents((prev) => prev.filter((c) => c.id !== id));
    } catch {
      // handled silently
    }
  };

  const handleFilterChange = (key) => {
    setFilter(key);
    setPage(1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content History</h1>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        Browse your previously generated content.
      </p>

      {/* Filters */}
      <div className="mt-6 flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => handleFilterChange(f.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
              filter === f.key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : contents.length === 0 ? (
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
          <p>No content yet. Start by creating something!</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => (
              <ContentCard key={content.id} content={content} onDelete={handleDelete} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

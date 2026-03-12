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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content History</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Browse your previously generated content.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl w-fit border border-gray-200/50 dark:border-gray-800">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => handleFilterChange(f.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all ${
              filter === f.key
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="mt-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
        </div>
      ) : contents.length === 0 ? (
        <div className="mt-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No content yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start by creating something!</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {contents.map((content) => (
              <ContentCard key={content.id} content={content} onDelete={handleDelete} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-purple-200 dark:hover:border-purple-800/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-purple-200 dark:hover:border-purple-800/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
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

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getContentHistory } from '../services/contentApi';

export default function Dashboard() {
  const { user } = useAuth();
  const [postCount, setPostCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);

  useEffect(() => {
    getContentHistory({ type: 'POST', limit: 1 })
      .then(({ data }) => setPostCount(data.data.total))
      .catch(() => {});
    getContentHistory({ type: 'VIDEO', limit: 1 })
      .then(({ data }) => setVideoCount(data.data.total))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Welcome, {user?.name}
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Your AI content dashboard. Start creating something amazing.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/create" className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-900 dark:text-white">Posts</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate images with text</p>
          <div className="mt-4 text-3xl font-bold text-indigo-600 dark:text-indigo-400">{postCount}</div>
        </Link>
        <Link to="/create" className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-900 dark:text-white">Videos</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate short videos with text</p>
          <div className="mt-4 text-3xl font-bold text-indigo-600 dark:text-indigo-400">{videoCount}</div>
        </Link>
        <Link to="/history" className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-900 dark:text-white">Total Content</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View all generated content</p>
          <div className="mt-4 text-3xl font-bold text-indigo-600 dark:text-indigo-400">{postCount + videoCount}</div>
        </Link>
      </div>
    </div>
  );
}

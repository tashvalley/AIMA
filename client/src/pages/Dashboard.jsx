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

  const cards = [
    {
      to: '/create',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      ),
      title: 'Posts',
      desc: 'Generate images with text',
      count: postCount,
    },
    {
      to: '/create',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
      ),
      title: 'Videos',
      desc: 'Generate short videos with text',
      count: videoCount,
    },
    {
      to: '/history',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
      title: 'All Content',
      desc: 'View your content library',
      count: postCount + videoCount,
    },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Your AI content dashboard. Create something amazing today.
        </p>
      </div>

      {/* Quick Action */}
      <Link
        to="/create"
        className="group block mb-8 relative overflow-hidden rounded-2xl gradient-bg p-8 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/25 transition-all"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <h2 className="text-xl font-bold">Create New Content</h2>
          </div>
          <p className="text-white/80 text-sm">Generate AI-powered posts, images, and videos from a single prompt.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
      </Link>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800/50 transition-all hover:shadow-lg hover:shadow-purple-500/[0.05]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:gradient-bg group-hover:text-white transition-colors">
                {card.icon}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{card.count}</div>
            <div className="mt-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{card.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{card.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

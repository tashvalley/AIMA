import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold gradient-text">404</h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Page not found</p>
        <Link
          to="/"
          className="mt-8 inline-block gradient-bg text-white font-semibold px-6 py-2.5 rounded-full shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/25 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

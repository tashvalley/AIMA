import { useState } from 'react';
import { generatePost, generateVideo } from '../services/contentApi';

const tabs = [
  { key: 'POST', label: 'Post (Image + Text)' },
  { key: 'VIDEO', label: 'Video (Video + Text)' },
];

export default function Create() {
  const [activeTab, setActiveTab] = useState('POST');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const { data } =
        activeTab === 'POST'
          ? await generatePost(prompt)
          : await generateVideo(prompt);
      setResult(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Content</h1>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        Generate AI-powered content from a single prompt.
      </p>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setResult(null); setError(''); }}
            className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
              activeTab === tab.key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Prompt form */}
      <form onSubmit={handleGenerate} className="mt-6 max-w-2xl">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Describe what you want to create
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          required
          placeholder={
            activeTab === 'POST'
              ? 'e.g., A vibrant sunset over a mountain lake with inspirational text about perseverance...'
              : 'e.g., A cinematic shot of ocean waves crashing on a rocky shore at golden hour...'
          }
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {activeTab === 'POST' ? 'Generating post...' : 'Generating video...'}
            </span>
          ) : (
            `Generate ${activeTab === 'POST' ? 'Post' : 'Video'}`
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-6 max-w-2xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Result */}
      {result && result.status === 'COMPLETED' && (
        <div className="mt-8 max-w-4xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generated Content</h2>
          <div className={activeTab === 'POST' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
            {/* Media */}
            {result.mediaUrl && (
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                {result.type === 'VIDEO' ? (
                  <video
                    src={`${import.meta.env.VITE_API_URL}${result.mediaUrl}`}
                    controls
                    className="w-full"
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${result.mediaUrl}`}
                    alt={result.prompt}
                    className="w-full"
                  />
                )}
              </div>
            )}
            {/* Text */}
            {result.generatedText && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {result.generatedText}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Failed result */}
      {result && result.status === 'FAILED' && (
        <div className="mt-6 max-w-2xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          Generation failed: {result.errorMessage || 'Unknown error'}
        </div>
      )}
    </div>
  );
}

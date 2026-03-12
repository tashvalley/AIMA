import { useState } from 'react';
import { generatePost, generateVideo } from '../services/contentApi';

const isSafeMediaUrl = (url) => typeof url === 'string' && url.startsWith('/uploads/');

const tabs = [
  { key: 'POST', label: 'Image Post', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
    </svg>
  )},
  { key: 'VIDEO', label: 'Video', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
  )},
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
      const msg = err.response?.data?.message || 'Generation failed. Please try again.';
      setError(typeof msg === 'string' ? msg.slice(0, 200) : 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Content</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Generate AI-powered content from a single prompt.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl w-fit border border-gray-200/50 dark:border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setResult(null); setError(''); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all ${
              activeTab === tab.key
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Prompt Form */}
      <form onSubmit={handleGenerate} className="mt-6 max-w-2xl">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
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
            maxLength={10000}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-shadow"
          />
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-500">{prompt.length.toLocaleString()} / 10,000</span>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="gradient-bg text-white px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                `Generate ${activeTab === 'POST' ? 'Post' : 'Video'}`
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-6 max-w-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm border border-red-200 dark:border-red-800/30">
          {error}
        </div>
      )}

      {/* Result */}
      {result && result.status === 'COMPLETED' && (
        <div className="mt-8 max-w-4xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generated Content</h2>
          <div className={activeTab === 'POST' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
            {/* Media */}
            {result.mediaUrl && isSafeMediaUrl(result.mediaUrl) && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
                {result.type === 'VIDEO' ? (
                  <video
                    src={`${import.meta.env.VITE_API_URL}${result.mediaUrl}`}
                    controls
                    className="w-full"
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${result.mediaUrl}`}
                    alt="Generated content"
                    className="w-full"
                  />
                )}
              </div>
            )}
            {/* Text */}
            {result.generatedText && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {result.generatedText}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Failed */}
      {result && result.status === 'FAILED' && (
        <div className="mt-6 max-w-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm border border-red-200 dark:border-red-800/30">
          Generation failed: {result.errorMessage || 'Unknown error'}
        </div>
      )}
    </div>
  );
}

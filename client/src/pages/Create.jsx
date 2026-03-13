import { useState } from 'react';
import { generatePost, generateVideo, downloadContent } from '../services/contentApi';

const isSafeMediaUrl = (url) => typeof url === 'string' && url.startsWith('/uploads/');

const IMAGE_RATIOS = [
  { value: '16:9', label: '16:9', desc: 'Landscape', w: 32, h: 18 },
  { value: '4:3', label: '4:3', desc: 'Standard', w: 28, h: 21 },
  { value: '1:1', label: '1:1', desc: 'Square', w: 24, h: 24 },
  { value: '3:4', label: '3:4', desc: 'Portrait', w: 21, h: 28 },
  { value: '9:16', label: '9:16', desc: 'Tall', w: 18, h: 32 },
];

const VIDEO_RATIOS = [
  { value: '16:9', label: '16:9', desc: 'Landscape', w: 32, h: 18 },
  { value: '9:16', label: '9:16', desc: 'Portrait', w: 18, h: 32 },
];

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
  const [copied, setCopied] = useState(false);
  const [withAudio, setWithAudio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState('16:9');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const { data } =
        activeTab === 'POST'
          ? await generatePost(prompt, aspectRatio)
          : await generateVideo(prompt, withAudio, aspectRatio);
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
            onClick={() => { setActiveTab(tab.key); setResult(null); setError(''); setAspectRatio('16:9'); }}
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
          {/* Aspect ratio selector */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Aspect ratio</p>
            <div className="flex gap-2 flex-wrap">
              {(activeTab === 'POST' ? IMAGE_RATIOS : VIDEO_RATIOS).map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setAspectRatio(r.value)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all ${
                    aspectRatio === r.value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 shadow-sm shadow-purple-500/10'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div
                    className={`rounded-sm ${
                      aspectRatio === r.value
                        ? 'border-2 border-purple-500'
                        : 'border-2 border-gray-300 dark:border-gray-500'
                    }`}
                    style={{ width: `${r.w * 0.65}px`, height: `${r.h * 0.65}px` }}
                  />
                  <div className="text-left">
                    <p className={`text-xs font-semibold ${aspectRatio === r.value ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}>{r.label}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Audio toggle — video only */}
          {activeTab === 'VIDEO' && (
            <div className="mt-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Generate with sound</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{withAudio ? 'Veo 3 — dialogue, SFX & ambient audio' : 'Veo 2 — silent video, lower cost'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWithAudio(!withAudio)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${withAudio ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${withAudio ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          )}

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
              <div>
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
                <button
                  onClick={() => downloadContent(result.id, result.type === 'VIDEO' ? 'aima-video.mp4' : 'aima-image.png')}
                  className="mt-3 inline-flex items-center gap-2 gradient-bg text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/25 cursor-pointer transition-all text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download {result.type === 'VIDEO' ? 'Video' : 'Image'}
                </button>
              </div>
            )}
            {/* Text */}
            {result.generatedText && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Generated Text</h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result.generatedText);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-purple-500 dark:text-gray-500 dark:hover:text-purple-400 cursor-pointer transition-colors"
                  >
                    {copied ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
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

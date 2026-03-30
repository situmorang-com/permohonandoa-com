export default function PreviewIcon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-serif text-slate-900 dark:text-white mb-8">
          Praying Hands Icon
        </h1>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-12 mb-8 inline-block">
          <svg
            viewBox="0 0 100 140"
            className="w-32 h-44 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <defs>
              <linearGradient id="handGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#4338ca', stopOpacity: 1 }} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Light rays from above */}
            <g opacity="0.4" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
              <line x1="50" y1="2" x2="50" y2="12"/>
              <line x1="32" y1="6" x2="22" y2="18"/>
              <line x1="68" y1="6" x2="78" y2="18"/>
            </g>

            {/* Left palm */}
            <path d="M 35 20
                     C 30 24 28 32 28 42
                     L 28 100
                     C 28 108 32 115 38 120
                     L 50 125
                     C 50 120 50 112 50 100
                     L 50 40
                     C 50 28 44 22 38 20
                     Z"
                  fill="url(#handGradient)" stroke="#4338ca" strokeWidth="1.5" filter="url(#glow)"/>

            {/* Left hand fingers/knuckles */}
            <g fill="#6366f1" opacity="0.9">
              <circle cx="32" cy="26" r="3"/>
              <circle cx="35" cy="23" r="3"/>
              <circle cx="40" cy="21" r="3"/>
              <circle cx="44" cy="20" r="3"/>
            </g>

            {/* Right palm */}
            <path d="M 65 20
                     C 70 24 72 32 72 42
                     L 72 100
                     C 72 108 68 115 62 120
                     L 50 125
                     C 50 120 50 112 50 100
                     L 50 40
                     C 50 28 56 22 62 20
                     Z"
                  fill="url(#handGradient)" stroke="#4338ca" strokeWidth="1.5" filter="url(#glow)"/>

            {/* Right hand fingers/knuckles */}
            <g fill="#6366f1" opacity="0.9">
              <circle cx="68" cy="26" r="3"/>
              <circle cx="65" cy="23" r="3"/>
              <circle cx="60" cy="21" r="3"/>
              <circle cx="56" cy="20" r="3"/>
            </g>

            {/* Subtle glow at base */}
            <ellipse cx="50" cy="130" rx="35" ry="8" fill="#6366f1" opacity="0.15"/>

            {/* Inner light accent */}
            <path d="M 42 50 Q 50 45 58 50" stroke="#c7d2fe" strokeWidth="2" opacity="0.5" strokeLinecap="round"/>
          </svg>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-lg mb-8">
          Ready to use in your logo
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="/praying-hands.svg"
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold transition"
          >
            Download SVG
          </a>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

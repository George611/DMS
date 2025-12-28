import { useState } from 'react';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSelector = () => {
    const { language: langCode, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', label: 'English', color: 'bg-blue-500' },
        { code: 'es', label: 'Español', color: 'bg-yellow-500' },
        { code: 'fr', label: 'Français', color: 'bg-indigo-500' },
        { code: 'ar', label: 'العربية', color: 'bg-emerald-500' },
    ];

    const currentLang = languages.find(l => l.code === langCode);

    const handleSelect = (code) => {
        setLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="relative font-sans z-50">
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px]"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Main Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`lang-btn ${isOpen ? 'active' : ''}`}
                aria-label="Change Language"
            >
                {/* Language Badge */}
                <div className={`lang-icon ${currentLang?.color}`}>
                    {currentLang?.code.toUpperCase()}
                </div>

                <div className="lang-text">
                    <span className="lang-label">Lang</span>
                    <span className="lang-name">{currentLang?.label}</span>
                </div>

                <FaChevronDown
                    className={`chevron ${isOpen ? 'open' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="lang-dropdown animate-slide-up-fade">
                    <div className="dropdown-content">
                        {languages.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => handleSelect(l.code)}
                                className={`lang-option ${langCode === l.code ? 'selected' : ''}`}
                            >
                                <div className={`option-icon ${l.color}`}>
                                    {l.code.toUpperCase()}
                                </div>

                                <span className="option-label">
                                    {l.label}
                                </span>

                                {langCode === l.code && (
                                    <div className="option-check" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
        .relative { position: relative; }
        .z-50 { z-index: 50; }
        .fixed { position: fixed; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .z-40 { z-index: 40; }
        .bg-black\/5 { background-color: rgba(0, 0, 0, 0.05); }
        .backdrop-blur-\[1px\] { backdrop-filter: blur(1px); }

        .lang-btn {
          position: relative;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.375rem 0.5rem 0.375rem 0.375rem;
          padding-inline-end: 1rem;
          border-radius: 9999px;
          transition: all 0.3s ease;
          border: 1px solid var(--border);
          background-color: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(8px);
          color: var(--text-main);
        }
        
        [data-theme="dark"] .lang-btn {
          background-color: rgba(30, 41, 59, 0.5);
        }

        .lang-btn:hover {
          background-color: var(--bg-surface);
          border-color: var(--primary);
          box-shadow: var(--shadow-sm);
        }

        .lang-btn.active {
          background-color: var(--bg-surface);
          border-color: var(--primary);
          box-shadow: var(--shadow-md);
        }

        .lang-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .lang-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1;
          gap: 0.125rem;
        }
        [dir="rtl"] .lang-text {
          align-items: flex-start;
        }

        .lang-label {
          font-size: 0.625rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 700;
        }

        .lang-name {
          font-size: 0.875rem;
          font-weight: 700;
        }

        .chevron {
          margin-inline-start: 0.25rem;
          font-size: 0.625rem;
          color: var(--text-muted);
          transition: transform 0.3s;
        }
        .chevron.open {
          transform: rotate(180deg);
          color: var(--primary);
        }

        .lang-dropdown {
          position: absolute;
          inset-inline-end: 0;
          top: 100%;
          margin-top: 0.75rem;
          width: 14rem;
          background-color: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 1rem;
          box-shadow: var(--shadow-xl);
          z-index: 50;
          overflow: hidden;
          padding: 0.5rem;
        }

        .dropdown-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .lang-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          text-align: start;
          padding: 0.75rem;
          border-radius: 0.75rem;
          transition: all 0.2s;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          color: inherit;
        }

        .lang-option:hover {
          background-color: var(--bg-surface-2);
        }

        .lang-option.selected {
          background-color: var(--bg-surface-2);
          border-color: var(--border);
          box-shadow: var(--shadow-sm);
        }

        .option-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
          box-shadow: var(--shadow-sm);
        }

        .option-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .selected .option-label {
          color: var(--primary);
        }

        .option-check {
          margin-inline-start: auto;
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 50%;
          background-color: var(--primary);
        }

        .bg-blue-500 { background-color: #3b82f6; }
        .bg-yellow-500 { background-color: #eab308; }
        .bg-indigo-500 { background-color: #6366f1; }
        .bg-emerald-500 { background-color: #10b981; }

        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-up-fade {
          animation: slideUpFade 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
        </div>
    );
};

export default LanguageSelector;

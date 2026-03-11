import { useState, useEffect, useRef, useCallback } from 'react';
import { sections, topicsTable } from './data';

/* ── Theme Hook ── */
function useTheme() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
    return { theme, toggleTheme };
}

/* ── Sun Icon ── */
function SunIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
    );
}

/* ── Moon Icon ── */
function MoonIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}

/* ── Code Block Component ── */
function CodeBlock({ code }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="code-block">
            <div className="code-header">
                <div className="code-dots">
                    <span className="dot-red" />
                    <span className="dot-yellow" />
                    <span className="dot-green" />
                </div>
                <span className="code-lang">JavaScript</span>
                <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
                    {copied ? '✓ Copied!' : 'Copy'}
                </button>
            </div>
            <pre><code>{code}</code></pre>
        </div>
    );
}

/* ── Question Card ── */
function QuestionCard({ question, qNumber, sectionColor, isActiveQ, onVisible }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (isActiveQ && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setOpen(true);
        }
    }, [isActiveQ]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) onVisible(question.id); },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [question.id, onVisible]);

    return (
        <div
            ref={ref}
            id={question.id}
            className={`question-card ${open ? 'open' : ''}`}
        >
            <button className="question-header" onClick={() => setOpen(o => !o)}>
                <div className="q-number" style={{ background: `${sectionColor}22`, color: sectionColor, borderColor: `${sectionColor}44` }}>
                    Q{qNumber}
                </div>
                <span className="question-text">{question.question}</span>
                <span className="q-toggle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            {open && (
                <div className="question-body">
                    <p className="answer-text">{question.answer}</p>

                    {question.keyPoints?.length > 0 && (
                        <div className="key-points">
                            <div className="key-points-title">⚡ Key Points</div>
                            <ul>
                                {question.keyPoints.map((pt, i) => (
                                    <li key={i}>{pt}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <CodeBlock code={question.code} />
                </div>
            )}
        </div>
    );
}

/* ── Sidebar ── */
function Sidebar({ activeSection, activeQ, onSectionClick, onQClick, sidebarOpen, setSidebarOpen, theme, toggleTheme }) {
    const [expandedSection, setExpandedSection] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setExpandedSection(activeSection);
    }, [activeSection]);

    const filtered = search.trim()
        ? sections.map(s => ({
            ...s,
            questions: s.questions.filter(q =>
                q.question.toLowerCase().includes(search.toLowerCase())
            )
        })).filter(s => s.questions.length > 0)
        : sections;

    return (
        <>
            <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                {/* Logo + Theme Toggle */}
                <div className="sidebar-logo">
                    <span style={{ fontSize: '1.5rem' }}>🚀</span>
                    <div className="sidebar-logo-text">
                        Interview Guide
                        <span>JS · React · Next.js</span>
                    </div>
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </button>
                </div>

                {/* Search */}
                <div className="search-bar">
                    <input
                        className="search-input"
                        placeholder="🔍 Search questions..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Nav */}
                {filtered.map(section => (
                    <div key={section.id} className="sidebar-section-group">
                        <button
                            className={`sidebar-section-btn ${activeSection === section.id ? 'active' : ''}`}
                            onClick={() => {
                                setExpandedSection(prev => prev === section.id ? null : section.id);
                                onSectionClick(section.id);
                                if (window.innerWidth < 900) setSidebarOpen(false);
                            }}
                        >
                            <span className="emoji">{section.emoji}</span>
                            {section.title}
                        </button>

                        {(expandedSection === section.id || search) && (
                            <div className="sidebar-q-list">
                                {section.questions.map((q, i) => (
                                    <button
                                        key={q.id}
                                        className={`sidebar-q-btn ${activeQ === q.id ? 'active' : ''}`}
                                        onClick={() => {
                                            onQClick(q.id);
                                            if (window.innerWidth < 900) setSidebarOpen(false);
                                        }}
                                    >
                                        {i + 1}. {q.question.length > 40 ? q.question.slice(0, 40) + '…' : q.question}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </aside>
        </>
    );
}

/* ── Hero ── */
function Hero() {
    const totalQ = sections.reduce((acc, s) => acc + s.questions.length, 0);

    const scrollDown = () => {
        document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="hero">
            <div className="hero-bg" />
            <div className="hero-grid" />
            <div className="hero-content">
                <div className="hero-badge">
                    <span>⭐</span> Complete Interview Preparation Guide
                </div>
                <h1>JS + React + Next.js<br />Interview Prep</h1>
                <p className="hero-sub">
                    Master {totalQ} of the most frequently asked interview questions
                    with detailed explanations and real code examples.
                </p>
                <div className="hero-tags">
                    <span className="hero-tag js">JavaScript</span>
                    <span className="hero-tag react">React 18+</span>
                    <span className="hero-tag next">Next.js 14/15</span>
                    <span className="hero-tag ts">TypeScript</span>
                </div>
                <div className="hero-stats">
                    <div className="hero-stat">
                        <div className="num">{totalQ}</div>
                        <div className="label">Questions</div>
                    </div>
                    <div className="hero-stat">
                        <div className="num">{sections.length}</div>
                        <div className="label">Sections</div>
                    </div>
                    <div className="hero-stat">
                        <div className="num">2026</div>
                        <div className="label">Updated</div>
                    </div>
                </div>
            </div>
            <button className="scroll-hint" onClick={scrollDown}>
                <span>Scroll to explore</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
        </div>
    );
}

/* ── App ── */
export default function App() {
    const [activeSection, setActiveSection] = useState(sections[0].id);
    const [activeQ, setActiveQ] = useState(null);
    const [targetQ, setTargetQ] = useState(null);
    const [progress, setProgress] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    // Track scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const el = document.documentElement;
            const scrolled = el.scrollTop;
            const total = el.scrollHeight - el.clientHeight;
            setProgress(total > 0 ? (scrolled / total) * 100 : 0);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSectionClick = (sectionId) => {
        setActiveSection(sectionId);
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleQClick = (qId) => {
        setTargetQ(qId);
        setTimeout(() => setTargetQ(null), 1000);
    };

    const handleQVisible = useCallback((qId) => {
        setActiveQ(qId);
        const section = sections.find(s => s.questions.some(q => q.id === qId));
        if (section) setActiveSection(section.id);
    }, []);

    // Global Q counter
    let globalQNum = 0;

    return (
        <>
            {/* Progress bar */}
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Mobile menu toggle */}
            <button className="mobile-toggle" onClick={() => setSidebarOpen(o => !o)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            </button>

            <Hero />

            <div className="app-layout" id="content">
                <Sidebar
                    activeSection={activeSection}
                    activeQ={activeQ}
                    onSectionClick={handleSectionClick}
                    onQClick={handleQClick}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />

                <main className="main-content">
                    {sections.map(section => (
                        <div key={section.id} id={section.id} className="section-block">
                            <div className="section-header">
                                <span className="section-emoji">{section.emoji}</span>
                                <div className="section-title-block">
                                    <h2 className="section-title">{section.title}</h2>
                                    <div className="section-count">{section.questions.length} questions</div>
                                    <div className="section-divider" style={{ background: section.color }} />
                                </div>
                            </div>

                            {section.questions.map(question => {
                                globalQNum++;
                                return (
                                    <QuestionCard
                                        key={question.id}
                                        question={question}
                                        qNumber={globalQNum}
                                        sectionColor={section.color}
                                        isActiveQ={targetQ === question.id}
                                        onVisible={handleQVisible}
                                    />
                                );
                            })}
                        </div>
                    ))}

                    {/* Summary section */}
                    <div className="summary-section">
                        <h2 className="summary-title">🎯 Top 10 Most Asked Topics</h2>
                        <p className="summary-sub">Quick-reference for your final prep session</p>
                        <div className="topics-grid">
                            {topicsTable.map((item, i) => (
                                <div key={i} className="topic-card">
                                    <div className="topic-num">{i + 1}</div>
                                    <div className="topic-content">
                                        <div className="topic-name">{item.topic}</div>
                                        <div className="topic-desc">{item.points}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="tip-box">
                            <span className="tip-icon">💡</span>
                            <div className="tip-content">
                                <div className="tip-title">Pro Interview Tip</div>
                                <div className="tip-text">
                                    Always <strong>think out loud</strong>. Explain your reasoning, mention trade-offs, and ask clarifying
                                    questions. Interviewers value <em>how you think</em>, not just the final answer.
                                    Practice saying &ldquo;That&rsquo;s a great question, let me think through it...&rdquo;
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer className="footer">
                        <p>
                            Built with ❤️ · Covers React 18+ · Next.js 14/15 App Router · TypeScript · March 2026
                        </p>
                        <p style={{ marginTop: '0.5rem' }}>
                            Good luck with your interview! 🚀
                        </p>
                    </footer>
                </main>
            </div>
        </>
    );
}

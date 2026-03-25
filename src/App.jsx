import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { sections, topicsTable } from './data';
import { assessments } from './assessments';

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

                    {question.references?.length > 0 && (
                        <div className="references">
                            <div className="references-title">📚 References</div>
                            <div className="references-list">
                                {question.references.map((ref, i) => (
                                    <a
                                        key={i}
                                        href={ref.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ref-link"
                                    >
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                        {ref.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* ── Sidebar ── */
function Sidebar({ activeSection, activeQ, onSectionClick, onQClick, sidebarOpen, setSidebarOpen, theme, toggleTheme, activeTab, setActiveTab }) {
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

                {/* Tab switcher */}
                <div className="sidebar-tabs">
                    <button
                        className={`sidebar-tab ${activeTab === 'guide' ? 'active' : ''}`}
                        onClick={() => setActiveTab('guide')}
                    >
                        📖 Guide
                    </button>
                    <button
                        className={`sidebar-tab ${activeTab === 'practice' ? 'active' : ''}`}
                        onClick={() => setActiveTab('practice')}
                    >
                        🧪 Practice
                    </button>
                </div>

                {activeTab === 'guide' && (
                    <>
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
                    </>
                )}

                {activeTab === 'practice' && (
                    <div className="sidebar-practice-list">
                        {assessments.map((a, i) => (
                            <button
                                key={a.id}
                                className="sidebar-practice-btn"
                                onClick={() => {
                                    document.getElementById(a.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    if (window.innerWidth < 900) setSidebarOpen(false);
                                }}
                            >
                                <span>{a.emoji}</span>
                                <span className="sp-title">{a.title}</span>
                                <span className={`sp-diff diff-${a.difficulty.toLowerCase()}`}>{a.difficulty}</span>
                            </button>
                        ))}
                    </div>
                )}
            </aside>
        </>
    );
}

/* ── Hero ── */
function Hero({ onTabChange }) {
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
                        <div className="num">{assessments.length}</div>
                        <div className="label">Assessments</div>
                    </div>
                    <div className="hero-stat">
                        <div className="num">2026</div>
                        <div className="label">Updated</div>
                    </div>
                </div>
                <div className="hero-ctas">
                    <button className="hero-cta primary" onClick={scrollDown}>
                        📖 Start Learning
                    </button>
                    <button className="hero-cta secondary" onClick={() => onTabChange('practice')}>
                        🧪 Practice Assessments
                    </button>
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

/* ══════════════════════════════════════════════
   LIVE DEMO COMPONENTS — Real API data
══════════════════════════════════════════════ */

/* ── Demo 1: Paginated Post Gallery ── */
const PER_PAGE = 6;
function PaginatedDemo() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(r => { if (!r.ok) throw new Error('Network error'); return r.json(); })
            .then(data => { if (!cancelled) { setPosts(data); setLoading(false); } })
            .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });
        return () => { cancelled = true; };
    }, []);

    const totalPages = Math.ceil(posts.length / PER_PAGE);
    const visible = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    if (error) return <div className="demo-error">⚠️ {error}</div>;

    return (
        <div className="demo-paginated">
            <div className="demo-posts-grid">
                {loading
                    ? Array.from({ length: PER_PAGE }, (_, i) => (
                        <div key={i} className="demo-post-skeleton">
                            <div className="skel-id-bar" /><div className="skel-title-bar" /><div className="skel-body-bar" />
                        </div>
                    ))
                    : visible.map(post => (
                        <div key={post.id} className="demo-post-card">
                            <div className="demo-post-id">#{post.id}</div>
                            <div className="demo-post-title">{post.title}</div>
                            <div className="demo-post-body">{post.body.slice(0, 70)}…</div>
                        </div>
                    ))
                }
            </div>
            {!loading && (
                <div className="demo-pagination">
                    <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
                    <span>Page <strong>{page}</strong> / {totalPages}</span>
                    <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next →</button>
                </div>
            )}
        </div>
    );
}

/* ── Demo 2: Live Search with Debounce ── */
function useDebounce(value, delay = 350) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

function Highlight({ text, query }) {
    if (!query.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return <span>{parts.map((p, i) => regex.test(p) ? <mark key={i} className="hl">{p}</mark> : <span key={i}>{p}</span>)}</span>;
}

function SearchDemo() {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const debounced = useDebounce(query, 350);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(r => r.json())
            .then(d => { setUsers(d); setLoading(false); });
    }, []);

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(debounced.toLowerCase()) ||
        u.email.toLowerCase().includes(debounced.toLowerCase())
    );

    return (
        <div className="demo-search">
            <div className="demo-search-bar">
                <span className="demo-search-icon">🔍</span>
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search name or email…"
                />
                {query && <button className="demo-clear" onClick={() => setQuery('')}>✕</button>}
            </div>
            {loading ? <p className="demo-hint">Loading users…</p> :
                filtered.length === 0 ? <p className="demo-empty">No users found for "{debounced}"</p> :
                    <ul className="demo-user-list">
                        {filtered.map(u => (
                            <li key={u.id} className="demo-user-item">
                                <div className="demo-avatar">{u.name[0]}</div>
                                <div>
                                    <div className="demo-uname"><Highlight text={u.name} query={debounced} /></div>
                                    <div className="demo-uemail"><Highlight text={u.email} query={debounced} /></div>
                                </div>
                            </li>
                        ))}
                    </ul>
            }
            <div className="demo-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>
        </div>
    );
}

/* ── Demo 3: Infinite Scroll ── */
function InfiniteDemo() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const sentinel = useRef(null);
    const loadingRef = useRef(false);

    const loadMore = useCallback(async () => {
        if (loadingRef.current || !hasMore) return;
        loadingRef.current = true;
        setLoading(true);
        try {
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${(page - 1) * 5}&_limit=5`);
            const data = await res.json();
            if (data.length < 5) setHasMore(false);
            setPosts(prev => [...prev, ...data]);
            setPage(p => p + 1);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [page, hasMore]);

    useEffect(() => {
        const el = sentinel.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) loadMore(); }, { rootMargin: '80px' });
        obs.observe(el);
        return () => obs.disconnect();
    }, [loadMore]);

    return (
        <div className="demo-infinite">
            {posts.map(p => (
                <div key={p.id} className="demo-feed-card">
                    <span className="demo-feed-id">#{p.id}</span>
                    <div className="demo-feed-title">{p.title}</div>
                </div>
            ))}
            <div ref={sentinel} className="demo-sentinel">
                {loading && <div className="demo-spinner">⟳ Loading more…</div>}
                {!hasMore && <div className="demo-all-done">✓ All posts loaded ({posts.length} total)</div>}
            </div>
        </div>
    );
}

/* ── Demo 4: Multi-Step Form ── */
const FORM_STEPS = ['Personal', 'Account', 'Review'];
function formReducer(s, a) {
    switch (a.type) {
        case 'UPDATE': return { ...s, data: { ...s.data, ...a.payload } };
        case 'NEXT': return { ...s, step: s.step + 1 };
        case 'BACK': return { ...s, step: s.step - 1 };
        case 'RESET': return { step: 0, data: { name: '', email: '', phone: '', username: '', password: '', confirm: '' } };
        default: return s;
    }
}
function validateStep(step, d) {
    const e = {};
    if (step === 0) {
        if (!d.name.trim()) e.name = 'Required';
        if (!/^[^@]+@[^@]+\.[^@]+$/.test(d.email)) e.email = 'Invalid email';
        if (!/^\d{10}$/.test(d.phone.replace(/\D/g, ''))) e.phone = '10 digits required';
    }
    if (step === 1) {
        if (d.username.length < 3) e.username = 'Min 3 chars';
        if (d.password.length < 8) e.password = 'Min 8 chars';
        if (d.password !== d.confirm) e.confirm = "Passwords don't match";
    }
    return e;
}
function FormDemo() {
    const [state, dispatch] = useReducer(formReducer, { step: 0, data: { name: '', email: '', phone: '', username: '', password: '', confirm: '' } });
    const [errors, setErrors] = useState({});
    const [done, setDone] = useState(false);
    const { step, data } = state;
    const ch = f => e => dispatch({ type: 'UPDATE', payload: { [f]: e.target.value } });
    const next = () => {
        const errs = validateStep(step, data);
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({}); dispatch({ type: 'NEXT' });
    };
    if (done) return (
        <div className="demo-success">
            <div className="demo-success-icon">🎉</div>
            <h4>Account Created!</h4>
            <p>Welcome, {data.name}!</p>
            <button onClick={() => { dispatch({ type: 'RESET' }); setDone(false); }}>Start Over</button>
        </div>
    );
    return (
        <div className="demo-wizard">
            <div className="demo-step-bar">
                {FORM_STEPS.map((s, i) => (
                    <div key={i} className={`demo-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                        <div className="demo-step-dot">{i < step ? '✓' : i + 1}</div>
                        <span>{s}</span>
                    </div>
                ))}
            </div>
            {step === 0 && <div className="demo-form-fields">
                <label>Name<input value={data.name} onChange={ch('name')} placeholder="John Doe" /></label>
                {errors.name && <span className="demo-err">{errors.name}</span>}
                <label>Email<input value={data.email} onChange={ch('email')} placeholder="john@example.com" /></label>
                {errors.email && <span className="demo-err">{errors.email}</span>}
                <label>Phone<input value={data.phone} onChange={ch('phone')} placeholder="10 digits" /></label>
                {errors.phone && <span className="demo-err">{errors.phone}</span>}
            </div>}
            {step === 1 && <div className="demo-form-fields">
                <label>Username<input value={data.username} onChange={ch('username')} /></label>
                {errors.username && <span className="demo-err">{errors.username}</span>}
                <label>Password<input type="password" value={data.password} onChange={ch('password')} /></label>
                {errors.password && <span className="demo-err">{errors.password}</span>}
                <label>Confirm<input type="password" value={data.confirm} onChange={ch('confirm')} /></label>
                {errors.confirm && <span className="demo-err">{errors.confirm}</span>}
            </div>}
            {step === 2 && <div className="demo-review">
                {[['Name', data.name], ['Email', data.email], ['Phone', data.phone], ['Username', data.username]].map(([k, v]) => (
                    <div key={k} className="demo-review-row"><span>{k}</span><strong>{v}</strong></div>
                ))}
            </div>}
            <div className="demo-form-nav">
                {step > 0 && <button className="demo-btn-back" onClick={() => dispatch({ type: 'BACK' })}>← Back</button>}
                {step < 2 ? <button className="demo-btn-next" onClick={next}>Next →</button>
                    : <button className="demo-btn-submit" onClick={() => setDone(true)}>Submit ✓</button>}
            </div>
        </div>
    );
}

/* ── Demo 5: Kanban Board ── */
const KB_COLS = ['todo', 'inprogress', 'done'];
const KB_LABELS = { todo: '📋 Todo', inprogress: '⚡ In Progress', done: '✅ Done' };
const KB_INIT = {
    todo: [{ id: 1, text: 'Design wireframes' }, { id: 2, text: 'Set up project' }],
    inprogress: [{ id: 3, text: 'Build API layer' }],
    done: [{ id: 4, text: 'Write user stories' }],
};
function KanbanDemo() {
    const [cols, setCols] = useState(KB_INIT);
    const [newCard, setNewCard] = useState('');
    const dragging = useRef(null);
    const addCard = () => {
        if (!newCard.trim()) return;
        setCols(p => ({ ...p, todo: [...p.todo, { id: Date.now(), text: newCard.trim() }] }));
        setNewCard('');
    };
    const del = (col, id) => setCols(p => ({ ...p, [col]: p[col].filter(c => c.id !== id) }));
    const drop = target => {
        const { col: from, id } = dragging.current || {};
        if (!from || from === target) return;
        const card = cols[from].find(c => c.id === id);
        if (!card) return;
        setCols(p => ({ ...p, [from]: p[from].filter(c => c.id !== id), [target]: [...p[target], card] }));
        dragging.current = null;
    };
    return (
        <div className="demo-kanban-wrap">
            <div className="demo-kanban-add">
                <input value={newCard} onChange={e => setNewCard(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCard()} placeholder="New task…" />
                <button onClick={addCard}>+ Add</button>
            </div>
            <div className="demo-kanban">
                {KB_COLS.map(col => (
                    <div key={col} className="demo-kb-col" onDragOver={e => e.preventDefault()} onDrop={() => drop(col)}>
                        <div className="demo-kb-header">{KB_LABELS[col]} <span className="demo-kb-count">{cols[col].length}</span></div>
                        {cols[col].map(c => (
                            <div key={c.id} draggable className="demo-kb-card" onDragStart={() => { dragging.current = { col, id: c.id }; }}>
                                <span>{c.text}</span>
                                <button onClick={() => del(col, c.id)}>✕</button>
                            </div>
                        ))}
                        {cols[col].length === 0 && <div className="demo-kb-empty">Drop here</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── Demo 6: Shopping Cart ── */
const PRODUCTS_DATA = [
    { id: 1, name: 'React Course', price: 49.99 },
    { id: 2, name: 'Next.js Mastery', price: 59.99 },
    { id: 3, name: 'TypeScript Pro', price: 39.99 },
    { id: 4, name: 'System Design', price: 79.99 },
];
const COUPONS = { SAVE10: 0.10, SAVE20: 0.20 };
function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD': {
            const ex = state.find(i => i.id === action.p.id);
            return ex ? state.map(i => i.id === action.p.id ? { ...i, qty: i.qty + 1 } : i) : [...state, { ...action.p, qty: 1 }];
        }
        case 'INC': return state.map(i => i.id === action.id ? { ...i, qty: i.qty + 1 } : i);
        case 'DEC': return state.map(i => i.id === action.id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0);
        case 'REM': return state.filter(i => i.id !== action.id);
        default: return state;
    }
}
function CartDemo() {
    const [cart, dispatch] = useReducer(cartReducer, []);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [msg, setMsg] = useState('');
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const discountAmt = subtotal * discount;
    const total = subtotal - discountAmt;
    const applyCoupon = () => {
        const r = COUPONS[coupon.toUpperCase()];
        if (r) { setDiscount(r); setMsg(`✓ ${r * 100}% off applied!`); }
        else { setDiscount(0); setMsg('✗ Invalid code'); }
    };
    return (
        <div className="demo-cart-wrap">
            <div className="demo-product-list">
                {PRODUCTS_DATA.map(p => (
                    <div key={p.id} className="demo-product-row">
                        <div>
                            <div className="demo-prod-name">{p.name}</div>
                            <div className="demo-prod-price">${p.price.toFixed(2)}</div>
                        </div>
                        <button onClick={() => dispatch({ type: 'ADD', p })}>+ Add</button>
                    </div>
                ))}
            </div>
            <div className="demo-cart-panel">
                <div className="demo-cart-title">🛒 Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)</div>
                {cart.length === 0 ? <p className="demo-empty-cart">Cart is empty — add some products!</p> : <>
                    {cart.map(item => (
                        <div key={item.id} className="demo-cart-item">
                            <span className="demo-ci-name">{item.name}</span>
                            <div className="demo-qty">
                                <button onClick={() => dispatch({ type: 'DEC', id: item.id })}>−</button>
                                <span>{item.qty}</span>
                                <button onClick={() => dispatch({ type: 'INC', id: item.id })}>+</button>
                            </div>
                            <span className="demo-ci-price">${(item.price * item.qty).toFixed(2)}</span>
                            <button className="demo-ci-del" onClick={() => dispatch({ type: 'REM', id: item.id })}>✕</button>
                        </div>
                    ))}
                    <div className="demo-coupon">
                        <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="SAVE10 / SAVE20" />
                        <button onClick={applyCoupon}>Apply</button>
                    </div>
                    {msg && <p className={`demo-coupon-msg ${discount > 0 ? 'valid' : 'invalid'}`}>{msg}</p>}
                    <div className="demo-totals">
                        <div className="demo-total-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                        {discount > 0 && <div className="demo-total-row demo-discount"><span>Discount ({discount * 100}%)</span><span>−${discountAmt.toFixed(2)}</span></div>}
                        <div className="demo-total-row demo-final"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
                    </div>
                </>}
            </div>
        </div>
    );
}

/* ── Demo 7: useAsync Hook with Real API ── */
function useAsync(asyncFn, deps = []) {
    const [state, setState] = useState({ data: null, loading: true, error: null });
    const [trigger, setTrigger] = useState(0);
    const fnRef = useRef(asyncFn);
    fnRef.current = asyncFn;
    useEffect(() => {
        let cancelled = false;
        setState(s => ({ ...s, loading: true, error: null }));
        fnRef.current().then(data => { if (!cancelled) setState({ data, loading: false, error: null }); })
            .catch(err => { if (!cancelled) setState({ data: null, loading: false, error: err.message }); });
        return () => { cancelled = true; };
    }, [...deps, trigger]);
    const retry = useCallback(() => setTrigger(t => t + 1), []);
    return { ...state, retry };
}

function AsyncDemo() {
    const [userId, setUserId] = useState(1);
    const fetchUser = useCallback(
        () => fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
        [userId]
    );
    const { data: user, loading, error, retry } = useAsync(fetchUser, [userId]);
    return (
        <div className="demo-async">
            <div className="demo-user-btns">
                {[1, 2, 3, 4, 5].map(id => (
                    <button key={id} className={`demo-uid-btn ${userId === id ? 'active' : ''}`} onClick={() => setUserId(id)}>
                        User {id}
                    </button>
                ))}
            </div>
            {loading ? <div className="demo-async-loading">⟳ Fetching user data…</div> :
                error ? <div className="demo-async-error"><p>⚠️ {error}</p><button onClick={retry}>Retry</button></div> :
                    user && <div className="demo-user-profile">
                        <div className="demo-profile-av">{user.name[0]}</div>
                        <div className="demo-profile-info">
                            <div className="demo-profile-name">{user.name}</div>
                            <div className="demo-profile-email">{user.email}</div>
                            <div className="demo-profile-company">{user.company?.name}</div>
                            <div className="demo-profile-website">{user.website}</div>
                        </div>
                        <button className="demo-refresh" onClick={retry}>↻</button>
                    </div>
            }
        </div>
    );
}

/* ── Demo 8: Virtualized List ── */
const VL_ROW_H = 56;
const VL_BUFFER = 4;
const ALL_VL_ITEMS = Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1, name: `User #${i + 1}`, email: `user${i + 1}@example.com`,
    score: Math.floor(Math.random() * 100),
}));
function VirtualDemo() {
    const [scrollTop, setScrollTop] = useState(0);
    const CONTAINER_H = 320;
    const totalH = ALL_VL_ITEMS.length * VL_ROW_H;
    const startIdx = Math.max(0, Math.floor(scrollTop / VL_ROW_H) - VL_BUFFER);
    const visCount = Math.ceil(CONTAINER_H / VL_ROW_H) + VL_BUFFER * 2;
    const endIdx = Math.min(ALL_VL_ITEMS.length - 1, startIdx + visCount);
    const visible = ALL_VL_ITEMS.slice(startIdx, endIdx + 1);
    return (
        <div className="demo-virtual">
            <div className="demo-vlist-info">
                Rendering <strong>{visible.length}</strong> of <strong>{ALL_VL_ITEMS.length.toLocaleString()}</strong> rows
                (rows {startIdx + 1}–{endIdx + 1})
            </div>
            <div className="demo-vlist-container" style={{ height: CONTAINER_H }} onScroll={e => setScrollTop(e.target.scrollTop)}>
                <div style={{ height: totalH, position: 'relative' }}>
                    {visible.map((item, i) => (
                        <div key={item.id} className="demo-vrow" style={{ top: (startIdx + i) * VL_ROW_H }}>
                            <div className="demo-vrow-id">#{item.id}</div>
                            <div>
                                <div className="demo-vrow-name">{item.name}</div>
                                <div className="demo-vrow-email">{item.email}</div>
                            </div>
                            <div className={`demo-vrow-score ${item.score > 75 ? 'high' : item.score > 50 ? 'mid' : 'low'}`}>
                                {item.score}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── Live Demo map ── */
const LIVE_DEMOS = {
    a1: PaginatedDemo,
    a2: SearchDemo,
    a3: InfiniteDemo,
    a4: FormDemo,
    a5: KanbanDemo,
    a6: CartDemo,
    a7: AsyncDemo,
    a8: VirtualDemo,
};

/* ── Assessment Card ── */
function AssessmentCard({ assessment }) {
    const [tab, setTab] = useState('overview'); // overview | demo | code
    const LiveDemo = LIVE_DEMOS[assessment.id];

    return (
        <div id={assessment.id} className="assessment-card" style={{ '--ac-color': assessment.color, '--ac-accent': assessment.accent, '--ac-border': assessment.border }}>
            {/* Header */}
            <div className="ac-header">
                <div className="ac-emoji">{assessment.emoji}</div>
                <div className="ac-meta">
                    <h3 className="ac-title">{assessment.title}</h3>
                    <div className="ac-badges">
                        <span className="ac-badge category">{assessment.category}</span>
                        <span className={`ac-badge difficulty diff-${assessment.difficulty.toLowerCase()}`}>{assessment.difficulty}</span>
                        <span className="ac-badge time">⏱ {assessment.time}</span>
                    </div>
                </div>
            </div>

            {/* Tab bar */}
            <div className="ac-tabs">
                {[['overview', '📋 Overview'], ['demo', '▶ Live Demo'], ['code', '{ } Solution']].map(([id, label]) => (
                    <button
                        key={id}
                        className={`ac-tab ${tab === id ? 'active' : ''}`}
                        onClick={() => setTab(id)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="ac-body">
                {tab === 'overview' && (
                    <div className="ac-overview">
                        <p className="ac-context">{assessment.context}</p>

                        <div className="ac-two-col">
                            <div className="ac-reqs">
                                <div className="ac-section-label">✅ Requirements</div>
                                <ul>
                                    {assessment.requirements.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                            <div className="ac-skills">
                                <div className="ac-section-label">🧠 Skills Tested</div>
                                <ul>
                                    {assessment.skills.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div className="ac-takeaway">
                            <span className="ac-takeaway-icon">💡</span>
                            <div>
                                <div className="ac-takeaway-label">Key Takeaway</div>
                                <div className="ac-takeaway-text">{assessment.keyTakeaway}</div>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'demo' && LiveDemo && (
                    <div className="ac-demo-wrap">
                        <div className="ac-demo-badge">🔴 Live — fetching real API data</div>
                        <LiveDemo />
                    </div>
                )}

                {tab === 'code' && (
                    <div className="ac-code-wrap">
                        <div className="ac-demo-badge">📄 Reference implementation — real solution code</div>
                        <CodeBlock code={assessment.code} />
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Assessments Page ── */
function AssessmentsPage() {
    return (
        <div className="assessments-page">
            <div className="assessments-hero">
                <div className="assessments-hero-badge">🧪 Practice Mode</div>
                <h2>Real-World Interview Assessments</h2>
                <p>
                    Modern React interviews are shifting from theory to real problem-solving.
                    Each challenge tests exactly what gets you <strong>selected</strong>.
                </p>
                <div className="assessments-hero-stats">
                    <div><strong>{assessments.length}</strong><span>Challenges</span></div>
                    <div><strong>Live</strong><span>API Data</span></div>
                    <div><strong>Real</strong><span>Solutions</span></div>
                </div>
            </div>

            <div className="assessments-list">
                {assessments.map(a => (
                    <AssessmentCard key={a.id} assessment={a} />
                ))}
            </div>

            <div className="assessments-tip-banner">
                <div className="atb-icon">🎯</div>
                <div>
                    <div className="atb-title">What Modern Interviews Actually Test</div>
                    <div className="atb-grid">
                        {['API fetching & error handling', 'Rendering lists efficiently', 'Pagination / infinite scroll',
                            'Clean component structure', 'Handling loading & empty states', 'Custom hooks & reuse'].map((t, i) => (
                                <div key={i} className="atb-item">✓ {t}</div>
                            ))}
                    </div>
                </div>
            </div>
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
    const [activeTab, setActiveTab] = useState('guide');
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

            <Hero onTabChange={(tab) => {
                setActiveTab(tab);
                document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
            }} />

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
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <main className="main-content">
                    {activeTab === 'guide' && (
                        <>
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
                        </>
                    )}

                    {activeTab === 'practice' && <AssessmentsPage />}
                </main>
            </div>
        </>
    );
}

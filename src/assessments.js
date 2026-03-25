export const assessments = [
    {
        id: 'a1',
        title: 'Paginated API Card Gallery',
        emoji: '🃏',
        difficulty: 'Medium',
        time: '25 min',
        category: 'React + API',
        color: '#a855f7',
        accent: 'rgba(168,85,247,0.15)',
        border: 'rgba(168,85,247,0.3)',
        context: `You're given an API endpoint. Your task is to fetch data and display it in a clean card UI with pagination — 6 items per page. This is one of the most common real-world interview tasks.`,
        requirements: [
            'Fetch data from the JSONPlaceholder API',
            'Display items using a card UI layout',
            'Show only 6 items at a time',
            'Implement Previous / Next pagination',
            'Show loading skeleton while fetching',
            'Handle empty state and error gracefully',
        ],
        skills: [
            'API fetching with useEffect',
            'Component structure & composition',
            'Pagination logic (slice, page state)',
            'Loading & error state handling',
            'Rendering lists with keys',
        ],
        keyTakeaway: 'Pagination is just math: `items.slice((page-1)*6, page*6)`. The real test is whether you handle loading, edge cases, and clean component separation.',
        code: `import { useState, useEffect } from 'react';

// ── Types ──────────────────────────────────────────
// const API = 'https://jsonplaceholder.typicode.com/posts';
const PER_PAGE = 6;

// ── Card Component ──────────────────────────────────
function PostCard({ post }) {
  return (
    <div className="post-card">
      <div className="card-id">#{post.id}</div>
      <h3>{post.title}</h3>
      <p>{post.body.slice(0, 90)}…</p>
    </div>
  );
}

// ── Skeleton ────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="post-card skeleton">
      <div className="skel-id" />
      <div className="skel-title" />
      <div className="skel-body" />
      <div className="skel-body short" />
    </div>
  );
}

// ── Main Component ──────────────────────────────────
export default function PostGallery() {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [page, setPage]     = useState(1);

  // Fetch once on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => { if (!cancelled) { setPosts(data); setLoading(false); } })
      .catch(err  => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  // ── Pagination logic ── (the interview exam point!)
  const totalPages = Math.ceil(posts.length / PER_PAGE);
  const visible    = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (error) return <div className="error-state">⚠️ {error}</div>;

  return (
    <div className="gallery-wrap">
      {/* Grid */}
      <div className="cards-grid">
        {loading
          ? Array.from({ length: PER_PAGE }, (_, i) => <SkeletonCard key={i} />)
          : visible.map(post => <PostCard key={post.id} post={post} />)
        }
      </div>

      {/* Pagination controls */}
      {!loading && (
        <div className="pagination">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
            ← Prev
          </button>
          <span>Page {page} / {totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}`,
    },
    {
        id: 'a2',
        title: 'Live Search with Debounce',
        emoji: '🔍',
        difficulty: 'Medium',
        time: '20 min',
        category: 'Hooks + UX',
        color: '#06b6d4',
        accent: 'rgba(6,182,212,0.15)',
        border: 'rgba(6,182,212,0.3)',
        context: `Build a search input that filters a list of users in real-time. The twist: you must debounce the API call so it doesn't fire on every keystroke. This tests your hook composition skills.`,
        requirements: [
            'Display a list of 20+ users from an API',
            'Search input filters results by name or email',
            'Debounce the search — fire only after 350ms idle',
            'Show "No results found" for empty matches',
            'Highlight the matched portion of text',
            'Clear button to reset search',
        ],
        skills: [
            'useDebounce custom hook',
            'Controlled input with useState',
            'Filtering arrays with .filter()',
            'Conditional rendering for empty state',
            'useEffect cleanup for timer',
        ],
        keyTakeaway: 'Debounce = "wait until the user stops typing." Implement it with useEffect + clearTimeout. This pattern appears in search, autocomplete, resize handlers, and form validation.',
        code: `import { useState, useEffect } from 'react';

// ── useDebounce hook ────────────────────────────────
function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // ← key: cancel on new value
  }, [value, delay]);

  return debounced;
}

// ── Highlight matched text ───────────────────────────
function Highlight({ text, query }) {
  if (!query.trim()) return <span>{text}</span>;
  const regex = new RegExp(\`(\${query})\`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i}>{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

// ── Main Component ──────────────────────────────────
export default function UserSearch() {
  const [users, setUsers]   = useState([]);
  const [query, setQuery]   = useState('');
  const [loading, setLoading] = useState(true);

  const debouncedQuery = useDebounce(query, 350);

  // Fetch users once
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false); });
  }, []);

  // Filter client-side using debounced value
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <div className="search-wrap">
      <div className="search-field">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name or email..."
          autoFocus
        />
        {query && (
          <button className="clear-btn" onClick={() => setQuery('')}>✕</button>
        )}
      </div>

      {loading ? (
        <p className="hint">Loading users…</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state">🙅 No users found for "{debouncedQuery}"</div>
      ) : (
        <ul className="user-list">
          {filtered.map(user => (
            <li key={user.id} className="user-item">
              <div className="user-avatar">{user.name[0]}</div>
              <div>
                <div className="user-name">
                  <Highlight text={user.name} query={debouncedQuery} />
                </div>
                <div className="user-email">
                  <Highlight text={user.email} query={debouncedQuery} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="result-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
    </div>
  );
}`,
    },
    {
        id: 'a3',
        title: 'Infinite Scroll Feed',
        emoji: '♾️',
        difficulty: 'Hard',
        time: '30 min',
        category: 'Intersection Observer',
        color: '#10b981',
        accent: 'rgba(16,185,129,0.15)',
        border: 'rgba(16,185,129,0.3)',
        context: `Build a Twitter/Instagram-style infinite scroll that automatically loads more posts when the user reaches the bottom of the list. No pagination buttons — loading happens automatically.`,
        requirements: [
            'Fetch initial batch of 10 posts from API',
            'Auto-load next batch when scrolling to bottom',
            'Show a spinner at the bottom while loading',
            'Stop loading when all data is fetched',
            'No scroll event listeners — use IntersectionObserver',
            'Handle API errors mid-scroll gracefully',
        ],
        skills: [
            'IntersectionObserver API',
            'useRef for sentinel element',
            'Accumulating data across fetches',
            'Loading state management',
            'Preventing duplicate fetches',
        ],
        keyTakeaway: 'IntersectionObserver is the professional alternative to scroll events. Attach it to a "sentinel" div at the list bottom — when it becomes visible, load more data.',
        code: `import { useState, useEffect, useRef, useCallback } from 'react';

const PAGE_SIZE = 10;

export default function InfiniteScroll() {
  const [posts, setPosts]       = useState([]);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [hasMore, setHasMore]   = useState(true);
  const sentinelRef             = useRef(null);

  // Fetch next page
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return; // prevent duplicate calls
    setLoading(true);

    try {
      const res  = await fetch(
        \`https://jsonplaceholder.typicode.com/posts?_start=\${(page-1)*PAGE_SIZE}&_limit=\${PAGE_SIZE}\`
      );
      const data = await res.json();

      if (data.length < PAGE_SIZE) setHasMore(false); // last page!
      setPosts(prev => [...prev, ...data]);            // accumulate
      setPage(p => p + 1);
    } catch {
      console.error('Load failed');
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // Observe sentinel element
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: '100px' } // trigger 100px before it's visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="feed">
      {posts.map(post => (
        <article key={post.id} className="feed-card">
          <span className="feed-id">#{post.id}</span>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </article>
      ))}

      {/* Sentinel — the IntersectionObserver watches this div */}
      <div ref={sentinelRef} className="sentinel">
        {loading && <div className="loader-spin">⟳ Loading more…</div>}
        {!hasMore && <p className="all-loaded">✓ All posts loaded</p>}
      </div>
    </div>
  );
}`,
    },
    {
        id: 'a4',
        title: 'Multi-Step Form with Validation',
        emoji: '📋',
        difficulty: 'Medium',
        time: '35 min',
        category: 'Forms + State',
        color: '#fbbf24',
        accent: 'rgba(251,191,36,0.15)',
        border: 'rgba(251,191,36,0.3)',
        context: `Build a 3-step registration form: Personal Info → Account Setup → Review & Submit. Each step validates before proceeding. State persists across steps. The final step shows a summary.`,
        requirements: [
            'Step indicator showing current/completed steps',
            'Personal Info: name, email, phone (required + format)',
            'Account Setup: username, password, confirm password',
            'Review: read-only summary before submit',
            'Validation runs on Next click, not on every keystroke',
            'Back button navigates without losing data',
        ],
        skills: [
            'Multi-step state management with useReducer',
            'Client-side form validation',
            'Controlled components',
            'Persisting data across navigation',
            'Conditional step rendering',
        ],
        keyTakeaway: 'Multi-step forms are just conditional rendering + a shared state object. The key insight: validate on "Next" not "onChange" to avoid annoying UX. Use useReducer to manage complex form state cleanly.',
        code: `import { useReducer, useState } from 'react';

const STEPS = ['Personal Info', 'Account Setup', 'Review'];

// Central form state via reducer
const initialState = {
  step: 0,
  data: { name: '', email: '', phone: '', username: '', password: '', confirm: '' }
};

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE':  return { ...state, data: { ...state.data, ...action.payload } };
    case 'NEXT':    return { ...state, step: state.step + 1 };
    case 'BACK':    return { ...state, step: state.step - 1 };
    case 'RESET':   return initialState;
    default: return state;
  }
}

// ── Validation ──────────────────────────────────────
function validate(step, data) {
  const errors = {};
  if (step === 0) {
    if (!data.name.trim()) errors.name = 'Name required';
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(data.email)) errors.email = 'Valid email required';
    if (!/^\d{10}$/.test(data.phone.replace(/\D/g, ''))) errors.phone = 'Valid 10-digit phone required';
  }
  if (step === 1) {
    if (data.username.length < 3) errors.username = 'Min 3 characters';
    if (data.password.length < 8) errors.password = 'Min 8 characters';
    if (data.password !== data.confirm) errors.confirm = 'Passwords do not match';
  }
  return errors;
}

// ── Main Component ──────────────────────────────────
export default function MultiStepForm() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const { step, data } = state;

  const handleChange = field => e =>
    dispatch({ type: 'UPDATE', payload: { [field]: e.target.value } });

  const handleNext = () => {
    const errs = validate(step, data);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    dispatch({ type: 'NEXT' });
  };

  if (submitted) return (
    <div className="success-screen">
      <div className="success-icon">🎉</div>
      <h2>Account Created!</h2>
      <p>Welcome, {data.name}!</p>
      <button onClick={() => { dispatch({ type: 'RESET' }); setSubmitted(false); }}>
        Start Over
      </button>
    </div>
  );

  return (
    <div className="form-wizard">
      {/* Step indicator */}
      <div className="step-indicator">
        {STEPS.map((s, i) => (
          <div key={i} className={\`step-dot \${i < step ? 'done' : ''} \${i === step ? 'active' : ''}\`}>
            <div className="dot">{i < step ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      {/* Step 0: Personal Info */}
      {step === 0 && (
        <div className="form-step">
          <h3>Personal Information</h3>
          <label>Full Name
            <input value={data.name} onChange={handleChange('name')} placeholder="John Doe" />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label>Email
            <input value={data.email} onChange={handleChange('email')} placeholder="john@example.com" />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label>Phone
            <input value={data.phone} onChange={handleChange('phone')} placeholder="1234567890" />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </label>
        </div>
      )}

      {/* Step 1: Account Setup */}
      {step === 1 && (
        <div className="form-step">
          <h3>Account Setup</h3>
          <label>Username
            <input value={data.username} onChange={handleChange('username')} />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </label>
          <label>Password
            <input type="password" value={data.password} onChange={handleChange('password')} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>
          <label>Confirm Password
            <input type="password" value={data.confirm} onChange={handleChange('confirm')} />
            {errors.confirm && <span className="field-error">{errors.confirm}</span>}
          </label>
        </div>
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <div className="form-step review">
          <h3>Review Your Details</h3>
          {Object.entries({ Name: data.name, Email: data.email, Phone: data.phone, Username: data.username }).map(([k, v]) => (
            <div key={k} className="review-row">
              <span className="review-label">{k}</span>
              <span className="review-value">{v}</span>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="form-nav">
        {step > 0 && <button className="btn-back" onClick={() => dispatch({ type: 'BACK' })}>← Back</button>}
        {step < 2
          ? <button className="btn-next" onClick={handleNext}>Next →</button>
          : <button className="btn-submit" onClick={() => setSubmitted(true)}>Submit ✓</button>
        }
      </div>
    </div>
  );
}`,
    },
    {
        id: 'a5',
        title: 'Drag & Drop Kanban Board',
        emoji: '🗂️',
        difficulty: 'Hard',
        time: '40 min',
        category: 'Advanced React',
        color: '#f472b6',
        accent: 'rgba(244,114,182,0.15)',
        border: 'rgba(244,114,182,0.3)',
        context: `Build a simple Kanban board with three columns: Todo, In Progress, Done. Users can drag cards between columns. No external drag-and-drop library — use the native HTML5 Drag API.`,
        requirements: [
            'Three columns: Todo, In Progress, Done',
            'Cards can be dragged from any column to any other',
            'Visual feedback while dragging (opacity, highlight target)',
            'Ability to add new cards to Todo',
            'Ability to delete cards from any column',
            'State persists in-memory (reset on reload is fine)',
        ],
        skills: [
            'HTML5 Drag and Drop API (onDragStart, onDragOver, onDrop)',
            'Immutable state updates',
            'useRef for dragged item tracking',
            'Dynamic column rendering',
            'Controlled input for card creation',
        ],
        keyTakeaway: 'HTML5 DnD works via 3 events: dragStart (mark what\'s moving), dragOver (prevent default to allow drop), drop (move the item). Store dragged item in a ref — not state — to avoid re-renders.',
        code: `import { useState, useRef } from 'react';

const COLUMNS = ['todo', 'inprogress', 'done'];
const LABELS  = { todo: '📋 Todo', inprogress: '⚡ In Progress', done: '✅ Done' };

const initialCards = {
  todo:       [{ id: 1, text: 'Design wireframes' }, { id: 2, text: 'Set up project' }],
  inprogress: [{ id: 3, text: 'Build API layer' }],
  done:       [{ id: 4, text: 'Write user stories' }],
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialCards);
  const [newCard, setNewCard] = useState('');
  const dragging = useRef(null); // { col, id } — useRef avoids re-renders!

  // ── Add card to Todo ──
  const addCard = () => {
    if (!newCard.trim()) return;
    const card = { id: Date.now(), text: newCard.trim() };
    setColumns(prev => ({ ...prev, todo: [...prev.todo, card] }));
    setNewCard('');
  };

  // ── Delete card ──
  const deleteCard = (col, id) => {
    setColumns(prev => ({
      ...prev,
      [col]: prev[col].filter(c => c.id !== id),
    }));
  };

  // ── Drag handlers ──
  const onDragStart = (col, id) => { dragging.current = { col, id }; };

  const onDrop = (targetCol) => {
    const { col: fromCol, id } = dragging.current || {};
    if (!fromCol || fromCol === targetCol) return;

    const card = columns[fromCol].find(c => c.id === id);
    if (!card) return;

    setColumns(prev => ({
      ...prev,
      [fromCol]: prev[fromCol].filter(c => c.id !== id),
      [targetCol]: [...prev[targetCol], card],
    }));

    dragging.current = null;
  };

  return (
    <div className="kanban-wrap">
      {/* Add Card input */}
      <div className="add-card-row">
        <input
          value={newCard}
          onChange={e => setNewCard(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCard()}
          placeholder="New task…"
        />
        <button onClick={addCard}>+ Add</button>
      </div>

      {/* Columns */}
      <div className="kanban-board">
        {COLUMNS.map(col => (
          <div
            key={col}
            className="kanban-col"
            onDragOver={e => e.preventDefault()} // CRITICAL: allows drop
            onDrop={() => onDrop(col)}
          >
            <div className="col-header">
              {LABELS[col]}
              <span className="card-count">{columns[col].length}</span>
            </div>

            {columns[col].map(card => (
              <div
                key={card.id}
                draggable
                className="kanban-card"
                onDragStart={() => onDragStart(col, card.id)}
              >
                {card.text}
                <button
                  className="delete-card"
                  onClick={() => deleteCard(col, card.id)}
                >✕</button>
              </div>
            ))}

            {columns[col].length === 0 && (
              <div className="empty-col">Drop cards here</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    },
    {
        id: 'a6',
        title: 'Real-Time Cart with Discount Logic',
        emoji: '🛒',
        difficulty: 'Medium',
        time: '25 min',
        category: 'State Management',
        color: '#3b82f6',
        accent: 'rgba(59,130,246,0.15)',
        border: 'rgba(59,130,246,0.3)',
        context: `Build an e-commerce cart where users can add items, change quantities, remove items, and apply coupon codes. All totals must be calculated in real-time. This tests your ability to manage derived state correctly.`,
        requirements: [
            'Display a list of products to add to cart',
            'Cart shows item name, quantity controls, and subtotal',
            'Remove individual items from cart',
            'Apply coupon code (SAVE10 = 10%, SAVE20 = 20%)',
            'Show subtotal, discount, and final total',
            'Empty cart state with CTA to shop',
        ],
        skills: [
            'Derived state (totals calculated from cart)',
            'useReducer for cart actions',
            'Immutable state updates',
            'Coupon/discount logic',
            'Conditional rendering for empty state',
        ],
        keyTakeaway: 'Never store totals in state — derive them. `const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)`. Totals auto-update whenever cart changes with zero extra code.',
        code: `import { useReducer, useState } from 'react';

const PRODUCTS = [
  { id: 1, name: 'React Course',      price: 49.99 },
  { id: 2, name: 'Next.js Mastery',   price: 59.99 },
  { id: 3, name: 'TypeScript Pro',    price: 39.99 },
  { id: 4, name: 'System Design Kit', price: 79.99 },
];

const COUPONS = { SAVE10: 0.10, SAVE20: 0.20 };

// ── Reducer ─────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find(i => i.id === action.product.id);
      if (exists) return state.map(i => i.id === action.product.id
        ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.product, qty: 1 }];
    }
    case 'INCREASE':
      return state.map(i => i.id === action.id ? { ...i, qty: i.qty + 1 } : i);
    case 'DECREASE':
      return state
        .map(i => i.id === action.id ? { ...i, qty: i.qty - 1 } : i)
        .filter(i => i.qty > 0); // remove when qty hits 0
    case 'REMOVE':
      return state.filter(i => i.id !== action.id);
    case 'CLEAR':
      return [];
    default: return state;
  }
}

// ── Main Component ──────────────────────────────────
export default function ShoppingCart() {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');

  // ── Derived totals (THE RIGHT WAY — never store in state!)
  const subtotal     = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discountAmt  = subtotal * discount;
  const total        = subtotal - discountAmt;

  const applyCoupon = () => {
    const rate = COUPONS[coupon.toUpperCase()];
    if (rate) { setDiscount(rate); setCouponMsg(\`✓ \${rate * 100}% off applied!\`); }
    else      { setDiscount(0);   setCouponMsg('✗ Invalid coupon code'); }
  };

  return (
    <div className="cart-layout">
      {/* Product Listing */}
      <div className="product-list">
        <h3>Products</h3>
        {PRODUCTS.map(p => (
          <div key={p.id} className="product-row">
            <div>
              <div className="prod-name">{p.name}</div>
              <div className="prod-price">$\{p.price.toFixed(2)}</div>
            </div>
            <button className="add-btn" onClick={() => dispatch({ type: 'ADD', product: p })}>
              + Add
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="cart-panel">
        <h3>🛒 Cart ({cart.length} items)</h3>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty!</p>
            <p className="hint">Add some courses above ↑</p>
          </div>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-name">{item.name}</div>
                <div className="qty-controls">
                  <button onClick={() => dispatch({ type: 'DECREASE', id: item.id })}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => dispatch({ type: 'INCREASE', id: item.id })}>+</button>
                </div>
                <div className="cart-item-price">\${(item.price * item.qty).toFixed(2)}</div>
                <button className="remove-btn" onClick={() => dispatch({ type: 'REMOVE', id: item.id })}>✕</button>
              </div>
            ))}

            {/* Coupon */}
            <div className="coupon-row">
              <input
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                placeholder="Coupon code (SAVE10 / SAVE20)"
              />
              <button onClick={applyCoupon}>Apply</button>
            </div>
            {couponMsg && <p className={\`coupon-msg \${discount > 0 ? 'valid' : 'invalid'}\`}>{couponMsg}</p>}

            {/* Totals */}
            <div className="cart-totals">
              <div className="total-row"><span>Subtotal</span><span>\${subtotal.toFixed(2)}</span></div>
              {discount > 0 && (
                <div className="total-row discount-row">
                  <span>Discount ({discount * 100}%)</span>
                  <span>−\${discountAmt.toFixed(2)}</span>
                </div>
              )}
              <div className="total-row final">
                <span>Total</span><span>\${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="checkout-btn">Checkout →</button>
          </>
        )}
      </div>
    </div>
  );
}`,
    },
    {
        id: 'a7',
        title: 'Custom useAsync Hook + Retry',
        emoji: '⚙️',
        difficulty: 'Hard',
        time: '30 min',
        category: 'Custom Hooks',
        color: '#f97316',
        accent: 'rgba(249,115,22,0.15)',
        border: 'rgba(249,115,22,0.3)',
        context: `Build a reusable useAsync hook that handles any async function with loading, error, and data states — plus automatic retries with exponential backoff. This is what senior engineers build for production apps.`,
        requirements: [
            'useAsync(asyncFn, deps) hook API',
            'Returns { data, loading, error, retry }',
            'Auto-runs on mount and when deps change',
            'Cancellation to prevent set-state after unmount',
            'Retry function to re-execute on error',
            'Optional: retries automatically with backoff',
        ],
        skills: [
            'Building production-grade custom hooks',
            'Cancellation with aborted flag',
            'Exponential backoff retry logic',
            'useCallback memoization',
            'Generic, reusable hook design',
        ],
        keyTakeaway: 'A production useAsync hook has 3 concerns: (1) cancellation — don\'t setState after unmount, (2) deduplication — don\'t fire twice in StrictMode, (3) reusability — accept any async function, not just fetch.',
        code: `import { useState, useEffect, useCallback, useRef } from 'react';

// ── useAsync — production-grade hook ───────────────
function useAsync(asyncFn, deps = [], options = {}) {
  const { retries = 0, retryDelay = 1000 } = options;

  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });
  const [trigger, setTrigger] = useState(0);
  const fnRef = useRef(asyncFn);
  fnRef.current = asyncFn; // always latest without causing re-run

  useEffect(() => {
    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: null }));

    async function execute(attempt = 0) {
      try {
        const data = await fnRef.current();
        if (!cancelled) setState({ data, loading: false, error: null });
      } catch (err) {
        if (cancelled) return;
        if (attempt < retries) {
          const delay = retryDelay * Math.pow(2, attempt); // exponential backoff
          console.log(\`Retry \${attempt + 1}/\${retries} in \${delay}ms…\`);
          setTimeout(() => execute(attempt + 1), delay);
        } else {
          setState({ data: null, loading: false, error: err.message });
        }
      }
    }

    execute();
    return () => { cancelled = true; }; // cleanup = cancel
  }, [...deps, trigger]); // trigger lets us force re-execute

  const retry = useCallback(() => setTrigger(t => t + 1), []);

  return { ...state, retry };
}

// ── Usage Example ───────────────────────────────────
function UserProfile({ userId }) {
  const fetchUser = useCallback(
    () => fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`).then(r => {
      if (!r.ok) throw new Error(\`HTTP \${r.status}\`);
      return r.json();
    }),
    [userId]
  );

  const { data: user, loading, error, retry } = useAsync(
    fetchUser,
    [userId],
    { retries: 3, retryDelay: 500 } // retry 3 times with backoff
  );

  if (loading) return <div className="async-loading">⟳ Fetching user…</div>;

  if (error) return (
    <div className="async-error">
      <p>⚠️ {error}</p>
      <button onClick={retry}>Retry</button>
    </div>
  );

  return (
    <div className="user-profile-card">
      <div className="profile-avatar">{user.name[0]}</div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <p>{user.company.name}</p>
      <button onClick={retry} className="refresh-btn">↻ Refresh</button>
    </div>
  );
}

// Swap userId to simulate deps change
export default function App() {
  const [userId, setUserId] = useState(1);
  return (
    <div>
      <div className="user-selector">
        {[1,2,3,4,5].map(id => (
          <button
            key={id}
            className={\`user-btn \${userId === id ? 'active' : ''}\`}
            onClick={() => setUserId(id)}
          >
            User {id}
          </button>
        ))}
      </div>
      <UserProfile userId={userId} />
    </div>
  );
}`,
    },
    {
        id: 'a8',
        title: 'Virtualized List (10,000 Items)',
        emoji: '📜',
        difficulty: 'Hard',
        time: '35 min',
        category: 'Performance',
        color: '#ec4899',
        accent: 'rgba(236,72,153,0.15)',
        border: 'rgba(236,72,153,0.3)',
        context: `Render a list of 10,000 items without freezing the browser. Implement virtualization from scratch (without react-window) to only render what's visible in the viewport. This is a premium interview signal.`,
        requirements: [
            'Render only visible rows in the DOM',
            'Support smooth scrolling without jank',
            'Total scroll height must represent all 10,000 items',
            'Implement a buffer zone above/below the viewport',
            'Works with fixed row height (simple) implementation',
            'Show frame rate indicator to prove performance',
        ],
        skills: [
            'Virtualization concept (visible window)',
            'Scroll event + Math.floor calculations',
            'Absolute positioning for rows',
            'useRef for container measurements',
            'requestAnimationFrame for smooth updates',
        ],
        keyTakeaway: 'Virtualization = only render visible items. Formula: `startIndex = Math.floor(scrollTop / rowHeight)`, `endIndex = startIndex + visibleCount`. Spacer div makes scrollbar behave correctly.',
        code: `import { useState, useRef, useCallback } from 'react';

const TOTAL_ITEMS = 10_000;
const ROW_HEIGHT  = 60;  // px — fixed height = simpler math
const BUFFER      = 5;   // extra rows above/below viewport

// Generate fake data once
const DATA = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
  id: i + 1,
  name: \`User #\${i + 1}\`,
  email: \`user\${i + 1}@example.com\`,
  score: Math.floor(Math.random() * 100),
}));

// ── Virtualised Row ─────────────────────────────────
function Row({ item, top }) {
  return (
    <div
      className="virtual-row"
      style={{ position: 'absolute', top, height: ROW_HEIGHT, width: '100%' }}
    >
      <div className="row-id">#{item.id}</div>
      <div>
        <div className="row-name">{item.name}</div>
        <div className="row-email">{item.email}</div>
      </div>
      <div className={\`row-score \${item.score > 75 ? 'high' : item.score > 50 ? 'mid' : 'low'}\`}>
        {item.score}
      </div>
    </div>
  );
}

// ── VirtualList Component ──────────────────────────
export default function VirtualList() {
  const containerRef   = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  const CONTAINER_H    = 500; // viewport height in px
  const totalH         = TOTAL_ITEMS * ROW_HEIGHT; // spacer height

  const handleScroll = useCallback(e => {
    setScrollTop(e.target.scrollTop);
  }, []);

  // ── The core math ──
  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const visCount = Math.ceil(CONTAINER_H / ROW_HEIGHT) + BUFFER * 2;
  const endIdx   = Math.min(TOTAL_ITEMS - 1, startIdx + visCount);

  const visibleItems = DATA.slice(startIdx, endIdx + 1);

  return (
    <div className="virtual-wrap">
      <div className="vlist-info">
        Rendering {visibleItems.length} of {TOTAL_ITEMS.toLocaleString()} rows
        (rows {startIdx + 1}–{endIdx + 1})
      </div>

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="vlist-container"
        style={{ height: CONTAINER_H, overflowY: 'auto', position: 'relative' }}
        onScroll={handleScroll}
      >
        {/* Spacer — makes scrollbar represent full list */}
        <div style={{ height: totalH, position: 'relative' }}>
          {visibleItems.map((item, i) => (
            <Row
              key={item.id}
              item={item}
              top={(startIdx + i) * ROW_HEIGHT}
            />
          ))}
        </div>
      </div>
    </div>
  );
}`,
    },
];

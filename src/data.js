export const sections = [
    {
        id: 'js-fundamentals',
        title: 'JavaScript Fundamentals',
        emoji: '🟡',
        color: '#F7DF1E',
        gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        questions: [
            {
                id: 'q1',
                question: 'What is Hoisting in JavaScript?',
                answer: "Hoisting is JavaScript's default behavior of moving declarations to the top of the current scope before code execution. Only declarations are hoisted, NOT initializations.",
                keyPoints: [
                    'var is hoisted and initialized to undefined',
                    'let/const are hoisted but live in the Temporal Dead Zone (TDZ)',
                    'Function declarations are fully hoisted (name + body)',
                    'Function expressions are NOT hoisted',
                ],
                code: `// var — hoisted and initialized to undefined
console.log(x);  // undefined (not ReferenceError)
var x = 5;

// let/const — Temporal Dead Zone (TDZ)
console.log(y);  // ❌ ReferenceError
let y = 10;

// Function declarations — FULLY hoisted ✅
greet();  // "Hello!"
function greet() { console.log("Hello!"); }

// Function expressions — NOT hoisted ❌
sayHi();  // TypeError: sayHi is not a function
var sayHi = function() { console.log("Hi!"); };`,
            },
            {
                id: 'q2',
                question: 'Explain Closures with a practical example',
                answer: 'A closure is a function that remembers variables from its outer scope even after the outer function has finished executing. Closures enable private state, data encapsulation, and function factories.',
                keyPoints: [
                    'Inner function retains access to outer scope variables',
                    'Used in React hooks, event handlers, module patterns',
                    'Classic loop bug with var — fix by using let',
                    'Enables private variables in JavaScript',
                ],
                code: `function makeCounter() {
  let count = 0;  // closed-over variable

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount:  () => count,
  };
}

const counter = makeCounter();
counter.increment(); // 1
counter.increment(); // 2
console.log(counter.getCount()); // 2
console.log(counter.count); // undefined — truly private!

// Classic Bug with var in loops
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3 ❌
}

// FIX with let (block-scoped per iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2 ✅
}`,
            },
            {
                id: 'q3',
                question: 'What is the difference between == and ===?',
                answer: '== (loose equality) performs type coercion before comparing. === (strict equality) checks value AND type — no coercion. Always prefer === in production code.',
                keyPoints: [
                    '== triggers type coercion before comparison',
                    '=== checks value and type — no conversion',
                    'null == undefined is true (special rule)',
                    'Always use === to avoid unexpected behavior',
                ],
                code: `// == with type coercion (surprises!)
0  == false;         // true  (false → 0)
'' == false;         // true  ('' → 0, false → 0)
null == undefined;   // true  (special rule)
'5' == 5;            // true  ('5' → 5)
[] == false;         // true  ([] → '' → 0, false → 0)

// === strict — no surprises ✅
0   === false;       // false (different types)
'5' === 5;           // false
null === undefined;  // false

// Always prefer === in production!`,
            },
            {
                id: 'q4',
                question: 'What is the Event Loop? How does JavaScript handle async code?',
                answer: 'JavaScript is single-threaded but handles async operations via the Event Loop which coordinates the Call Stack, Web APIs, Microtask Queue, and Macrotask Queue.',
                keyPoints: [
                    'JavaScript is single-threaded — one thing at a time',
                    'Microtasks (Promises) run BEFORE macrotasks (setTimeout)',
                    'Microtask queue is drained completely before next macrotask',
                    'Web APIs handle async work (timers, fetch, etc.)',
                ],
                code: `// Priority: Sync → Microtasks → Macrotasks

console.log('1 - Start');                              // Sync

setTimeout(() => console.log('2 - setTimeout'), 0);   // Macrotask

Promise.resolve().then(() => console.log('3 - Promise')); // Microtask

queueMicrotask(() => console.log('4 - Microtask'));   // Microtask

console.log('5 - End');                                // Sync

// Output:
// 1 - Start
// 5 - End
// 3 - Promise   ← Microtask before macrotask!
// 4 - Microtask
// 2 - setTimeout`,
            },
            {
                id: 'q5',
                question: "Explain 'this' in JavaScript — all binding rules",
                answer: "'this' refers to the execution context — what object is calling the function. Its value depends entirely on HOW the function is called, not where it's defined.",
                keyPoints: [
                    'Object method: this = the object calling it',
                    'Arrow function: inherits this from enclosing scope',
                    'call/apply/bind: explicit binding',
                    'new keyword: this = newly created object',
                ],
                code: `// 1. Object method — this = the object
const obj = { name: 'Alice', greet() { console.log(this.name); } };
obj.greet();  // 'Alice'

// 2. Arrow — inherits this from enclosing scope
const timer = {
  name: 'Timer',
  start() {
    setTimeout(() => console.log(this.name), 100); // ✅ 'Timer'
    setTimeout(function() { console.log(this.name); }, 100); // ❌ undefined
  }
};

// 3. Explicit binding: call, apply, bind
function greet(msg) { console.log(\`\${msg}, \${this.name}\`); }
const user = { name: 'Bob' };
greet.call(user, 'Hello');   // 'Hello, Bob'
greet.apply(user, ['Hi']);   // 'Hi, Bob'
greet.bind(user)('Hey');     // 'Hey, Bob'

// 4. new keyword
function Person(name) { this.name = name; }
const p = new Person('Charlie');
console.log(p.name); // 'Charlie'`,
            },
            {
                id: 'q6',
                question: 'What is Prototypal Inheritance?',
                answer: 'Every JavaScript object has a hidden [[Prototype]] link to another object. When you access a property, JS walks up the prototype chain until found or null is reached. ES6 classes are syntactic sugar over this.',
                keyPoints: [
                    'Every object has [[Prototype]] (accessible via __proto__)',
                    'Property lookup walks up the prototype chain',
                    'Object.create() lets you set the prototype explicitly',
                    'ES6 class/extends is syntactic sugar over prototypes',
                ],
                code: `const animal = {
  breathe() { console.log('Breathing...'); }
};
const dog = Object.create(animal);
dog.bark = function() { console.log('Woof!'); };

dog.bark();    // 'Woof!'      — own property
dog.breathe(); // 'Breathing'  — inherited from animal
// Chain: dog → animal → Object.prototype → null

// ES6 Class syntax (same thing under the hood)
class Animal {
  constructor(name) { this.name = name; }
  speak() { console.log(\`\${this.name} makes a sound\`); }
}
class Dog extends Animal {
  speak() { console.log(\`\${this.name} barks\`); }
}
const d = new Dog('Rex');
d.speak();                        // 'Rex barks'
console.log(d instanceof Animal); // true`,
            },
        ],
    },
    {
        id: 'es6-async',
        title: 'ES6+ & Async JavaScript',
        emoji: '🟠',
        color: '#FF9500',
        gradient: 'linear-gradient(135deg, #1a1030 0%, #0d1b2a 100%)',
        questions: [
            {
                id: 'q7',
                question: 'Destructuring, Spread, and Rest Operators',
                answer: 'Modern ES6+ syntax for cleanly extracting values, combining collections, and handling variable-length arguments.',
                keyPoints: [
                    'Destructuring extracts values from arrays/objects',
                    'Spread (...) expands iterables into individual elements',
                    'Rest (...) collects remaining elements into an array',
                    'Works in function params, assignments, and imports',
                ],
                code: `// Array Destructuring
const [a, b, ...rest] = [1, 2, 3, 4, 5];
console.log(a, b, rest); // 1, 2, [3, 4, 5]

// Object Destructuring with rename + default
const { name, role: userRole, city = 'Unknown' } = user;

// Function parameter destructuring
function display({ name, age = 18, role = 'user' } = {}) {
  console.log(\`\${name} (\${age}) - \${role}\`);
}

// Spread: merge arrays/objects
const merged = [...arr1, ...arr2];
const obj    = { ...defaults, ...overrides }; // later keys win

// Swap variables without temp
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y); // 2, 1

// Rest: collect remaining args
function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15`,
            },
            {
                id: 'q8',
                question: 'Promises — creation, chaining, and combinators',
                answer: 'Promises represent the eventual result of an async operation. They can be chained and combined with powerful static methods.',
                keyPoints: [
                    'Promise.all — fails fast if ANY promise rejects',
                    'Promise.allSettled — waits for ALL, reports each status',
                    'Promise.race — first settled wins (resolve or reject)',
                    'Promise.any — first FULFILLED wins (ignores rejections)',
                ],
                code: `const fetchUser = (id) => new Promise((resolve, reject) => {
  id > 0 ? resolve({ id }) : reject(new Error('Invalid ID'));
});

// Chaining
fetchUser(1)
  .then(user => user.id)
  .then(id   => id * 2)
  .catch(err => console.error(err.message))
  .finally(  () => console.log('Always runs'));

// Combinators
const p1 = Promise.resolve('A');
const p2 = Promise.reject(new Error('B failed'));
const p3 = Promise.resolve('C');

// all — one fail = everything fails
Promise.all([p1, p2, p3]); // ❌ throws

// allSettled — waits for all, gives status of each
Promise.allSettled([p1, p2]).then(results => {
  // [{status:'fulfilled', value:'A'}, {status:'rejected',...}]
});

// race — first settled wins
Promise.race([p1, p3]).then(console.log); // 'A'

// any — first FULFILLED wins
Promise.any([p2, p3]).then(console.log); // 'C'`,
            },
            {
                id: 'q9',
                question: 'async/await — error handling and parallel execution',
                answer: 'async/await is syntactic sugar over Promises that makes async code look synchronous. Critical: use Promise.all for parallel execution.',
                keyPoints: [
                    'async function always returns a Promise',
                    'await pauses execution until Promise settles',
                    'Use try/catch/finally for error handling',
                    'ALWAYS use Promise.all for parallel independent operations',
                ],
                code: `// Error handling
async function main() {
  try {
    const user = await getUser(1);
    console.log(user);
  } catch (error) {
    console.error('Failed:', error.message);
  } finally {
    console.log('Cleanup code');
  }
}

// ❌ Sequential (slow — 2 seconds total)
const user  = await getUser(1);
const posts = await getPosts(1);

// ✅ Parallel (fast — 1 second total)
const [user, posts] = await Promise.all([
  getUser(1),
  getPosts(1),
]);

// Retry with exponential backoff
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url).then(r => r.json());
    } catch (err) {
      if (i === retries - 1) throw err;
      const delay = 1000 * Math.pow(2, i); // 1s, 2s, 4s
      await new Promise(r => setTimeout(r, delay));
      console.log(\`Retry \${i + 1}...\`);
    }
  }
}`,
            },
        ],
    },
    {
        id: 'react-core',
        title: 'React Core Concepts',
        emoji: '⚛️',
        color: '#61DAFB',
        gradient: 'linear-gradient(135deg, #001220 0%, #003049 100%)',
        questions: [
            {
                id: 'q10',
                question: 'What is the Virtual DOM and how does reconciliation work?',
                answer: 'The Virtual DOM is a lightweight JS representation of the real DOM. On state changes, React diffs the new VDOM against the old one (reconciliation) and applies only minimal real DOM patches. React Fiber enables incremental, prioritized rendering.',
                keyPoints: [
                    'VDOM is a plain JS object tree — cheap to create',
                    'Diffing algorithm finds minimum number of changes',
                    'React Fiber enables async, pauseable rendering',
                    'Keys help React track list items across re-renders',
                ],
                code: `// State Change → New VDOM → Diff → Patch Real DOM
//                          (Fiber Reconciler)

// ❌ Bad: index as key — breaks on reorder/insert
{items.map((item, i) => <li key={i}>{item}</li>)}

// ✅ Good: stable unique IDs
{items.map(item => <li key={item.id}>{item.name}</li>)}

// React Fiber priorities:
// 1. User input (clicks, typing) — immediate
// 2. Animations — high priority
// 3. Data fetching results — normal
// 4. Background work — low priority

// Concurrent features (React 18)
import { startTransition } from 'react';

// Mark state update as non-urgent (won't block UI)
startTransition(() => {
  setSearchResults(heavySearch(query));
});`,
            },
            {
                id: 'q11',
                question: 'Controlled vs Uncontrolled Components',
                answer: 'Controlled components let React state drive the input value. Uncontrolled components let the DOM manage state, accessed imperatively via refs.',
                keyPoints: [
                    'Controlled: value prop + onChange handler',
                    'Uncontrolled: defaultValue + ref to read DOM value',
                    'Use Controlled for validation, dynamic forms',
                    'Use Uncontrolled for file inputs & third-party libs',
                ],
                code: `// ── Controlled Component ──
// React state is the single source of truth
function ControlledForm() {
  const [name, setName] = useState('');

  return (
    <input
      value={name}                       // controlled by state
      onChange={e => setName(e.target.value)}
    />
  );
}

// ── Uncontrolled Component ──
// DOM manages value; React reads it imperatively
function UncontrolledForm() {
  const nameRef = useRef(null);

  const handleSubmit = () => {
    console.log(nameRef.current.value); // read on demand
  };

  return (
    <input
      ref={nameRef}
      defaultValue="Initial"  // not controlled, just initial
    />
  );
}`,
            },
        ],
    },
    {
        id: 'react-hooks',
        title: 'React Hooks Deep Dive',
        emoji: '🪝',
        color: '#A855F7',
        gradient: 'linear-gradient(135deg, #1a0830 0%, #2c0956 100%)',
        questions: [
            {
                id: 'q12',
                question: 'useState — advanced patterns and stale closure pitfall',
                answer: 'useState is the fundamental hook for local component state. Key pattern: always use functional updates when new state depends on previous state to avoid stale closures.',
                keyPoints: [
                    'Functional update: setCount(prev => prev + 1)',
                    'Lazy initialization: useState(() => expensiveFn())',
                    'Object state: always spread to preserve other fields',
                    'State updates are batched in React 18+',
                ],
                code: `// ✅ Functional update — avoids stale closure
const handleClick = () => {
  setTimeout(() => {
    setCount(prev => prev + 1); // always latest!
  }, 1000);
};

// ❌ Stale closure bug
const handleBug = () => {
  setTimeout(() => {
    setCount(count + 1); // count is stale in closure!
  }, 1000);
};

// Lazy initialization (expensive computation runs once)
const [data] = useState(() => {
  const saved = localStorage.getItem('data');
  return saved ? JSON.parse(saved) : { items: [] };
});

// Object state — always spread!
const [user, setUser] = useState({ name: '', email: '' });
const updateField = field => e =>
  setUser(prev => ({ ...prev, [field]: e.target.value }));

// Batch updates (React 18+)
// React automatically batches these into ONE re-render
function handleClick() {
  setCount(c => c + 1);  // ⎤
  setName('Bob');         // ⎥ → single render
  setActive(true);        // ⎦
}`,
            },
            {
                id: 'q13',
                question: 'useEffect — complete guide with cleanup',
                answer: 'useEffect lets you perform side effects after rendering. The cleanup function prevents memory leaks. The dependency array controls when the effect runs.',
                keyPoints: [
                    'No deps array: runs after every render',
                    'Empty []: runs once on mount only',
                    '[dep]: runs when dep changes (and on mount)',
                    'Return cleanup function to prevent memory leaks',
                ],
                code: `// Variants
useEffect(() => { /* every render */ });
useEffect(() => { /* mount only  */ }, []);
useEffect(() => { /* id changes  */ }, [id]);

// Timer with cleanup
useEffect(() => {
  const id = setInterval(() => {
    setSeconds(s => s + 1);
  }, 1000);
  return () => clearInterval(id); // ← cleanup on unmount
}, []);

// Safe async data fetching (no race conditions)
useEffect(() => {
  let cancelled = false;

  async function load() {
    setLoading(true);
    try {
      const data = await fetch(\`/api/users/\${userId}\`)
        .then(r => r.json());
      if (!cancelled) setUser(data); // ← guard
    } catch (err) {
      if (!cancelled) setError(err.message);
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  load();
  return () => { cancelled = true; }; // cleanup
}, [userId]);

// useLayoutEffect: runs BEFORE browser paint
// Use for reading DOM measurements
useLayoutEffect(() => {
  const h = ref.current.getBoundingClientRect().height;
  setHeight(h);
}, []);`,
            },
            {
                id: 'q14',
                question: 'useCallback and useMemo — when to use (and when NOT to)',
                answer: 'useMemo caches expensive computations. useCallback caches function references. Both prevent unnecessary re-renders when used correctly. Don\'t over-optimize — profile first!',
                keyPoints: [
                    'useMemo → cache expensive computations / object references',
                    'useCallback → stable function ref for memoized children',
                    'Child must be wrapped in React.memo to benefit',
                    'Skip them for cheap operations — the overhead is real!',
                ],
                code: `// useMemo: cache expensive computation
const filteredItems = useMemo(
  () => items.filter(x => x.name.includes(query)),
  [items, query]  // only recalculates when these change
);

// ❌ Over-optimization — trivial math, no benefit
const doubled = useMemo(() => count * 2, [count]);
// Just write: const doubled = count * 2;

// useCallback: stable function reference
const handleClick = useCallback(() => {
  setCount(c => c + 1);
}, []); // empty deps = always same reference

// useCallback ONLY helps when child is memoized:
const Child = React.memo(({ onClick }) => {
  console.log('Child rendered'); // won't fire unless onClick changes
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [dark, setDark] = useState(false);

  const handleClick = useCallback(
    () => setCount(c => c + 1),
    [] // stable — Child won't re-render on dark toggle!
  );
  return (
    <div style={{ background: dark ? '#000' : '#fff' }}>
      <button onClick={() => setDark(d => !d)}>Toggle</button>
      <Child onClick={handleClick} />
    </div>
  );
}`,
            },
            {
                id: 'q15',
                question: 'useRef — DOM refs, mutable values, previous value pattern',
                answer: 'useRef returns a mutable object whose .current property persists across renders WITHOUT causing re-renders. Great for DOM access, timers, and tracking previous values.',
                keyPoints: [
                    'Mutating ref.current does NOT trigger re-render',
                    'Use for DOM access: focus, scroll, measure',
                    'Store mutable values that survive renders (timer IDs)',
                    'Previous value pattern: read ref before updating',
                ],
                code: `// 1. DOM element reference
function FocusInput() {
  const inputRef = useRef(null);
  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>
        Focus
      </button>
    </>
  );
}

// 2. Mutable value (no re-render on change)
function StopWatch() {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null); // stores timer ID

  const start = () => {
    intervalRef.current = setInterval(
      () => setTime(t => t + 1), 1000
    );
  };
  const stop = () => clearInterval(intervalRef.current);

  return <>{time}s <button onClick={start}>Start</button></>;
}

// 3. Previous value pattern
function usePrevious(value) {
  const ref = useRef(undefined);
  useEffect(() => {
    ref.current = value; // updates AFTER render
  });
  return ref.current; // returns PREVIOUS render's value
}

function Counter({ count }) {
  const prev = usePrevious(count);
  return <p>Now: {count}, Before: {prev}</p>;
}`,
            },
            {
                id: 'q16',
                question: 'useContext and useReducer — complex shared state',
                answer: 'useContext provides a way to share values without prop drilling. useReducer is like Redux in miniature — better than useState for complex, interdependent state.',
                keyPoints: [
                    'Context avoids prop drilling for app-wide state',
                    'Split contexts to prevent unnecessary re-renders',
                    'useReducer for multiple related state transitions',
                    'Combine Context + useReducer for Redux-like pattern',
                ],
                code: `// useContext
const ThemeContext = createContext('light');

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function Button() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
      Current: {theme}
    </button>
  );
}

// useReducer — predictable state transitions
const initialState = { count: 0, loading: false, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': return { ...state, count: state.count + 1 };
    case 'DECREMENT': return { ...state, count: state.count - 1 };
    case 'RESET':     return initialState;
    case 'SET_LOADING': return { ...state, loading: action.payload };
    default: throw new Error(\`Unknown action: \${action.type}\`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </>
  );
}`,
            },
            {
                id: 'q17',
                question: 'Custom Hooks — useFetch, useDebounce, useLocalStorage',
                answer: 'Custom hooks let you extract and reuse stateful logic across components. They must start with "use". They compose other hooks together.',
                keyPoints: [
                    'Must start with "use" for hooks rules to apply',
                    'Can compose any other hooks inside',
                    'Return whatever the component needs (value, setter, state)',
                    'Share logic without HOC or render props complexity',
                ],
                code: `// useFetch — reusable data fetching
function useFetch(url) {
  const [state, setState] = useState({
    data: null, loading: true, error: null
  });

  useEffect(() => {
    let cancelled = false;
    setState(s => ({ ...s, loading: true }));

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ data: null, loading: false, error: err.message });
      });

    return () => { cancelled = true; };
  }, [url]);

  return state;
}

// useDebounce — delay value update
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// useLocalStorage — persisted state
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}`,
            },
        ],
    },
    {
        id: 'react-performance',
        title: 'React Performance Optimization',
        emoji: '⚡',
        color: '#FBBF24',
        gradient: 'linear-gradient(135deg, #1c0a00 0%, #2d1500 100%)',
        questions: [
            {
                id: 'q18',
                question: 'React.memo, Code Splitting, and List Virtualization',
                answer: 'Performance optimization tools: React.memo prevents unnecessary re-renders, lazy/Suspense enables on-demand loading, and virtualization renders only visible list items.',
                keyPoints: [
                    'React.memo: skip re-render if props unchanged (shallow compare)',
                    'Always combine with useCallback for function props',
                    'lazy() + Suspense: load components on demand',
                    'Virtualize lists of 100+ items with react-window',
                ],
                code: `// React.memo — prevent re-render if props unchanged
const Card = React.memo(({ user }) => (
  <div>{user.name}</div>
));

// Custom comparison (return true = props equal = skip render)
const SmartCard = React.memo(
  ({ user }) => <div>{user.name}</div>,
  (prev, next) => prev.user.id === next.user.id
);

// Code Splitting with lazy + Suspense
import { lazy, Suspense } from 'react';
const Dashboard = lazy(() => import('./Dashboard'));
const Settings  = lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<div className="spinner">Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}

// List Virtualization (react-window)
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  );
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}`,
            },
        ],
    },
    {
        id: 'nextjs',
        title: 'Next.js App Router',
        emoji: '▲',
        color: '#FFFFFF',
        gradient: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
        questions: [
            {
                id: 'q19',
                question: 'SSR vs SSG vs ISR vs CSR — when to use each',
                answer: 'Choose your rendering strategy based on data freshness requirements, personalization needs, and performance goals.',
                keyPoints: [
                    'CSR: user dashboards, auth pages, real-time data',
                    'SSR: personalized pages, user-specific content',
                    'SSG: blogs, docs, marketing — fast, SEO-friendly',
                    'ISR: product pages — static speed + periodic refresh',
                ],
                code: `// SSG (default — cached forever at build time)
async function BlogPage() {
  const data = await fetch(url, {
    cache: 'force-cache'  // default
  }).then(r => r.json());
  return <article>{data.content}</article>;
}

// ISR — regenerate every 60 seconds in background
async function ProductPage({ params }) {
  const product = await fetch(\`/api/products/\${params.id}\`, {
    next: { revalidate: 60 }
  }).then(r => r.json());
  return <div>{product.name}</div>;
}

// SSR — fresh every request, never cached
async function DashboardPage() {
  const user = await fetch('/api/me', {
    cache: 'no-store'
  }).then(r => r.json());
  return <div>Hello, {user.name}</div>;
}

// Generate static paths for dynamic SSG routes
export async function generateStaticParams() {
  const posts = await fetch('/api/posts').then(r => r.json());
  return posts.map(p => ({ slug: p.slug }));
}`,
            },
            {
                id: 'q20',
                question: 'App Router Folder Structure and Special Files',
                answer: 'Next.js App Router uses file-system routing where special filenames create specific behavior automatically.',
                keyPoints: [
                    'layout.tsx: persistent shell, not re-rendered on navigation',
                    'loading.tsx: automatic Suspense fallback',
                    'error.tsx: error boundary for the segment',
                    'Route Groups (folder): share layouts without affecting URL',
                ],
                code: `app/
├── layout.tsx        ← Root layout (persistent shell)
├── page.tsx          ← Route: /
├── loading.tsx       ← Auto Suspense fallback
├── error.tsx         ← Error boundary
├── not-found.tsx     ← 404 page
│
├── blog/
│   ├── page.tsx      ← Route: /blog
│   └── [slug]/
│       └── page.tsx  ← Route: /blog/:slug
│
├── (marketing)/      ← Route Group (no URL impact)
│   ├── layout.tsx    ← Only for routes in this group
│   ├── about/page.tsx    ← Route: /about
│   └── pricing/page.tsx  ← Route: /pricing
│
└── api/
    └── users/
        └── route.ts  ← API Route Handler

// API Route Handler
export async function GET(req) {
  const users = await db.user.findMany();
  return Response.json(users);
}

export async function POST(req) {
  const body = await req.json();
  const user = await db.user.create({ data: body });
  return Response.json(user, { status: 201 });
}`,
            },
            {
                id: 'q21',
                question: 'Server Components vs Client Components',
                answer: 'Server Components run exclusively on the server — zero client JS, direct DB access. Client Components ("use client") handle interactivity, hooks, and browser APIs.',
                keyPoints: [
                    'Server Components: default in App Router, zero client JS',
                    'Direct DB/API access without exposing secrets',
                    'Client Components: hooks, events, browser APIs',
                    'SC can render CC (pass data as props), but NOT vice versa',
                ],
                code: `// ── Server Component (default) ──
// app/users/page.tsx — runs ONLY on server
import { db } from '@/lib/db';

async function UsersPage() {
  // Direct DB access — no API needed! Secrets stay safe.
  const users = await db.user.findMany();

  return (
    <main>
      {users.map(u => <div key={u.id}>{u.name}</div>)}
      <AddUserButton />  {/* Client component for interactivity */}
    </main>
  );
}

// ── Client Component ──
// components/AddUserButton.tsx
'use client';  // ← This directive makes it a Client Component

import { useState } from 'react';

function AddUserButton() {
  const [open, setOpen] = useState(false); // hooks work here ✅
  return (
    <>
      <button onClick={() => setOpen(true)}>Add User</button>
      {open && <UserModal onClose={() => setOpen(false)} />}
    </>
  );
}

// ✅ Server Component can RENDER Client Component
// ❌ Client Component CANNOT import Server Component`,
            },
            {
                id: 'q22',
                question: 'Server Actions — mutations without API routes',
                answer: "Server Actions let you run server-side code directly from forms and components — no API route needed. They're type-safe, support progressive enhancement, and integrate with Next.js caching.",
                keyPoints: [
                    'Mark with "use server" directive',
                    'Can be called directly as form action attr',
                    'revalidatePath/revalidateTag to bust cache after mutation',
                    'useActionState for loading/error states on client',
                ],
                code: `// app/actions/user.ts
'use server';  // ← all functions here run on server

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createUser(formData: FormData) {
  const data = {
    name:  formData.get('name') as string,
    email: formData.get('email') as string,
  };

  await db.user.create({ data });
  revalidatePath('/users'); // bust the cache
  redirect('/users');        // navigate after action
}

// Use directly in a <form> — no onSubmit needed!
function CreateUserForm() {
  return (
    <form action={createUser}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit">Create User</button>
    </form>
  );
}

// With loading/error states (React 19 / Next.js 15)
'use client';
import { useActionState } from 'react';

function SmartForm() {
  const [state, formAction, isPending] = useActionState(
    createUser, null
  );
  return (
    <form action={formAction}>
      <input name="name" required />
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  );
}`,
            },
            {
                id: 'q23',
                question: "Next.js Caching Layers — all 4 explained",
                answer: 'Next.js has 4 distinct caching layers that work together to maximize performance while keeping data fresh.',
                keyPoints: [
                    'Request Memo: deduplicates same fetch() in one render tree',
                    'Data Cache: persists fetch results server-side (disk)',
                    'Full Route Cache: cached HTML+RSC for static routes',
                    'Router Cache: client-side memory for fast navigation',
                ],
                code: `// 4 Caching Layers:
// 1. Request Memoization  — same fetch() in one render = 1 request
// 2. Data Cache           — persists across requests on disk
// 3. Full Route Cache     — cached HTML for static routes
// 4. Router Cache         — client-side navigation cache

// Time-based revalidation (ISR)
fetch(url, { next: { revalidate: 60 } }); // fresh every 60s

// Tag-based on-demand revalidation
fetch(url, { next: { tags: ['products'] } });

// Invalidate by tag from Server Action:
import { revalidateTag, revalidatePath } from 'next/cache';

export async function updateProduct(id, data) {
  await db.product.update({ where: { id }, data });
  revalidateTag('products');    // by tag
  revalidatePath('/products');  // by path
}

// For DB queries (non-fetch), use unstable_cache
import { unstable_cache } from 'next/cache';

const getCachedProducts = unstable_cache(
  async () => db.product.findMany(),
  ['products'],                      // cache key
  { revalidate: 60, tags: ['products'] }
);`,
            },
        ],
    },
    {
        id: 'advanced',
        title: 'Advanced Patterns & TypeScript',
        emoji: '🔷',
        color: '#3B82F6',
        gradient: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 100%)',
        questions: [
            {
                id: 'q24',
                question: 'HOC vs Render Props vs Custom Hooks',
                answer: 'Three patterns for sharing logic between components. Custom Hooks are the modern preferred approach — they compose naturally and avoid component tree nesting.',
                keyPoints: [
                    'HOC: wraps component, injects props — causes wrapper hell',
                    'Render Props: shares via children function — verbose',
                    'Custom Hooks: modern, clean, composable — use this!',
                    'All three achieve the same goal of logic reuse',
                ],
                code: `// ── HOC (Higher-Order Component) ──
function withAuth(Component) {
  return function AuthWrapper(props) {
    const { user } = useAuth();
    if (!user) return <Redirect to="/login" />;
    return <Component {...props} user={user} />;
  };
}
const ProtectedDashboard = withAuth(Dashboard);

// ── Render Props ──
function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {children(pos)}  {/* passes data via function call */}
    </div>
  );
}
<MouseTracker>
  {({ x, y }) => <p>Mouse: {x}, {y}</p>}
</MouseTracker>

// ── Custom Hook (modern, preferred ✅) ──
function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = e => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return pos;
}

// Cleanest API:
function Component() {
  const { x, y } = useMousePosition();
  return <p>Mouse: {x}, {y}</p>;
}`,
            },
            {
                id: 'q25',
                question: 'Common TypeScript Patterns for React/Next.js',
                answer: 'TypeScript with React: type your props, use generics for reusable components, extend HTML element types, and type your hooks properly.',
                keyPoints: [
                    'interface > type for component props (extensible)',
                    'Generics make components truly reusable',
                    'Extend HTML attributes to keep native props',
                    'Discriminated unions for variant props',
                ],
                code: `// Component props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(i => (
        <li key={keyExtractor(i)}>{renderItem(i)}</li>
      ))}
    </ul>
  );
}

// Extend HTML element props (keep all native attributes!)
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Input({ label, error, ...inputProps }: InputProps) {
  return (
    <div>
      <label>{label}</label>
      <input {...inputProps} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

// Next.js page props
interface PageProps {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}`,
            },
        ],
    },
    {
        id: 'quick-fire',
        title: 'Tricky Quick-Fire Questions',
        emoji: '🎯',
        color: '#EF4444',
        gradient: 'linear-gradient(135deg, #1a0000 0%, #3b0000 100%)',
        questions: [
            {
                id: 'q26',
                question: 'null vs undefined vs undeclared',
                answer: 'Three distinct states of "nothing" in JavaScript, each with different semantics and behaviors.',
                keyPoints: [
                    'undefined: declared but not assigned',
                    'null: intentionally set to "empty"',
                    'undeclared: variable never declared in scope',
                    'typeof is safe for undeclared variables (no error)',
                ],
                code: `let a;
console.log(a);         // undefined (declared, not assigned)
console.log(typeof a);  // 'undefined'

let b = null;
console.log(b);         // null (intentionally empty)
console.log(typeof b);  // 'object' ← famous JS quirk!

console.log(c);         // ❌ ReferenceError (never declared)
console.log(typeof c);  // 'undefined' ← typeof is safe!

// Common checks:
if (value == null) { }   // catches BOTH null AND undefined
if (value === null) { }  // only null
if (value === undefined) { } // only undefined
if (value != null) { }   // not null AND not undefined`,
            },
            {
                id: 'q27',
                question: 'What does this print? (Event Loop question)',
                answer: 'Classic interview question testing knowledge of the event loop execution order.',
                keyPoints: [
                    'Synchronous code runs first (console.log)',
                    'Microtasks (Promises) run before ANY macrotask',
                    'Macrotasks (setTimeout) run last',
                    'setTimeout 0ms does NOT mean "immediately"',
                ],
                code: `console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);

// Answer: 1, 4, 3, 2 ✅

// Why?
// 1 → Sync runs immediately
// 4 → Still sync, runs next
// 3 → Microtask (Promise) — runs BEFORE any macrotask
// 2 → Macrotask (setTimeout) — runs last

// ─── Advanced version ───
async function async1() {
  console.log('a1 start');
  await async2();
  console.log('a1 end');
}
async function async2() { console.log('a2'); }

console.log('start');
setTimeout(() => console.log('timeout'), 0);
async1();
console.log('end');

// Output: start → a1 start → a2 → end → a1 end → timeout`,
            },
            {
                id: 'q28',
                question: 'Shallow Copy vs Deep Copy',
                answer: 'Shallow copy duplicates the top level only — nested objects still share references. Deep copy creates a fully independent copy of the entire object tree.',
                keyPoints: [
                    'Spread {...obj} and Object.assign() are shallow',
                    'JSON.parse(JSON.stringify()) loses Functions/Dates/undefined',
                    'structuredClone() is the modern native deep copy API',
                    'Use Lodash _.cloneDeep for complex cases',
                ],
                code: `const obj = { a: 1, b: { c: 2 } };

// ── Shallow Copy (nested refs shared!) ──
const shallow1 = { ...obj };
const shallow2 = Object.assign({}, obj);

shallow1.b.c = 99;
console.log(obj.b.c); // 99 ← ORIGINAL AFFECTED! ❌

shallow1.a = 100;
console.log(obj.a); // 1 ← top-level is fine ✅

// ── Deep Copy options ──

// JSON method — simple but loses edge cases
const deep1 = JSON.parse(JSON.stringify(obj));
// Loses: undefined, Functions, Date, Set, Map, circular refs

// structuredClone — modern, native ✅
const deep2 = structuredClone(obj);
deep2.b.c = 999;
console.log(obj.b.c); // 2 ← original untouched ✅

// Handles: Dates, ArrayBuffers, Maps, Sets, circular refs
// Does NOT handle: functions, DOM nodes, class instances`,
            },
            {
                id: 'q29',
                question: 'Prop Drilling — problem and solutions',
                answer: 'Prop drilling is passing props through multiple intermediate components that don\'t need them. Multiple solutions of varying complexity.',
                keyPoints: [
                    'Context API: great for theme, auth, locale',
                    'Component composition: pass JSX, not data',
                    'Zustand/Jotai: lightweight global state',
                    'Redux: for complex state in large apps',
                ],
                code: `// ❌ Prop Drilling — user passed through layers
function App() {
  const user = useCurrentUser();
  return <Layout user={user} />;
}
function Layout({ user }) {
  return <Header user={user} />;  // doesn't need user
}
function Header({ user }) {
  return <Nav user={user} />;    // doesn't need user
}
function Nav({ user }) {
  return <Avatar user={user} />; // ONLY this needs user
}

// ✅ Fix 1: Context API
const UserContext = createContext(null);

function App() {
  const user = useCurrentUser();
  return (
    <UserContext.Provider value={user}>
      <Layout />  {/* no prop needed! */}
    </UserContext.Provider>
  );
}

function Avatar() {
  const user = useContext(UserContext); // access anywhere
  return <img src={user.avatar} />;
}

// ✅ Fix 2: Component Composition
function App() {
  const user = useCurrentUser();
  // Pass the JSX, not the data — no drilling!
  return <Layout header={<Avatar user={user} />} />;
}`,
            },
            {
                id: 'q30',
                question: 'WeakMap and WeakSet — what and when?',
                answer: 'WeakMap and WeakSet hold weak references to objects — entries are automatically garbage collected when the key object has no other references.',
                keyPoints: [
                    'Keys must be objects (not primitives)',
                    'Entries are automatically GC\'d — no memory leaks',
                    'Not enumerable — you can\'t iterate them',
                    'Use case: caching per DOM node, private data',
                ],
                code: `// WeakMap: object keys, auto garbage collected
const cache = new WeakMap();

function processUser(user) {
  if (cache.has(user)) {
    return cache.get(user); // return cached result
  }
  const result = expensiveComputation(user);
  cache.set(user, result);  // auto-cleaned when user is GC'd
  return result;
}

// Private data pattern
const _private = new WeakMap();

class Person {
  constructor(name, age) {
    _private.set(this, { age }); // age is truly private!
    this.name = name;
  }
  getAge() {
    return _private.get(this).age; // accessible inside class
  }
}
const p = new Person('Alice', 30);
console.log(p.name);    // 'Alice' (public)
console.log(p.age);     // undefined (private!)
console.log(p.getAge()); // 30 (via method)

// WeakSet: track objects without preventing GC
const visited = new WeakSet();
function processOnce(node) {
  if (visited.has(node)) return;
  visited.add(node);
  doWork(node); // only processes each node once
}`,
            },
        ],
    },
];

export const topicsTable = [
    { topic: 'Closures', points: 'Scope chain, private state, loop bug with var vs let' },
    { topic: 'Event Loop', points: 'Call Stack, Microtask vs Macrotask, Promise priority' },
    { topic: 'Promises / async-await', points: 'Chaining, error handling, parallel with Promise.all' },
    { topic: 'React Hooks', points: 'useState, useEffect, useCallback, useMemo, useRef, custom hooks' },
    { topic: 'React Rendering', points: 'Virtual DOM, reconciliation, React.memo, key prop' },
    { topic: 'useEffect', points: 'Dependency array, cleanup, stale closures, data fetching' },
    { topic: 'Context vs Redux', points: 'When to use each, performance implications' },
    { topic: 'Next.js Rendering', points: 'SSR/SSG/ISR/CSR differences and when to use each' },
    { topic: 'Server Components', points: 'Zero client JS, direct DB, vs Client Components' },
    { topic: 'TypeScript', points: 'Generics, discriminated unions, utility types (Partial, Pick, Omit)' },
];

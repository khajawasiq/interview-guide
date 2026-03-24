/**
 * External reference links for each interview question.
 * Keyed by question id (q1–q30).
 * Imported by data.js and merged into each question at runtime.
 */
export const questionRefs = {
    q1: [
        { label: 'MDN – Hoisting',                url: 'https://developer.mozilla.org/en-US/docs/Glossary/Hoisting' },
        { label: 'MDN – Temporal Dead Zone',       url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz' },
        { label: 'JavaScript.info – var/hoisting', url: 'https://javascript.info/var' },
        { label: 'ECMAScript – Variable Statement', url: 'https://tc39.es/ecma262/#sec-variable-statement' },
    ],
    q2: [
        { label: 'MDN – Closures',                   url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures' },
        { label: 'JavaScript.info – Closure',        url: 'https://javascript.info/closure' },
        { label: "You Don't Know JS – Scope & Closures", url: 'https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/README.md' },
        { label: 'Eric Elliott – What is a Closure?', url: 'https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-closure-b2f0d2152b36' },
    ],
    q3: [
        { label: 'MDN – Equality comparisons',             url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness' },
        { label: 'ECMAScript – Abstract Equality Algo',    url: 'https://tc39.es/ecma262/#sec-abstract-equality-comparison' },
        { label: 'JavaScript.info – Comparisons',          url: 'https://javascript.info/comparison' },
        { label: 'MDN – Object.is()',                      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is' },
    ],
    q4: [
        { label: 'MDN – Event Loop',                       url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop' },
        { label: "Jake Archibald – Tasks, Microtasks",     url: 'https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/' },
        { label: 'Lydia Hallie – JS Visualized Event Loop', url: 'https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif' },
        { label: "Philip Roberts – What the heck is the event loop?", url: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ' },
    ],
    q5: [
        { label: "MDN – this keyword",                     url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this' },
        { label: "MDN – Function.prototype.bind()",        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind' },
        { label: "JavaScript.info – Object methods, this", url: 'https://javascript.info/object-methods' },
        { label: "You Don't Know JS – this",               url: 'https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20%26%20object%20prototypes/ch2.md' },
    ],
    q6: [
        { label: 'MDN – Prototype chain',                  url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain' },
        { label: 'JavaScript.info – Prototypal Inheritance', url: 'https://javascript.info/prototype-inheritance' },
        { label: 'MDN – Object.create()',                  url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create' },
        { label: 'MDN – Classes',                          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes' },
    ],
    q7: [
        { label: 'MDN – Destructuring assignment',         url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment' },
        { label: 'MDN – Spread syntax',                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax' },
        { label: 'MDN – Rest parameters',                  url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters' },
        { label: 'JavaScript.info – Destructuring',        url: 'https://javascript.info/destructuring-assignment' },
    ],
    q8: [
        { label: 'MDN – Promise',                          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise' },
        { label: 'MDN – Promise.all()',                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all' },
        { label: 'MDN – Promise.allSettled()',             url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled' },
        { label: 'JavaScript.info – Promise chaining',     url: 'https://javascript.info/promise-chaining' },
    ],
    q9: [
        { label: 'MDN – async/await',                      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function' },
        { label: 'JavaScript.info – Async/await',          url: 'https://javascript.info/async-await' },
        { label: 'Lydia Hallie – JS Visualized: Promises', url: 'https://dev.to/lydiahallie/javascript-visualized-promises-async-await-5gke' },
        { label: 'MDN – Error handling with promises',     url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#error_handling' },
    ],
    q10: [
        { label: 'React Docs – Rendering',                 url: 'https://react.dev/learn/render-and-commit' },
        { label: 'React Docs – reconciliation (legacy)',   url: 'https://legacy.reactjs.org/docs/reconciliation.html' },
        { label: 'Dan Abramov – React as a UI Runtime',    url: 'https://overreacted.io/react-as-a-ui-runtime/' },
        { label: 'React Fibre Architecture',               url: 'https://github.com/acdlite/react-fiber-architecture' },
    ],
    q11: [
        { label: 'React Docs – Controlled components',     url: 'https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components' },
        { label: 'MDN – Forms in React',                   url: 'https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_interactivity_forms_events' },
        { label: 'React Docs – useRef',                    url: 'https://react.dev/reference/react/useRef' },
        { label: 'React Docs – Referencing values with refs', url: 'https://react.dev/learn/referencing-values-with-refs' },
    ],
    q12: [
        { label: 'React Docs – useState',                  url: 'https://react.dev/reference/react/useState' },
        { label: 'React Docs – State as snapshot',         url: 'https://react.dev/learn/state-as-a-snapshot' },
        { label: 'React Docs – Queueing state updates',    url: 'https://react.dev/learn/queueing-a-series-of-state-updates' },
        { label: 'React 18 – Automatic batching',          url: 'https://react.dev/blog/2022/03/29/react-v18#new-feature-automatic-batching' },
    ],
    q13: [
        { label: 'React Docs – useEffect',                 url: 'https://react.dev/reference/react/useEffect' },
        { label: 'React Docs – Synchronizing with Effects', url: 'https://react.dev/learn/synchronizing-with-effects' },
        { label: 'React Docs – You might not need an Effect', url: 'https://react.dev/learn/you-might-not-need-an-effect' },
        { label: 'Dan Abramov – A Complete Guide to useEffect', url: 'https://overreacted.io/a-complete-guide-to-useeffect/' },
    ],
    q14: [
        { label: 'React Docs – useMemo',                   url: 'https://react.dev/reference/react/useMemo' },
        { label: 'React Docs – useCallback',               url: 'https://react.dev/reference/react/useCallback' },
        { label: 'React Docs – memo()',                    url: 'https://react.dev/reference/react/memo' },
        { label: 'React Docs – Skipping expensive recalculations', url: 'https://react.dev/learn/react-compiler' },
    ],
    q15: [
        { label: 'React Docs – useRef',                    url: 'https://react.dev/reference/react/useRef' },
        { label: 'React Docs – Manipulating the DOM with Refs', url: 'https://react.dev/learn/manipulating-the-dom-with-refs' },
        { label: 'React Docs – Referencing values with Refs', url: 'https://react.dev/learn/referencing-values-with-refs' },
    ],
    q16: [
        { label: 'React Docs – useContext',                url: 'https://react.dev/reference/react/useContext' },
        { label: 'React Docs – useReducer',                url: 'https://react.dev/reference/react/useReducer' },
        { label: 'React Docs – Scaling up with Reducer & Context', url: 'https://react.dev/learn/scaling-up-with-reducer-and-context' },
        { label: 'React Docs – Passing data deeply with Context', url: 'https://react.dev/learn/passing-data-deeply-with-context' },
    ],
    q17: [
        { label: 'React Docs – Reusing logic with custom Hooks', url: 'https://react.dev/learn/reusing-logic-with-custom-hooks' },
        { label: 'React Docs – Rules of Hooks',            url: 'https://react.dev/reference/rules/rules-of-hooks' },
        { label: 'usehooks.com – Collection of custom hooks', url: 'https://usehooks.com/' },
        { label: 'ahooks – Production hooks library',      url: 'https://ahooks.js.org/' },
    ],
    q18: [
        { label: 'React Docs – memo()',                    url: 'https://react.dev/reference/react/memo' },
        { label: 'React Docs – lazy()',                    url: 'https://react.dev/reference/react/lazy' },
        { label: 'react-window – List virtualization',     url: 'https://github.com/bvaughn/react-window' },
        { label: 'React Docs – Code splitting',            url: 'https://react.dev/reference/react/lazy#suspense-for-code-splitting' },
    ],
    q19: [
        { label: 'Next.js Docs – Data fetching',           url: 'https://nextjs.org/docs/app/building-your-application/data-fetching' },
        { label: 'Next.js Docs – Rendering strategies',    url: 'https://nextjs.org/docs/app/building-your-application/rendering' },
        { label: 'Next.js Docs – ISR',                     url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration' },
        { label: 'Next.js Docs – generateStaticParams',    url: 'https://nextjs.org/docs/app/api-reference/functions/generate-static-params' },
    ],
    q20: [
        { label: 'Next.js Docs – App Router',              url: 'https://nextjs.org/docs/app' },
        { label: 'Next.js Docs – Routing fundamentals',    url: 'https://nextjs.org/docs/app/building-your-application/routing' },
        { label: 'Next.js Docs – Special files',           url: 'https://nextjs.org/docs/app/building-your-application/routing#file-conventions' },
        { label: 'Next.js Docs – Route groups',            url: 'https://nextjs.org/docs/app/building-your-application/routing/route-groups' },
    ],
    q21: [
        { label: 'Next.js Docs – Server Components',       url: 'https://nextjs.org/docs/app/building-your-application/rendering/server-components' },
        { label: 'Next.js Docs – Client Components',       url: 'https://nextjs.org/docs/app/building-your-application/rendering/client-components' },
        { label: 'React Docs – Server Components',         url: 'https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components' },
        { label: 'Next.js Docs – Composition patterns',    url: 'https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns' },
    ],
    q22: [
        { label: 'Next.js Docs – Server Actions',          url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations' },
        { label: 'React Docs – useActionState',            url: 'https://react.dev/reference/react/useActionState' },
        { label: 'Next.js Docs – revalidatePath',          url: 'https://nextjs.org/docs/app/api-reference/functions/revalidatePath' },
        { label: 'Next.js Docs – redirect()',              url: 'https://nextjs.org/docs/app/api-reference/functions/redirect' },
    ],
    q23: [
        { label: 'Next.js Docs – Caching',                 url: 'https://nextjs.org/docs/app/building-your-application/caching' },
        { label: 'Next.js Docs – unstable_cache',          url: 'https://nextjs.org/docs/app/api-reference/functions/unstable_cache' },
        { label: 'Next.js Docs – revalidateTag',           url: 'https://nextjs.org/docs/app/api-reference/functions/revalidateTag' },
        { label: 'Next.js Docs – fetch() caching',        url: 'https://nextjs.org/docs/app/api-reference/functions/fetch' },
    ],
    q24: [
        { label: 'React Docs – Custom hooks',              url: 'https://react.dev/learn/reusing-logic-with-custom-hooks' },
        { label: 'MDN – Higher-Order Functions',           url: 'https://developer.mozilla.org/en-US/docs/Glossary/Higher-order_function' },
        { label: 'React Docs – Render Props (legacy)',     url: 'https://legacy.reactjs.org/docs/render-props.html' },
        { label: 'HOC vs Hooks – Kent C Dodds',           url: 'https://kentcdodds.com/blog/react-hooks-whats-going-to-happen-to-react-component-patterns' },
    ],
    q25: [
        { label: 'TypeScript Handbook – Generics',         url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html' },
        { label: 'TypeScript Handbook – Utility Types',    url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html' },
        { label: 'React TypeScript Cheatsheet',           url: 'https://react-typescript-cheatsheet.netlify.app/' },
        { label: 'TypeScript – Discriminated Unions',      url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions' },
    ],
    q26: [
        { label: 'MDN – null',                             url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null' },
        { label: 'MDN – undefined',                        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined' },
        { label: 'JavaScript.info – null vs undefined',    url: 'https://javascript.info/types#the-null-value' },
        { label: 'MDN – typeof operator',                  url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof' },
    ],
    q27: [
        { label: 'MDN – Event Loop',                       url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop' },
        { label: "Lydia Hallie – JS Visualized Promises",  url: 'https://dev.to/lydiahallie/javascript-visualized-promises-async-await-5gke' },
        { label: 'JavaScript.info – Event Loop',           url: 'https://javascript.info/event-loop' },
    ],
    q28: [
        { label: 'MDN – structuredClone()',                url: 'https://developer.mozilla.org/en-US/docs/Web/API/structuredClone' },
        { label: 'MDN – Spread syntax (shallow copy)',     url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax' },
        { label: 'JavaScript.info – Object copying',       url: 'https://javascript.info/object-copy' },
        { label: 'Lodash – cloneDeep()',                   url: 'https://lodash.com/docs/#cloneDeep' },
    ],
    q29: [
        { label: 'React Docs – Passing data deeply (Context)', url: 'https://react.dev/learn/passing-data-deeply-with-context' },
        { label: 'Zustand – Lightweight state manager',    url: 'https://github.com/pmndrs/zustand' },
        { label: 'Jotai – Atomic state for React',         url: 'https://jotai.org/' },
        { label: 'Redux Toolkit – Official Redux',         url: 'https://redux-toolkit.js.org/' },
    ],
    q30: [
        { label: 'MDN – WeakMap',                          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap' },
        { label: 'MDN – WeakSet',                          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet' },
        { label: 'JavaScript.info – WeakMap and WeakSet',  url: 'https://javascript.info/weakmap-weakset' },
        { label: 'MDN – Memory management / Garbage collection', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management' },
    ],
};

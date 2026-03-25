<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

# Senior Developer Code Guidelines & Best Practices

As an AI assistant contributing to `xiroo-client`, you must adhere to the following senior-level development principles to maintain a clean, readable, minimal, and scalable e-commerce architecture.

## 1. Architecture: Mini Folder Splitting (Feature-Based)

Instead of grouping files globally by purely technical type (e.g., a massive `components/` folder or a massive `hooks/` folder), use a **Feature-Sliced Design**.

```text
src/
├── app/                  # Next.js App Router pages, layouts, and route handlers
├── components/
│   └── ui/               # Global, agnostic, highly reusable UI components (Button, Input, Modal)
├── features/             # Feature modules - "Mini Folder Structure"
│   ├── cart/             # Everything related to the cart feature
│   │   ├── components/   # Cart-specific components (CartDrawer, CartItem)
│   │   ├── hooks/        # Cart business logic (useCart, useCheckout)
│   │   ├── api/          # Cart-specific data fetching and mutations
│   │   ├── utils/        # Cart-specific helpers
│   │   └── types.ts      # Cart-specific TypeScript interfaces
│   └── product/          # Product display and management feature
├── redux/                # Global Redux state management (store, slices, thunks)
├── lib/                  # Third-party wrapper instantiations (Axios, Prisma, Stripe)
├── hooks/                # Global generic hooks (useDebounce, useWindowSize)
└── utils/                # Global generic helpers (formatCurrency)
```

**Rule:** When building a new domain concept (like "Checkout" or "User Profile"), keep its logic, UI, and types isolated inside its own `features/` directory.

**Redux Rule:** All global state management logic must be strictly placed inside the root `redux/` folder. This includes the store configuration, root reducer, and individual state slices. Avoid scattering Redux logic across components or features.

## 2. Clean Code & Separation of Concerns (SRP)

- **Single Responsibility Principle:** A component should only do one thing. If a file exceeds 150-200 lines, it is doing too much. Extract its sections into smaller sub-components.
- **Hook-Driven UI:** Decouple business logic from UI rendering. If a component contains `useEffect`, `useState`, and complex data fetching, extract that logic into a custom hook (e.g., `useProductList()`). The component itself should only accept props and return JSX.

## 3. DRY (Don't Repeat Yourself) & Scalability

- **Strict UI Component Reuse:** Foundational, reusable UI components (Buttons, Inputs, Links, Modals) will live in `src/components/ui/`. **ALWAYS** use these shared components throughout the codebase instead of using raw HTML tags (`<button>`, `<input>`, `<a>`) or building new ones from scratch.
- **Extract Over Copy-Pasting:** Never duplicate complex UI patterns or business logic. If you write the same layout or calculation twice, abstract it into a shared generic hook or a common feature component.
- **Type Safety First:** Strongly type all props, API responses, and state using TypeScript. Avoid `any` at all costs. Utilize specific interfaces and discriminated unions for complex varying states.
- **Centralized Configuration:** Keep constant values, status codes, and environment variable wrappers in centralized config files (e.g., `src/config/constants.ts`). Avoid replacing "magic strings/numbers" throughout the components.

## 4. Next.js App Router Mastery

- **Server Components (RSC) by Default:** Treat all components as Server Components by default. This minimizes the JavaScript bundle sent to the browser, improving SEO and performance.
- **Push Client Boundaries Down:** Only add `"use client"` where absolutely necessary (e.g., components requiring `onClick`, `useState`, or browser APIs). Push these client boundaries to the extreme leaves of your component tree.
- **Streaming & Suspense:** Wrap asynchronous data fetching components in `<Suspense fallback={<Skeleton />}>` to prevent blocking the initial UI layout render.

## 5. Naming Conventions & Readability

- **PascalCase** for React components and their filenames (`ProductCard.tsx`).
- **camelCase** for objects, functions, hooks, and standard variables (`useCart()`, `calculateTotal`).
- **kebab-case** for standard directories, utility files, and URLs (`features/product-detail/format-data.ts`).
- **Boolean Naming:** Phrase boolean props/variables as answering a question (e.g., `isLoading`, `hasError`, `canCheckout`, `isMobile`).

## 6. Minimalist UI & Styling Guardrails (Tailwind CSS)

- **Always use Tailwind CSS** for styling. Never use inline styles (`style={{}}`) or standard CSS/SCSS modules unless absolutely required for a hyper-complex animation.
- Keep visual implementations uncluttered. A "minimal" store requires deep attention to breathing room (generous padding/margins) and strict visual hierarchy.
- Use predictable and consistent spacing scales via Tailwind (e.g., `p-4`, `m-6`, `gap-8`). Avoid random pixel values (`p-[13px]`). Extract complex, repeated Tailwind class names into `cn()` utility variables or component configurations.

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-rules -->
 
# Next.js: ALWAYS read docs before coding
 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
 
<!-- END:nextjs-agent-rules -->

# XIROO Project: Elite Coding Standards

Follow these rules strictly to maintain the quality, performance, and premium feel of the XIROO shop.

## 1. DRY (Don't Repeat Yourself)
- **Component Reusability**: Before creating a new component, check `src/components` for existing ones. If a pattern repeats 3+ times, abstract it into a shared component.
- **Utility First**: Place shared logic (formatters, validators, calculations) in `src/utils`. Never duplicate logic across files.
- **Constant Management**: Use `src/constants` for strings, magic numbers, and configuration objects.

## 2. Performance & Optimization
- **Next.js Features**: Use Server Components by default. Only use `'use client'` when interactivity is required (hooks, event listeners).
- **Image Optimization**: ALWAYS use the Next.js `<Image />` component with proper `width`, `height`, and `alt` tags. Use `priority` for LCP images.
- **Code Splitting**: Use `dynamic()` imports for heavy client-side components (modals, complex charts) to keep the initial bundle small.
- **Data Fetching**: Use `React Query` (TanStack Query) for client-side state/caching and native `fetch` with Next.js cache options for server-side.

## 3. Premium Design & Aesthetics
- **Design System**: Use the established color palette (HSL-based) and typography. Avoid browser default styles.
- **Micro-interactions**: Implement subtle hover effects, transitions, and framer-motion animations to make the UI feel alive and premium.
- **Visual Depth**: Use glassmorphism (backdrop-blur), soft shadows, and subtle gradients instead of flat colors.

## 4. Code Quality & Maintenance
- **Atomic Commits**: Ensure changes are logically grouped and focused on a single task.
- **Self-Documenting Code**: Use descriptive variable/function names. Add comments only for complex logic that isn't immediately obvious.
- **Modular Architecture (File Size)**: Keep files focused and concise. A single file should have a maximum of 200 - 250 lines of code. If a file exceeds 250 lines, split it into smaller, logically separated pieces.

## 5. Security
- **Data Sanitization**: Never trust user input. Sanitize all data before rendering or sending to the server.
- **Environment Variables**: Never hardcode secrets. Use `.env.local` and `process.env`.

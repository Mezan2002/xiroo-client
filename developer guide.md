# Xiroo Shop: Developer Guide

Welcome to the Xiroo Boutique development team. This guide is designed to help you navigate our codebase and maintain our high standards of architectural excellence and premium aesthetic.

## 1. Core Technology Stack
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Vanilla CSS for custom logic)
- **Server-State**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Client-State**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 2. Directory Structure
```text
/app        -> Next.js App Router (Pages, Layouts, CSS)
/components -> Modular UI components
  /ui       -> Atomic components (Button, Badge, etc.)
  /shared   -> Complex components (Navbar, Sidebar, Drawers)
/context    -> Global registry systems (User, Cart, Wishlist)
/redux      -> Persistent session state
/lib        -> API utilities and persistence layers
/hooks      -> Reusable React logic
/public     -> Static assets (images, fonts)
```

## 3. State Management Standards

### 3.1 Server State (TanStack Query)
We use TanStack Query for almost all asynchronous data fetching and mutations. 
- **Query Keys**: Use consistent array-based keys (e.g., `["currentUser"]`, `["orders"]`).
- **Mutations**: Use `useMutation` for any side effects (`login`, `addToCart`).
- **Invalidation**: Always invalidate or update the cache in `onSuccess`.

### 3.2 Client State (Redux)
Redux is reserved for persistent session state that must survive refreshes (e.g., Auth Tokens) or extremely global UI states. Most logic should reside in **Contexts**.

## 4. Communication & Persistence
- **API Registry**: Use `apiRequest` from `@/lib/api`. It provides standardized error handling and security headers.
- **Local Persistence**: For client-only modules (Cart, Wishlist), we use a hybrid of **TanStack Query + LocalStorage**. 
  - Implementation: `lib/cart.js` handles the storage, `context/CartContext.jsx` provides the reactive interface.

## 5. Component Development
- **Aesthetic**: Maintain a "Premium Boutique" feel. Use `rounded-none`, minimalist borders (`border-zinc-100`), and curated typography (Montserrat).
- **ProductCard**: Our most sensitive component. It is the entry point for both Cart and Wishlist logic.

## 6. Authentication Flow
Identity is managed via `UserContext.jsx`.
- Use `const { user, loginMutation } = useUser();` to access identity.
- Protected routes are handled via Next.js middleware or conditional rendering in layouts.

## 7. Best Practices
1. **Hydration**: Always handle `mounted` state in Client Components to avoid SSR mismatches with LocalStorage.
2. **Atomic Consistency**: Ensure that an action in one drawer (e.g., adding to cart) immediately reflects in the Navbar badge.
3. **No Placeholders**: Use `generate_image` or actual assets.

## 8. Implementing a New Module (Best Practices)

When adding a new feature or "Mini Module" (e.g., a "Compare Products" list), follow this specific lifecycle to ensure architectural parity:

### Step 1: Define the Persistence Layer (`@/lib/moduleName.js`)
If the data needs to survive page refreshes but isn't stored on the server (client-side only), create a persistence utility using `localStorage`.

### Step 2: Create the Reactivity Context (`@/context/ModuleNameContext.jsx`)
Create a **Context Provider** that wraps TanStack Query hooks.
- **Query**: Use `useQuery` to fetch the data from your persistence layer. Set `staleTime: Infinity` if the data is local-only.
- **Mutations**: Use `useMutation` for any actions (add, remove, clear).
- **Update Logic**: In the mutation's `onSuccess`, use `queryClient.setQueryData` for instantaneous UI updates across the entire app.

### Step 3: Register the Provider (`app/layout.js`)
Wrap the application in your new provider. Place it inside the `UserProvider` so it can access identity state if needed.

### Step 4: Component Integration
- Consume your new registry using a custom hook: `const { items, addItem } = useModuleName();`.
- **Optimization**: Always wrap your context value in `useMemo` and helper functions in `useCallback` to prevent unnecessary re-renders of the entire component tree.

### Step 5: Optimization & Cleanup
- **Hydration Guard**: Use a `mounted` state in your components to ensure that LocalStorage-dependent data only renders on the client.
- **Query Keys**: Use a standard, descriptive array like `["moduleName"]`.
- **Performance**: Leverage TanStack Query's built-in `isLoading` and `isPending` states to provide smooth "Boutique-grade" loading indicators.

---
*Follow these steps, and your module will stay synchronized, performant, and consistent with the Xiroo Boutique standards.*

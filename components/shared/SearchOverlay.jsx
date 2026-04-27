"use client";
import DefaultSearchLayout from "./search-overlay-sections/DefaultSearchLayout";
import SearchHeader from "./search-overlay-sections/SearchHeader";
import SearchResults from "./search-overlay-sections/SearchResults";
import { useSearchLogic } from "./search-overlay-sections/useSearchLogic";

export function SearchOverlay({ isOpen, onClose }) {
  const {
    query, setQuery, debouncedQuery, isSearching, searchResults, trendingProducts,
    recentlyViewed, isSearchMode, handleClearRecent, handleTrendingClick, inputRef
  } = useSearchLogic(isOpen, onClose);

  return (
    <div
      className={`fixed inset-0 z-[1001] transition-all duration-300 ${
        isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <div
        className={`absolute inset-0 flex items-start justify-center sm:pt-[8vh] sm:px-4 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-y-0 opacity-100 scale-100" : "-translate-y-8 opacity-0 scale-95"
        }`}
      >
        <aside className="w-full max-w-[1000px] bg-white text-black shadow-2xl pointer-events-auto overflow-hidden flex flex-col h-full sm:h-auto max-h-full sm:max-h-[84vh]">
          <SearchHeader query={query} setQuery={setQuery} inputRef={inputRef} onClose={onClose} />

          <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 md:py-10 scrollbar-hide space-y-10 md:space-y-14">
            {isSearchMode ? (
              <SearchResults
                isSearching={isSearching}
                debouncedQuery={debouncedQuery}
                searchResults={searchResults}
                onClose={onClose}
              />
            ) : (
              <DefaultSearchLayout
                recentlyViewed={recentlyViewed}
                handleClearRecent={handleClearRecent}
                handleTrendingClick={handleTrendingClick}
                trendingProducts={trendingProducts}
                onClose={onClose}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

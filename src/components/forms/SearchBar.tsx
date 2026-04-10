import React, { useState, useEffect, useRef } from 'react';
import {
  Search, X, Filter,
  BookOpen, Award, Clock, TrendingUp,
  Loader, Users
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchResult {
  id: string;
  type: 'course' | 'student' | 'tutor' | 'school' | 'document' | 'lesson';
  title: string;
  subtitle?: string;
  url: string;
  icon?: React.ReactNode;
  metadata?: Record<string, any>;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string, filters?: SearchFilters) => Promise<SearchResult[]>;
  onResultClick: (result: SearchResult) => void;
  filters?: SearchFilter[];
  recentSearches?: string[];
  savedSearches?: string[];
  className?: string;
  autoFocus?: boolean;
  debounceMs?: number;
  maxResults?: number;
}

interface SearchFilter {
  id: string;
  label: string;
  type: 'select' | 'checkbox' | 'radio' | 'date';
  options?: Array<{ value: string; label: string }>;
}

interface SearchFilters {
  [key: string]: any;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  onResultClick,
  filters = [],
  recentSearches = [],
  savedSearches = [],
  className = '',
  autoFocus = false,
  debounceMs = 300,
  maxResults = 10
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, debounceMs);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Perform search when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await onSearch(debouncedQuery, activeFilters);
        setResults(searchResults.slice(0, maxResults));
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, activeFilters, onSearch, maxResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setShowFilters(false);
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick(result);
    setShowResults(false);
    setQuery('');
    
    // Save to recent searches
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updatedRecent = [query, ...recent.filter((s: string) => s !== query)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'student': return <Users className="w-4 h-4" />;
      case 'tutor': return <Award className="w-4 h-4" />;
      case 'lesson': return <Clock className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="block w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />

        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
          {query && (
            <button
              onClick={clearSearch}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
          
          {filters.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg relative ${
                activeFilterCount > 0 ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-100'
              }`}
            >
              <Filter className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <Badge
                  size="sm"
                  className="absolute -top-1 -right-1 bg-primary-600 text-white min-w-[1.2rem] h-4"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && filters.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveFilters({});
                setShowFilters(false);
              }}
            >
              Clear all
            </Button>
          </div>
          
          <div className="space-y-4">
            {filters.map((filter) => (
              <div key={filter.id}>
                <label className="block text-sm font-medium mb-2">
                  {filter.label}
                </label>
                
                {filter.type === 'select' && filter.options && (
                  <select
                    value={activeFilters[filter.id] || ''}
                    onChange={(e) => setActiveFilters(prev => ({
                      ...prev,
                      [filter.id]: e.target.value
                    }))}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All</option>
                    {filter.options.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {filter.type === 'checkbox' && filter.options?.map(opt => (
                  <label key={opt.value} className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      checked={activeFilters[filter.id]?.includes(opt.value)}
                      onChange={(e) => {
                        const current = activeFilters[filter.id] || [];
                        const updated = e.target.checked
                          ? [...current, opt.value]
                          : current.filter((v: string) => v !== opt.value);
                        setActiveFilters(prev => ({
                          ...prev,
                          [filter.id]: updated
                        }));
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}

                {filter.type === 'date' && (
                  <input
                    type="date"
                    value={activeFilters[filter.id] || ''}
                    onChange={(e) => setActiveFilters(prev => ({
                      ...prev,
                      [filter.id]: e.target.value
                    }))}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Search Results */}
      {showResults && (query || recentSearches.length > 0 || savedSearches.length > 0) && (
        <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50">
          {loading ? (
            <div className="p-8 text-center">
              <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Searching...</p>
            </div>
          ) : (
            <div className="py-2">
              {/* Recent Searches */}
              {!query && recentSearches.length > 0 && (
                <div className="px-4 py-2">
                  <p className="text-xs font-medium text-gray-500 mb-2">Recent Searches</p>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-50 rounded flex items-center"
                    >
                      <Clock className="w-3 h-3 text-gray-400 mr-2" />
                      {search}
                    </button>
                  ))}
                </div>
              )}

              {/* Saved Searches */}
              {!query && savedSearches.length > 0 && (
                <div className="px-4 py-2 border-t">
                  <p className="text-xs font-medium text-gray-500 mb-2">Saved Searches</p>
                  {savedSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-50 rounded flex items-center"
                    >
                      <TrendingUp className="w-3 h-3 text-gray-400 mr-2" />
                      {search}
                    </button>
                  ))}
                </div>
              )}

              {/* Search Results */}
              {query && results.length > 0 && (
                <div className="px-4 py-2">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Results ({results.length})
                  </p>
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full text-left px-2 py-2 hover:bg-gray-50 rounded flex items-start space-x-3 ${
                        index === selectedIndex ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        result.type === 'course' ? 'bg-blue-100' :
                        result.type === 'student' ? 'bg-green-100' :
                        result.type === 'tutor' ? 'bg-purple-100' :
                        'bg-gray-100'
                      }`}>
                        {result.icon || getResultIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.title}
                        </p>
                        {result.subtitle && (
                          <p className="text-xs text-gray-500 truncate">
                            {result.subtitle}
                          </p>
                        )}
                        {result.metadata && (
                          <div className="flex items-center space-x-2 mt-1">
                            {Object.entries(result.metadata).map(([key, value]) => (
                              <Badge key={key} variant="secondary" size="sm">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {query && results.length === 0 && (
                <div className="p-8 text-center">
                  <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No results found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try different keywords or adjust your filters
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
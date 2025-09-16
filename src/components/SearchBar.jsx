import { useState, useEffect } from 'react'
import { Search, X, BookOpen, User, Hash } from 'lucide-react'
import { useDebounce } from '../hooks/useCustomHooks'

const SearchBar = ({ onSearch, searchQuery, setSearchQuery }) => {
  const [focused, setFocused] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Search suggestions (mock data for now)
  const searchSuggestions = [
    { type: 'title', icon: BookOpen, text: 'Harry Potter', category: 'Popular Titles' },
    { type: 'author', icon: User, text: 'Stephen King', category: 'Popular Authors' },
    { type: 'subject', icon: Hash, text: 'Physics', category: 'Academic Subjects' },
    { type: 'subject', icon: Hash, text: 'Computer Science', category: 'Technology' },
    { type: 'title', icon: BookOpen, text: 'The Great Gatsby', category: 'Classic Literature' },
    { type: 'author', icon: User, text: 'Jane Austen', category: 'Classic Authors' },
    { type: 'subject', icon: Hash, text: 'Fiction', category: 'Genres' },
    { type: 'subject', icon: Hash, text: 'Romance', category: 'Genres' },
  ]

  useEffect(() => {
    if (debouncedSearchQuery) {
      onSearch(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery, onSearch])

  useEffect(() => {
    if (searchQuery && focused) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [searchQuery, focused])

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text)
    setSuggestions([])
    setFocused(false)
    // Trigger search immediately
    onSearch(suggestion.text)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSuggestions([])
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-charcoal-500 dark:text-charcoal-300 transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 300)}
          placeholder="Search by title, author, ISBN, or subject..."
          className={`w-full pl-12 pr-12 py-4 text-lg text-charcoal-900 dark:text-cream-50 placeholder-charcoal-500 dark:placeholder-charcoal-400 bg-white dark:bg-charcoal-800 border rounded-3xl focus:outline-none transition-all duration-300 shadow-soft ${
            focused
              ? 'ring-4 ring-primary-100 dark:ring-charcoal-600 border-primary-400 dark:border-secondary-400 shadow-pastel'
              : 'border-primary-200 dark:border-charcoal-600'
          }`}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-primary-100 dark:hover:bg-charcoal-700 transition-colors"
          >
            <X className="w-4 h-4 text-charcoal-500 dark:text-charcoal-300" />
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-charcoal-800 border border-primary-200 dark:border-charcoal-600 rounded-2xl shadow-soft z-50 animate-slide-up">
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-charcoal-700 transition-colors text-left"
              >
                <div className="p-2 bg-primary-100 dark:bg-charcoal-600 rounded-lg">
                  <suggestion.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-charcoal-900 dark:text-cream-50">
                    {suggestion.text}
                  </div>
                  <div className="text-sm text-charcoal-600 dark:text-charcoal-300">
                    {suggestion.category}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="px-4 py-2 bg-primary-25 dark:bg-charcoal-700 rounded-b-2xl">
            <p className="text-xs text-charcoal-600 dark:text-charcoal-300">
              Press Enter to search for "{searchQuery}"
            </p>
          </div>
        </div>
      )}

      {/* Search Tips */}
      {!searchQuery && !focused && (
        <div className="mt-4 text-center">
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300">
            💡 <strong>Pro tip:</strong> Try searching for "Quantum Physics", "Stephen King", or use ISBN numbers
          </p>
        </div>
      )}
    </div>
  )
}

export default SearchBar
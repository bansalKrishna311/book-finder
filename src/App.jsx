import { useState, useEffect, useCallback } from 'react'
import { Moon, Sun, BookOpen, TrendingUp } from 'lucide-react'
import SearchBar from './components/SearchBar'
import MoodChips from './components/MoodChips'
import BookCard from './components/BookCard'
import BookDetailModal from './components/BookDetailModal'
import { searchBooks, searchBooksByMood, getTrendingBooks } from './services/bookService'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMood, setSelectedMood] = useState(null)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState(null)

  // Initialize with trending books
  useEffect(() => {
    const loadTrendingBooks = async () => {
      try {
        setLoading(true)
        const result = await getTrendingBooks()
        setBooks(result.books)
      } catch (err) {
        console.error('Failed to load trending books:', err)
        setError('Failed to load trending books. Please try again.')
        // Fallback to mock data if API fails
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    loadTrendingBooks()
  }, [])

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode))
    }
  }, [])

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', JSON.stringify(newMode))
  }

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Handle search
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      try {
        setLoading(true)
        const result = await getTrendingBooks()
        setBooks(result.books)
        setError(null)
      } catch (err) {
        console.error('Failed to load trending books:', err)
        setError('Failed to load books. Please try again.')
        setBooks([])
      } finally {
        setLoading(false)
      }
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await searchBooks(query, { maxResults: 20 })
      setBooks(result.books)
    } catch (err) {
      console.error('Search failed:', err)
      setError('Search failed. Please try again.')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle mood selection
  const handleMoodSelect = useCallback(async (moodId, keywords) => {
    setSelectedMood(moodId)
    
    if (!moodId) {
      try {
        setLoading(true)
        const result = await getTrendingBooks()
        setBooks(result.books)
        setError(null)
      } catch (err) {
        console.error('Failed to load trending books:', err)
        setError('Failed to load books. Please try again.')
        setBooks([])
      } finally {
        setLoading(false)
      }
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await searchBooksByMood(keywords, { maxResults: 20 })
      setBooks(result.books)
    } catch (err) {
      console.error('Mood search failed:', err)
      setError('Failed to load mood-based books. Please try again.')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle book click
  const handleBookClick = useCallback((book) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }, [])

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setSelectedBook(null)
  }, [])

  const getSectionTitle = () => {
    if (selectedMood) {
      const moodLabels = {
        study: 'Study Materials',
        fun: 'Fun Reads',
        romantic: 'Romantic Stories',
        adventure: 'Adventure & Fantasy',
        chill: 'Relaxing Reads',
        inspirational: 'Inspirational Books'
      }
      return moodLabels[selectedMood] || 'Recommended Books'
    }
    
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`
    }
    
    return 'Trending This Week'
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-charcoal-900 transition-all duration-300">
      {/* Header */}
      <header className=" dark:bg-charcoal-800/95 backdrop-blur-md border-b border-primary-100 dark:border-charcoal-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-primary rounded-2xl shadow-soft">
                <BookOpen className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-charcoal-900 dark:text-cream-50">
                  Alex's Book Finder
                </h1>
                <p className="text-xs text-charcoal-600 dark:text-charcoal-300 -mt-1">
                  Find your next favorite read
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-primary-50 dark:bg-charcoal-700 hover:bg-primary-100 dark:hover:bg-charcoal-600 transition-all duration-300"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-accent-400 dark:text-accent-300" />
                ) : (
                  <Moon className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-cream-50 mb-4">
            What would you like to{' '}
            <span className="text-primary-600 dark:text-primary-400">
              discover
            </span>{' '}
            today?
          </h2>
          <p className="text-lg text-charcoal-700 dark:text-charcoal-200 mb-8 max-w-2xl mx-auto">
            Search for textbooks, explore by mood, or discover trending reads. 
            Your perfect book is just a search away!
          </p>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              onSearch={handleSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>

          {/* Mood Chips */}
          <div className="mb-8">
            <MoodChips
              onMoodSelect={handleMoodSelect}
              selectedMood={selectedMood}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-accent-100 dark:bg-accent-900/30 border border-accent-200 dark:border-accent-700 rounded-2xl">
            <p className="text-accent-700 dark:text-accent-300 text-center">
              {error}
            </p>
          </div>
        )}

        {/* Books Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              <h3 className="font-display text-2xl font-semibold text-charcoal-900 dark:text-cream-50">
                {getSectionTitle()}
              </h3>
            </div>
            <span className="text-sm text-charcoal-600 dark:text-charcoal-300">
              {books.length} books found
            </span>
          </div>

          {loading ? (
            /* Loading Skeleton */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-charcoal-800 rounded-3xl p-4 shadow-soft animate-pulse">
                  <div className="aspect-[3/4] bg-primary-100 dark:bg-charcoal-700 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-primary-100 dark:bg-charcoal-700 rounded mb-2"></div>
                  <div className="h-3 bg-primary-100 dark:bg-charcoal-700 rounded mb-2 w-2/3"></div>
                  <div className="h-3 bg-primary-100 dark:bg-charcoal-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : books.length > 0 ? (
            /* Book Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onBookClick={handleBookClick}
                />
              ))}
            </div>
          ) : (
            /* No Results */
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-primary-100 dark:bg-charcoal-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary-500 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-900 dark:text-cream-50 mb-2">
                No books found
              </h3>
              <p className="text-charcoal-700 dark:text-charcoal-200">
                Try a different search term or explore our mood categories above.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/95 dark:bg-charcoal-800/95 backdrop-blur-md border-t border-primary-100 dark:border-charcoal-600 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-charcoal-700 dark:text-charcoal-200">
              Made with 💜 by{' '}
              <a 
                href="https://www.linkedin.com/in/bansalkrishna311/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-medium"
              >
                Krishna Bansal
              </a>{' '}
              for book lovers everywhere
            </p>
            <p className="text-xs text-charcoal-600 dark:text-charcoal-300 mt-2">
              Powered by Open Library API | Candidate ID: Naukri0925
            </p>
          </div>
        </div>
      </footer>

      {/* Book Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  )
}

export default App

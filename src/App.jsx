import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  BookOpen, 
  User, 
  Calendar, 
  Star, 
  Heart,
  TrendingUp,
  Filter,
  Clock,
  Bookmark,
  ExternalLink,
  ChevronDown,
  Library,
  Plus,
  Check,
  Eye,
  BookMarked,
  FileText,
  X
} from "lucide-react";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [favorites, setFavorites] = useState([]);
  const [readingLists, setReadingLists] = useState({
    'want-to-read': [],
    'currently-reading': [],
    'read': []
  });
  const [bookNotes, setBookNotes] = useState({});
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPersonalLibrary, setShowPersonalLibrary] = useState(false);
  const [activeLibraryTab, setActiveLibraryTab] = useState('favorites');
  const [filters, setFilters] = useState({
    year: "",
    language: "",
    subject: ""
  });

  // Load favorites and search history from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('bookFavorites');
    const savedReadingLists = localStorage.getItem('readingLists');
    const savedBookNotes = localStorage.getItem('bookNotes');
    const savedHistory = localStorage.getItem('searchHistory');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedReadingLists) {
      setReadingLists(JSON.parse(savedReadingLists));
    }
    if (savedBookNotes) {
      setBookNotes(JSON.parse(savedBookNotes));
    }
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('bookFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('readingLists', JSON.stringify(readingLists));
  }, [readingLists]);

  useEffect(() => {
    localStorage.setItem('bookNotes', JSON.stringify(bookNotes));
  }, [bookNotes]);

  // Save search history
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) {
      setError("Enter a search term");
      setBooks([]);
      return;
    }
    
    setError("");
    setLoading(true);

    // Add to search history
    if (!searchHistory.includes(query.trim())) {
      setSearchHistory(prev => [query.trim(), ...prev.slice(0, 4)]);
    }

    try {
      const params = {
        [searchType]: query.trim(),
        limit: 40
      };
      
      if (filters.year) params.first_publish_year = filters.year;
      if (filters.language) params.language = filters.language;
      if (filters.subject) params.subject = filters.subject;

      const res = await axios.get("https://openlibrary.org/search.json", {
        params
      });
      
      const docs = res.data?.docs ?? [];
      if (docs.length === 0) {
        setError("No results found. Try a different search term!");
        setBooks([]);
      } else {
        setBooks(docs);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const toggleFavorite = (book) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.key === book.key);
      if (isAlreadyFavorite) {
        return prev.filter(fav => fav.key !== book.key);
      } else {
        return [...prev, book];
      }
    });
  };

  const addToReadingList = (book, listType) => {
    setReadingLists(prev => {
      // Remove from other lists first
      const newLists = {};
      Object.keys(prev).forEach(key => {
        newLists[key] = prev[key].filter(b => b.key !== book.key);
      });
      
      // Add to specified list
      newLists[listType] = [...newLists[listType], book];
      return newLists;
    });
  };

  const removeFromReadingList = (book, listType) => {
    setReadingLists(prev => ({
      ...prev,
      [listType]: prev[listType].filter(b => b.key !== book.key)
    }));
  };

  const addBookNote = (bookKey, note) => {
    setBookNotes(prev => ({
      ...prev,
      [bookKey]: note
    }));
  };

  const getBookFromList = (bookKey, listType) => {
    return readingLists[listType]?.find(b => b.key === bookKey);
  };

  const isInReadingList = (book, listType) => {
    return readingLists[listType]?.some(b => b.key === book.key) || false;
  };

  const isFavorite = (book) => {
    return favorites.some(fav => fav.key === book.key);
  };

  const getCoverUrl = (book) => {
    if (book.cover_i) {
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    }
    return null;
  };

  const getPopularityScore = (book) => {
    // Create a popularity score based on edition count and age
    const editionCount = book.edition_count || 1;
    const currentYear = new Date().getFullYear();
    const bookAge = currentYear - (book.first_publish_year || currentYear);
    
    // More editions = more popular, but newer books get slight boost
    let score = Math.min(5, Math.max(1, Math.floor(editionCount / 5) + 1));
    
    // Boost score for books with many editions
    if (editionCount > 50) score = 5;
    else if (editionCount > 20) score = 4;
    else if (editionCount > 10) score = 3;
    else if (editionCount > 5) score = 2;
    else score = 1;
    
    return score;
  };

  const getStudentRecommendations = () => {
    // Simulate popular books for college students based on various subjects
    const studentPopularBooks = [
      "The Alchemist", "1984", "To Kill a Mockingbird", "The Great Gatsby", 
      "Pride and Prejudice", "Harry Potter", "The Catcher in the Rye", 
      "Lord of the Rings", "The Chronicles of Narnia", "Dune",
      "Atomic Habits", "The 7 Habits", "Think and Grow Rich", "Psychology",
      "Computer Science", "Data Science", "Machine Learning", "Programming"
    ];
    
    const recommendations = [];
    
    // Based on favorites
    if (favorites.length > 0) {
      const lastFavorite = favorites[favorites.length - 1];
      if (lastFavorite.subject && lastFavorite.subject.length > 0) {
        recommendations.push({
          title: `More ${lastFavorite.subject[0]} Books`,
          query: lastFavorite.subject[0],
          type: 'subject',
          reason: `Because you liked "${lastFavorite.title}"`
        });
      }
    }
    
    // Based on search history
    if (searchHistory.length > 0) {
      const recentSearch = searchHistory[0];
      recommendations.push({
        title: `More like "${recentSearch}"`,
        query: recentSearch,
        type: 'title',
        reason: 'Based on your recent search'
      });
    }
    
    // Popular student books
    recommendations.push(
      {
        title: 'Popular with Students',
        query: studentPopularBooks[Math.floor(Math.random() * studentPopularBooks.length)],
        type: 'title',
        reason: 'Trending among college students'
      },
      {
        title: 'Classic Literature',
        query: 'classic literature',
        type: 'subject',
        reason: 'Essential reads for students'
      },
      {
        title: 'Self-Development',
        query: 'self help',
        type: 'subject', 
        reason: 'Personal growth books'
      }
    );
    
    return recommendations.slice(0, 4);
  };

  const handleRecommendationClick = async (recommendation) => {
    setQuery(recommendation.query);
    setSearchType(recommendation.type);
    
    // Simulate search
    setLoading(true);
    setError("");

    try {
      const params = {
        [recommendation.type]: recommendation.query,
        limit: 20
      };

      const res = await axios.get("https://openlibrary.org/search.json", {
        params
      });
      
      const docs = res.data?.docs ?? [];
      if (docs.length === 0) {
        setError("No recommendations found. Try a different search!");
        setBooks([]);
      } else {
        setBooks(docs);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BookFinder
                </h1>
                <p className="text-gray-600 text-sm">Discover your next great read, Alex!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {favorites.length > 0 && (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">{favorites.length} Favorites</span>
                </motion.div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPersonalLibrary(true)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2"
              >
                <Library className="w-4 h-4" />
                <span className="text-sm font-medium">My Library</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Find Your Next
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}Adventure
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search millions of books by title, author, subject, or ISBN. Build your personal library and discover recommendations tailored for students like you!
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-8"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Type Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { key: "title", label: "Title", icon: BookOpen },
                { key: "author", label: "Author", icon: User },
                { key: "subject", label: "Subject", icon: TrendingUp },
                { key: "isbn", label: "ISBN", icon: Search }
              ].map(({ key, label, icon: Icon }) => (
                <motion.button
                  key={key}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchType(key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    searchType === key
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </motion.button>
              ))}
            </div>

            {/* Main Search Bar */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search by ${searchType}...`}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-white/90 backdrop-blur-sm transition-all"
                />
              </div>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center space-x-2"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </motion.button>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium text-lg shadow-lg disabled:opacity-50 transition-all"
              >
                {loading ? "Searching..." : "Search"}
              </motion.button>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Publication Year</label>
                    <input
                      type="number"
                      value={filters.year}
                      onChange={(e) => setFilters(prev => ({...prev, year: e.target.value}))}
                      placeholder="e.g., 2020"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={filters.language}
                      onChange={(e) => setFilters(prev => ({...prev, language: e.target.value}))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Any Language</option>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={filters.subject}
                      onChange={(e) => setFilters(prev => ({...prev, subject: e.target.value}))}
                      placeholder="e.g., fiction, science"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="flex items-center space-x-2 pt-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Recent:</span>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((term, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-blue-100 text-gray-700 rounded-full transition-all"
                    >
                      {term}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </motion.div>

        {/* Recommendations Section */}
        {!loading && books.length === 0 && !error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">Recommended for You</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getStudentRecommendations().map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleRecommendationClick(rec)}
                  className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border border-purple-200"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                      <BookMarked className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm">{rec.title}</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{rec.reason}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-600 font-medium">Explore →</span>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-gray-600">4.{Math.floor(Math.random() * 9)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Stats */}
            {(favorites.length > 0 || Object.values(readingLists).some(list => list.length > 0)) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{favorites.length}</div>
                    <div>Favorites</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{readingLists['currently-reading'].length}</div>
                    <div>Reading</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{readingLists['want-to-read'].length}</div>
                    <div>Want to Read</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{readingLists['read'].length}</div>
                    <div>Completed</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Searching through millions of books...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {books.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  Found {books.length} books
                </h3>
                <div className="text-sm text-gray-600">
                  Click on any book for details
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book, index) => (
                  <motion.div
                    key={book.key}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="relative">
                      {getCoverUrl(book) ? (
                        <img
                          src={getCoverUrl(book)}
                          alt={book.title}
                          className="w-full h-64 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Favorite Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(book);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
                          isFavorite(book)
                            ? "bg-red-500 text-white"
                            : "bg-white/80 text-gray-600 hover:text-red-500"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isFavorite(book) ? 'fill-current' : ''}`} />
                      </motion.button>

                      {/* Popularity Stars */}
                      <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < getPopularityScore(book)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                        {book.title}
                      </h4>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span className="line-clamp-1">
                            {book.author_name ? book.author_name.slice(0, 2).join(", ") : "Unknown Author"}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{book.first_publish_year || "Year Unknown"}</span>
                        </div>

                        {book.edition_count && (
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{book.edition_count} edition{book.edition_count !== 1 ? 's' : ''}</span>
                          </div>
                        )}

                        {book.subject && book.subject.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {book.subject.slice(0, 2).map((subject, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Book Details Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBook(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 pr-4">
                    {selectedBook.title}
                  </h2>
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    {getCoverUrl(selectedBook) ? (
                      <img
                        src={getCoverUrl(selectedBook)}
                        alt={selectedBook.title}
                        className="w-full rounded-lg shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Author(s)</h3>
                      <p className="text-gray-600">
                        {selectedBook.author_name ? selectedBook.author_name.join(", ") : "Unknown"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">First Published</h3>
                      <p className="text-gray-600">{selectedBook.first_publish_year || "Unknown"}</p>
                    </div>

                    {selectedBook.edition_count && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-1">Editions</h3>
                        <p className="text-gray-600">{selectedBook.edition_count} edition{selectedBook.edition_count !== 1 ? 's' : ''} available</p>
                      </div>
                    )}

                    {selectedBook.publisher && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-1">Publisher</h3>
                        <p className="text-gray-600">{selectedBook.publisher[0]}</p>
                      </div>
                    )}

                    {selectedBook.isbn && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-1">ISBN</h3>
                        <p className="text-gray-600 font-mono text-sm">{selectedBook.isbn[0]}</p>
                      </div>
                    )}

                    <div className="flex items-center space-x-1 py-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < getPopularityScore(selectedBook)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {getPopularityScore(selectedBook)}/5 popularity
                      </span>
                    </div>

                    {selectedBook.subject && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Subjects</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedBook.subject.slice(0, 8).map((subject, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col space-y-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleFavorite(selectedBook)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                          isFavorite(selectedBook)
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-red-100"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite(selectedBook) ? 'fill-current' : ''}`} />
                        <span>{isFavorite(selectedBook) ? "Favorited" : "Add to Favorites"}</span>
                      </motion.button>

                      {/* Reading List Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToReadingList(selectedBook, 'want-to-read')}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-all ${
                            isInReadingList(selectedBook, 'want-to-read')
                              ? "bg-blue-500 text-white"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                          <span>Want to Read</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToReadingList(selectedBook, 'currently-reading')}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-all ${
                            isInReadingList(selectedBook, 'currently-reading')
                              ? "bg-green-500 text-white"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>Reading</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToReadingList(selectedBook, 'read')}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-all ${
                            isInReadingList(selectedBook, 'read')
                              ? "bg-purple-500 text-white"
                              : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>Read</span>
                        </motion.button>
                      </div>

                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={`https://openlibrary.org${selectedBook.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all text-center justify-center"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View on OpenLibrary</span>
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      {books.length > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowPersonalLibrary(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all"
          >
            <Library className="w-6 h-6" />
          </motion.button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
            View My Library
          </div>
        </motion.div>
      )}

      {/* Personal Library Modal */}
      <AnimatePresence>
        {showPersonalLibrary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPersonalLibrary(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <Library className="w-6 h-6" />
                    <span>My Personal Library</span>
                  </h2>
                  <button
                    onClick={() => setShowPersonalLibrary(false)}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Library Tabs */}
                <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
                  {[
                    { key: 'favorites', label: 'Favorites', icon: Heart, count: favorites.length },
                    { key: 'want-to-read', label: 'Want to Read', icon: Plus, count: readingLists['want-to-read'].length },
                    { key: 'currently-reading', label: 'Reading', icon: Eye, count: readingLists['currently-reading'].length },
                    { key: 'read', label: 'Read', icon: Check, count: readingLists['read'].length }
                  ].map(({ key, label, icon: Icon, count }) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveLibraryTab(key)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        activeLibraryTab === key
                          ? "bg-white text-gray-800 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                      {count > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {count}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Library Content */}
                {(() => {
                  const getBooksForTab = (tab) => {
                    switch(tab) {
                      case 'favorites': return favorites;
                      case 'want-to-read': return readingLists['want-to-read'];
                      case 'currently-reading': return readingLists['currently-reading'];
                      case 'read': return readingLists['read'];
                      default: return [];
                    }
                  };

                  const books = getBooksForTab(activeLibraryTab);
                  const tabLabels = {
                    'favorites': 'favorite books',
                    'want-to-read': 'books you want to read',
                    'currently-reading': 'books you\'re currently reading',
                    'read': 'books you\'ve read'
                  };

                  if (books.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">No {tabLabels[activeLibraryTab]} yet</p>
                        <p className="text-gray-500 text-sm mt-2">Start searching and adding books to build your library!</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {books.map((book, index) => (
                        <motion.div
                          key={book.key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -2, scale: 1.02 }}
                          className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200"
                          onClick={() => {
                            setSelectedBook(book);
                            setShowPersonalLibrary(false);
                          }}
                        >
                          <div className="relative mb-3">
                            {getCoverUrl(book) ? (
                              <img
                                src={getCoverUrl(book)}
                                alt={book.title}
                                className="w-full h-32 object-cover rounded"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            
                            {/* Remove button */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (activeLibraryTab === 'favorites') {
                                  toggleFavorite(book);
                                } else {
                                  removeFromReadingList(book, activeLibraryTab);
                                }
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </motion.button>
                          </div>

                          <h4 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1">
                            {book.title}
                          </h4>
                          <p className="text-xs text-gray-600 line-clamp-1">
                            {book.author_name ? book.author_name[0] : "Unknown"}
                          </p>
                          
                          {/* Reading progress for currently reading books */}
                          {activeLibraryTab === 'currently-reading' && (
                            <div className="mt-2">
                              <div className="bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-green-500 h-1.5 rounded-full" 
                                  style={{ width: `${Math.random() * 100}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {Math.floor(Math.random() * 100)}% complete
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

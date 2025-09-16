import { useState, useEffect } from 'react'
import { X, ExternalLink, Calendar, Globe, Star, BookOpen, Users, Tag, Download } from 'lucide-react'

const BookDetailModal = ({ book, isOpen, onClose }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  // Reset image loaded state when book changes
  useEffect(() => {
    setImageLoaded(false)
  }, [book?.id])

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !book) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const fallbackCover = `https://via.placeholder.com/400x600/A5C9FF/FFFFFF?text=${encodeURIComponent(book.title?.substring(0, 20) || 'Book')}`

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl shadow-pastel max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-100 dark:border-charcoal-600">
          <h2 className="font-display text-2xl font-bold text-charcoal-900 dark:text-cream-50">
            Book Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-primary-50 dark:hover:bg-charcoal-700 transition-colors"
          >
            <X className="w-5 h-5 text-charcoal-600 dark:text-charcoal-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Book Cover */}
              <div className="lg:w-1/3">
                <div className="relative aspect-[2/3] w-full max-w-sm mx-auto lg:mx-0">
                  {!imageLoaded && (
                    <div className="absolute inset-0 skeleton rounded-2xl" />
                  )}
                  <img
                    src={book.thumbnail || fallbackCover}
                    alt={book.title}
                    className={`w-full h-full object-cover rounded-2xl shadow-soft transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      e.target.src = fallbackCover
                      setImageLoaded(true)
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {book.previewLink && (
                    <button
                      onClick={() => window.open(book.previewLink, '_blank')}
                      className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-2xl font-semibold bg-secondary-100 dark:bg-secondary-900/30 text-charcoal-700 dark:text-charcoal-200 hover:bg-secondary-200 dark:hover:bg-secondary-800/40 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Preview Book</span>
                    </button>
                  )}

                  {book.buyLink && (
                    <button
                      onClick={() => window.open(book.buyLink, '_blank')}
                      className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-2xl font-semibold bg-accent-100 dark:bg-accent-900/30 text-charcoal-700 dark:text-charcoal-200 hover:bg-accent-200 dark:hover:bg-accent-800/40 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      <span>Buy Book</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Book Information */}
              <div className="lg:w-2/3 space-y-6">
                {/* Title and Author */}
                <div>
                  <h1 className="font-display text-3xl font-bold text-charcoal-900 dark:text-cream-50 mb-2">
                    {book.title}
                  </h1>
                  {book.subtitle && (
                    <h2 className="text-xl text-charcoal-600 dark:text-charcoal-300 mb-3">
                      {book.subtitle}
                    </h2>
                  )}
                  <div className="flex items-center space-x-2 text-charcoal-700 dark:text-charcoal-200">
                    <Users className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                    <span className="font-medium">
                      {book.authors?.join(', ') || 'Unknown Author'}
                    </span>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {book.averageRating && !isNaN(parseFloat(book.averageRating)) && (
                    <div className="bg-primary-50 dark:bg-charcoal-700 rounded-2xl p-4 text-center">
                      <Star className="w-6 h-6 text-accent-400 dark:text-accent-300 mx-auto mb-2 fill-current" />
                      <div className="font-bold text-charcoal-900 dark:text-cream-50">
                        {parseFloat(book.averageRating).toFixed(1)}
                      </div>
                      <div className="text-sm text-charcoal-600 dark:text-charcoal-300">
                        Rating
                      </div>
                    </div>
                  )}

                  {book.pageCount && (
                    <div className="bg-secondary-50 dark:bg-charcoal-700 rounded-2xl p-4 text-center">
                      <BookOpen className="w-6 h-6 text-secondary-500 dark:text-secondary-400 mx-auto mb-2" />
                      <div className="font-bold text-charcoal-900 dark:text-cream-50">
                        {book.pageCount}
                      </div>
                      <div className="text-sm text-charcoal-600 dark:text-charcoal-300">
                        Pages
                      </div>
                    </div>
                  )}

                  {book.publishedDate && (
                    <div className="bg-accent-50 dark:bg-charcoal-700 rounded-2xl p-4 text-center">
                      <Calendar className="w-6 h-6 text-accent-500 dark:text-accent-400 mx-auto mb-2" />
                      <div className="font-bold text-charcoal-900 dark:text-cream-50">
                        {new Date(book.publishedDate).getFullYear()}
                      </div>
                      <div className="text-sm text-charcoal-600 dark:text-charcoal-300">
                        Published
                      </div>
                    </div>
                  )}

                  {book.language && (
                    <div className="bg-cream-200 dark:bg-charcoal-700 rounded-2xl p-4 text-center">
                      <Globe className="w-6 h-6 text-charcoal-500 mx-auto mb-2" />
                      <div className="font-bold text-charcoal-900 dark:text-cream-50 uppercase">
                        {book.language}
                      </div>
                      <div className="text-sm text-charcoal-600 dark:text-charcoal-300">
                        Language
                      </div>
                    </div>
                  )}
                </div>

                {/* Categories */}
                {book.categories && book.categories.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-charcoal-900 dark:text-cream-50 mb-3 flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-primary-500 dark:text-primary-400" />
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {book.categories.map((category, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Publisher Info */}
                {(book.publisher || book.publishedDate) && (
                  <div className="bg-cream-100 dark:bg-charcoal-700 rounded-2xl p-4">
                    <h3 className="font-semibold text-charcoal-900 dark:text-cream-50 mb-2">
                      Publication Details
                    </h3>
                    <div className="space-y-1 text-sm text-charcoal-600 dark:text-charcoal-300">
                      {book.publisher && (
                        <p><span className="font-medium">Publisher:</span> {book.publisher}</p>
                      )}
                      {book.publishedDate && (
                        <p><span className="font-medium">Published:</span> {new Date(book.publishedDate).toLocaleDateString()}</p>
                      )}
                      {book.isbn && (
                        <p><span className="font-medium">ISBN:</span> {book.isbn}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                {book.description && (
                  <div>
                    <h3 className="font-semibold text-charcoal-900 dark:text-cream-50 mb-3">
                      Description
                    </h3>
                    <div 
                      className="prose prose-charcoal dark:prose-cream max-w-none text-charcoal-700 dark:text-charcoal-200 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: book.description.replace(/<br\s*\/?>/gi, '<br />') 
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetailModal
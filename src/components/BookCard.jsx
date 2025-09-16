import { useState } from 'react'
import { Heart, Star, Calendar, Globe } from 'lucide-react'

const BookCard = ({ book, onBookClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleCardClick = () => {
    onBookClick(book)
  }

  // Fallback book cover if image fails to load
  const fallbackCover = `https://via.placeholder.com/200x300/A5C9FF/FFFFFF?text=${encodeURIComponent(book.title?.substring(0, 20) || 'Book')}`

  return (
    <div 
      className="group bg-white dark:bg-charcoal-800 rounded-3xl p-4 shadow-soft hover:shadow-pastel transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
      onClick={handleCardClick}
    >
      {/* Book Cover */}
      <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-2xl bg-primary-50 dark:bg-charcoal-700">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton rounded-2xl" />
        )}
        <img
          src={book.thumbnail || fallbackCover}
          alt={book.title}
          className={`w-full h-full object-cover transition-all duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = fallbackCover
            setImageLoaded(true)
          }}
        />
        
        {/* Decorative Heart Icon */}
        <div className="absolute top-2 right-2 p-2 rounded-xl backdrop-blur-sm bg-white/80 dark:bg-charcoal-800/80 transition-all duration-200">
          <Heart className="w-4 h-4 text-charcoal-400 dark:text-charcoal-500" />
        </div>
      </div>

      {/* Book Info */}
      <div className="space-y-2">
        {/* Title */}
        <h3 className="font-semibold text-charcoal-900 dark:text-cream-50 line-clamp-2 text-sm leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-charcoal-700 dark:text-charcoal-200 text-xs line-clamp-1">
          {book.authors?.join(', ') || 'Unknown Author'}
        </p>

        {/* Rating and Year */}
        <div className="flex items-center justify-between">
          {book.averageRating && !isNaN(parseFloat(book.averageRating)) && (
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-accent-400 dark:text-accent-300 fill-current" />
              <span className="text-xs text-charcoal-800 dark:text-charcoal-200">
                {parseFloat(book.averageRating).toFixed(1)}
              </span>
            </div>
          )}
          {book.publishedDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-charcoal-600 dark:text-charcoal-300" />
              <span className="text-xs text-charcoal-700 dark:text-charcoal-200">
                {new Date(book.publishedDate).getFullYear()}
              </span>
            </div>
          )}
        </div>

        {/* Language */}
        {book.language && (
          <div className="flex items-center space-x-1">
            <Globe className="w-3 h-3 text-charcoal-600 dark:text-charcoal-300" />
            <span className="text-xs text-charcoal-700 dark:text-charcoal-200 uppercase">
              {book.language}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookCard
// Open Library API service
const OPEN_LIBRARY_API_BASE_URL = 'https://openlibrary.org'
const OPEN_LIBRARY_SEARCH_URL = `${OPEN_LIBRARY_API_BASE_URL}/search.json`
const OPEN_LIBRARY_COVERS_URL = 'https://covers.openlibrary.org/b'

// Transform Open Library API response to our book format
const transformBook = (doc) => {
  // Get the first available cover
  const getCoverUrl = (size = 'M') => {
    if (doc.cover_i) {
      return `${OPEN_LIBRARY_COVERS_URL}/id/${doc.cover_i}-${size}.jpg`
    }
    if (doc.isbn && doc.isbn.length > 0) {
      return `${OPEN_LIBRARY_COVERS_URL}/isbn/${doc.isbn[0]}-${size}.jpg`
    }
    return null
  }

  // Create a unique ID from key or use first ISBN
  const id = doc.key ? doc.key.replace('/works/', '') : doc.isbn?.[0] || `book_${Date.now()}_${Math.random()}`

  return {
    id,
    title: doc.title || 'Unknown Title',
    subtitle: doc.subtitle,
    authors: doc.author_name || [],
    description: doc.first_sentence ? doc.first_sentence.join(' ') : null,
    thumbnail: getCoverUrl('M'),
    largeCover: getCoverUrl('L'),
    averageRating: doc.ratings_average ? parseFloat(doc.ratings_average).toFixed(1) : null,
    ratingsCount: doc.ratings_count || null,
    pageCount: doc.number_of_pages_median || null,
    publishedDate: doc.first_publish_year ? `${doc.first_publish_year}-01-01` : null,
    publisher: doc.publisher ? doc.publisher[0] : null,
    language: doc.language ? doc.language[0] : 'en',
    subjects: doc.subject || [],
    categories: doc.subject ? doc.subject.slice(0, 5) : [], // First 5 subjects as categories
    isbn: doc.isbn ? doc.isbn[0] : null,
    oclc: doc.oclc ? doc.oclc[0] : null,
    lccn: doc.lccn ? doc.lccn[0] : null,
    previewLink: doc.key ? `${OPEN_LIBRARY_API_BASE_URL}${doc.key}` : null,
    infoLink: doc.key ? `${OPEN_LIBRARY_API_BASE_URL}${doc.key}` : null,
    readOnlineLink: doc.has_fulltext ? `${OPEN_LIBRARY_API_BASE_URL}${doc.key}` : null,
    // Additional Open Library specific data
    editionCount: doc.edition_count || 1,
    firstPublishYear: doc.first_publish_year,
    hasFulltext: doc.has_fulltext || false,
    publicScan: doc.public_scan_b || false,
    ia: doc.ia, // Internet Archive identifiers
  }
}

// Search books by query
export const searchBooks = async (query, options = {}) => {
  try {
    const {
      limit = 20,
      offset = 0,
      sort = '', // '', 'rating', 'new', 'old'
      lang,
      subject,
      author,
      title,
      publisher
    } = options

    // Build search parameters
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      offset: offset.toString(),
      fields: 'key,title,subtitle,author_name,cover_i,edition_count,first_publish_year,ratings_average,ratings_count,number_of_pages_median,publisher,language,subject,isbn,oclc,lccn,has_fulltext,public_scan_b,ia,first_sentence'
    })

    // Add specific search fields if provided
    if (author) params.append('author', author)
    if (title) params.append('title', title) 
    if (subject) params.append('subject', subject)
    if (publisher) params.append('publisher', publisher)
    if (lang) params.append('lang', lang)
    if (sort) params.append('sort', sort)

    const response = await fetch(`${OPEN_LIBRARY_SEARCH_URL}?${params}`, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'BookFinder/1.0'
      }
    })
    
    if (!response.ok) {
      // If we get a server error, try a simpler query
      if (response.status >= 500 && query.length > 20) {
        // Retry with a simplified query
        const simpleQuery = query.split(' ').slice(0, 2).join(' ')
        const simpleParams = new URLSearchParams({
          q: simpleQuery,
          limit: Math.min(limit, 10).toString(),
          offset: '0',
          fields: 'key,title,author_name,cover_i,first_publish_year,ratings_average'
        })
        
        const retryResponse = await fetch(`${OPEN_LIBRARY_SEARCH_URL}?${simpleParams}`)
        if (retryResponse.ok) {
          const retryData = await retryResponse.json()
          return {
            books: (retryData.docs || []).map(transformBook),
            totalItems: retryData.numFound || 0,
            start: retryData.start || 0,
            numFound: retryData.numFound || 0
          }
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      books: (data.docs || []).map(transformBook),
      totalItems: data.numFound || 0,
      start: data.start || 0,
      numFound: data.numFound || 0
    }
  } catch (error) {
    console.error('Error searching books:', error)
    throw error
  }
}

// Search books by mood/category
export const searchBooksByMood = async (keywords, options = {}) => {
  try {
    // If keywords start with 'subject:', use directly as the search query
    if (keywords.startsWith('subject:')) {
      return await searchBooks(keywords, { ...options, limit: options.limit || 12 })
    }

    // Fallback for simple keyword-based queries
    const simpleMoodQueries = {
      study: 'subject:Education',
      fun: 'subject:Fiction',
      romantic: 'subject:Romance',
      adventure: 'subject:Adventure',
      chill: 'subject:Poetry',
      inspirational: 'subject:Biography'
    }

    // Find matching mood or use keywords directly
    const moodKeys = Object.keys(simpleMoodQueries)
    const matchingMood = moodKeys.find(mood => keywords.toLowerCase().includes(mood))
    
    const searchQuery = matchingMood ? simpleMoodQueries[matchingMood] : `subject:${keywords}`
    
    return await searchBooks(searchQuery, { ...options, limit: options.limit || 12 })
  } catch (error) {
    console.error('Error in mood search:', error)
    // Return fallback based on mood - try a simple keyword search instead
    try {
      const fallbackQuery = keywords.replace('subject:', '').toLowerCase()
      return await searchBooks(fallbackQuery, { ...options, limit: options.limit || 6 })
    } catch (fallbackError) {
      // Final fallback to trending books
      const fallbackBooks = await getTrendingBooks()
      return { books: fallbackBooks.books.slice(0, 6), totalItems: 6 }
    }
  }
}

// Get book details by Open Library key
export const getBookById = async (bookId) => {
  try {
    // If bookId looks like an Open Library key, use it directly
    const bookKey = bookId.startsWith('/works/') ? bookId : `/works/${bookId}`
    
    const response = await fetch(`${OPEN_LIBRARY_API_BASE_URL}${bookKey}.json`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Transform the detailed book data
    return {
      id: bookId,
      title: data.title || 'Unknown Title',
      subtitle: data.subtitle,
      description: data.description ? (typeof data.description === 'string' ? data.description : data.description.value) : null,
      subjects: data.subjects || [],
      categories: data.subjects ? data.subjects.slice(0, 5) : [],
      covers: data.covers ? data.covers.map(coverId => `${OPEN_LIBRARY_COVERS_URL}/id/${coverId}-L.jpg`) : [],
      thumbnail: data.covers ? `${OPEN_LIBRARY_COVERS_URL}/id/${data.covers[0]}-M.jpg` : null,
      authors: [], // Would need additional API call to get author details
      firstPublishDate: data.first_publish_date,
      key: data.key,
      created: data.created,
      lastModified: data.last_modified,
      links: data.links || [],
    }
  } catch (error) {
    console.error('Error fetching book:', error)
    throw error
  }
}

// Get trending/popular books
export const getTrendingBooks = async () => {
  const trendingQueries = [
    'fiction',
    'science',
    'history',
    'biography',
    'romance'
  ]
  
  try {
    // Get a simple trending query to avoid complex queries that might fail
    const randomQuery = trendingQueries[Math.floor(Math.random() * trendingQueries.length)]
    const result = await searchBooks(randomQuery, { 
      limit: 15,
      offset: 0
    })
    
    // Filter and return results
    const validBooks = result.books.filter(book => 
      book.title && 
      book.authors && 
      book.authors.length > 0
    )
    
    return {
      books: validBooks.slice(0, 12), // Return top 12
      totalItems: result.totalItems || validBooks.length
    }
  } catch (error) {
    console.error('Error fetching trending books:', error)
    
    // Return fallback mock data when API fails
    const fallbackBooks = [
      {
        id: 'fallback_1',
        title: 'The Great Gatsby',
        authors: ['F. Scott Fitzgerald'],
        thumbnail: 'https://via.placeholder.com/200x300/A5C9FF/FFFFFF?text=The+Great+Gatsby',
        publishedDate: '1925-01-01',
        language: 'en',
        averageRating: '4.2',
        description: 'A classic American novel set in the Jazz Age.'
      },
      {
        id: 'fallback_2', 
        title: 'To Kill a Mockingbird',
        authors: ['Harper Lee'],
        thumbnail: 'https://via.placeholder.com/200x300/C8B6FF/FFFFFF?text=To+Kill+a+Mockingbird',
        publishedDate: '1960-01-01',
        language: 'en',
        averageRating: '4.5',
        description: 'A gripping tale of racial injustice and childhood innocence.'
      },
      {
        id: 'fallback_3',
        title: '1984',
        authors: ['George Orwell'],
        thumbnail: 'https://via.placeholder.com/200x300/FFB5A7/FFFFFF?text=1984',
        publishedDate: '1949-01-01',
        language: 'en',
        averageRating: '4.1',
        description: 'A dystopian vision of totalitarian control.'
      },
      {
        id: 'fallback_4',
        title: 'Pride and Prejudice',
        authors: ['Jane Austen'],
        thumbnail: 'https://via.placeholder.com/200x300/A5C9FF/FFFFFF?text=Pride+and+Prejudice',
        publishedDate: '1813-01-01', 
        language: 'en',
        averageRating: '4.3',
        description: 'A romantic novel exploring themes of love, reputation, and class.'
      },
      {
        id: 'fallback_5',
        title: 'The Catcher in the Rye',
        authors: ['J.D. Salinger'],
        thumbnail: 'https://via.placeholder.com/200x300/C8B6FF/FFFFFF?text=The+Catcher+in+the+Rye',
        publishedDate: '1951-01-01',
        language: 'en', 
        averageRating: '3.8',
        description: 'A controversial novel about teenage rebellion and alienation.'
      },
      {
        id: 'fallback_6',
        title: 'Harry Potter and the Philosopher\'s Stone',
        authors: ['J.K. Rowling'],
        thumbnail: 'https://via.placeholder.com/200x300/FFB5A7/FFFFFF?text=Harry+Potter',
        publishedDate: '1997-01-01',
        language: 'en',
        averageRating: '4.6',
        description: 'The magical adventure that started it all.'
      }
    ]
    
    return {
      books: fallbackBooks,
      totalItems: fallbackBooks.length
    }
  }
}

// Advanced search with filters
export const advancedSearch = async (query, filters = {}) => {
  const {
    author,
    title,
    subject,
    isbn,
    publisher,
    language,
    yearFrom,
    yearTo,
    sort = '',
    hasFulltext = false
  } = filters

  // Build advanced query string
  let searchParams = {
    q: query
  }

  // Add specific field searches
  if (author) searchParams.author = author
  if (title) searchParams.title = title
  if (subject) searchParams.subject = subject
  if (isbn) searchParams.isbn = isbn
  if (publisher) searchParams.publisher = publisher

  // Add year range to query string
  if (yearFrom || yearTo) {
    const yearQuery = []
    if (yearFrom) yearQuery.push(`first_publish_year:[${yearFrom} TO *]`)
    if (yearTo) yearQuery.push(`first_publish_year:[* TO ${yearTo}]`)
    if (yearQuery.length > 0) {
      searchParams.q += ` AND (${yearQuery.join(' AND ')})`
    }
  }

  // Add fulltext filter
  if (hasFulltext) {
    searchParams.q += ' AND has_fulltext:true'
  }

  const options = {
    sort,
    lang: language,
    limit: 40
  }

  // Combine searchParams into query string
  let finalQuery = searchParams.q
  if (searchParams.author) finalQuery += ` AND author:"${searchParams.author}"`
  if (searchParams.title) finalQuery += ` AND title:"${searchParams.title}"`
  if (searchParams.subject) finalQuery += ` AND subject:"${searchParams.subject}"`
  if (searchParams.isbn) finalQuery += ` AND isbn:"${searchParams.isbn}"`
  if (searchParams.publisher) finalQuery += ` AND publisher:"${searchParams.publisher}"`

  return await searchBooks(finalQuery, options)
}

// Get book suggestions based on a book
export const getBookSuggestions = async (bookTitle, author) => {
  try {
    let query = ''
    
    if (author && author.length > 0) {
      // First try to find books by the same author
      query = `author:"${author[0]}"`
    } else if (bookTitle) {
      // Extract meaningful words from title for similar book search
      const titleWords = bookTitle.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 3 && !['the', 'and', 'with', 'from', 'into', 'during', 'including', 'until', 'against', 'among', 'throughout', 'despite', 'towards', 'upon', 'concerning', 'of', 'to', 'for', 'in', 'on', 'by', 'about', 'like', 'through', 'over', 'before', 'between', 'after', 'since', 'without', 'under', 'within', 'along', 'following', 'across', 'behind', 'beyond', 'plus', 'except', 'but', 'up', 'out', 'around', 'down', 'off', 'above', 'near'].includes(word))
      
      if (titleWords.length > 0) {
        query = titleWords.slice(0, 2).join(' OR ') // Use first 2 meaningful words
      }
    }
    
    if (!query) return []
    
    const result = await searchBooks(query, { limit: 12 })
    
    // Filter out the original book if it appears in suggestions
    const suggestions = result.books.filter(book => 
      book.title.toLowerCase() !== bookTitle.toLowerCase()
    )
    
    return suggestions.slice(0, 6) // Return top 6 suggestions
  } catch (error) {
    console.error('Error fetching book suggestions:', error)
    return []
  }
}
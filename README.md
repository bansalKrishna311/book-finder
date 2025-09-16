# Alex's Book Finder 📚

> **Candidate ID: Naukri0925**  
> **Web Developer Assignment for Aganitha**  
> **Applicant: Krishna Bansal** - [LinkedIn](https://www.linkedin.com/in/bansalkrishna311/)

## Assignment Overview

This project was developed as part of the assignment for the **Web Developer position at Aganitha**. The task was to create a book discovery application that fetches appropriate data from external APIs and implements a user-friendly interface for exploring books by various categories and search criteria.

---

## 🌟 Live Demo

A beautiful, responsive book discovery application built with React and Vite. Explore thousands of books through mood-based filtering, intelligent search, and a delightful user experience.

**👨‍💻 Developer:** Krishna Bansal - [Connect on LinkedIn](https://www.linkedin.com/in/bansalkrishna311/)

---

## ✨ Features

### 🎯 Core Functionality
- **Smart Search**: Search by title, author, ISBN, or subject with real-time suggestions
- **Mood-Based Discovery**: Filter books by mood categories (Study, Fun, Romantic, Adventure, Chill, Inspirational)
- **Trending Books**: Discover popular and trending reads
- **Book Details**: Comprehensive book information with ratings, descriptions, and metadata
- **Dark/Light Mode**: Seamless theme switching with system preference detection

### 🎨 Design Excellence
- **Pastel Theme**: Beautiful custom color palette with soft, eye-friendly colors
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Smooth Animations**: Delightful micro-interactions and loading states
- **Accessibility**: WCAG compliant with proper contrast ratios and keyboard navigation

### ⚡ Technical Highlights
- **React 19** with modern hooks and functional components
- **Vite** for lightning-fast development and build process
- **Tailwind CSS v4** for utility-first styling
- **Open Library API** integration with robust error handling
- **Custom Hooks** for debounced search and localStorage management
- **Performance Optimized** with lazy loading and efficient re-renders

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/bansalKrishna311/book-finder.git

# Navigate to project directory
cd book-finder

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern UI library
- **Vite 7.1.2** - Next-generation frontend tooling
- **Tailwind CSS v4.1.13** - Utility-first CSS framework

### APIs & Data
- **Open Library API** - Book data and search functionality
- **Custom API Layer** - Robust error handling and data transformation

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing and optimization
- **Lucide React** - Beautiful icon library

### Design System
- **Custom Pastel Theme** - Primary Blue (#A5C9FF), Secondary Purple (#C8B6FF), Accent Coral (#FFB5A7)
- **Dark Mode Support** - Complete theme switching capability
- **Responsive Grid** - Mobile-first design approach

---

## 📁 Project Structure

```
book-finder/
├── src/
│   ├── components/
│   │   ├── BookCard.jsx           # Individual book display component
│   │   ├── BookDetailModal.jsx    # Detailed book information modal
│   │   ├── MoodChips.jsx         # Mood-based filtering chips
│   │   └── SearchBar.jsx         # Smart search with suggestions
│   ├── hooks/
│   │   └── useCustomHooks.js     # Custom hooks (debounce, localStorage)
│   ├── services/
│   │   └── bookService.js        # API integration and data handling
│   ├── App.jsx                   # Main application component
│   ├── App.css                   # Component-specific styles
│   ├── index.css                 # Global styles and Tailwind imports
│   └── main.jsx                  # Application entry point
├── public/
│   └── vite.svg                  # Vite logo
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind configuration
├── vite.config.js               # Vite configuration
└── README.md                     # Project documentation
```

---

## 🎯 Assignment Requirements Fulfilled

### ✅ Data Fetching
- **API Integration**: Successfully integrated Open Library API
- **Error Handling**: Robust error handling with fallback mechanisms
- **Data Transformation**: Clean, consistent data structure across components
- **Performance**: Debounced search and efficient API calls

### ✅ User Experience
- **Intuitive Interface**: Clean, modern design with clear navigation
- **Responsive Design**: Works seamlessly across all device sizes
- **Loading States**: Skeleton loaders and smooth transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation

### ✅ Technical Implementation
- **Modern React**: Hooks, functional components, and best practices
- **State Management**: Efficient local state management
- **Code Quality**: Clean, maintainable, and well-documented code
- **Build System**: Optimized Vite configuration for development and production

---

## 🌙 Theme System

The application features a comprehensive theme system with:

- **Light Mode**: Cream backgrounds with charcoal text
- **Dark Mode**: Charcoal backgrounds with cream text
- **Pastel Accents**: Consistent color palette across all themes
- **System Preference**: Automatic theme detection based on user's system settings

---

## 📱 Responsive Design

### Mobile (320px+)
- Single column book grid
- Collapsible search suggestions
- Touch-optimized mood chips

### Tablet (768px+)
- Two-column book layout
- Enhanced search interface
- Improved modal presentations

### Desktop (1024px+)
- Multi-column book grid (up to 5 columns)
- Full-featured search with autocomplete
- Rich modal experiences

---

## 🔧 API Integration Details

### Open Library API
- **Search Endpoint**: `/search.json` for book searches
- **Subject Endpoint**: `/subjects/[subject].json` for mood-based filtering
- **Cover Images**: Dynamic cover image fetching with fallbacks
- **Rate Limiting**: Implemented debounced requests to respect API limits

### Error Handling
- **Network Errors**: Graceful degradation with retry mechanisms
- **API Errors**: User-friendly error messages
- **Fallback Data**: Classic books fallback when API is unavailable
- **Loading States**: Skeleton screens during data fetching

---

## 🎨 Design Philosophy

### Pastel Theme Rationale
- **Eye Comfort**: Soft colors reduce eye strain during long reading sessions
- **Brand Identity**: Unique, memorable color palette that stands out
- **Accessibility**: Carefully chosen colors meet WCAG contrast requirements
- **Mood Enhancement**: Colors evoke calm, focused reading atmosphere

### User-Centric Approach
- **Intuitive Navigation**: Logical flow from search to discovery to details
- **Minimal Cognitive Load**: Clean interface with clear visual hierarchy
- **Delightful Interactions**: Subtle animations enhance user experience
- **Performance First**: Fast loading times and smooth transitions

---

## 🚀 Performance Optimizations

- **Lazy Loading**: Images load on demand
- **Debounced Search**: Prevents excessive API calls
- **Memoized Components**: Optimized re-rendering
- **Efficient Bundling**: Vite's optimized build process
- **CSS Optimization**: Tailwind CSS purging for smaller bundle size

---

## 🔒 Submission Information

**Important:** It is mandatory to mention **Candidate ID: Naukri0925** when submitting the exercise. Submissions without the Candidate ID will not be considered.

Thank you for your interest in the **Web Developer position at Aganitha**.

---

## 👨‍💻 About the Developer

**Krishna Bansal**  
Web Developer | React Specialist | UI/UX Enthusiast

- 🔗 **LinkedIn**: [Connect with me](https://www.linkedin.com/in/bansalkrishna311/)
- � **Phone**: +91 9511834002
- �📧 **Contact**: Available on LinkedIn
- 🌟 **Portfolio**: [View more projects](https://www.linkedin.com/in/bansalkrishna311/)

### Skills Demonstrated
- **Frontend Development**: React, JavaScript, CSS, HTML
- **Modern Tooling**: Vite, Tailwind CSS, PostCSS
- **API Integration**: RESTful APIs, error handling, data transformation
- **UI/UX Design**: Responsive design, accessibility, user experience
- **Performance**: Optimization techniques, efficient bundling
- **Code Quality**: Clean code practices, documentation, maintainability

---

## 📄 License

This project was created as an assignment for Aganitha's Web Developer position.

**Candidate ID: Naukri0925**

---

**Made with 💜 by [Krishna Bansal](https://www.linkedin.com/in/bansalkrishna311/) for book lovers everywhere**

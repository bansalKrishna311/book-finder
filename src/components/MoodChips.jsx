import { useState } from 'react'

const MoodChips = ({ onMoodSelect, selectedMood }) => {
  const moods = [
    { 
      id: 'study', 
      emoji: '📖', 
      label: 'Study', 
      color: 'primary',
      bg: 'bg-primary-100 dark:bg-primary-900/30',
      hoverBg: 'hover:bg-primary-200 dark:hover:bg-primary-800/40',
      activeBg: 'bg-primary-600 dark:bg-primary-600',
      activeText: 'text-[#FFB5A7] dark:text-cream-50',
      keywords: 'subject:Education'
    },
    { 
      id: 'fun', 
      emoji: '😂', 
      label: 'Fun', 
      color: 'accent',
      bg: 'bg-accent-100 dark:bg-accent-900/30',
      hoverBg: 'hover:bg-accent-200 dark:hover:bg-accent-800/40',
      activeBg: 'bg-accent-600 dark:bg-accent-600',
         activeText: 'text-[#FFB5A7] dark:text-cream-50',

      keywords: 'subject:Humor'
    },
    { 
      id: 'romantic', 
      emoji: '💕', 
      label: 'Romantic', 
      color: 'secondary',
      bg: 'bg-secondary-100 dark:bg-secondary-900/30',
      hoverBg: 'hover:bg-secondary-200 dark:hover:bg-secondary-800/40',
      activeBg: 'bg-secondary-600 dark:bg-secondary-600',
           activeText: 'text-[#FFB5A7] dark:text-cream-50',

      keywords: 'subject:Romance'
    },
    { 
      id: 'adventure', 
      emoji: '🚀', 
      label: 'Adventure', 
      color: 'primary',
      bg: 'bg-primary-100 dark:bg-primary-900/30',
      hoverBg: 'hover:bg-primary-200 dark:hover:bg-primary-800/40',
      activeBg: 'bg-primary-600 dark:bg-primary-600',
           activeText: 'text-[#FFB5A7] dark:text-cream-50',

      keywords: 'subject:Adventure'
    },
    { 
      id: 'chill', 
      emoji: '💤', 
      label: 'Chill', 
      color: 'neutral',
      bg: 'bg-cream-200 dark:bg-charcoal-700',
      hoverBg: 'hover:bg-cream-300 dark:hover:bg-charcoal-600',
      activeBg: 'bg-cream-400 dark:bg-charcoal-500',
            activeText: 'text-[#FFB5A7] dark:text-cream-50',

      keywords: 'subject:Poetry'
    },
    { 
      id: 'inspirational', 
      emoji: '🌟', 
      label: 'Inspirational', 
      color: 'accent',
      bg: 'bg-accent-100 dark:bg-accent-900/30',
      hoverBg: 'hover:bg-accent-200 dark:hover:bg-accent-800/40',
      activeBg: 'bg-accent-600 dark:bg-accent-600',
           activeText: 'text-[#FFB5A7] dark:text-cream-50',

      keywords: 'subject:Biography'
    },
  ]

  const handleMoodClick = (mood) => {
    const newSelectedMood = selectedMood === mood.id ? null : mood.id
    onMoodSelect(newSelectedMood, mood.keywords)
    
    // Change background tint based on mood
    const root = document.documentElement
    if (newSelectedMood) {
      root.style.setProperty('--mood-tint', getMoodGradient(mood.color))
      root.classList.add('mood-active')
    } else {
      root.style.removeProperty('--mood-tint')
      root.classList.remove('mood-active')
    }
  }

  const getMoodGradient = (color) => {
    const gradients = {
      primary: 'linear-gradient(135deg, rgba(165, 201, 255, 0.1) 0%, rgba(200, 182, 255, 0.1) 100%)',
      secondary: 'linear-gradient(135deg, rgba(200, 182, 255, 0.1) 0%, rgba(255, 181, 167, 0.1) 100%)',
      accent: 'linear-gradient(135deg, rgba(255, 181, 167, 0.1) 0%, rgba(165, 201, 255, 0.1) 100%)',
      neutral: 'linear-gradient(135deg, rgba(255, 253, 247, 0.1) 0%, rgba(30, 30, 46, 0.05) 100%)'
    }
    return gradients[color] || gradients.primary
  }

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {moods.map((mood) => (
        <button
          key={mood.id}
          onClick={() => handleMoodClick(mood)}
          className={`px-6 py-3 rounded-2xl transition-all duration-300 shadow-soft hover:shadow-pastel hover:scale-105 active:scale-95 ${
            selectedMood === mood.id
              ? `${mood.activeBg} ${mood.activeText} shadow-pastel scale-105`
              : `${mood.bg} ${mood.hoverBg} text-charcoal-700 dark:text-charcoal-200`
          }`}
        >
          <span className="text-xl mr-2">{mood.emoji}</span>
          <span className="font-semibold text-base">
            {mood.label}
          </span>
          {selectedMood === mood.id && (
            <div className="absolute inset-0 rounded-2xl animate-mood-glow pointer-events-none" />
          )}
        </button>
      ))}
    </div>
  )
}

export default MoodChips
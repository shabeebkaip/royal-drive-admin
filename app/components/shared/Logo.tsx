import React from 'react'

interface LogoProps {
  className?: string
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}

const Logo = ({ className = '', variant = 'dark', size = 'md' }: LogoProps) => {
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  }

  const letterSpacing = {
    sm: 'tracking-[0.1em]',
    md: 'tracking-[0.15em]',
    lg: 'tracking-[0.2em]'
  }

  // Racing color scheme - bold and sporty blue
  const textColor = variant === 'light' ? 'text-white' : 'text-gray-900'
  const accentColor = variant === 'light' ? 'text-blue-400' : 'text-blue-600'
  const speedLineColor = variant === 'light' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : 'bg-gradient-to-r from-blue-600 to-cyan-500'

  return (
    <div className={`flex items-center relative ${className}`}>
      {/* Racing Logo with Speed Effects */}
      <div className="relative flex items-center">
        
        {/* Speed Lines Background Effect */}
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
          <div className={`h-0.5 w-4 ${speedLineColor} skew-y-12 opacity-70`}></div>
          <div className={`h-0.5 w-6 ${speedLineColor} skew-y-12 opacity-50 mt-1`}></div>
          <div className={`h-0.5 w-3 ${speedLineColor} skew-y-12 opacity-30 mt-1`}></div>
        </div>

        {/* Main Logo Text */}
        <div className="flex items-center space-x-1 relative z-10">
          {/* ROYAL - Bold Italic Racing Style */}
          <span className={`
            ${textSizeClasses[size]} 
            ${textColor} 
            font-black 
            italic 
            ${letterSpacing[size]} 
            uppercase 
            transform 
            skew-x-[-12deg] 
            drop-shadow-lg
            bg-gradient-to-b from-current to-gray-700 bg-clip-text
            ${variant === 'light' ? 'text-transparent' : ''}
          `}>
            ROYAL
          </span>

          {/* Racing Chevron/Arrow Separator */}
          <div className="relative mx-2">
            <svg 
              width="20" 
              height="16" 
              viewBox="0 0 20 16" 
              className={`${variant === 'light' ? 'text-blue-400' : 'text-blue-600'} drop-shadow-lg`}
              fill="currentColor"
            >
              <path d="M2 8L8 2L6.5 0.5L0 7L0.5 8L0 9L6.5 15.5L8 14L2 8Z" transform="rotate(180 10 8)" />
              <path d="M12 8L18 2L16.5 0.5L10 7L10.5 8L10 9L16.5 15.5L18 14L12 8Z" transform="rotate(180 10 8)" />
            </svg>
          </div>

          {/* DRIVE - Bold Italic Racing Style */}
          <span className={`
            ${textSizeClasses[size]} 
            ${accentColor} 
            font-black 
            italic 
            ${letterSpacing[size]} 
            uppercase 
            transform 
            skew-x-[-12deg] 
            drop-shadow-lg
            bg-gradient-to-b from-current to-blue-800 bg-clip-text
            ${variant === 'light' ? 'text-transparent' : ''}
          `}>
            DRIVE
          </span>
        </div>

        {/* Speed Lines Forward Effect */}
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
          <div className={`h-0.5 w-8 ${speedLineColor} skew-y-[-12deg] opacity-70`}></div>
          <div className={`h-0.5 w-12 ${speedLineColor} skew-y-[-12deg] opacity-50 mt-1`}></div>
          <div className={`h-0.5 w-6 ${speedLineColor} skew-y-[-12deg] opacity-30 mt-1`}></div>
        </div>

        {/* Subtle Glow Effect for Dark Variant */}
        {variant === 'dark' && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 blur-xl -z-10 rounded-lg"></div>
        )}
      </div>
    </div>
  )
}

export default Logo

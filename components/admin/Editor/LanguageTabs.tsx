'use client'

interface LanguageTabsProps {
  activeLanguage: 'az' | 'en' | 'ru' | 'tr'
  onLanguageChange: (lang: 'az' | 'en' | 'ru' | 'tr') => void
}

const languages = [
  { code: 'az' as const, label: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  { code: 'ru' as const, label: 'Русский', flag: '🇷🇺' },
  { code: 'tr' as const, label: 'Türkçe', flag: '🇹🇷' },
]

export default function LanguageTabs({ activeLanguage, onLanguageChange }: LanguageTabsProps) {
  return (
    <div className="border-b border-bg-tertiary mb-6">
      <div className="flex gap-2 overflow-x-auto">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={`
              flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200
              border-b-2 whitespace-nowrap
              ${activeLanguage === lang.code
                ? 'border-accent-primary text-accent-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-bg-tertiary'
              }
            `}
          >
            <span className="text-xl">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

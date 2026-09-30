'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AccordionItemProps {
  title: string
  description: string
  isOpen: boolean
  onToggle: () => void
  index: number
}

function AccordionItem({ title, description, isOpen, onToggle, index }: AccordionItemProps) {
  return (
    <div className="border border-white/5 rounded-xl overflow-hidden bg-bg-tertiary/50 hover:border-accent-primary/30 transition-colors">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left group"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-3 flex-1">
          {/* Plus/Minus Icon */}
          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen 
              ? 'bg-accent-primary text-white rotate-180' 
              : 'bg-white/5 text-accent-primary group-hover:bg-accent-primary/10'
          }`}>
            <ChevronDown size={16} className="transition-transform duration-300" />
          </div>
          
          {/* Title */}
          <span className={`text-sm font-medium transition-colors ${
            isOpen ? 'text-accent-primary' : 'text-text-secondary group-hover:text-text-primary'
          }`}>
            {title}
          </span>
        </div>
      </button>

      {/* Animated Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pl-14">
              <p className="text-sm text-text-muted leading-relaxed">
                {description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface AccordionProps {
  items: Array<{
    title: string
    description: string
  }>
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          description={item.description}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
          index={index}
        />
      ))}
    </div>
  )
}

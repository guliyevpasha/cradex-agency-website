'use client'

import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'

interface ActionButtonsProps {
  editHref: string
  onDelete: () => void
}

export default function ActionButtons({ editHref, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Edit Button */}
      <Link href={editHref}>
        <button
          className="p-2 rounded-lg bg-accent-primary hover:bg-accent-secondary text-white transition-colors duration-200"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
      </Link>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = '搜索...' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-terminal-bg border border-terminal-border rounded-xl
                   text-sm text-terminal-text placeholder-terminal-muted
                   focus:outline-none focus:border-terminal-accent/50 focus:ring-1 focus:ring-terminal-accent/20
                   transition-all duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-terminal-muted hover:text-terminal-text"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

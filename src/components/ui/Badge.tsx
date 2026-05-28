interface BadgeProps {
  label: string
  variant?: 'default' | 'accent' | 'danger' | 'warning' | 'info'
  size?: 'sm' | 'md'
}

const variants = {
  default: 'bg-terminal-border text-terminal-muted',
  accent: 'bg-terminal-accent/15 text-terminal-accent border border-terminal-accent/30',
  danger: 'bg-red-500/15 text-red-400 border border-red-500/30',
  warning: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  info: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
}

export default function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}>
      {label}
    </span>
  )
}

import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, Users, FileText, AlertTriangle, TrendingUp } from 'lucide-react'

const navItems = [
  { path: '/', label: '仪表盘', icon: BarChart3 },
  { path: '/leaders', label: '领导人物库', icon: Users },
  { path: '/policies', label: '政策库', icon: FileText },
  { path: '/penalties', label: '处罚监控', icon: AlertTriangle },
]

export default function Header() {
  const location = useLocation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-terminal-header/90 backdrop-blur-xl border-b border-terminal-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-terminal-accent to-terminal-accent2 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-lg font-bold gradient-text">Gina Dashboard</span>
              <span className="hidden sm:inline text-xs text-terminal-muted ml-2">AI金融监管情报平台</span>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-terminal-accent/10 border border-terminal-accent/30 rounded-lg"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className={`relative flex items-center gap-2 ${isActive ? 'text-terminal-accent' : 'text-terminal-muted hover:text-terminal-text'}`}>
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}

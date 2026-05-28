export default function Footer() {
  return (
    <footer className="border-t border-terminal-border py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs text-terminal-muted">
        <p>每月更新 · 集成多数据源 · AI辅助分析</p>
        <p className="mt-1">
          Gina Dashboard &copy; {new Date().getFullYear()} · AI金融监管情报平台
        </p>
      </div>
    </footer>
  )
}

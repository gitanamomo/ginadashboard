import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Leaders = lazy(() => import('@/pages/Leaders'))
const LeaderDetail = lazy(() => import('@/pages/LeaderDetail'))
const Policies = lazy(() => import('@/pages/Policies'))
const ForeignBanks = lazy(() => import('@/pages/ForeignBanks'))
const ForeignBankDetail = lazy(() => import('@/pages/ForeignBankDetail'))

function NotFound() {
  return (
    <div className="text-center py-20">
      <div className="text-6xl font-bold gradient-text mb-4">404</div>
      <p className="text-terminal-muted mb-6">页面未找到</p>
      <a href="/ginadashboard/" className="btn-primary">返回首页</a>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/banks" element={<ForeignBanks />} />
            <Route path="/banks/:id" element={<ForeignBankDetail />} />
            <Route path="/leaders" element={<Leaders />} />
            <Route path="/leaders/:id" element={<LeaderDetail />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

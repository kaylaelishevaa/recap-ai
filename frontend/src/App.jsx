import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/Common/ErrorBoundary'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#15101C] text-[#ECE7F1]">
          <Header />
          <main className="flex-1 max-w-[960px] w-full mx-auto px-6 py-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/meeting/:id" element={<ResultsPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

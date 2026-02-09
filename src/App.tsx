import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { RefreshProvider } from './context/RefreshContext'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { UploadPage } from './pages/UploadPage'
import { FilesPage } from './pages/FilesPage'
import { SharePage } from './pages/SharePage'
import { Navbar } from './components/Navbar'
import './index.css'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </>
  )
}

const App: React.FC = () => {
  return (
    <RefreshProvider>
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/share/:shortLink" element={<SharePageWrapper />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <HomePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <UploadPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/files"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <FilesPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </RefreshProvider>
  )
}

const SharePageWrapper: React.FC = () => {
  const { shortLink } = useParams<{ shortLink: string }>()
  return shortLink ? <SharePage shortLink={shortLink} /> : null
}

export default App

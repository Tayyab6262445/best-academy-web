import { Suspense, lazy } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { store } from './app/store'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './layouts/AppShell'
import Spinner from './components/Spinner'
import { Toaster } from './components/ui/toaster'
import { TooltipProvider } from './components/ui/tooltip'

import Gateway from './pages/Gateway'
import LoginPage from './pages/LoginPage'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const AttendancePage = lazy(() => import('./pages/AttendancePage'))
const ResultsPage = lazy(() => import('./pages/ResultsPage'))
const QuizzesPage = lazy(() => import('./pages/QuizzesPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const CoursesPage = lazy(() => import('./pages/CoursesPage'))
const PdfViewerPage = lazy(() => import('./pages/PdfViewerPage'))
const AttemptedTestsPage = lazy(() => import('./pages/AttemptedTestsPage'))
const QuizResultPage = lazy(() => import('./pages/QuizResultPage'))
const ReviewTestPage = lazy(() => import('./pages/ReviewTestPage'))
const TestAttemptPage = lazy(() => import('./pages/TestAttemptPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <Spinner size="large" color="#E31E24" />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <TooltipProvider delayDuration={200}>
          <Toaster />
          <BrowserRouter>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Gateway />} />
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route element={<AppShell />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/attendance" element={<AttendancePage />} />
                    <Route path="/results" element={<ResultsPage />} />
                    <Route path="/quizzes" element={<QuizzesPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/attempted-tests" element={<AttemptedTestsPage />} />
                    <Route path="/quiz-result" element={<QuizResultPage />} />
                    <Route path="/review-test" element={<ReviewTestPage />} />
                  </Route>

                  <Route path="/pdf-viewer" element={<PdfViewerPage />} />
                  <Route path="/test-attempt" element={<TestAttemptPage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default App

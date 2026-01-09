import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Flashcards from './pages/Flashcards';
import Speaking from './pages/Speaking';
import SpeakingScenarios from './pages/SpeakingScenarios';
import SpeakingFlashcard from './pages/SpeakingFlashcard';
import Login from './pages/Login';
import Register from './pages/Register';
import Learn from './pages/Learn';
import LevelTopics from './pages/LevelTopics';
import LearnCards from './pages/LearnCards';
import SpecializedSelector from './pages/SpecializedSelector';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Stats from './pages/Stats';
import Favorites from './pages/Favorites';
import Mistakes from './pages/Mistakes';
import Quiz from './pages/Quiz';
import Feedback from './pages/Feedback';
import AdminDashboard from './pages/AdminDashboard';
import AssessmentTest from './pages/AssessmentTest';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { NavigationProvider } from './context/NavigationContext';

function AppContent() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname === '/admin';
  const isAssessmentPage = location.pathname === '/assessment';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isAuthPage && !isAdminPage && !isAssessmentPage && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            token ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) : <Home />
          } />
          <Route path="/assessment" element={
            <ProtectedRoute>
              <AssessmentTest />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {isAdmin ? <Navigate to="/admin" replace /> : <Dashboard />}
            </ProtectedRoute>
          } />
          <Route path="/flashcards" element={
            <ProtectedRoute>
              <Flashcards />
            </ProtectedRoute>
          } />
          <Route path="/learn" element={
            <ProtectedRoute>
              <Learn />
            </ProtectedRoute>
          } />
          <Route path="/level-topics" element={
            <ProtectedRoute>
              <LevelTopics />
            </ProtectedRoute>
          } />
          <Route path="/specialized-selector" element={
            <ProtectedRoute>
              <SpecializedSelector />
            </ProtectedRoute>
          } />
          <Route path="/learn-cards" element={
            <ProtectedRoute>
              <LearnCards />
            </ProtectedRoute>
          } />
          <Route path="/speaking" element={
            <ProtectedRoute>
              <Speaking />
            </ProtectedRoute>
          } />
          <Route path="/speaking-scenarios" element={
            <ProtectedRoute>
              <SpeakingScenarios />
            </ProtectedRoute>
          } />
          <Route path="/speaking-flashcard" element={
            <ProtectedRoute>
              <SpeakingFlashcard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          } />
          <Route path="/stats" element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />
          <Route path="/mistakes" element={
            <ProtectedRoute>
              <Mistakes />
            </ProtectedRoute>
          } />
          <Route path="/quiz" element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/login" element={
            token ? <Navigate to="/dashboard" replace /> : <Login />
          } />
          <Route path="/register" element={
            token ? <Navigate to="/dashboard" replace /> : <Register />
          } />
        </Routes>
      </main>
      {!isAuthPage && !isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </Router>
  );
}

export default App;

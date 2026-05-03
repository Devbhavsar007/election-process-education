import React, { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth.js'
import Navbar from './components/Navbar'
import HeroHeader from './components/HeroHeader'
import AuthPage from './components/AuthPage'
import CompleteProfile from './components/CompleteProfile'
import Dashboard from './components/Dashboard'
import VotingJourney from './components/VotingJourney'
import ElectionTimeline from './components/ElectionTimeline'
import PollingBoothGuide from './components/PollingBoothGuide'
import ScenarioSimulator from './components/ScenarioSimulator'
import KnowledgeQuiz from './components/KnowledgeQuiz'
import AIChat from './components/AIChat'
import TranslateTool from './components/TranslateTool'
import VoterChecklist from './components/VoterChecklist'
import AnalyticsInsights from './components/AnalyticsInsights'
import Footer from './components/Footer'

function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState('landing');
  const [pendingScroll, setPendingScroll] = useState(null);

  useEffect(() => {
    if (view === 'landing' && pendingScroll) {
      const el = document.getElementById(pendingScroll);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
          setPendingScroll(null);
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [view, pendingScroll]);

  const handleNavigate = (targetView) => {
    const sectionElements = {
      'features': 'features-section',
      'how-it-works': 'process-section'
    };

    if (targetView === 'landing') {
      if (view === 'landing') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setView('landing');
      }
      return;
    }

    if (sectionElements[targetView]) {
      if (view === 'landing') {
        const el = document.getElementById(sectionElements[targetView]);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        setPendingScroll(sectionElements[targetView]);
        setView('landing');
      }
      return;
    }

    setView(targetView);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, border: '3px solid var(--border)',
            borderTopColor: 'var(--accent-primary)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading CivicVerse...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  if (view === 'auth') {
    return <AuthPage onBack={() => setView('landing')} onNavigate={handleNavigate} />;
  }

  if (view === 'complete-profile') {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Navbar onNavigate={handleNavigate} currentView={view} />
        <CompleteProfile onNavigate={handleNavigate} />
      </div>
    );
  }

  // Protected views — redirect to auth if not logged in
  const protectedViews = ['dashboard', 'journey', 'timeline', 'booth', 'scenario', 'quiz', 'chat', 'translate', 'checklist', 'analytics'];
  if (protectedViews.includes(view) && !user) {
    setView('auth');
    return null;
  }

  if (view === 'dashboard') {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Navbar onNavigate={handleNavigate} currentView={view} />
        <Dashboard onNavigate={handleNavigate} />
      </div>
    );
  }

  if (view === 'journey') {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Navbar onNavigate={handleNavigate} currentView={view} />
        <VotingJourney onNavigate={handleNavigate} />
      </div>
    );
  }

  if (view === 'timeline') {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Navbar onNavigate={handleNavigate} currentView={view} />
        <ElectionTimeline onNavigate={handleNavigate} />
      </div>
    );
  }

  if (view === 'booth') {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Navbar onNavigate={handleNavigate} currentView={view} />
        <PollingBoothGuide onNavigate={handleNavigate} />
      </div>
    );
  }

  if (view === 'scenario') {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Navbar onNavigate={handleNavigate} currentView={view} />
        <ScenarioSimulator onNavigate={handleNavigate} />
      </div>
    );
  }

  if (view === 'quiz') {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Navbar onNavigate={handleNavigate} currentView={view} />
        <KnowledgeQuiz onNavigate={handleNavigate} />
      </div>
    );
  }

  if (view === 'chat') {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Navbar onNavigate={handleNavigate} currentView={view} />
        <AIChat onNavigate={handleNavigate} />
      </div>
    );
  }

  if (view === 'translate') {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Navbar onNavigate={handleNavigate} currentView={view} />
        <TranslateTool onNavigate={handleNavigate} />
      </div>
    );
  }

  if (view === 'checklist') {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Navbar onNavigate={handleNavigate} currentView={view} />
        <VoterChecklist onNavigate={handleNavigate} />
      </div>
    );
  }

  if (view === 'analytics') {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Navbar onNavigate={handleNavigate} currentView={view} />
        <AnalyticsInsights onNavigate={handleNavigate} />
      </div>
    );
  }

  // Landing page
  return (
    <div style={{ padding: '0', backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar onNavigate={handleNavigate} currentView={view} />
      <main>
        <HeroHeader onStart={() => setView('auth')} />
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App

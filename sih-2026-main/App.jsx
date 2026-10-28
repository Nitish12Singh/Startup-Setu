import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DemoFlowModal from './DemoFlowModal';

import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import GovDashboard from './GovDashboard';
import AIChallengeBuilder from './AIChallengeBuilder';
import ChallengeMarketplace from './ChallengeMarketplace';
import StartupMatching from './StartupMatching';
import ProposalSubmission from './ProposalSubmission';
import GovernmentProposals from './GovernmentProposals';
import EvaluatorDashboard from './EvaluatorDashboard';
import EvaluatorHome from './EvaluatorHome';
import PilotManagement from './PilotManagement';
import KPIDashboard from './KPIDashboard';
import EvidencePassport from './EvidencePassport';
import ValidatorDashboard from './ValidatorDashboard';
import ValidatorHome from './ValidatorHome';
import ProcurementDecisionPack from './ProcurementDecisionPack';
import ScaleEngine from './ScaleEngine';
import AuditTrail from './AuditTrail';
import AdminDashboard from './AdminDashboard';
import StartupProfile from './StartupProfile';
import PaymentsPage from './PaymentsPage';
import SupportChatbot from './SupportChatbot';
import CookieConsent from './CookieConsent';

const CONSENT_STORAGE_KEY = 'startupsetu_cookie_consent';

const getInitialConsent = () => {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) === 'accepted';
  } catch {
    return false;
  }
};

export default function App() {
  // Start unauthenticated on the public homepage; login remains available from navigation.
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('landing');
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [trackingConsent, setTrackingConsent] = useState(getInitialConsent);
  const [selectedChallengeId, setSelectedChallengeId] = useState('ch-1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Shared Data States
  const [challenges, setChallenges] = useState([]);
  const [startups, setStartups] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [evidenceList, setEvidenceList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const recordActivity = (eventType, details = {}) => {
    if (!trackingConsent) return;

    fetch('/api/activity-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        page: window.location.pathname,
        activeTab,
        userId: currentUser?.id || null,
        userRole: currentUser?.role || 'Guest',
        details
      }),
      keepalive: true
    }).catch(error => console.error('Unable to record activity event:', error));
  };

  useEffect(() => {
    if (!trackingConsent) return undefined;

    const handleClick = event => {
      const target = event.target.closest('button, a, [role="button"]');
      if (target) {
        recordActivity('interaction', {
          action: 'click',
          label: target.getAttribute('aria-label') || target.textContent?.trim().slice(0, 120) || 'unnamed'
        });
      }
    };
    const handleChange = event => {
      const target = event.target;
      if (target.matches('input, select, textarea')) {
        recordActivity('change', {
          field: target.getAttribute('name') || target.getAttribute('type') || target.tagName.toLowerCase()
        });
      }
    };
    const handleSubmit = event => {
      recordActivity('form_submit', {
        form: event.target.getAttribute('aria-label') || event.target.id || 'unnamed'
      });
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('change', handleChange);
    document.addEventListener('submit', handleSubmit);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('change', handleChange);
      document.removeEventListener('submit', handleSubmit);
    };
  }, [trackingConsent, activeTab, currentUser]);

  useEffect(() => {
    recordActivity('navigation', { destination: activeTab });
  }, [activeTab]);

  const acceptTracking = () => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
      document.cookie = `${CONSENT_STORAGE_KEY}=accepted; Max-Age=31536000; Path=/; SameSite=Lax`;
    } catch (error) {
      console.error('Unable to save cookie consent:', error);
    }
    setTrackingConsent(true);
  };

  const declineTracking = () => {
    try {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
      document.cookie = `${CONSENT_STORAGE_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
    } catch (error) {
      console.error('Unable to clear cookie consent:', error);
    }
    setTrackingConsent(false);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const responses = await Promise.all([
        fetch('/api/challenges'),
        fetch('/api/startups'),
        fetch('/api/proposals'),
        fetch('/api/pilots'),
        fetch('/api/kpis'),
        fetch('/api/evidence'),
        fetch('/api/audit-logs')
      ]);
      const failedResponse = responses.find(response => !response.ok);
      if (failedResponse) {
        throw new Error(`Initial data request failed with status ${failedResponse.status}`);
      }

      const [chData, stData, prData, piData, kpData, evData, auData] =
        await Promise.all(responses.map(response => response.json()));

      setChallenges(chData);
      setStartups(stData);
      setProposals(prData);
      setPilots(piData);
      setKpis(kpData);
      setEvidenceList(evData);
      setAuditLogs(auData);
    } catch (err) {
      console.error('Error loading API data:', err);
    }
  };

  const handleRoleChange = (newRole, email, targetTabOverride = null, profileDetails = {}) => {
    const roleDefaults = {
      'Government Officer': { defaultTab: 'gov-dashboard' },
      'Startup': { defaultTab: 'startup-dashboard' },
      'Evaluator': { defaultTab: 'evaluator-dashboard' },
      'Validator': { defaultTab: 'validator-dashboard' },
      'Admin': { defaultTab: 'admin-users' }
    };

    const details = roleDefaults[newRole] || roleDefaults['Government Officer'];
    const identity = profileDetails.name || email || 'User';
    setCurrentUser({
      id: `u-${Date.now()}`,
      role: newRole,
      name: identity,
      email: email || '',
      organization: profileDetails.organization || '',
      designation: profileDetails.designation || '',
      avatar: profileDetails.avatar || null,
      token: profileDetails.token || '',
      startupId: profileDetails.startupId || null
    });

    setActiveTab(targetTabOverride || details.defaultTab);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('login');
  };

  const handlePublishChallenge = async (newChallengeData) => {
    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChallengeData)
      });
      const published = await res.json();
      if (!res.ok) {
        throw new Error(published.error || `Challenge publish failed with status ${res.status}`);
      }
      setChallenges(previousChallenges => [published, ...previousChallenges]);
    } catch (err) {
      console.error('Error publishing challenge:', err);
    }
  };

  const handleExecuteDemoStep = (roleToSet, targetTab) => {
    handleRoleChange(roleToSet, null, targetTab);
  };

  // Role-Based Allowed Tabs Map
  const roleAllowedTabs = {
    'Government Officer': ['gov-dashboard', 'ai-builder', 'startups', 'matching', 'proposals', 'kpi-analytics', 'evidence-passport', 'procurement-decisions', 'scale-engine', 'audit-trail', 'profile', 'landing', 'login', 'auth'],
    'Startup': ['startup-dashboard', 'marketplace', 'proposals', 'proposal-submission', 'pilots', 'evidence-passport', 'payments', 'startup-profile', 'profile', 'landing', 'login', 'auth'],
    'Evaluator': ['evaluator-dashboard', 'evaluator-scoring', 'kpi-analytics', 'audit-trail', 'profile', 'landing', 'login', 'auth'],
    'Validator': ['validator-dashboard', 'pilots', 'evidence-passport', 'validator-signoff', 'kpi-analytics', 'audit-trail', 'profile', 'landing', 'login', 'auth'],
    'Admin': ['admin-users', 'kpi-analytics', 'audit-trail', 'profile', 'landing', 'login', 'auth']
  };

  const renderContent = () => {
    if (activeTab === 'landing') {
      return <LandingPage onNavigate={setActiveTab} onSelectRole={handleRoleChange} />;
    }

    if (activeTab === 'login' || activeTab === 'auth' || !currentUser) {
      return (
        <LoginPage 
          onLoginSuccess={(role, email, targetTab, profileDetails) => handleRoleChange(role, email, targetTab, profileDetails)} 
          onNavigate={setActiveTab} 
        />
      );
    }

    // Role-based Route Guard
    const allowed = roleAllowedTabs[currentUser.role] || [];
    if (!allowed.includes(activeTab)) {
      const defaultRoleTab = {
        'Government Officer': 'gov-dashboard',
        'Startup': 'startup-dashboard',
        'Evaluator': 'evaluator-dashboard',
        'Validator': 'validator-dashboard',
        'Admin': 'admin-users'
      }[currentUser.role] || 'gov-dashboard';

      return (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto my-12 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl font-bold">
            🔒
          </div>
          <h3 className="text-xl font-extrabold text-amber-950">Access Restricted by Role</h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            Your current logged-in role (<strong className="text-amber-950">{currentUser.role}</strong>) does not have authorization to view the target module.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button 
              onClick={() => setActiveTab(defaultRoleTab)}
              className="gov-btn-primary text-xs py-2 px-4 font-bold"
            >
              Return to {currentUser.role} Dashboard
            </button>
          </div>
        </div>
      );
    }
    switch (activeTab) {
      case 'landing':
        return <LandingPage onNavigate={setActiveTab} onSelectRole={handleRoleChange} />;

      case 'login':
      case 'auth':
        return (
          <LoginPage 
            onLoginSuccess={(role, email, targetTab, profileDetails) => handleRoleChange(role, email, targetTab, profileDetails)} 
            onNavigate={setActiveTab} 
          />
        );

      case 'gov-dashboard':
        return (
          <GovDashboard 
            challenges={challenges} 
            pilots={pilots} 
            onNavigate={setActiveTab} 
            onSelectChallenge={setSelectedChallengeId} 
          />
        );

      case 'startup-dashboard':
        return (
          <GovDashboard 
            challenges={challenges} 
            pilots={pilots} 
            currentUser={currentUser}
            onNavigate={setActiveTab} 
            onSelectChallenge={setSelectedChallengeId} 
          />
        );

      case 'evaluator-dashboard':
        return <EvaluatorHome proposals={proposals} onNavigate={setActiveTab} />;

      case 'validator-dashboard':
        return <ValidatorHome pilots={pilots} evidenceList={evidenceList} onNavigate={setActiveTab} />;

      case 'admin-users':
        return <AdminDashboard activeTab={activeTab} startups={startups} challenges={challenges} pilots={pilots} currentUser={currentUser} onNavigate={setActiveTab} />;

      case 'ai-builder':
        return <AIChallengeBuilder onPublishChallenge={handlePublishChallenge} onNavigate={setActiveTab} />;

      case 'marketplace':
        return (
          <ChallengeMarketplace 
            challenges={challenges} 
            onSelectChallenge={setSelectedChallengeId} 
            onNavigate={setActiveTab} 
            currentUser={currentUser}
          />
        );

      case 'matching':
        return (
          <StartupMatching 
            challenges={challenges} 
            selectedChallengeId={selectedChallengeId} 
            onNavigate={setActiveTab} 
          />
        );

      case 'proposals':
        if (currentUser?.role === 'Government Officer') {
          return <GovernmentProposals proposals={proposals} challenges={challenges} />;
        }
        return (
          <ProposalSubmission 
            challenges={challenges} 
            selectedChallengeId={selectedChallengeId} 
            onNavigate={setActiveTab} 
          />
        );

      case 'proposal-submission':
        return (
          <ProposalSubmission 
            challenges={challenges} 
            selectedChallengeId={selectedChallengeId} 
            onNavigate={setActiveTab} 
          />
        );

      case 'evaluator-scoring':
        return <EvaluatorDashboard proposals={proposals} challenges={challenges} onNavigate={setActiveTab} />;

      case 'pilots':
        return <PilotManagement pilots={pilots} currentUser={currentUser} onNavigate={setActiveTab} />;

      case 'payments':
        return <PaymentsPage pilots={pilots} />;

      case 'kpi-analytics':
        return <KPIDashboard pilots={pilots} kpis={kpis} onNavigate={setActiveTab} />;

      case 'evidence-passport':
        return <EvidencePassport pilots={pilots} evidenceList={evidenceList} onNavigate={setActiveTab} />;

      case 'validator-signoff':
        return <ValidatorDashboard pilots={pilots} evidenceList={evidenceList} onNavigate={setActiveTab} />;

      case 'procurement-decisions':
        return <ProcurementDecisionPack pilots={pilots} onNavigate={setActiveTab} />;

      case 'scale-engine':
        return <ScaleEngine onNavigate={setActiveTab} />;

      case 'audit-trail':
        return <AuditTrail auditLogs={auditLogs} />;

      case 'startups':
        return <StartupProfile startups={startups} onNavigate={setActiveTab} />;

      case 'startup-profile':
      case 'profile':
        return <StartupProfile currentUser={currentUser} onNavigate={setActiveTab} />;

      default:
        return <GovDashboard challenges={challenges} pilots={pilots} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar 
        currentUser={currentUser} 
        onRoleChange={handleRoleChange} 
        onNavigate={setActiveTab} 
        activeTab={activeTab}
        onOpenDemoFlow={() => setShowDemoModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Layout Area */}
      <div className="flex flex-1">
        
        {/* Role-Specific Sidebar (Hidden on Landing Page & Login Page) */}
        {activeTab !== 'landing' && activeTab !== 'login' && activeTab !== 'auth' && (
          <Sidebar 
            activeRole={currentUser ? currentUser.role : 'Government Officer'} 
            activeTab={activeTab} 
            onSelectTab={setActiveTab} 
            collapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(previous => !previous)}
          />
        )}

        {/* Dynamic Page Content View */}
        <main className={`flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-x-hidden ${
          activeTab === 'landing' || activeTab === 'login' || activeTab === 'auth' ? 'max-w-7xl' : ''
        }`}>
          {renderContent()}
        </main>
      </div>

      {/* Hackathon Interactive Story Walkthrough Modal */}
      <DemoFlowModal 
        isOpen={showDemoModal} 
        onClose={() => setShowDemoModal(false)} 
        onExecuteStep={handleExecuteDemoStep}
      />
      <SupportChatbot />
      {!trackingConsent && (
        <CookieConsent onAccept={acceptTracking} onDecline={declineTracking} />
      )}

    </div>
  );
}

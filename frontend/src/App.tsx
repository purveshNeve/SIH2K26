import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { ProjectIntelligenceCopilot } from './components/assistant/ProjectIntelligenceCopilot';
import { projectService } from './services/projectService';
import type { Project, EarlyWarningAlert, SectorType } from './types';
import { Bot } from 'lucide-react';

export const App: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>([]);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [sectorFilter, setSectorFilter] = useState<SectorType | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      const [projList, alertList] = await Promise.all([
        projectService.getProjects(),
        projectService.getAlerts()
      ]);
      if (isMounted) {
        setProjects(projList);
        setAlerts(alertList);
        setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleOpenProjectModal = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  const handleOpenProjectById = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (proj) navigate(`/projects/${proj.id}`);
  };

  const context = {
    projects,
    alerts,
    sectorFilter,
    onSelectProject: handleOpenProjectModal,
    onSelectProjectById: handleOpenProjectById,
    onFilterSector: (sector: SectorType) => {
      setSectorFilter(sector);
      navigate('/explorer');
    }
  };

  

  return (
    <div className="app-shell">
      <div className="app-content">
        <Header alerts={alerts} onOpenCopilot={() => setIsCopilotOpen(true)} />

        <main className="app-main">
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--text-secondary)' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="pulse-dot pulse-dot-critical" style={{ width: '14px', height: '14px', marginBottom: '12px' }} />
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Initializing PRAGYA Telemetry Stream...</p>
              </div>
            </div>
          ) : (
            <Outlet context={context} />
          )}
        </main>

        {!isCopilotOpen && (
          <button
            onClick={() => setIsCopilotOpen(true)}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 90,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #0ea5c6 0%, #22d3ee 100%)',
              color: '#06111f',
              border: '1px solid rgba(255,255,255,0.25)',
              fontWeight: 800,
              fontSize: '0.85rem',
              boxShadow: '0 14px 32px rgba(14, 165, 198, 0.3)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 18px 36px rgba(14, 165, 198, 0.38)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 14px 32px rgba(14, 165, 198, 0.3)';
            }}
          >
            <Bot size={18} color="#06111f" />
            <span>PRAGYA Copilot</span>
          </button>
        )}

        <ProjectIntelligenceCopilot
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          onOpenProject={handleOpenProjectById}
        />

        <footer className="app-footer">
          <div className="app-footer-inner">
            <div>
              <strong>PRAGYA Decision Support Ecosystem</strong> • Infrastructure & Project Monitoring Division (IPMD)
              <div style={{ marginTop: '2px' }}>
                Ministry of Statistics and Programme Implementation (MoSPI), Government of India • National Repository of ₹150 Cr+ Infrastructure Projects
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span>Data Baseline: April 2026</span>
              <span>•</span>
              <span>API Gateway: FastAPI Ready (:8000)</span>
              <span>•</span>
              <span style={{ color: '#6ee7b7' }}>System Status: Operational</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default App;

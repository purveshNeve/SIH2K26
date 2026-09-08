import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Bell, 
  Layers, 
  BarChart3,
  BrainCircuit,
  Bot,
  LogOut
} from 'lucide-react';
import type { EarlyWarningAlert } from '../../types';
import { useAuth } from '../../context/authContext';

interface HeaderProps {
  alerts: EarlyWarningAlert[];
  onSearchSelect?: (projectId: string) => void;
  onOpenCopilot: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  alerts,
  onOpenCopilot
}) => {
  const navigate = useNavigate();
  const { userEmail, logout } = useAuth();
  const [time, setTime] = useState<string>('');
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' IST');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const criticalAlertsCount = alerts.filter(a => a.severity === 'CRITICAL').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'projects', label: 'Projects', icon: Layers, badge: criticalAlertsCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'model-intelligence', label: 'Model Intelligence', icon: BrainCircuit },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 90,
      background: 'rgba(248, 250, 252, 0.8)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div className="gov-ribbon" />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px 10px',
        borderBottom: '1px solid rgba(148, 163, 184, 0.18)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0b1e3b 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 18px rgba(14, 165, 198, 0.28)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#ffffff', letterSpacing: '-0.05em' }}>P</span>
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.12rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                PRAGYA
              </h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.62rem', padding: '2px 7px' }}>
                MoSPI • IPMD
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--accent-emerald)', background: 'rgba(22, 163, 106, 0.12)', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(22, 163, 106, 0.18)' }}>
                <span className="pulse-dot pulse-dot-emerald" />
                Live Telemetry (April 2026)
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '560px' }}>
              Project Assessment, Infrastructure Monitoring & Analytics for Nation-building
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255,255,255,0.56)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            border: '1px solid rgba(148,163,184,0.2)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>Projects: </span>
              <strong className="num-mono" style={{ color: 'var(--text-primary)' }}>1,981</strong>
            </div>
            <div style={{ width: '1px', height: '12px', background: 'var(--border-medium)' }} />
            <div>
              <span style={{ color: 'var(--text-tertiary)' }}>Value: </span>
              <strong className="num-mono" style={{ color: 'var(--accent-cyan)' }}>₹42.78L Cr</strong>
            </div>
            <div style={{ width: '1px', height: '12px', background: 'var(--border-medium)' }} />
            <div className="num-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
              {time}
            </div>
          </div>

          <button
            onClick={onOpenCopilot}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #0ea5c6 0%, #22d3ee 100%)',
              color: '#06111f',
              border: '1px solid rgba(255,255,255,0.3)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.8rem',
              boxShadow: '0 10px 22px rgba(14, 165, 198, 0.22)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 12px 26px rgba(14, 165, 198, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 22px rgba(14, 165, 198, 0.22)';
            }}
          >
            <Bot size={15} />
            <span>PRAGYA Copilot</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '6px', borderLeft: '1px solid rgba(148,163,184,0.2)' }}>
            <div title={userEmail || 'Signed-in user'} style={{ width: '34px', height: '34px', borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #0ea5c6, #67e8f9)', color: '#07101c', fontWeight: 800, fontSize: '0.85rem', boxShadow: '0 8px 18px rgba(14, 165, 198, 0.22)' }}>
              {(userEmail?.[0] || 'U').toUpperCase()}
            </div>
            <button
              onClick={() => { logout(); navigate('/login', { replace: true }); }}
              title="Logout"
              aria-label="Logout"
              style={{ width: '34px', height: '34px', display: 'grid', placeItems: 'center', borderRadius: '50%', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.65)', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <LogOut size={15} />
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAlertDropdown(!showAlertDropdown)}
              style={{
                position: 'relative',
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(148,163,184,0.2)',
                color: 'var(--text-primary)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
              title="Early Warning Alerts"
            >
              <Bell size={16} />
              {criticalAlertsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: 'var(--accent-rose)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
                }}>
                  {criticalAlertsCount}
                </span>
              )}
            </button>

            {showAlertDropdown && (
              <div className="glass-panel" style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '340px',
                padding: '14px',
                zIndex: 100,
                boxShadow: 'var(--shadow-lg)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Active Early Warnings ({alerts.length})</span>
                  <button 
                    onClick={() => { navigate('/alerts'); setShowAlertDropdown(false); }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    View All &rarr;
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                  {alerts.slice(0, 4).map(alert => (
                    <div 
                      key={alert.id}
                      onClick={() => { navigate('/alerts'); setShowAlertDropdown(false); }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: alert.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-tertiary)',
                        borderLeft: `3px solid ${alert.severity === 'CRITICAL' ? 'var(--accent-rose)' : 'var(--accent-amber)'}`,
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                        <span style={{ fontWeight: 700, color: alert.severity === 'CRITICAL' ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>{alert.severity}</span>
                        <span style={{ color: 'var(--text-tertiary)' }}>{alert.timestamp.split(' ')[0]}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '2px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {alert.projectName}
                      </p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {alert.headline}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        overflowX: 'auto',
        gap: '6px',
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(6px)'
      }}>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={`/${item.id}`}
              className={({ isActive }) => isActive ? 'nav-tab nav-tab-active' : 'nav-tab'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: '2.5px solid transparent',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                borderRadius: '12px 12px 0 0',
                transition: 'color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast)'
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span style={{
                  background: 'var(--accent-rose)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  marginLeft: '2px'
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
};

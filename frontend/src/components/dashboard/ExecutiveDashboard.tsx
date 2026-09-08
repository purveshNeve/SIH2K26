import React from 'react';
import { AlertTriangle, ArrowRight, Clock3, FolderKanban, IndianRupee, ShieldAlert, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { PortfolioHealth } from './PortfolioHealth';
import { StatCard } from '../common/StatCard';
import type { Project, SectorType } from '../../types';
import { MACRO_PORTFOLIO_STATS, SECTOR_BENCHMARKS } from '../../data/mockAnalytics';

interface ExecutiveDashboardProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNavigateToTab: (tabId: string) => void;
  onFilterSector: (sector: SectorType) => void;
}

const riskCopy: Record<Project['riskLevel'], string> = {
  LOW: 'Low risk',
  MODERATE: 'Moderate risk',
  HIGH: 'High risk',
  CRITICAL: 'Critical risk',
};

const sectorAliases: Array<{ label: string; sectors: SectorType[] }> = [
  { label: 'Railways', sectors: ['Railways'] },
  { label: 'Roads', sectors: ['Roads & Highways'] },
  { label: 'Metro', sectors: ['Urban Development & Metro'] },
  { label: 'Energy', sectors: ['Power', 'Coal'] },
  { label: 'Petroleum', sectors: ['Petroleum & Natural Gas'] },
  { label: 'Airports', sectors: ['Civil Aviation'] },
  { label: 'Others', sectors: ['Ports & Shipping', 'Water Resources', 'Atomic Energy', 'Telecommunications', 'Mines & Steel'] },
];

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  projects,
  onSelectProject,
  onNavigateToTab,
  onFilterSector,
}) => {
  const stats = MACRO_PORTFOLIO_STATS;
  const attentionProjects = [...projects]
    .sort((a, b) => b.riskBreakdown.compositeScore - a.riskBreakdown.compositeScore)
    .slice(0, 5);
  const highRiskCount = stats.projectsInRedAlert + stats.projectsInAmberAlert;

  return (
    <div className="executive-dashboard">
      <motion.section className="page-intro dashboard-intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div>
          <span className="eyebrow">Portfolio command centre · {stats.reportingCycle}</span>
          <h2>Know what needs attention before it becomes a crisis.</h2>
          <p>{stats.totalMonitoredProjects.toLocaleString('en-IN')} infrastructure projects are being monitored across {stats.totalMinistriesMonitored} ministries. Start with the signals that can change delivery outcomes.</p>
        </div>
        <button className="primary-action" onClick={() => onNavigateToTab('projects')}><span>Review priority projects</span><ArrowRight size={16} /></button>
      </motion.section>

      <motion.section className="dashboard-kpi-grid" aria-label="Portfolio summary" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}>
        {[<StatCard title="Total projects" value={stats.totalMonitoredProjects} subtitle={`${stats.totalMinistriesMonitored} ministries · ${stats.totalSectorsMonitored} sectors`} icon={FolderKanban} color="cyan" deltaText="Portfolio coverage 100%" deltaType="positive" />, <StatCard title="High-risk projects" value={highRiskCount} subtitle={`${stats.projectsInRedAlert} critical · ${stats.projectsInAmberAlert} watch`} icon={ShieldAlert} color="rose" deltaText="Needs active review" deltaType="negative" />, <StatCard title="Delayed projects" value={stats.projectsWithTimeOverrun} subtitle={`Average delay ${stats.avgTimeOverrunMonths} months`} icon={Clock3} color="amber" deltaText={`${stats.earlyWarningLeadTimeMonths} mo early warning`} deltaType="positive" />, <StatCard title="Expected cost increase" value={`Rs ${stats.anticipatedEscalationLakhCr}L Cr`} subtitle={`${stats.escalationPercentage}% above original approved cost`} icon={IndianRupee} color="blue" deltaText="Forecast exposure" deltaType="negative" />].map((card, index) => <motion.div key={index} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>{card}</motion.div>)}
      </motion.section>

      <section className="dashboard-health-grid">
        <PortfolioHealth />
        <div className="glass-panel dashboard-signal-card">
          <div className="section-heading"><div><span className="eyebrow">Decision signal</span><h3>What the portfolio is telling you</h3></div><TrendingUp size={20} color="var(--accent-cyan)" /></div>
          <p className="signal-copy">{stats.projectsWithTimeOverrun.toLocaleString('en-IN')} projects are behind schedule, while the model identifies an average of {stats.earlyWarningLeadTimeMonths} months to intervene before a warning becomes a materialized overrun.</p>
          <div className="signal-facts"><div><strong>{stats.projectsInRedAlert}</strong><span>critical projects</span></div><div><strong>{stats.preventedEscalationPotentialCr.toLocaleString('en-IN')}</strong><span>Cr potential protected</span></div></div>
          <button className="text-action" onClick={() => onNavigateToTab('model-intelligence')}>Understand the forecast <ArrowRight size={15} /></button>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading"><div><span className="eyebrow">Prioritised by risk</span><h3>Projects requiring attention</h3><p>Start with the projects where delay and cost exposure are highest.</p></div><button className="text-action" onClick={() => onNavigateToTab('projects')}>View all projects <ArrowRight size={15} /></button></div>
        <div className="attention-list">
          {attentionProjects.map((project) => (
            <button className="attention-row" key={project.id} onClick={() => onSelectProject(project)}>
              <div className={`attention-marker attention-${project.riskLevel.toLowerCase()}`} />
              <div className="attention-project"><strong>{project.name}</strong><span>{project.sector} · {project.state}</span></div>
              <span className={`badge badge-${project.riskLevel.toLowerCase()}`}>{riskCopy[project.riskLevel]}</span>
              <div className="attention-metric"><span>Expected delay</span><strong>{project.timeOverrunMonths} mo</strong></div>
              <div className="attention-metric"><span>Expected cost increase</span><strong>+{project.costOverrunPercent.toFixed(1)}%</strong></div>
              <ArrowRight className="attention-arrow" size={17} />
            </button>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading"><div><span className="eyebrow">Portfolio composition</span><h3>Sector snapshot</h3><p>Compare delivery health and jump directly into a sector.</p></div></div>
        <div className="sector-snapshot-grid">
          {sectorAliases.map((alias) => {
            const benchmarks = SECTOR_BENCHMARKS.filter((sector) => alias.sectors.includes(sector.sector));
            const projectsCount = benchmarks.reduce((sum, sector) => sum + sector.activeProjectsCount, 0);
            const riskCount = benchmarks.reduce((sum, sector) => sum + sector.highRiskProjectsCount, 0);
            const health = Math.max(0, Math.round(100 - benchmarks.reduce((sum, sector) => sum + sector.avgCostOverrunPercent + sector.avgScheduleDelayMonths / 3, 0) / Math.max(benchmarks.length, 1)));
            const targetSector = alias.sectors.find((sector) => SECTOR_BENCHMARKS.some((item) => item.sector === sector));
            return <button className="sector-snapshot-card" key={alias.label} onClick={() => targetSector && onFilterSector(targetSector)}><div><strong>{alias.label}</strong><span>{projectsCount.toLocaleString('en-IN')} projects</span></div><div className="sector-health"><strong>{health}</strong><span>health</span></div><small>{riskCount} high-risk · {benchmarks[0]?.avgScheduleDelayMonths || 0} mo avg delay</small></button>;
          })}
        </div>
      </section>

      <div className="dashboard-footnote"><AlertTriangle size={15} /><span>Forecasts are decision support, not a replacement for project-owner review. Latest baseline: {stats.reportingCycle}.</span></div>
    </div>
  );
};

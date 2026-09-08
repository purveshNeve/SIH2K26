import { BenchmarkAnalytics } from '../components/benchmarking/BenchmarkAnalytics';
import { RiskScoringFramework } from '../components/risk/RiskScoringFramework';
import { useOutletContext } from 'react-router-dom';
import { AlertTriangle, Clock3, IndianRupee, Layers3 } from 'lucide-react';
import type { PageContext } from './pageTypes';
import { SECTOR_BENCHMARKS } from '../data/mockAnalytics';
import { StatCard } from '../components/common/StatCard';

export default function Analytics() {
  const { projects, onSelectProject } = useOutletContext<PageContext>();
  const highestDelaySector = [...SECTOR_BENCHMARKS].sort((a, b) => b.avgScheduleDelayMonths - a.avgScheduleDelayMonths)[0];
  const highestOverrunSector = [...SECTOR_BENCHMARKS].sort((a, b) => b.avgCostOverrunPercent - a.avgCostOverrunPercent)[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section className="page-intro">
        <span className="eyebrow">Portfolio comparison</span>
        <h2>Analytics that explain where delivery is drifting</h2>
        <p>Compare sectors, ministries, agencies, and project risk in one decision view.</p>
      </section>
      <section className="analytics-overview-grid" aria-label="Analytics summary">
        <StatCard title="Sectors compared" value={SECTOR_BENCHMARKS.length} subtitle="Active portfolio benchmarks" icon={Layers3} color="cyan" deltaText="Cross-sector view" deltaType="neutral" />
        <StatCard title="Highest average delay" value={`${highestDelaySector.avgScheduleDelayMonths} mo`} subtitle={highestDelaySector.sector} icon={Clock3} color="amber" deltaText="Needs delivery review" deltaType="negative" />
        <StatCard title="Highest cost increase" value={`+${highestOverrunSector.avgCostOverrunPercent}%`} subtitle={highestOverrunSector.sector} icon={IndianRupee} color="rose" deltaText="Largest sector exposure" deltaType="negative" />
        <StatCard title="High-risk projects" value={SECTOR_BENCHMARKS.reduce((sum, sector) => sum + sector.highRiskProjectsCount, 0)} subtitle="Across benchmarked sectors" icon={AlertTriangle} color="blue" deltaText="Use the risk view below" deltaType="neutral" />
      </section>
      <section className="glass-panel analytics-insight-panel">
        <div className="section-heading"><div><span className="eyebrow">Where delivery is drifting</span><h3>Sector health comparison</h3><p>Longer bars indicate greater delivery pressure from cost increase and schedule delay.</p></div></div>
        <div className="sector-bars">
          {[...SECTOR_BENCHMARKS].sort((a, b) => (b.avgCostOverrunPercent + b.avgScheduleDelayMonths / 3) - (a.avgCostOverrunPercent + a.avgScheduleDelayMonths / 3)).map((sector) => {
            const pressure = Math.min(100, Math.round(sector.avgCostOverrunPercent + sector.avgScheduleDelayMonths / 3));
            return <div className="sector-bar-row" key={sector.sector}><div><strong>{sector.sector}</strong><span>{sector.highRiskProjectsCount} high-risk projects</span></div><div className="sector-bar-track"><i style={{ width: `${pressure}%` }} /></div><b>{pressure}%</b></div>;
          })}
        </div>
      </section>
      <BenchmarkAnalytics />
      <RiskScoringFramework projects={projects} onSelectProject={onSelectProject} />
    </div>
  );
}
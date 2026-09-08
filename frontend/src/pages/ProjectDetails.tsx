import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, CircleAlert, IndianRupee, ShieldCheck } from 'lucide-react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import type { PageContext } from './pageTypes';

const riskLabel: Record<string, string> = {
  LOW: 'Low risk',
  MODERATE: 'Moderate risk',
  HIGH: 'High risk',
  CRITICAL: 'Critical risk',
};

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { projects } = useOutletContext<PageContext>();
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return (
      <section className="state-panel">
        <CircleAlert size={24} />
        <h2>Project not found</h2>
        <p>This project is not available in the current portfolio view.</p>
        <Link className="button-link" to="/projects">Back to projects</Link>
      </section>
    );
  }

  return (
    <div className="project-details-page">
      <Link className="back-link" to="/projects"><ArrowLeft size={16} /> Back to projects</Link>
      <section className="project-hero glass-panel">
        <div>
          <span className="eyebrow">{project.sector} · {project.state}</span>
          <h2>{project.name}</h2>
          <p>{project.ministry} · {project.implementingAgency}</p>
          <p className="project-summary">{project.executiveSummary}</p>
        </div>
        <div className="project-health-score">
          <span>Project health</span>
          <strong>{100 - project.riskBreakdown.compositeScore}</strong>
          <span>/ 100</span>
          <b className={`badge badge-${project.riskLevel.toLowerCase()}`}>{riskLabel[project.riskLevel]}</b>
        </div>
      </section>

      <div className="detail-kpi-grid">
        <article className="glass-panel detail-kpi"><IndianRupee size={18} /><span>Expected final cost</span><strong>Rs {project.predictedFinalCostCr.toLocaleString('en-IN')} Cr</strong><small>+{project.costOverrunPercent.toFixed(1)}% over original</small></article>
        <article className="glass-panel detail-kpi"><CalendarDays size={18} /><span>Expected completion</span><strong>{project.predictedCompletionDate}</strong><small>{project.timeOverrunMonths} months behind original plan</small></article>
        <article className="glass-panel detail-kpi"><ShieldCheck size={18} /><span>Forecast confidence</span><strong>{project.aiConfidenceScore}%</strong><small>Based on latest project update</small></article>
        <article className="glass-panel detail-kpi"><CheckCircle2 size={18} /><span>Physical progress</span><strong>{project.physicalProgressPercent}%</strong><small>{project.cufData.milestonesAchievedCount} of {project.cufData.totalMilestonesCount} milestones complete</small></article>
      </div>

      <section className="detail-section glass-panel">
        <div className="section-heading"><div><span className="eyebrow">What needs attention</span><h3>Main reasons behind this forecast</h3></div></div>
        <div className="reason-grid">
          {project.bottlenecks.map((bottleneck) => (
            <article className="reason-card" key={bottleneck.id}>
              <span className={`badge badge-${bottleneck.severity.toLowerCase()}`}>{bottleneck.severity}</span>
              <h4>{bottleneck.category}</h4>
              <p>{bottleneck.description}</p>
              <strong>Potential impact: {bottleneck.delayImpactMonths} months · Rs {bottleneck.costImpactCr.toLocaleString('en-IN')} Cr</strong>
            </article>
          ))}
        </div>
      </section>

      <div className="detail-two-column">
        <section className="detail-section glass-panel">
          <div className="section-heading"><div><span className="eyebrow">Cost outlook</span><h3>Approved to expected final cost</h3></div></div>
          <div className="cost-compare">
            <div><span>Original approved</span><strong>Rs {project.originalCostCr.toLocaleString('en-IN')} Cr</strong><i style={{ width: '60%' }} /></div>
            <div><span>Current revised</span><strong>Rs {project.revisedCostCr.toLocaleString('en-IN')} Cr</strong><i style={{ width: `${Math.min(100, (project.revisedCostCr / project.predictedFinalCostCr) * 100)}%` }} /></div>
            <div><span>Expected final cost</span><strong>Rs {project.predictedFinalCostCr.toLocaleString('en-IN')} Cr</strong><i className="cost-expected" style={{ width: '100%' }} /></div>
          </div>
          <div className="detail-callout"><IndianRupee size={16} /><span>The current forecast indicates <strong>Rs {project.costOverrunCr.toLocaleString('en-IN')} Cr</strong> of expected increase above the original approval.</span></div>
        </section>

        <section className="detail-section glass-panel">
          <div className="section-heading"><div><span className="eyebrow">Schedule outlook</span><h3>Planned versus expected completion</h3></div></div>
          <div className="schedule-compare"><div><span>Original plan</span><strong>{project.originalCompletionDate}</strong></div><ArrowRight size={17} /><div><span>Revised plan</span><strong>{project.revisedCompletionDate}</strong></div><ArrowRight size={17} /><div className="schedule-alert"><span>Expected completion</span><strong>{project.predictedCompletionDate}</strong></div></div>
          <div className="detail-callout warning"><CalendarDays size={16} /><span>The project is currently expected to finish <strong>{project.timeOverrunMonths} months</strong> behind its original plan.</span></div>
        </section>
      </div>

      <section className="detail-section glass-panel">
        <div className="section-heading"><div><span className="eyebrow">Recommended next steps</span><h3>Actions that can reduce delivery risk</h3></div></div>
        <div className="recommendation-list">
          {project.bottlenecks.slice(0, 3).map((bottleneck, index) => (
            <div className="recommendation-row" key={bottleneck.id}><span>{index + 1}</span><div><strong>{bottleneck.agencyActionRequired}</strong><small>Owner: {project.implementingAgency} · Linked to {bottleneck.category.toLowerCase()}</small></div><button className="text-action">Review <ArrowRight size={14} /></button></div>
          ))}
        </div>
      </section>

      <section className="detail-section glass-panel">
        <div className="section-heading"><div><span className="eyebrow">Critical path</span><h3>Milestone timeline</h3></div></div>
        <div className="milestone-list">
          {project.milestones.map((milestone) => (
            <div className="milestone-row" key={milestone.id}>
              <span className={`milestone-dot milestone-${milestone.status.toLowerCase()}`} />
              <div><strong>{milestone.name}</strong><small>Target {milestone.revisedDate} · {milestone.status.replace('_', ' ').toLowerCase()}</small></div>
              <b>{milestone.slippageMonths ? `+${milestone.slippageMonths} mo` : 'On track'}</b>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
import { useOutletContext } from 'react-router-dom';
import { BrainCircuit, CheckCircle2, Database, Gauge, ShieldCheck } from 'lucide-react';
import { CostOverrunModel } from '../components/predictions/CostOverrunModel';
import { CUFDriverAnalysis } from '../components/cuf/CUFDriverAnalysis';
import { AI_VS_STATISTICAL_METRICS } from '../data/mockAnalytics';
import { SHAP_FEATURE_ATTRIBUTION } from '../data/mockAnalytics';
import type { PageContext } from './pageTypes';

export default function ModelIntelligence() {
  const { projects, onSelectProject } = useOutletContext<PageContext>();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section className="page-intro">
        <span className="eyebrow">Transparent forecasting</span>
        <h2>Understand how PAIMANA reaches a forecast</h2>
        <p>Review model performance, forecast comparisons, and the main reasons behind project risk.</p>
      </section>
      <section className="model-overview-grid" aria-label="Model overview">
        <article className="glass-panel model-overview-card model-overview-wide"><div className="model-icon"><BrainCircuit size={19} /></div><div><span>Current forecasting model</span><strong>PAIMANA Ensemble v2.1</strong><small>Last trained April 2026 · 1,981 monitored projects</small></div><b className="badge badge-low"><CheckCircle2 size={13} /> Certified</b></article>
        <article className="glass-panel model-overview-card"><Gauge size={19} color="var(--accent-cyan)" /><span>Forecast accuracy</span><strong>88.4%</strong><small>R-squared on held-out data</small></article>
        <article className="glass-panel model-overview-card"><Database size={19} color="var(--accent-indigo)" /><span>Average error</span><strong>11.2%</strong><small>Mean absolute percentage error</small></article>
        <article className="glass-panel model-overview-card"><ShieldCheck size={19} color="var(--accent-emerald)" /><span>Early warning lead</span><strong>8.4 mo</strong><small>Average time to intervene</small></article>
      </section>
      <section className="glass-panel validation-strip">
        <div><span className="eyebrow">Model assurance</span><h3>What the validation results mean</h3><p>PAIMANA catches more complex delivery risks earlier than the previous forecasting approach.</p></div>
        <div className="validation-metrics">{AI_VS_STATISTICAL_METRICS.slice(0, 3).map((metric) => <div key={metric.metricName}><span>{metric.metricName.replace(/\(.*/, '').trim()}</span><strong>{String(metric.aiMachineLearning)}</strong><small>{metric.improvementGain}</small></div>)}</div>
      </section>
      <div className="model-evidence-grid">
        <section className="glass-panel model-evidence-card"><div className="section-heading"><div><span className="eyebrow">Explainability</span><h3>Main reasons behind forecasts</h3></div></div><div className="feature-bars">{SHAP_FEATURE_ATTRIBUTION.slice(0, 5).map((feature) => <div className="feature-bar-row" key={feature.featureName}><div><strong>{feature.featureName}</strong><span>{feature.description}</span></div><div className="feature-track"><i style={{ width: `${Math.round(feature.importanceScore * 400)}%` }} /></div><b>{Math.round(feature.importanceScore * 100)}%</b></div>)}</div></section>
        <section className="glass-panel model-evidence-card certification-card"><div className="section-heading"><div><span className="eyebrow">Model certification</span><h3>Ready for decision support</h3></div><ShieldCheck size={22} color="var(--accent-emerald)" /></div><div className="certification-list"><p><CheckCircle2 size={16} /> Cross-validation passed</p><p><CheckCircle2 size={16} /> Data leakage checks completed</p><p><CheckCircle2 size={16} /> Generalization gap acceptable</p><p><CheckCircle2 size={16} /> Global fallback available</p></div><div className="detail-callout"><Database size={15} /><span>Sector-specific models are used when enough history exists; otherwise the global model provides the forecast.</span></div></section>
      </div>
      <CostOverrunModel projects={projects} onSelectProject={onSelectProject} />
      <CUFDriverAnalysis />
    </div>
  );
}
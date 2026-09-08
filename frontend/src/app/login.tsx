import { Activity, LockKeyhole } from 'lucide-react';
import { useEffect } from 'react';

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  useEffect(() => {
    document.body.className = 'theme-light';
    return () => {
      document.body.className = 'theme-light';
    };
  }, []);

  return (
    <main className="login-page">
      <div className="login-page-grid" />
      <div className="login-shell">
        <section className="login-hero" aria-label="PRAGYA overview">
          <header className="login-brand">
            <div className="login-brand-mark"><Activity size={21} /></div>
            <div>
              <strong>PRAGYA</strong>
              <small>Infrastructure Monitoring & Analytics</small>
            </div>
          </header>

          <div className="login-hero-copy">
            <h2>
              Predict.
              <span className="accent">Prevent.</span>
              Prioritize.
            </h2>
            <p>
              AI-powered infrastructure intelligence and early-warning decision support for central-sector project monitoring across India.
            </p>
          </div>

          <div className="login-metrics" aria-label="PRAGYA platform metrics">
            <div className="login-metric">
              <strong>1,981</strong>
              <span>Active Projects</span>
            </div>
            <div className="login-metric">
              <strong>₹42.78L</strong>
              <span>Portfolio Value</span>
            </div>
            <div className="login-metric">
              <strong>8.4 Mo</strong>
              <span>Warning Lead</span>
            </div>
          </div>
        </section>

        <LoginForm />
        <p className="login-legal"><LockKeyhole size={13} /> Government of India monitoring network</p>
      </div>
    </main>
  )
}

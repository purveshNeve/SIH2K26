import React, { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'blue' | 'indigo';
  deltaText?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  tooltip?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'cyan',
  deltaText,
  deltaType = 'neutral',
  tooltip
}) => {
  const colorMap = {
    cyan: { text: 'var(--accent-cyan)', bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.25)' },
    emerald: { text: 'var(--accent-emerald)', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)' },
    amber: { text: 'var(--accent-amber)', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)' },
    rose: { text: 'var(--accent-rose)', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.25)' },
    blue: { text: 'var(--accent-blue)', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.25)' },
    indigo: { text: 'var(--accent-indigo)', bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.25)' }
  };

  const themeColors = colorMap[color];
  const [displayValue, setDisplayValue] = useState<string>(String(value));

  useEffect(() => {
    if (typeof value !== 'number') return;

    let frameId = 0;
    const start = 0;
    const end = value;
    const duration = 900;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(start + (end - start) * eased);
      setDisplayValue(nextValue.toLocaleString('en-IN'));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return (
    <div 
      className="glass-panel glass-panel-interactive" 
      style={{
        padding: '18px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}
      title={tooltip}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {title}
        </span>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: themeColors.bg,
          border: `1px solid ${themeColors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: themeColors.text,
          boxShadow: '0 8px 18px rgba(15, 23, 42, 0.05)'
        }}>
          <Icon size={18} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
        <div className="num-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
          {typeof value === 'number' ? displayValue : String(value)}
        </div>
        <div style={{ width: '48px', height: '24px', borderRadius: '8px', background: 'linear-gradient(180deg, rgba(255,255,255,0.8), rgba(148,163,184,0.05))', border: '1px solid rgba(148,163,184,0.16)', display: 'flex', alignItems: 'end', justifyContent: 'space-between', padding: '4px 5px' }}>
          {[25, 38, 30, 50, 58, 45].map((bar, index) => (
            <span key={index} style={{ width: '4px', height: `${bar}%`, borderRadius: '3px 3px 0 0', background: index % 2 === 0 ? themeColors.text : 'rgba(148,163,184,0.7)' }} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        {subtitle && (
          <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
            {subtitle}
          </span>
        )}

        {deltaText && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 7px',
            borderRadius: 'var(--radius-full)',
            background: deltaType === 'positive' 
              ? 'rgba(16, 185, 129, 0.12)' 
              : deltaType === 'negative' 
                ? 'rgba(239, 68, 68, 0.12)' 
                : 'rgba(148, 163, 184, 0.12)',
            color: deltaType === 'positive' 
              ? 'var(--accent-emerald)' 
              : deltaType === 'negative' 
                ? 'var(--accent-rose)' 
                : 'var(--text-secondary)'
          }}>
            {deltaType === 'positive' && <TrendingUp size={12} />}
            {deltaType === 'negative' && <TrendingDown size={12} />}
            {deltaText}
          </span>
        )}
      </div>
    </div>
  );
};

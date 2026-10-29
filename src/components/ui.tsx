import { INDICATORS } from '../scoring/indicators';
import type { Contribution } from '../scoring/score';

export const SCORE_CLASSES = [
  { min: 80, label: '80–100', colour: '#7A3A12' },
  { min: 65, label: '65–80', colour: '#B5652B' },
  { min: 50, label: '50–65', colour: '#D98B4A' },
  { min: 35, label: '35–50', colour: '#EBBC8C' },
  { min: 0, label: '0–35', colour: '#D8D2C4' },
];

export const scoreColour = (score: number) => SCORE_CLASSES.find((c) => score >= c.min)!.colour;

export const fmt = (n: number, digits = 1) => n.toFixed(digits);

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="logo-cu" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9995C" />
          <stop offset="1" stopColor="#A2501F" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#13201C" />
      <path d="M32 56C32 56 14 39.5 14 26.5a18 18 0 1 1 36 0C50 39.5 32 56 32 56Z" fill="url(#logo-cu)" />
      <g fill="none" stroke="#13201C" strokeLinecap="round" strokeWidth="2.2">
        <ellipse cx="33" cy="26" rx="11.5" ry="10.5" opacity=".55" />
        <ellipse cx="34.2" cy="24.8" rx="6.8" ry="6.2" opacity=".8" />
      </g>
      <circle cx="35" cy="24" r="2.6" fill="#13201C" />
    </svg>
  );
}

/** Horizontal stacked bar showing how many points each indicator adds. */
export function ContributionBar({ contributions, height = 8 }: { contributions: Contribution[]; height?: number }) {
  return (
    <div className="stack" style={{ height }} role="img" aria-label={contributions.map((c) => `${INDICATORS[c.key].label} ${fmt(c.points)} points`).join(', ')}>
      {contributions.map((c) =>
        c.points > 0 ? (
          <span key={c.key} style={{ width: `${c.points}%`, background: INDICATORS[c.key].colour }} title={`${INDICATORS[c.key].label}: ${fmt(c.points)} pts`} />
        ) : null,
      )}
    </div>
  );
}

export function RankDelta({ delta }: { delta: number }) {
  if (delta === 0) return <span className="delta same" title="Same rank as default weights">–</span>;
  const up = delta > 0;
  return (
    <span className={`delta ${up ? 'up' : 'down'}`} title={`${up ? 'Up' : 'Down'} ${Math.abs(delta)} vs default weights`}>
      {up ? '▲' : '▼'}
      {Math.abs(delta)}
    </span>
  );
}

export function DemoBadge() {
  return <span className="demo-badge" title="All targets, layers and values are synthetic demonstration data">Demonstration data</span>;
}

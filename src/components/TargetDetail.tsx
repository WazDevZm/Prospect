import type { Target } from '../data/targets';
import { INDICATORS } from '../scoring/indicators';
import type { MissingPolicy, Ranked } from '../scoring/score';
import { ContributionBar, DemoBadge, fmt, RankDelta, scoreColour } from './ui';

interface Props {
  entry: Ranked<Target>;
  total: number;
  baselineRank: number;
  policy: MissingPolicy;
  onClose: () => void;
}

export function TargetDetail({ entry, total, baselineRank, policy, onClose }: Props) {
  const { item, result, rank } = entry;
  const sorted = [...result.contributions].sort((a, b) => b.points - a.points);
  const strongest = sorted.find((c) => c.points > 0);
  const missing = result.contributions.filter((c) => c.value == null);

  return (
    <article className="detail" aria-label={`Details for ${item.name}`}>
      <button className="link back" onClick={onClose}>
        ← All targets
      </button>
      <header className="detail-head">
        <div>
          <div className="detail-id">
            {item.id} · {item.district}, {item.province} <DemoBadge />
          </div>
          <h2>{item.name}</h2>
        </div>
        <div className="big-score" style={{ background: scoreColour(result.score) }}>
          <span>{fmt(result.score)}</span>
          <small>/ 100</small>
        </div>
      </header>

      <p className="rank-line">
        Ranked <strong>#{rank}</strong> of {total} <RankDelta delta={baselineRank - rank} />
        {strongest && (
          <>
            {' '}
            · strongest driver: <strong>{INDICATORS[strongest.key].label.toLowerCase()}</strong>
          </>
        )}
      </p>

      <ContributionBar contributions={result.contributions} height={14} />

      <h3>Score breakdown</h3>
      <table className="breakdown">
        <thead>
          <tr>
            <th>Indicator</th>
            <th className="num">Score</th>
            <th className="num">Weight</th>
            <th className="num">Points</th>
          </tr>
        </thead>
        <tbody>
          {result.contributions.map((c) => (
            <tr key={c.key} className={c.value == null ? 'missing' : ''}>
              <td>
                <span className="dot" style={{ background: INDICATORS[c.key].colour }} />
                <strong>{INDICATORS[c.key].label}</strong>
                <div className="raw">{INDICATORS[c.key].describeRaw(item.evidence)}</div>
              </td>
              <td className="num">{c.value == null ? '—' : fmt(c.value)}</td>
              <td className="num">
                {fmt(c.appliedWeight * 100, 0)}%
                {Math.abs(c.appliedWeight - c.nominalWeight) > 1e-9 && <div className="raw">set {fmt(c.nominalWeight * 100, 0)}%</div>}
              </td>
              <td className="num">{fmt(c.points)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>Priority score = Σ score × weight</td>
            <td className="num">
              <strong>{fmt(result.score)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="formula" aria-label="Calculation">
        {result.contributions
          .filter((c) => c.appliedWeight > 0)
          .map((c) => `${c.value == null ? 0 : fmt(c.value)} × ${fmt(c.appliedWeight, 3)}`)
          .join(' + ')}{' '}
        = <strong>{fmt(result.score)}</strong>
      </div>

      {missing.length > 0 && (
        <div className="callout warn">
          <strong>Data gap:</strong> no data for {missing.map((c) => INDICATORS[c.key].label.toLowerCase()).join(', ')}.{' '}
          {policy === 'renormalise'
            ? 'Its weight was redistributed across the available indicators, so this score rests on less evidence than a complete target.'
            : 'It was scored as zero, which lowers this target relative to fully-surveyed areas.'}
        </div>
      )}

      <h3>Target facts</h3>
      <dl className="facts">
        <dt>Centroid (WGS 84)</dt>
        <dd>
          {item.centre[0].toFixed(3)}°, {item.centre[1].toFixed(3)}°
        </dd>
        <dt>Approx. area</dt>
        <dd>{item.areaKm2} km²</dd>
        <dt>Soil samples</dt>
        <dd>{item.soilSamples || 'None'}</dd>
        <dt>Notes</dt>
        <dd>{item.notes}</dd>
      </dl>

      <div className="callout">
        A priority score is a ranking under the selected indicators and weights. It is <strong>not</strong> a probability of finding copper and does not
        confirm a deposit. Geological review and field verification are required.
      </div>
    </article>
  );
}

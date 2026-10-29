import type { Target } from '../data/targets';
import { INDICATOR_KEYS } from '../scoring/indicators';
import type { Ranked } from '../scoring/score';
import { ContributionBar, fmt, RankDelta, scoreColour } from './ui';

interface Props {
  ranked: Ranked<Target>[];
  baselineRank: Map<string, number>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onExport: () => void;
}

export function RankingList({ ranked, baselineRank, selectedId, onSelect, onExport }: Props) {
  return (
    <div className="ranking">
      <div className="section-head">
        <h2>Ranked targets</h2>
        <button className="link" onClick={onExport} disabled={!ranked.length}>
          Export CSV
        </button>
      </div>
      {ranked.length === 0 && <p className="empty">No targets match the current filters.</p>}
      <ol className="rank-list">
        {ranked.map(({ item, result, rank }) => (
          <li key={item.id}>
            <button className={`rank-item ${item.id === selectedId ? 'selected' : ''}`} onClick={() => onSelect(item.id)} aria-pressed={item.id === selectedId}>
              <span className="rank-num">{rank}</span>
              <span className="rank-body">
                <span className="rank-title">
                  {item.name}
                  <RankDelta delta={(baselineRank.get(item.id) ?? rank) - rank} />
                </span>
                <span className="rank-meta">
                  {item.id} · {item.district}
                  {result.available < INDICATOR_KEYS.length && (
                    <span className="gap" title="Some indicators have no data for this target">
                      {result.available}/{INDICATOR_KEYS.length} indicators
                    </span>
                  )}
                </span>
                <ContributionBar contributions={result.contributions} />
              </span>
              <span className="rank-score" style={{ borderColor: scoreColour(result.score) }}>
                {fmt(result.score)}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

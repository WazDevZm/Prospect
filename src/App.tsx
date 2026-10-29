import { useMemo, useState } from 'react';
import { Controls, DEFAULT_FILTERS, type Filters } from './components/Controls';
import { MapView, type LayerState } from './components/MapView';
import { Methodology } from './components/Methodology';
import { RankingList } from './components/RankingList';
import { TargetDetail } from './components/TargetDetail';
import { DemoBadge, Logo } from './components/ui';
import { TARGETS, type Target } from './data/targets';
import { INDICATOR_KEYS, INDICATORS } from './scoring/indicators';
import { DEFAULT_POLICY, DEFAULT_WEIGHTS, rank, type MissingPolicy, type Ranked, type Weights } from './scoring/score';

type View = 'explore' | 'method';

function toCsv(rows: Ranked<Target>[]): string {
  const head = ['rank', 'id', 'name', 'province', 'district', 'lat', 'lng', 'priority_score', 'indicators_available', ...INDICATOR_KEYS.flatMap((k) => [`${k}_score`, `${k}_points`])];
  const lines = rows.map(({ item, result, rank }) =>
    [
      rank,
      item.id,
      `"${item.name}"`,
      item.province,
      item.district,
      item.centre[0],
      item.centre[1],
      result.score.toFixed(2),
      result.available,
      ...result.contributions.flatMap((c) => [c.value == null ? '' : c.value.toFixed(2), c.points.toFixed(2)]),
    ].join(','),
  );
  return ['# Prospect export - DEMONSTRATION DATA, not for exploration decisions', head.join(','), ...lines].join('\n');
}

export default function App() {
  const [view, setView] = useState<View>('explore');
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [policy, setPolicy] = useState<MissingPolicy>(DEFAULT_POLICY);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [layers, setLayers] = useState<LayerState>({ faults: true, occurrences: true, footprints: true });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const baselineRank = useMemo(() => new Map(rank(TARGETS, DEFAULT_WEIGHTS, DEFAULT_POLICY).map((r) => [r.item.id, r.rank])), []);
  const ranked = useMemo(() => rank(TARGETS, weights, policy), [weights, policy]);

  const visible = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return ranked.filter(({ item, result }) => {
        if (filters.province !== 'all' && item.province !== filters.province) return false;
        if (result.score < filters.minScore) return false;
        if (filters.completeOnly && result.available < INDICATOR_KEYS.length) return false;
        if (q && ![item.name, item.id, item.district].some((s) => s.toLowerCase().includes(q))) return false;
        return true;
    });
  }, [ranked, filters]);

  const selected = visible.find((r) => r.item.id === selectedId);

  const exportCsv = () => {
    const blob = new Blob([toCsv(visible)], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'prospect-ranking-demo.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <Logo />
          <div>
            <div className="brand-name">PROSPECT</div>
            <div className="brand-tag">Turning geological data into exploration priorities</div>
          </div>
        </div>
        <nav className="tabs" aria-label="Main">
          <button className={view === 'explore' ? 'active' : ''} onClick={() => setView('explore')}>
            Explore &amp; rank
          </button>
          <button className={view === 'method' ? 'active' : ''} onClick={() => setView('method')}>
            Methodology &amp; data
          </button>
        </nav>
        <DemoBadge />
      </header>

      {view === 'explore' ? (
        <main className="explore">
          <Controls
            weights={weights}
            setWeights={setWeights}
            policy={policy}
            setPolicy={setPolicy}
            filters={filters}
            setFilters={setFilters}
            layers={layers}
            setLayers={setLayers}
            shown={visible.length}
            total={TARGETS.length}
          />
          <MapView ranked={visible} selectedId={selected ? selectedId : null} onSelect={setSelectedId} layers={layers} />
          <aside className="panel side">
            {selected ? (
              <TargetDetail entry={selected} total={TARGETS.length} baselineRank={baselineRank.get(selected.item.id)!} policy={policy} onClose={() => setSelectedId(null)} />
            ) : (
              <>
                <RankingList ranked={visible} baselineRank={baselineRank} selectedId={selectedId} onSelect={setSelectedId} onExport={exportCsv} />
                <div className="key">
                  {INDICATOR_KEYS.map((k) => (
                    <span key={k}>
                      <span className="dot" style={{ background: INDICATORS[k].colour }} />
                      {INDICATORS[k].label}
                    </span>
                  ))}
                </div>
              </>
            )}
          </aside>
        </main>
      ) : (
        <Methodology weights={weights} policy={policy} />
      )}

      <footer className="footer">
        Prospect MVP · decision-support only — scores are rankings, not probabilities of discovery · all data shown is synthetic
      </footer>
    </div>
  );
}

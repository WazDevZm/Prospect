import { INDICATOR_KEYS, INDICATORS } from '../scoring/indicators';
import { DEFAULT_WEIGHTS, toFractions, type MissingPolicy, type Weights } from '../scoring/score';
import type { LayerState } from './MapView';

export interface Filters {
  search: string;
  province: 'all' | 'Copperbelt' | 'North-Western';
  minScore: number;
  completeOnly: boolean;
}

export const DEFAULT_FILTERS: Filters = { search: '', province: 'all', minScore: 0, completeOnly: false };

interface Props {
  weights: Weights;
  setWeights: (w: Weights) => void;
  policy: MissingPolicy;
  setPolicy: (p: MissingPolicy) => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  layers: LayerState;
  setLayers: (l: LayerState) => void;
  shown: number;
  total: number;
}

export function Controls(p: Props) {
  const fractions = toFractions(p.weights);
  const isDefault = INDICATOR_KEYS.every((k) => p.weights[k] === DEFAULT_WEIGHTS[k]);

  return (
    <aside className="panel controls" aria-label="Scoring and filter controls">
      <section>
        <div className="section-head">
          <h2>Scoring weights</h2>
          <button className="link" onClick={() => p.setWeights(DEFAULT_WEIGHTS)} disabled={isDefault}>
            Reset
          </button>
        </div>
        <p className="hint">Drag to change how much each indicator counts. Weights are rescaled to total 100%.</p>
        {INDICATOR_KEYS.map((k) => (
          <label key={k} className="weight">
            <span className="weight-label">
              <span className="dot" style={{ background: INDICATORS[k].colour }} />
              {INDICATORS[k].label}
              <span className="weight-val">{Math.round(fractions[k] * 100)}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={p.weights[k]}
              onChange={(e) => p.setWeights({ ...p.weights, [k]: Number(e.target.value) })}
              aria-label={`${INDICATORS[k].label} weight`}
              style={{ accentColor: INDICATORS[k].colour }}
            />
          </label>
        ))}

        <fieldset className="policy">
          <legend>Missing data</legend>
          <label>
            <input type="radio" name="policy" checked={p.policy === 'renormalise'} onChange={() => p.setPolicy('renormalise')} />
            Exclude &amp; rescale weights
          </label>
          <label>
            <input type="radio" name="policy" checked={p.policy === 'zero'} onChange={() => p.setPolicy('zero')} />
            Score as zero (penalise gaps)
          </label>
        </fieldset>
      </section>

      <section>
        <div className="section-head">
          <h2>Filters</h2>
          <span className="count">
            {p.shown} / {p.total}
          </span>
        </div>
        <input
          className="search"
          type="search"
          placeholder="Search name, ID or district…"
          value={p.filters.search}
          onChange={(e) => p.setFilters({ ...p.filters, search: e.target.value })}
        />
        <label className="field">
          Province
          <select value={p.filters.province} onChange={(e) => p.setFilters({ ...p.filters, province: e.target.value as Filters['province'] })}>
            <option value="all">All provinces</option>
            <option value="Copperbelt">Copperbelt</option>
            <option value="North-Western">North-Western</option>
          </select>
        </label>
        <label className="field">
          Minimum priority score: <strong>{p.filters.minScore}</strong>
          <input type="range" min={0} max={90} step={5} value={p.filters.minScore} onChange={(e) => p.setFilters({ ...p.filters, minScore: Number(e.target.value) })} />
        </label>
        <label className="check">
          <input type="checkbox" checked={p.filters.completeOnly} onChange={(e) => p.setFilters({ ...p.filters, completeOnly: e.target.checked })} />
          Only targets with all 4 indicators
        </label>
      </section>

      <section>
        <h2>Map layers</h2>
        <label className="check">
          <input type="checkbox" checked={p.layers.faults} onChange={(e) => p.setLayers({ ...p.layers, faults: e.target.checked })} />
          Faults (demo)
        </label>
        <label className="check">
          <input type="checkbox" checked={p.layers.occurrences} onChange={(e) => p.setLayers({ ...p.layers, occurrences: e.target.checked })} />
          Recorded occurrences (demo)
        </label>
        <label className="check">
          <input type="checkbox" checked={p.layers.footprints} onChange={(e) => p.setLayers({ ...p.layers, footprints: e.target.checked })} />
          Target footprints
        </label>
      </section>
    </aside>
  );
}

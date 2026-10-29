import { DEMO_FAULTS, DEMO_OCCURRENCES, DEMO_TARGETS } from '../data/demo';
import { INDICATOR_KEYS, INDICATORS, LITHOLOGY } from '../scoring/indicators';
import { DEFAULT_WEIGHTS, toFractions, type MissingPolicy, type Weights } from '../scoring/score';

const STAGES = [
  ['Explore', 'View the study area and inspect the available geological and geospatial layers.'],
  ['Identify', 'Inspect candidate target areas individually on the map or in the list.'],
  ['Compare', 'Rank targets with a documented, weighted scoring method.'],
  ['Understand', 'Open a target to see its score, contributing indicators and data gaps.'],
  ['Investigate', 'Use the results to decide where closer assessment or field checks may be warranted.'],
];

const LIMITATIONS = [
  ['Data quality', 'Incomplete or unreliable inputs can produce misleading rankings.'],
  ['Scoring assumptions', 'Indicator choice, thresholds and weights all influence results — try changing them.'],
  ['Occurrence-data bias', 'Recorded occurrences cluster where people have already looked; proximity rewards known ground.'],
  ['False confidence', 'A number like 72.4 looks more precise than the evidence behind it justifies.'],
  ['Geological validation', 'Expert interpretation and field verification remain essential.'],
];

export function Methodology({ weights, policy }: { weights: Weights; policy: MissingPolicy }) {
  const current = toFractions(weights);
  const defaults = toFractions(DEFAULT_WEIGHTS);

  return (
    <main className="method">
      <section className="method-hero">
        <h1>Methodology, data &amp; limitations</h1>
        <p>
          Prospect ranks candidate copper exploration areas with a transparent weighted-sum score. Everything that affects a ranking — the indicators,
          the rules that put them on a common scale, the weights and the treatment of missing data — is documented on this page and in the source
          code.
        </p>
        <div className="callout warn">
          <strong>Demonstration data.</strong> All {DEMO_TARGETS.length} targets, {DEMO_FAULTS.length} fault traces and {DEMO_OCCURRENCES.length}{' '}
          occurrence points are synthetic. Names are fictional. No validated prediction accuracy or discovery claim is made.
        </div>
      </section>

      <section>
        <h2>Workflow</h2>
        <ol className="stages">
          {STAGES.map(([t, d], i) => (
            <li key={t}>
              <span className="stage-num">{i + 1}</span>
              <strong>{t}</strong>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>The priority score</h2>
        <div className="formula big">
          Priority = Σ<sub>i</sub> w<sub>i</sub> · s<sub>i</sub> &nbsp;&nbsp; where s<sub>i</sub> ∈ [0, 100] and Σ w<sub>i</sub> = 1
        </div>
        <p>
          Each indicator <em>i</em> is converted to a score s<sub>i</sub> between 0 and 100, multiplied by its weight w<sub>i</sub>, and the
          contributions are added. <strong>Worked example:</strong> an indicator scoring 80 with a 30% weight contributes 80 × 0.30 = 24 points.
        </p>
        <p>
          A higher score means a higher ranking under these indicators and assumptions. It is <strong>not</strong> the probability of finding copper
          and does not confirm a deposit.
        </p>
      </section>

      <section>
        <h2>Indicators &amp; normalisation</h2>
        <div className="table-scroll">
          <table className="method-table">
            <thead>
              <tr>
                <th>Indicator</th>
                <th>Question</th>
                <th>Rule</th>
                <th className="num">Default</th>
                <th className="num">Current</th>
              </tr>
            </thead>
            <tbody>
              {INDICATOR_KEYS.map((k) => (
                <tr key={k}>
                  <td>
                    <span className="dot" style={{ background: INDICATORS[k].colour }} />
                    <strong>{INDICATORS[k].label}</strong>
                  </td>
                  <td>{INDICATORS[k].question}</td>
                  <td>
                    {INDICATORS[k].rule}
                    <code className="code">{INDICATORS[k].formula}</code>
                  </td>
                  <td className="num">{Math.round(defaults[k] * 100)}%</td>
                  <td className="num">{Math.round(current[k] * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Host-unit favourability (illustrative, pending geological review)</h3>
        <div className="table-scroll">
          <table className="method-table compact">
            <thead>
              <tr>
                <th>Mapped unit</th>
                <th className="num">Score</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(LITHOLOGY).map((l) => (
                <tr key={l.label}>
                  <td>{l.label}</td>
                  <td className="num">{l.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Missing information</h2>
        <p>
          Currently using: <strong>{policy === 'renormalise' ? 'exclude & rescale weights' : 'score as zero'}</strong>. Change it in the Explore view.
        </p>
        <ul>
          <li>
            <strong>Exclude &amp; rescale</strong> — a missing indicator is dropped and the remaining weights are rescaled to total 100%. Targets are
            not penalised for being unsurveyed, but their scores rest on less evidence. They are flagged in the list.
          </li>
          <li>
            <strong>Score as zero</strong> — a missing indicator keeps its weight and contributes 0 points. This is conservative and favours
            well-surveyed ground.
          </li>
        </ul>
      </section>

      <section>
        <h2>Spatial processing</h2>
        <ul>
          <li>Coordinate reference system: WGS 84 geographic (EPSG:4326) for storage and display.</li>
          <li>
            Distances to faults and occurrences are computed in the browser from the displayed layers — great-circle (haversine) distance for points,
            and a local equirectangular projection for point-to-line distance. What you see on the map is what is scored.
          </li>
          <li>Each target is currently represented by its centroid; polygon-based statistics are planned for real data.</li>
        </ul>
      </section>

      <section>
        <h2>Data sources</h2>
        <table className="method-table">
          <thead>
            <tr>
              <th>Layer</th>
              <th>Source</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Candidate targets, lithology, Cu-in-soil</td>
              <td>Synthetic (src/data/demo.ts)</td>
              <td>Demonstration only</td>
            </tr>
            <tr>
              <td>Fault traces</td>
              <td>Synthetic (src/data/demo.ts)</td>
              <td>Demonstration only</td>
            </tr>
            <tr>
              <td>Recorded occurrences</td>
              <td>Synthetic (src/data/demo.ts)</td>
              <td>Demonstration only</td>
            </tr>
            <tr>
              <td>Basemaps</td>
              <td>Esri World Topo / Imagery, OpenStreetMap</td>
              <td>Context only, not scored</td>
            </tr>
          </tbody>
        </table>
        <p className="hint">
          Real datasets will require documented provenance, usage permissions, a consistent CRS and an understanding of coverage before integration.
        </p>
      </section>

      <section>
        <h2>Risks &amp; limitations</h2>
        <dl className="limits">
          {LIMITATIONS.map(([t, d]) => (
            <div key={t}>
              <dt>{t}</dt>
              <dd>{d}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}

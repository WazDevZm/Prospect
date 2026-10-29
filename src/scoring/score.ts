// Weighted-sum priority score.
//
//   priority = Σ wᵢ · sᵢ      where Σ wᵢ = 1 over the indicators being combined
//
// A higher score means a higher ranking under the chosen indicators and
// weights. It is NOT a probability of finding copper.

import { INDICATOR_KEYS, normaliseAll, type Evidence, type IndicatorKey, type Normalised } from './indicators';

export type Weights = Record<IndicatorKey, number>;

/**
 * How to treat an indicator with no data for a target:
 *  - 'renormalise': drop it and rescale the remaining weights to sum to 100%.
 *  - 'zero':        keep its weight and score it as 0 (penalises data gaps).
 */
export type MissingPolicy = 'renormalise' | 'zero';

export const DEFAULT_WEIGHTS: Weights = { geology: 30, geochemistry: 30, structure: 20, occurrence: 20 };
export const DEFAULT_POLICY: MissingPolicy = 'renormalise';

export interface Contribution {
  key: IndicatorKey;
  /** Indicator score on 0–100, or null if no data. */
  value: number | null;
  /** Weight as set by the user, as a fraction of the total (0–1). */
  nominalWeight: number;
  /** Weight actually applied after the missing-data policy (0–1). */
  appliedWeight: number;
  /** Points this indicator adds to the priority score. */
  points: number;
}

export interface ScoreResult {
  score: number;
  contributions: Contribution[];
  /** Number of indicators with data (out of INDICATOR_KEYS.length). */
  available: number;
}

/** Converts raw weights to fractions that sum to 1 (equal split if all are 0). */
export function toFractions(weights: Weights): Weights {
  const total = INDICATOR_KEYS.reduce((s, k) => s + Math.max(0, weights[k]), 0);
  const out = {} as Weights;
  for (const k of INDICATOR_KEYS) {
    out[k] = total === 0 ? 1 / INDICATOR_KEYS.length : Math.max(0, weights[k]) / total;
  }
  return out;
}

export function combine(values: Normalised, weights: Weights, policy: MissingPolicy): ScoreResult {
  const nominal = toFractions(weights);
  const availableWeight = INDICATOR_KEYS.reduce((s, k) => s + (values[k] == null ? 0 : nominal[k]), 0);

  const contributions = INDICATOR_KEYS.map((key): Contribution => {
    const value = values[key];
    let appliedWeight = nominal[key];
    if (value == null) appliedWeight = policy === 'renormalise' ? 0 : nominal[key];
    else if (policy === 'renormalise') appliedWeight = availableWeight === 0 ? 0 : nominal[key] / availableWeight;
    return { key, value, nominalWeight: nominal[key], appliedWeight, points: appliedWeight * (value ?? 0) };
  });

  return {
    score: contributions.reduce((s, c) => s + c.points, 0),
    contributions,
    available: INDICATOR_KEYS.filter((k) => values[k] != null).length,
  };
}

export function scoreEvidence(e: Evidence, weights: Weights, policy: MissingPolicy): ScoreResult {
  return combine(normaliseAll(e), weights, policy);
}

export interface Ranked<T> {
  item: T;
  result: ScoreResult;
  rank: number;
}

/** Scores and ranks items (1 = highest). Ties keep a stable order by id. */
export function rank<T extends { id: string; evidence: Evidence }>(
  items: T[],
  weights: Weights,
  policy: MissingPolicy,
): Ranked<T>[] {
  return items
    .map((item) => ({ item, result: scoreEvidence(item.evidence, weights, policy), rank: 0 }))
    .sort((a, b) => b.result.score - a.result.score || a.item.id.localeCompare(b.item.id))
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

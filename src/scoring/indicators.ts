// Indicator definitions: how each piece of raw evidence is put on a common
// 0–100 scale. These rules and thresholds are ILLUSTRATIVE and must be reviewed
// by a geologist before being applied to real data (see Validation Plan).

import type { LithologyKey } from '../data/demo';

export type IndicatorKey = 'geology' | 'geochemistry' | 'structure' | 'occurrence';

export const INDICATOR_KEYS: IndicatorKey[] = ['geology', 'geochemistry', 'structure', 'occurrence'];

/** Raw evidence for one target, after spatial processing. null = no data. */
export interface Evidence {
  lithology: LithologyKey | null;
  cuSoilPpm: number | null;
  faultDistanceKm: number | null;
  occurrenceDistanceKm: number | null;
}

export type Normalised = Record<IndicatorKey, number | null>;

export const LITHOLOGY: Record<LithologyKey, { label: string; score: number }> = {
  'lower-roan': { label: 'Lower Roan Subgroup (ore shale / arenite)', score: 95 },
  'upper-roan': { label: 'Upper Roan Subgroup (dolomite / argillite)', score: 70 },
  mwashia: { label: 'Mwashia Subgroup', score: 55 },
  kundelungu: { label: 'Kundelungu Group', score: 35 },
  basement: { label: 'Basement Complex (granite / gneiss)', score: 25 },
  intrusive: { label: 'Post-Katangan intrusive', score: 20 },
};

export const GEOCHEM_BACKGROUND_PPM = 50;
export const GEOCHEM_SATURATION_PPM = 1000;
export const STRUCTURE_MAX_KM = 10;
export const OCCURRENCE_MAX_KM = 25;

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

/** Linear distance decay: 100 at 0 km, 0 at or beyond maxKm. */
export const distanceDecay = (km: number, maxKm: number) => clamp(100 * (1 - km / maxKm));

/** Log-linear: 0 at or below background, 100 at or above saturation. */
export function geochemScore(ppm: number): number {
  if (ppm <= GEOCHEM_BACKGROUND_PPM) return 0;
  const lo = Math.log10(GEOCHEM_BACKGROUND_PPM);
  const hi = Math.log10(GEOCHEM_SATURATION_PPM);
  return clamp((100 * (Math.log10(ppm) - lo)) / (hi - lo));
}

export interface IndicatorDef {
  key: IndicatorKey;
  label: string;
  question: string;
  rule: string;
  formula: string;
  colour: string;
  normalise: (e: Evidence) => number | null;
  describeRaw: (e: Evidence) => string;
}

export const INDICATORS: Record<IndicatorKey, IndicatorDef> = {
  geology: {
    key: 'geology',
    label: 'Geological setting',
    question: 'Is the area underlain by a host unit favourable for sediment-hosted copper?',
    rule: 'Lookup table: each mapped host unit is assigned a favourability score.',
    formula: 's = favourability(host unit)',
    colour: '#8C6BB1',
    normalise: (e) => (e.lithology ? LITHOLOGY[e.lithology].score : null),
    describeRaw: (e) => (e.lithology ? LITHOLOGY[e.lithology].label : 'Unmapped'),
  },
  geochemistry: {
    key: 'geochemistry',
    label: 'Geochemical evidence',
    question: 'How anomalous is copper in soil relative to background?',
    rule: `Log-linear between ${GEOCHEM_BACKGROUND_PPM} ppm (background → 0) and ${GEOCHEM_SATURATION_PPM} ppm (→ 100).`,
    formula: `s = 100 · (log₁₀ Cu − log₁₀ ${GEOCHEM_BACKGROUND_PPM}) / (log₁₀ ${GEOCHEM_SATURATION_PPM} − log₁₀ ${GEOCHEM_BACKGROUND_PPM})`,
    colour: '#C8742F',
    normalise: (e) => (e.cuSoilPpm == null ? null : geochemScore(e.cuSoilPpm)),
    describeRaw: (e) => (e.cuSoilPpm == null ? 'No survey' : `${e.cuSoilPpm} ppm Cu (median soil)`),
  },
  structure: {
    key: 'structure',
    label: 'Structural context',
    question: 'How close is the area to a mapped fault that could have channelled fluids?',
    rule: `Linear decay with distance to nearest mapped fault: 0 km → 100, ≥ ${STRUCTURE_MAX_KM} km → 0.`,
    formula: `s = 100 · max(0, 1 − d / ${STRUCTURE_MAX_KM} km)`,
    colour: '#2E8B7A',
    normalise: (e) =>
      e.faultDistanceKm == null ? null : distanceDecay(e.faultDistanceKm, STRUCTURE_MAX_KM),
    describeRaw: (e) =>
      e.faultDistanceKm == null ? 'No structural data' : `${e.faultDistanceKm.toFixed(1)} km to nearest fault`,
  },
  occurrence: {
    key: 'occurrence',
    label: 'Proximity to occurrences',
    question: 'How close is the area to a recorded copper occurrence?',
    rule: `Linear decay with distance to nearest recorded occurrence: 0 km → 100, ≥ ${OCCURRENCE_MAX_KM} km → 0.`,
    formula: `s = 100 · max(0, 1 − d / ${OCCURRENCE_MAX_KM} km)`,
    colour: '#3D6FB6',
    normalise: (e) =>
      e.occurrenceDistanceKm == null ? null : distanceDecay(e.occurrenceDistanceKm, OCCURRENCE_MAX_KM),
    describeRaw: (e) =>
      e.occurrenceDistanceKm == null
        ? 'No occurrence data'
        : `${e.occurrenceDistanceKm.toFixed(1)} km to nearest occurrence`,
  },
};

export function normaliseAll(e: Evidence): Normalised {
  return {
    geology: INDICATORS.geology.normalise(e),
    geochemistry: INDICATORS.geochemistry.normalise(e),
    structure: INDICATORS.structure.normalise(e),
    occurrence: INDICATORS.occurrence.normalise(e),
  };
}

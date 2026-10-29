import { describe, expect, it } from 'vitest';
import { haversineKm, pointToSegmentKm } from './geo';
import { distanceDecay, geochemScore, normaliseAll, type Normalised } from './indicators';
import { combine, DEFAULT_WEIGHTS, rank, toFractions } from './score';
import { TARGETS } from '../data/targets';

const full: Normalised = { geology: 80, geochemistry: 60, structure: 50, occurrence: 100 };

describe('combine — controlled examples', () => {
  it('reproduces the concept-document example: 80 × 30% = 24 points', () => {
    const r = combine(full, DEFAULT_WEIGHTS, 'renormalise');
    expect(r.contributions.find((c) => c.key === 'geology')!.points).toBeCloseTo(24);
  });

  it('sums weighted contributions', () => {
    // 80·.3 + 60·.3 + 50·.2 + 100·.2 = 24 + 18 + 10 + 20
    expect(combine(full, DEFAULT_WEIGHTS, 'renormalise').score).toBeCloseTo(72);
  });

  it('is invariant to weight scale', () => {
    const a = combine(full, { geology: 3, geochemistry: 3, structure: 2, occurrence: 2 }, 'zero');
    expect(a.score).toBeCloseTo(72);
  });

  it('renormalises remaining weights when an indicator is missing', () => {
    const r = combine({ ...full, geochemistry: null }, DEFAULT_WEIGHTS, 'renormalise');
    expect(r.score).toBeCloseTo((80 * 30 + 50 * 20 + 100 * 20) / 70);
    expect(r.available).toBe(3);
    const applied = r.contributions.reduce((s, c) => s + c.appliedWeight, 0);
    expect(applied).toBeCloseTo(1);
  });

  it('scores a missing indicator as zero under the "zero" policy', () => {
    expect(combine({ ...full, geochemistry: null }, DEFAULT_WEIGHTS, 'zero').score).toBeCloseTo(54);
  });

  it('returns 0 when nothing is available', () => {
    const none: Normalised = { geology: null, geochemistry: null, structure: null, occurrence: null };
    expect(combine(none, DEFAULT_WEIGHTS, 'renormalise').score).toBe(0);
  });

  it('splits equally when all weights are zero', () => {
    const f = toFractions({ geology: 0, geochemistry: 0, structure: 0, occurrence: 0 });
    expect(f.geology).toBeCloseTo(0.25);
  });

  it('keeps the score within 0–100', () => {
    const max = combine({ geology: 100, geochemistry: 100, structure: 100, occurrence: 100 }, DEFAULT_WEIGHTS, 'zero');
    expect(max.score).toBeCloseTo(100);
  });
});

describe('normalisation rules', () => {
  it('geochemistry is log-linear between background and saturation', () => {
    expect(geochemScore(50)).toBe(0);
    expect(geochemScore(10)).toBe(0);
    expect(geochemScore(1000)).toBeCloseTo(100);
    expect(geochemScore(5000)).toBe(100);
    expect(geochemScore(Math.sqrt(50 * 1000))).toBeCloseTo(50);
  });

  it('distance decay is linear and clamped', () => {
    expect(distanceDecay(0, 10)).toBe(100);
    expect(distanceDecay(5, 10)).toBe(50);
    expect(distanceDecay(12, 10)).toBe(0);
  });

  it('returns null for missing evidence', () => {
    const n = normaliseAll({ lithology: null, cuSoilPpm: null, faultDistanceKm: 3, occurrenceDistanceKm: null });
    expect(n.geology).toBeNull();
    expect(n.geochemistry).toBeNull();
    expect(n.structure).toBeCloseTo(70);
  });
});

describe('geometry', () => {
  it('one degree of latitude is ~111 km', () => {
    expect(haversineKm([-12, 28], [-13, 28])).toBeCloseTo(111.2, 0);
  });

  it('point-to-segment distance uses the perpendicular foot', () => {
    // Point 0.1° north of the middle of an E–W segment ≈ 11.06 km
    expect(pointToSegmentKm([-12.9, 28], [-13, 27.9], [-13, 28.1])).toBeCloseTo(11.06, 1);
    // Beyond the segment end, distance is to the endpoint
    expect(pointToSegmentKm([-13, 28.3], [-13, 27.9], [-13, 28.1])).toBeCloseTo(haversineKm([-13, 28.3], [-13, 28.1]), 0);
  });
});

describe('ranking', () => {
  it('ranks all demo targets in descending score order with ranks 1..n', () => {
    const ranked = rank(TARGETS, DEFAULT_WEIGHTS, 'renormalise');
    expect(ranked.map((r) => r.rank)).toEqual(ranked.map((_, i) => i + 1));
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1].result.score).toBeGreaterThanOrEqual(ranked[i].result.score);
    }
  });

  it('changing weights can change the ranking', () => {
    const a = rank(TARGETS, DEFAULT_WEIGHTS, 'renormalise').map((r) => r.item.id);
    const b = rank(TARGETS, { geology: 0, geochemistry: 0, structure: 100, occurrence: 0 }, 'renormalise').map((r) => r.item.id);
    expect(a).not.toEqual(b);
  });
});

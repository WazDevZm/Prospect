// Spatial processing step: derive each target's evidence from the demo layers.
// Fault and occurrence distances are computed geometrically from the map
// layers, so what the user sees on the map is exactly what is scored.

import { distanceToPolylinesKm, nearestPointKm } from '../scoring/geo';
import type { Evidence } from '../scoring/indicators';
import { DEMO_FAULTS, DEMO_OCCURRENCES, DEMO_TARGETS, type DemoTarget } from './demo';

export interface Target extends DemoTarget {
  evidence: Evidence;
}

export function buildTargets(): Target[] {
  const faultLines = DEMO_FAULTS.map((f) => f.path);
  const occurrencePoints = DEMO_OCCURRENCES.map((o) => o.position);
  return DEMO_TARGETS.map((t) => ({
    ...t,
    evidence: {
      lithology: t.lithology,
      cuSoilPpm: t.cuSoilPpm,
      faultDistanceKm: faultLines.length ? distanceToPolylinesKm(t.centre, faultLines) : null,
      occurrenceDistanceKm: occurrencePoints.length ? nearestPointKm(t.centre, occurrencePoints) : null,
    },
  }));
}

export const TARGETS: Target[] = buildTargets();

// ─────────────────────────────────────────────────────────────────────────────
//  DEMONSTRATION DATA — NOT REAL GEOLOGICAL OBSERVATIONS
//
//  Every target, fault trace, occurrence point and geochemical value in this
//  file is synthetic. Names are fictional and locations are only loosely placed
//  in the Zambian Copperbelt / North-Western Province region so the map has a
//  realistic context. Nothing here is derived from survey data, and none of it
//  should be used for exploration decisions.
// ─────────────────────────────────────────────────────────────────────────────

import type { LatLng } from '../scoring/geo';

export type LithologyKey =
  | 'lower-roan'
  | 'upper-roan'
  | 'mwashia'
  | 'kundelungu'
  | 'basement'
  | 'intrusive';

export interface DemoTarget {
  id: string;
  name: string;
  province: 'Copperbelt' | 'North-Western';
  district: string;
  /** Approximate centroid of the candidate area. */
  centre: LatLng;
  /** Approximate area of the candidate polygon, km². */
  areaKm2: number;
  /** Dominant mapped host unit inside the area, or null where unmapped. */
  lithology: LithologyKey | null;
  /** Median Cu in soil (ppm) from a demo survey, or null where no survey exists. */
  cuSoilPpm: number | null;
  /** Number of demo soil samples behind the median. */
  soilSamples: number;
  notes: string;
}

export interface DemoFault {
  id: string;
  name: string;
  path: LatLng[];
}

export interface DemoOccurrence {
  id: string;
  name: string;
  position: LatLng;
  kind: 'Showing' | 'Old working' | 'Drill intersection';
}

/** Study-area extent used to frame the map. */
export const STUDY_AREA_BOUNDS: [LatLng, LatLng] = [
  [-13.45, 25.55],
  [-11.85, 28.95],
];

export const DEMO_FAULTS: DemoFault[] = [
  {
    id: 'F1',
    name: 'Demo Fault A (NW–SE)',
    path: [
      [-12.05, 26.05],
      [-12.22, 26.55],
      [-12.36, 27.1],
      [-12.52, 27.7],
      [-12.74, 28.15],
      [-13.02, 28.6],
    ],
  },
  {
    id: 'F2',
    name: 'Demo Fault B (NW–SE)',
    path: [
      [-12.45, 25.75],
      [-12.6, 26.3],
      [-12.78, 26.95],
      [-12.98, 27.55],
      [-13.22, 28.2],
    ],
  },
  {
    id: 'F3',
    name: 'Demo Fault C (NE–SW splay)',
    path: [
      [-12.95, 27.95],
      [-12.7, 28.35],
      [-12.45, 28.7],
    ],
  },
  {
    id: 'F4',
    name: 'Demo Fault D (N–S)',
    path: [
      [-11.95, 25.95],
      [-12.3, 25.98],
      [-12.65, 26.02],
    ],
  },
];

export const DEMO_OCCURRENCES: DemoOccurrence[] = [
  { id: 'O1', name: 'Demo Occurrence 1', position: [-12.42, 27.55], kind: 'Old working' },
  { id: 'O2', name: 'Demo Occurrence 2', position: [-12.68, 28.05], kind: 'Showing' },
  { id: 'O3', name: 'Demo Occurrence 3', position: [-12.9, 28.48], kind: 'Drill intersection' },
  { id: 'O4', name: 'Demo Occurrence 4', position: [-12.2, 26.45], kind: 'Showing' },
  { id: 'O5', name: 'Demo Occurrence 5', position: [-12.32, 25.9], kind: 'Old working' },
  { id: 'O6', name: 'Demo Occurrence 6', position: [-13.15, 28.3], kind: 'Showing' },
  { id: 'O7', name: 'Demo Occurrence 7', position: [-12.58, 27.05], kind: 'Drill intersection' },
];

export const DEMO_TARGETS: DemoTarget[] = [
  {
    id: 'DEMO-01',
    name: 'Kafubu Ridge',
    province: 'Copperbelt',
    district: 'Kitwe',
    centre: [-12.71, 28.1],
    areaKm2: 18,
    lithology: 'lower-roan',
    cuSoilPpm: 640,
    soilSamples: 212,
    notes: 'Ridge-parallel soil anomaly along the demo fault A corridor.',
  },
  {
    id: 'DEMO-02',
    name: 'Mwambashi Flats',
    province: 'Copperbelt',
    district: 'Kitwe',
    centre: [-12.6, 27.92],
    areaKm2: 24,
    lithology: 'upper-roan',
    cuSoilPpm: 310,
    soilSamples: 140,
    notes: 'Broad, moderate anomaly; thick cover limits geological mapping.',
  },
  {
    id: 'DEMO-03',
    name: 'Chambishi West',
    province: 'Copperbelt',
    district: 'Kalulushi',
    centre: [-12.66, 27.72],
    areaKm2: 15,
    lithology: 'lower-roan',
    cuSoilPpm: null,
    soilSamples: 0,
    notes: 'Favourable host mapped but no geochemical survey in demo dataset.',
  },
  {
    id: 'DEMO-04',
    name: 'Lufwanyama Bend',
    province: 'Copperbelt',
    district: 'Lufwanyama',
    centre: [-12.86, 27.38],
    areaKm2: 30,
    lithology: 'mwashia',
    cuSoilPpm: 180,
    soilSamples: 96,
    notes: 'Weak anomaly near the demo fault B trace.',
  },
  {
    id: 'DEMO-05',
    name: 'Kafue Headwaters',
    province: 'Copperbelt',
    district: 'Chililabombwe',
    centre: [-12.4, 27.62],
    areaKm2: 12,
    lithology: 'lower-roan',
    cuSoilPpm: 890,
    soilSamples: 188,
    notes: 'Strong anomaly adjacent to a demo old working.',
  },
  {
    id: 'DEMO-06',
    name: 'Mufulira East Dome',
    province: 'Copperbelt',
    district: 'Mufulira',
    centre: [-12.52, 28.4],
    areaKm2: 20,
    lithology: 'basement',
    cuSoilPpm: 95,
    soilSamples: 60,
    notes: 'Basement dome flank; background-level copper in demo survey.',
  },
  {
    id: 'DEMO-07',
    name: 'Baluba South',
    province: 'Copperbelt',
    district: 'Luanshya',
    centre: [-13.1, 28.36],
    areaKm2: 16,
    lithology: 'upper-roan',
    cuSoilPpm: 420,
    soilSamples: 120,
    notes: 'Moderate anomaly; near a demo showing.',
  },
  {
    id: 'DEMO-08',
    name: 'Kaloko Syncline',
    province: 'Copperbelt',
    district: 'Masaiti',
    centre: [-13.0, 28.75],
    areaKm2: 26,
    lithology: 'kundelungu',
    cuSoilPpm: 140,
    soilSamples: 72,
    notes: 'Younger cover sequence; weak response.',
  },
  {
    id: 'DEMO-09',
    name: 'Solwezi North Arc',
    province: 'North-Western',
    district: 'Solwezi',
    centre: [-12.12, 26.38],
    areaKm2: 35,
    lithology: 'mwashia',
    cuSoilPpm: 520,
    soilSamples: 230,
    notes: 'Arcuate anomaly following the demo fault A trace.',
  },
  {
    id: 'DEMO-10',
    name: 'Mutanda Plains',
    province: 'North-Western',
    district: 'Solwezi',
    centre: [-12.42, 26.25],
    areaKm2: 40,
    lithology: null,
    cuSoilPpm: 260,
    soilSamples: 85,
    notes: 'Geology unmapped in demo dataset; geochemistry only.',
  },
  {
    id: 'DEMO-11',
    name: 'Kalumbila Hills',
    province: 'North-Western',
    district: 'Kalumbila',
    centre: [-12.3, 25.98],
    areaKm2: 22,
    lithology: 'lower-roan',
    cuSoilPpm: 470,
    soilSamples: 160,
    notes: 'Near demo fault D and an old working.',
  },
  {
    id: 'DEMO-12',
    name: 'Lumwana Dambo',
    province: 'North-Western',
    district: 'Kalumbila',
    centre: [-12.2, 25.72],
    areaKm2: 28,
    lithology: 'basement',
    cuSoilPpm: 330,
    soilSamples: 110,
    notes: 'Basement-hosted anomaly; host-rock score may undervalue it.',
  },
  {
    id: 'DEMO-13',
    name: 'Kasempa Gate',
    province: 'North-Western',
    district: 'Mushindamo',
    centre: [-12.85, 26.6],
    areaKm2: 32,
    lithology: 'intrusive',
    cuSoilPpm: null,
    soilSamples: 0,
    notes: 'Intrusive body; no geochemistry and far from known occurrences.',
  },
  {
    id: 'DEMO-14',
    name: 'Kipushi Corridor',
    province: 'North-Western',
    district: 'Mushindamo',
    centre: [-12.6, 27.1],
    areaKm2: 19,
    lithology: 'upper-roan',
    cuSoilPpm: 560,
    soilSamples: 175,
    notes: 'Anomaly adjacent to a demo drill intersection.',
  },
];

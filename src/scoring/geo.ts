// Small geodesy helpers. Coordinates are [lat, lng] in WGS 84 (EPSG:4326).

export type LatLng = [number, number];

const EARTH_RADIUS_KM = 6371.0088;
const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance between two points, in kilometres. */
export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Shortest distance from point p to segment a–b, in kilometres.
 * Uses a local equirectangular projection centred on p, which is accurate to
 * well under 1% at the tens-of-kilometres scale used for target screening.
 */
export function pointToSegmentKm(p: LatLng, a: LatLng, b: LatLng): number {
  const kx = 111.32 * Math.cos(toRad(p[0]));
  const ky = 110.574;
  const ax = (a[1] - p[1]) * kx;
  const ay = (a[0] - p[0]) * ky;
  const bx = (b[1] - p[1]) * kx;
  const by = (b[0] - p[0]) * ky;
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2));
  return Math.hypot(ax + t * dx, ay + t * dy);
}

/** Shortest distance from p to any segment of any of the polylines, in kilometres. */
export function distanceToPolylinesKm(p: LatLng, lines: LatLng[][]): number {
  let min = Infinity;
  for (const line of lines) {
    for (let i = 1; i < line.length; i++) {
      min = Math.min(min, pointToSegmentKm(p, line[i - 1], line[i]));
    }
  }
  return min;
}

/** Distance from p to the nearest of the given points, in kilometres. */
export function nearestPointKm(p: LatLng, points: LatLng[]): number {
  let min = Infinity;
  for (const q of points) min = Math.min(min, haversineKm(p, q));
  return min;
}

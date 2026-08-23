import type { Waypoint } from '../types/logistics';

export function calculateLSI(
  rainfallMm: number,
  slopeDeg: number,
  soilSaturationPercent: number,
  histFailures: number
): number {
  const rScore = Math.min(100, (rainfallMm / 120) * 100) * 0.35;
  const sScore = Math.min(100, (slopeDeg / 60) * 100) * 0.30;
  const mScore = Math.min(100, soilSaturationPercent) * 0.20;
  const hScore = Math.min(100, (histFailures / 20) * 100) * 0.15;
  return Math.round(rScore + sScore + mScore + hScore);
}

export function computeRouteDistanceKm(waypoints: Waypoint[]): number {
  let total = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((p1.lat * Math.PI) / 180) * Math.cos((p2.lat * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += 6371 * c;
  }
  return Number(total.toFixed(1));
}

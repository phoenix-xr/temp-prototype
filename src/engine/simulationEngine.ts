import type { Vehicle, LatLng } from '../types/logistics';

// Calculate bearing in degrees from point A to point B
export function calculateBearing(start: LatLng, end: LatLng): number {
  const startLat = (start.lat * Math.PI) / 180;
  const startLng = (start.lng * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const endLng = (end.lng * Math.PI) / 180;

  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

// Calculate Haversine distance in KM
export function getDistanceKm(p1: LatLng, p2: LatLng): number {
  const R = 6371;
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) * Math.cos((p2.lat * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Step vehicle forward along its active route towards the Central Warehouse
export function advanceVehicle(
  vehicle: Vehicle,
  deltaTimeSec: number,
  simSpeedMultiplier: number
): Vehicle {
  if (vehicle.status === 'DELIVERED') return vehicle;

  const activeRoute = vehicle.availableRoutes.find(r => r.id === vehicle.activeRouteId) || vehicle.availableRoutes[0];
  if (!activeRoute || activeRoute.waypoints.length < 2) return vehicle;

  const waypoints = activeRoute.waypoints;
  const currIdx = vehicle.pathIndex;

  if (currIdx >= waypoints.length - 1) {
    return {
      ...vehicle,
      status: 'DELIVERED',
      progressPercent: 100,
      speedKmph: 0
    };
  }

  const p1 = waypoints[currIdx];
  const p2 = waypoints[currIdx + 1];

  const segDistKm = Math.max(0.001, getDistanceKm(p1, p2));
  
  // Distance traveled in this time slice
  const distanceTraveledKm = (vehicle.speedKmph * (deltaTimeSec * simSpeedMultiplier)) / 3600;
  
  const stepRatio = distanceTraveledKm / segDistKm;
  let newSubProgress = vehicle.subProgress + stepRatio;
  let newIdx = currIdx;

  if (newSubProgress >= 1.0) {
    newSubProgress = 0;
    newIdx = currIdx + 1;
  }

  if (newIdx >= waypoints.length - 1) {
    const finalPt = waypoints[waypoints.length - 1];
    return {
      ...vehicle,
      pathIndex: waypoints.length - 1,
      subProgress: 1,
      progressPercent: 100,
      status: 'DELIVERED',
      speedKmph: 0,
      currentLocation: { lat: finalPt.lat, lng: finalPt.lng },
      altitudeM: finalPt.elevation || vehicle.altitudeM
    };
  }

  const wpA = waypoints[newIdx];
  const wpB = waypoints[newIdx + 1];

  // Interpolate position
  const lat = wpA.lat + (wpB.lat - wpA.lat) * newSubProgress;
  const lng = wpA.lng + (wpB.lng - wpA.lng) * newSubProgress;

  // Heading
  const heading = Math.round(calculateBearing(wpA, wpB));

  // Overall progress
  const totalWaypoints = waypoints.length;
  const progressPercent = Math.min(99, Math.round(((newIdx + newSubProgress) / (totalWaypoints - 1)) * 100));
  const fuelPercent = Math.max(5, Number((vehicle.fuelPercent - (distanceTraveledKm * 0.05)).toFixed(1)));

  return {
    ...vehicle,
    pathIndex: newIdx,
    subProgress: newSubProgress,
    currentLocation: { lat, lng },
    heading,
    progressPercent,
    fuelPercent
  };
}

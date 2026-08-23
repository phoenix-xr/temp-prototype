import type { Vehicle, RouteOption } from '../types/logistics';
import { CENTRAL_WAREHOUSE, HAZARDS_CATALOG } from './nerCorridors';
import roadGeometries from './realRoadRoutes.json';

export function createInitialVehicles(): Vehicle[] {
  // 1. Critical Medical & Vaccine Convoy (Northern Hub -> Central Warehouse)
  const medSafeRoute: RouteOption = {
    id: 'RT_MED_SAFE',
    name: 'AI Safe Route: NH-6 Modern 4-Lane Expressway',
    isSafeOptimal: true,
    status: 'SAFE',
    description: 'Reinforced 4-lane highway via GS Road & Polo Flyover.',
    totalDistanceKm: roadGeometries.MED_SAFE?.distanceKm || 12.1,
    estimatedDurationMin: roadGeometries.MED_SAFE?.durationMin || 18,
    compositeRiskScore: 16,
    dangerZonesCount: 0,
    whyRejectedOrChosen: '✓ SELECTED: Max stability index (16%). Heavy concrete retaining walls and wide shoulders. All-weather safe for emergency vaccine transport.',
    waypoints: roadGeometries.MED_SAFE?.points || [
      { lat: 25.6180, lng: 91.8790 },
      { lat: 25.6080, lng: 91.8960 },
      { lat: 25.5940, lng: 91.9010 },
      CENTRAL_WAREHOUSE.location
    ]
  };

  const medDangerRoute: RouteOption = {
    id: 'RT_MED_DANGER',
    name: 'Rejected Path: Mawlai Escarpment Cliff Route',
    isSafeOptimal: false,
    status: 'BLOCKED',
    description: 'Narrow unpaved descent along Mawlai escarpment.',
    totalDistanceKm: roadGeometries.MED_DANGER?.distanceKm || 8.3,
    estimatedDurationMin: (roadGeometries.MED_DANGER?.durationMin || 14) + 65,
    compositeRiskScore: 96,
    dangerZonesCount: 1,
    whyRejectedOrChosen: '⛔ REJECTED BY AI: Passes through active Mawlai Landslide Scree Zone. High 118 mm/h rainfall + 58° slope creates severe boulder collapse danger.',
    associatedHazard: HAZARDS_CATALOG.MAWLAI_LANDSLIDE,
    waypoints: roadGeometries.MED_DANGER?.points || [
      { lat: 25.6180, lng: 91.8790 },
      { lat: 25.6035, lng: 91.8685 },
      { lat: 25.5900, lng: 91.8780 },
      CENTRAL_WAREHOUSE.location
    ]
  };

  // 2. FCI Essential Food Grain Supply (Upper Shillong Depot -> Central Warehouse)
  const grainSafeRoute: RouteOption = {
    id: 'RT_GRAIN_SAFE',
    name: 'AI Safe Route: Cantonment Ring Highway',
    isSafeOptimal: true,
    status: 'SAFE',
    description: 'Paved military arterial road with continuous slope drainage channels.',
    totalDistanceKm: roadGeometries.GRAIN_SAFE?.distanceKm || 16.7,
    estimatedDurationMin: roadGeometries.GRAIN_SAFE?.durationMin || 28,
    compositeRiskScore: 22,
    dangerZonesCount: 0,
    whyRejectedOrChosen: '✓ SELECTED: Gentle 18° gradient, reinforced culverts, zero soil liquefaction risk for heavy 18.5-ton grain payload.',
    waypoints: roadGeometries.GRAIN_SAFE?.points || [
      { lat: 25.5450, lng: 91.8520 },
      { lat: 25.5600, lng: 91.8580 },
      { lat: 25.5780, lng: 91.8840 },
      CENTRAL_WAREHOUSE.location
    ]
  };

  const grainDangerRoute: RouteOption = {
    id: 'RT_GRAIN_DANGER',
    name: 'Rejected Path: Lower Barik Ravine Cut-off',
    isSafeOptimal: false,
    status: 'BLOCKED',
    description: 'Traverses water-saturated weathered clay valley.',
    totalDistanceKm: roadGeometries.GRAIN_DANGER?.distanceKm || 13.4,
    estimatedDurationMin: (roadGeometries.GRAIN_DANGER?.durationMin || 22) + 75,
    compositeRiskScore: 89,
    dangerZonesCount: 1,
    whyRejectedOrChosen: '⛔ REJECTED BY AI: Soil saturation index at 92%. Severe risk of heavy 18-ton truck sinking into liquefied tarmac shoulders.',
    associatedHazard: HAZARDS_CATALOG.BARIK_SOIL_SLUMP,
    waypoints: roadGeometries.GRAIN_DANGER?.points || [
      { lat: 25.5450, lng: 91.8520 },
      { lat: 25.5670, lng: 91.8760 },
      { lat: 25.5790, lng: 91.8920 },
      CENTRAL_WAREHOUSE.location
    ]
  };

  // 3. LPG & Fuel Tanker (Eastern Entry Gateway -> Central Warehouse)
  const fuelSafeRoute: RouteOption = {
    id: 'RT_FUEL_SAFE',
    name: 'AI Safe Route: Shillong Eastern Bypass Corridor',
    isSafeOptimal: true,
    status: 'SAFE',
    description: 'Wide double-lane bypass with blast barriers and gradual gradient.',
    totalDistanceKm: roadGeometries.FUEL_SAFE?.distanceKm || 6.8,
    estimatedDurationMin: roadGeometries.FUEL_SAFE?.durationMin || 14,
    compositeRiskScore: 18,
    dangerZonesCount: 0,
    whyRejectedOrChosen: '✓ SELECTED: Safest corridor for flammable hazardous petroleum cargo. Avoids narrow cliff edges.',
    waypoints: roadGeometries.FUEL_SAFE?.points || [
      { lat: 25.5680, lng: 91.9280 },
      { lat: 25.5840, lng: 91.9050 },
      CENTRAL_WAREHOUSE.location
    ]
  };

  const fuelDangerRoute: RouteOption = {
    id: 'RT_FUEL_DANGER',
    name: 'Rejected Path: Ganol Mountain Cliff Chute',
    isSafeOptimal: false,
    status: 'BLOCKED',
    description: 'Unprotected narrow 1-lane mountain cut-off along 54° cliff drop.',
    totalDistanceKm: roadGeometries.FUEL_DANGER?.distanceKm || 7.7,
    estimatedDurationMin: (roadGeometries.FUEL_DANGER?.durationMin || 18) + 60,
    compositeRiskScore: 91,
    dangerZonesCount: 1,
    whyRejectedOrChosen: '⛔ REJECTED BY AI: 54° slope with high probability of quartzite rockfall debris crashing onto fuel tankers.',
    associatedHazard: HAZARDS_CATALOG.GANOL_ROCKFALL,
    waypoints: roadGeometries.FUEL_DANGER?.points || [
      { lat: 25.5680, lng: 91.9280 },
      { lat: 25.5810, lng: 91.9190 },
      CENTRAL_WAREHOUSE.location
    ]
  };

  // 4. Agri Cold Storage & Perishable Logistics (South Gateway -> Central Warehouse)
  const agriSafeRoute: RouteOption = {
    id: 'RT_AGRI_SAFE',
    name: 'AI Safe Route: Shillong Peak Ridge Expressway',
    isSafeOptimal: true,
    status: 'SAFE',
    description: 'Engineered ridge road with high-capacity storm drains.',
    totalDistanceKm: roadGeometries.AGRI_SAFE?.distanceKm || 14.7,
    estimatedDurationMin: roadGeometries.AGRI_SAFE?.durationMin || 26,
    compositeRiskScore: 24,
    dangerZonesCount: 0,
    whyRejectedOrChosen: '✓ SELECTED: Gentle descent with continuous asphalt grip. Reliable for temperature-sensitive organic produce.',
    waypoints: roadGeometries.AGRI_SAFE?.points || [
      { lat: 25.5320, lng: 91.8210 },
      { lat: 25.5520, lng: 91.8420 },
      { lat: 25.5720, lng: 91.8850 },
      CENTRAL_WAREHOUSE.location
    ]
  };

  const agriDangerRoute: RouteOption = {
    id: 'RT_AGRI_DANGER',
    name: 'Rejected Path: Lumparing 62° Mudflow Ravine',
    isSafeOptimal: false,
    status: 'BLOCKED',
    description: 'Steep winding track with zero drainage culverts.',
    totalDistanceKm: roadGeometries.AGRI_DANGER?.distanceKm || 21.0,
    estimatedDurationMin: (roadGeometries.AGRI_DANGER?.durationMin || 38) + 70,
    compositeRiskScore: 93,
    dangerZonesCount: 1,
    whyRejectedOrChosen: '⛔ REJECTED BY AI: 104 mm/h cloudburst overwhelmed culvert, causing zero tire traction and mudflow washouts.',
    associatedHazard: HAZARDS_CATALOG.MYLLIEM_MUDFLOW,
    waypoints: roadGeometries.AGRI_DANGER?.points || [
      { lat: 25.5320, lng: 91.8210 },
      { lat: 25.5560, lng: 91.8580 },
      { lat: 25.5700, lng: 91.8750 },
      CENTRAL_WAREHOUSE.location
    ]
  };

  const medStart = medSafeRoute.waypoints[0] || { lat: 25.6180, lng: 91.8790 };
  const grainStart = grainSafeRoute.waypoints[0] || { lat: 25.5450, lng: 91.8520 };
  const fuelStart = fuelSafeRoute.waypoints[0] || { lat: 25.5680, lng: 91.9280 };
  const agriStart = agriSafeRoute.waypoints[0] || { lat: 25.5320, lng: 91.8210 };

  return [
    {
      id: 'TRK-MED-101',
      callsign: 'MED-ALPHA 01',
      driverName: 'Havildar T. Sangma',
      cargoType: 'CRITICAL_MEDICINE',
      cargoDescription: 'Emergency Vaccines & Oxygen Cylinders',
      cargoWeightTons: 3.5,
      priority: 'EMERGENCY_ALPHA',
      originName: 'Mawlai North Staging Hub',
      destinationName: CENTRAL_WAREHOUSE.name,
      currentLocation: medStart,
      heading: 155,
      speedKmph: 42,
      altitudeM: 1520,
      progressPercent: 5,
      activeRouteId: 'RT_MED_SAFE',
      availableRoutes: [medSafeRoute, medDangerRoute],
      fuelPercent: 92,
      status: 'IN_TRANSIT',
      pathIndex: 0,
      subProgress: 0.1
    },
    {
      id: 'TRK-GRAIN-204',
      callsign: 'FCI-GRAIN 04',
      driverName: 'M. Bordoloi',
      cargoType: 'PDS_GRAINS',
      cargoDescription: 'PDS Rice & Wheat Essential Rations (18.5 Tons)',
      cargoWeightTons: 18.5,
      priority: 'HIGH',
      originName: 'Upper Shillong High Depot',
      destinationName: CENTRAL_WAREHOUSE.name,
      currentLocation: grainStart,
      heading: 45,
      speedKmph: 36,
      altitudeM: 1680,
      progressPercent: 8,
      activeRouteId: 'RT_GRAIN_SAFE',
      availableRoutes: [grainSafeRoute, grainDangerRoute],
      fuelPercent: 86,
      status: 'IN_TRANSIT',
      pathIndex: 0,
      subProgress: 0.15
    },
    {
      id: 'TRK-FUEL-309',
      callsign: 'IOCL-TANKER 09',
      driverName: 'R. Lyngdoh',
      cargoType: 'PETROLEUM_LPG',
      cargoDescription: '10,000L Mountain High-Altitude Diesel',
      cargoWeightTons: 14.0,
      priority: 'HIGH',
      originName: 'Eastern Gate Highway Depot',
      destinationName: CENTRAL_WAREHOUSE.name,
      currentLocation: fuelStart,
      heading: 310,
      speedKmph: 38,
      altitudeM: 1410,
      progressPercent: 10,
      activeRouteId: 'RT_FUEL_SAFE',
      availableRoutes: [fuelSafeRoute, fuelDangerRoute],
      fuelPercent: 94,
      status: 'IN_TRANSIT',
      pathIndex: 0,
      subProgress: 0.2
    },
    {
      id: 'TRK-AGRI-412',
      callsign: 'AGRI-COLD 12',
      driverName: 'B. Kharbangar',
      cargoType: 'ORGANIC_PRODUCE',
      cargoDescription: 'Perishable Cold-Chain Medicines & Agri Supplies',
      cargoWeightTons: 6.2,
      priority: 'NORMAL',
      originName: 'South Agri Cooperative Base',
      destinationName: CENTRAL_WAREHOUSE.name,
      currentLocation: agriStart,
      heading: 55,
      speedKmph: 35,
      altitudeM: 1610,
      progressPercent: 4,
      activeRouteId: 'RT_AGRI_SAFE',
      availableRoutes: [agriSafeRoute, agriDangerRoute],
      fuelPercent: 89,
      status: 'IN_TRANSIT',
      pathIndex: 0,
      subProgress: 0.1
    }
  ];
}

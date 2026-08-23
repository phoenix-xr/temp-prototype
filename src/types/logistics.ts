export type RiskLevel = 'SAFE' | 'MODERATE' | 'CRITICAL' | 'BLOCKED';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Waypoint extends LatLng {
  name?: string;
  elevation?: number;
}

export interface SpatialMicroPatch {
  id: string;
  sectorCode: string; // e.g. "SEC-ML-01", "SEC-US-04"
  name: string;
  subRegion: string;
  polygon: LatLng[];
  center: LatLng;
  areaSqKm: number;
  elevationMeanM: number;
  // Localized Environmental Telemetry (Independent per patch)
  precipitationMm: number; // Localized rainfall rate mm/h
  rain72hAccumulatedMm: number;
  soilSaturationPercent: number; // Localized pore-water pressure
  soilType: string;
  slopeGradientDeg: number; // Localized slope from DEM
  historicalFailureCount: number;
  computedLSI: number; // 0 - 100
  riskLevel: RiskLevel;
  sensorFeeds: {
    radarStation: string;
    inclinometerId: string;
    soilProbeId: string;
  };
}

export interface EnvironmentalSpot {
  id: string;
  name: string;
  type: 'PRECIPITATION' | 'POOR_SOIL' | 'STEEP_SLOPE' | 'HISTORICAL_LANDSLIDE';
  location: LatLng;
  radiusMeters: number;
  valueLabel: string;
  severityScore: number;
  description: string;
  color: string;
}

export interface HazardRiskDetail {
  id: string;
  title: string;
  locationName: string;
  coordinates: LatLng;
  roadName: string;
  riskScore: number;
  hazardType: 'LANDSLIDE_DISASTER' | 'UNSTABLE_SOIL_SLIP' | 'TORRENTIAL_WASHOUT' | 'STEEP_ROCKFALL';
  rainfallMm: number;
  soilSaturationPercent: number;
  slopeGradientDeg: number;
  historicalFailures: number;
  aiExplanation: string;
  impactOnLogistics: string;
  delayEstimateMin: number;
}

export type CargoType = 
  | 'CRITICAL_MEDICINE'
  | 'PDS_GRAINS'
  | 'PETROLEUM_LPG'
  | 'ORGANIC_PRODUCE'
  | 'DISASTER_RESCUE_EQUIPMENT';

export interface RouteOption {
  id: string;
  name: string;
  isSafeOptimal: boolean;
  description: string;
  totalDistanceKm: number;
  estimatedDurationMin: number;
  compositeRiskScore: number;
  dangerZonesCount: number;
  whyRejectedOrChosen: string;
  waypoints: Waypoint[];
  associatedHazard?: HazardRiskDetail;
}

export interface Vehicle {
  id: string;
  callsign: string;
  driverName: string;
  cargoType: CargoType;
  cargoDescription: string;
  cargoWeightTons: number;
  priority: 'EMERGENCY_ALPHA' | 'HIGH' | 'NORMAL';
  originName: string;
  destinationName: string;
  currentLocation: LatLng;
  heading: number;
  speedKmph: number;
  altitudeM: number;
  progressPercent: number;
  activeRouteId: string;
  availableRoutes: RouteOption[];
  fuelPercent: number;
  status: 'IN_TRANSIT' | 'REROUTING' | 'HALTED_HAZARD' | 'DELIVERED';
  pathIndex: number;
  subProgress: number;
}

export interface WarehouseLocation {
  id: string;
  name: string;
  location: LatLng;
  altitudeM: number;
  capacityTons: number;
  stockLevelPercent: number;
  description: string;
}

export interface SimulationState {
  isPlaying: boolean;
  simSpeed: number;
  selectedVehicleId: string | null;
  selectedHazardDetail: HazardRiskDetail | null;
  selectedPatch: SpatialMicroPatch | null;
  mapTileLayer: 'osm' | 'dark' | 'satellite' | 'terrain';
  activeDataLayers: {
    spatialMicroGrid: boolean; // Show localized micro-sectors
    precipitationSpots: boolean;
    soilQualitySpots: boolean;
    slopeGradientSpots: boolean;
    historicalLandslides: boolean;
  };
}

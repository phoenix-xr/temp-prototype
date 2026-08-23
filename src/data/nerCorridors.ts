import type { WarehouseLocation, EnvironmentalSpot, HazardRiskDetail, SpatialMicroPatch } from '../types/logistics';

// Central Hub & Destination Warehouse
export const CENTRAL_WAREHOUSE: WarehouseLocation = {
  id: 'WH_SHILLONG_CENTRAL',
  name: 'NER Strategic Disaster & Logistics Warehouse Hub',
  location: { lat: 25.5885, lng: 91.8950 },
  altitudeM: 1485,
  capacityTons: 1200,
  stockLevelPercent: 84,
  description: 'Primary Regional Stockpile: Emergency Medicines, PDS Rations, Cold-Chain Vaccines & Fuel Resupply'
};

// Map Center for tight, detailed city view
export const SHILLONG_CITY_CENTER: [number, number] = [25.5820, 91.8880];
export const DEFAULT_CITY_ZOOM = 13.2;

// Bounding Box of Shillong Spatial Domain
// Lat: 25.5250 to 25.6250 (4 rows of 0.025° ~ 2.7 km each)
// Lng: 91.8200 to 91.9400 (4 cols of 0.030° ~ 3.0 km each)
export function generateUniformSpatialGrid(): SpatialMicroPatch[] {
  const rows = 4; // Row A, B, C, D (North to South)
  const cols = 4; // Col 1, 2, 3, 4 (West to East)
  const latStart = 25.6250;
  const latStep = 0.0250;
  const lngStart = 91.8200;
  const lngStep = 0.0300;

  const rowLetters = ['A', 'B', 'C', 'D'];
  const gridCells: SpatialMicroPatch[] = [];

  // Pre-configured localized telemetry for each cell [row][col]
  const cellTelemetry: Record<string, {
    name: string;
    subRegion: string;
    rain: number;
    soil: number;
    slope: number;
    slides: number;
    lsi: number;
    risk: 'SAFE' | 'CRITICAL' | 'MODERATE';
    soilType: string;
  }> = {
    'A1': { name: 'North-West Mountain Ridgeline', subRegion: 'Umiam Escarpment', rain: 35, soil: 55, slope: 38, slides: 2, lsi: 42, risk: 'SAFE', soilType: 'Hard Granite & Sandstone' },
    'A2': { name: 'Mawlai Escarpment Storm Cell', subRegion: 'Mawlai North Chute', rain: 118, soil: 94, slope: 58, slides: 18, lsi: 96, risk: 'CRITICAL', soilType: 'Weathered Clay Overburden' },
    'A3': { name: 'Mawlai North Highway Sector', subRegion: 'NH-6 Modern Expressway', rain: 24, soil: 48, slope: 22, slides: 1, lsi: 26, risk: 'SAFE', soilType: 'Reinforced Asphalt & Concrete' },
    'A4': { name: 'North-East Ridge Sector', subRegion: 'Old Guwahati Pass', rain: 28, soil: 45, slope: 25, slides: 3, lsi: 30, risk: 'SAFE', soilType: 'Bedrock Scree' },

    'B1': { name: 'West Valley Farmland', subRegion: 'Shillong West Basin', rain: 30, soil: 50, slope: 18, slides: 0, lsi: 22, risk: 'SAFE', soilType: 'Alluvial Silty Loam' },
    'B2': { name: 'Lumparing 62° Shear Escarpment', subRegion: 'West Fault Crest', rain: 104, soil: 91, slope: 62, slides: 14, lsi: 93, risk: 'CRITICAL', soilType: 'Fractured Quartzite' },
    'B3': { name: 'Polo Ground Logistics Sector', subRegion: 'Central Warehouse Hub', rain: 16, soil: 38, slope: 12, slides: 0, lsi: 18, risk: 'SAFE', soilType: 'Engineered Valley Subgrade' },
    'B4': { name: 'Ganol Mountain Ravine', subRegion: 'Eastern Ridge Pass', rain: 92, soil: 88, slope: 54, slides: 11, lsi: 91, risk: 'CRITICAL', soilType: 'Unretained Siltstone' },

    'C1': { name: 'Elephant Falls South Sector', subRegion: 'South-West Highlands', rain: 42, soil: 58, slope: 34, slides: 4, lsi: 44, risk: 'SAFE', soilType: 'Porous Basalt' },
    'C2': { name: 'Barik Valley Saturated Mud Patch', subRegion: 'Barik Ravine Choke Point', rain: 85, soil: 92, slope: 46, slides: 9, lsi: 89, risk: 'CRITICAL', soilType: 'Expansive Black Clay' },
    'C3': { name: 'Police Bazar & Laitumkhrah Core', subRegion: 'City Center Arterial', rain: 22, soil: 44, slope: 18, slides: 1, lsi: 24, risk: 'SAFE', soilType: 'Paved Urban Retained Roads' },
    'C4': { name: 'Laitumkhrah East Ring Highway', subRegion: 'Eastern Safe Bypass', rain: 18, soil: 42, slope: 24, slides: 1, lsi: 22, risk: 'SAFE', soilType: 'Reinforced Viaduct Arterial' },

    'D1': { name: 'South Agri Cooperative Zone', subRegion: 'Mylliem Agricultural Basin', rain: 35, soil: 52, slope: 22, slides: 1, lsi: 28, risk: 'SAFE', soilType: 'Agricultural Terraced Silt' },
    'D2': { name: 'Upper Shillong Peak Ridge', subRegion: 'Upper Shillong Cantonment', rain: 38, soil: 52, slope: 28, slides: 3, lsi: 36, risk: 'SAFE', soilType: 'Military Reinforced Subgrade' },
    'D3': { name: 'Malki Forest Overburden', subRegion: 'South Malki Reserve', rain: 45, soil: 62, slope: 35, slides: 5, lsi: 48, risk: 'SAFE', soilType: 'Forested Weathered Loam' },
    'D4': { name: 'Shillong Peak South-East Pass', subRegion: 'Cherrapunji Access Highway', rain: 50, soil: 65, slope: 40, slides: 6, lsi: 52, risk: 'SAFE', soilType: 'Weathered Sandstone Slopes' },
  };

  for (let r = 0; r < rows; r++) {
    const latTop = latStart - (r * latStep);
    const latBottom = latTop - latStep;

    for (let c = 0; c < cols; c++) {
      const lngLeft = lngStart + (c * lngStep);
      const lngRight = lngLeft + lngStep;
      const code = `${rowLetters[r]}${c + 1}`;
      const meta = cellTelemetry[code] || {
        name: `Grid Cell ${code}`,
        subRegion: 'Sampling Zone',
        rain: 25,
        soil: 45,
        slope: 20,
        slides: 1,
        lsi: 25,
        risk: 'SAFE',
        soilType: 'Standard Subgrade'
      };

      gridCells.push({
        id: `GRID_${code}`,
        sectorCode: `CELL-${code}`,
        name: meta.name,
        subRegion: meta.subRegion,
        polygon: [
          { lat: latTop, lng: lngLeft },
          { lat: latTop, lng: lngRight },
          { lat: latBottom, lng: lngRight },
          { lat: latBottom, lng: lngLeft }
        ],
        center: {
          lat: Number(((latTop + latBottom) / 2).toFixed(6)),
          lng: Number(((lngLeft + lngRight) / 2).toFixed(6))
        },
        areaSqKm: 8.1,
        elevationMeanM: 1520,
        precipitationMm: meta.rain,
        rain72hAccumulatedMm: meta.rain * 3,
        soilSaturationPercent: meta.soil,
        soilType: meta.soilType,
        slopeGradientDeg: meta.slope,
        historicalFailureCount: meta.slides,
        computedLSI: meta.lsi,
        riskLevel: meta.risk,
        sensorFeeds: {
          radarStation: `IMD-SHL-RADAR-${code}`,
          inclinometerId: `GSI-INC-${code}`,
          soilProbeId: `ISRO-SM-${code}`
        }
      });
    }
  }

  return gridCells;
}

export const SHILLONG_MICRO_PATCHES: SpatialMicroPatch[] = generateUniformSpatialGrid();

// Environmental Spots (Radial gradient hotspots)
export const ENVIRONMENTAL_DATA_SPOTS: EnvironmentalSpot[] = [
  {
    id: 'RAIN_SPOT_1',
    name: 'Mawlai Escarpment Storm Core',
    type: 'PRECIPITATION',
    location: { lat: 25.6070, lng: 91.8660 },
    radiusMeters: 900,
    valueLabel: '118 mm/h (Localized Cloudburst)',
    severityScore: 96,
    description: 'Doppler Radar Cell: Localized convective storm cloud burst over Mawlai Escarpment.',
    color: '#06b6d4'
  },
  {
    id: 'SOIL_SPOT_1',
    name: 'Barik Valley Saturated Clay',
    type: 'POOR_SOIL',
    location: { lat: 25.5660, lng: 91.8750 },
    radiusMeters: 750,
    valueLabel: '92% Pore-Water Pressure',
    severityScore: 89,
    description: 'ISRO MOSDAC Satellite: Clay saturation exceeded plastic limit. Liquefaction danger.',
    color: '#f59e0b'
  },
  {
    id: 'SLOPE_SPOT_1',
    name: 'Lumparing High Shear Crest',
    type: 'STEEP_SLOPE',
    location: { lat: 25.5550, lng: 91.8570 },
    radiusMeters: 800,
    valueLabel: '62° Incline (DEM 30m)',
    severityScore: 93,
    description: 'Bhuvan CartoDEM: Vertical escarpment with zero retaining vegetation.',
    color: '#ec4899'
  },
  {
    id: 'HIST_SPOT_1',
    name: 'Ganol Mountain Scree History',
    type: 'HISTORICAL_LANDSLIDE',
    location: { lat: 25.5800, lng: 91.9220 },
    radiusMeters: 750,
    valueLabel: '14 Recorded Landslides',
    severityScore: 91,
    description: 'GSI National Landslide Inventory: Recurring seasonal boulder fall record.',
    color: '#ef4444'
  }
];

// Detailed Hazards for Clickable Red Paths
export const HAZARDS_CATALOG: Record<string, HazardRiskDetail> = {
  MAWLAI_LANDSLIDE: {
    id: 'HAZ_MAWLAI_01',
    title: 'Severe Landslide & Boulder Collapse Blockade',
    locationName: 'Mawlai Escarpment Mountain Pass (Grid Cell A2)',
    coordinates: { lat: 25.6035, lng: 91.8685 },
    roadName: 'Old Mawlai Hill Chute',
    riskScore: 96,
    hazardType: 'LANDSLIDE_DISASTER',
    rainfallMm: 118,
    soilSaturationPercent: 94,
    slopeGradientDeg: 58,
    historicalFailures: 18,
    aiExplanation: 'Grid Cell A2 experienced a localized convective cloudburst (118 mm/h). High pore-water pressure on a 58° slope caused shear failure and rockfall blockades.',
    impactOnLogistics: 'CRITICAL FAILURE: 100% road blockage. Catastrophic vehicle rollover danger avoided.',
    delayEstimateMin: 180
  },
  BARIK_SOIL_SLUMP: {
    id: 'HAZ_BARIK_02',
    title: 'Soil Liquefaction & Road Shoulder Collapse',
    locationName: 'Barik Ravine Valley (Grid Cell C2)',
    coordinates: { lat: 25.5670, lng: 91.8760 },
    roadName: 'Lower Barik Ravine Cut',
    riskScore: 89,
    hazardType: 'UNSTABLE_SOIL_SLIP',
    rainfallMm: 85,
    soilSaturationPercent: 92,
    slopeGradientDeg: 46,
    historicalFailures: 9,
    aiExplanation: 'Grid Cell C2 soil moisture reached 92% plastic saturation. Heavy grain trucks risk sinking into liquefied road shoulders.',
    impactOnLogistics: 'ROAD SUBSIDENCE: Impassable for heavy 18-ton logistics convoys.',
    delayEstimateMin: 95
  },
  GANOL_ROCKFALL: {
    id: 'HAZ_GANOL_03',
    title: 'Quartzite Scree & Cliff Detachment',
    locationName: 'Ganol Mountain Ravine (Grid Cell B4)',
    coordinates: { lat: 25.5810, lng: 91.9190 },
    roadName: 'East Ganol Mountain Cut',
    riskScore: 91,
    hazardType: 'STEEP_ROCKFALL',
    rainfallMm: 92,
    soilSaturationPercent: 88,
    slopeGradientDeg: 54,
    historicalFailures: 14,
    aiExplanation: 'Grid Cell B4 54° slope gradient combined with 92 mm/h rain triggers detachment of quartzite boulders. High risk for flammable fuel tankers.',
    impactOnLogistics: 'HIGH RISK: Unprotected 1-lane mountain cut with zero rock-shed shelters.',
    delayEstimateMin: 120
  },
  MYLLIEM_MUDFLOW: {
    id: 'HAZ_MYLLIEM_04',
    title: 'Torrential Mudflow & Traction Loss',
    locationName: 'Lumparing High Shear Crest (Grid Cell B2)',
    coordinates: { lat: 25.5560, lng: 91.8580 },
    roadName: 'Upper Lumparing Ridge Track',
    riskScore: 93,
    hazardType: 'TORRENTIAL_WASHOUT',
    rainfallMm: 104,
    soilSaturationPercent: 91,
    slopeGradientDeg: 62,
    historicalFailures: 14,
    aiExplanation: 'Grid Cell B2 62° incline experienced torrential washout. Extreme mudflow prevents heavy trucks from maintaining tire traction.',
    impactOnLogistics: 'TRACTION FAILURE: Logistics convoys slip backwards on unpaved 62° hairpin incline.',
    delayEstimateMin: 150
  }
};

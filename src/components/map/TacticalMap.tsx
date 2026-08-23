import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Polygon, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { Vehicle, SimulationState, HazardRiskDetail, EnvironmentalSpot, LatLng } from '../../types/logistics';
import { CENTRAL_WAREHOUSE, SHILLONG_CITY_CENTER, DEFAULT_CITY_ZOOM, ENVIRONMENTAL_DATA_SPOTS, SHILLONG_MICRO_PATCHES } from '../../data/nerCorridors';
import { createVehicleIcon } from './CustomVehicleIcon';

interface TacticalMapProps {
  vehicles: Vehicle[];
  simState: SimulationState;
  onSelectVehicle: (id: string | null) => void;
  onSelectHazard: (hazard: HazardRiskDetail) => void;
  isDeployModeActive?: boolean;
  onMapClickDeploy?: (coord: LatLng) => void;
}

// Custom Warehouse Icon
function createWarehouseIcon() {
  const html = `
    <div class="relative flex items-center justify-center cursor-pointer">
      <div class="w-10 h-10 rounded-xl bg-zinc-900 border border-emerald-500/60 shadow-md flex items-center justify-center text-white text-base">
        🏢
      </div>
      <div class="absolute -bottom-5 bg-zinc-950 text-[10px] font-mono font-medium text-emerald-400 px-2 py-0.5 rounded border border-zinc-800 whitespace-nowrap shadow-md">
        CENTRAL WAREHOUSE
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-warehouse-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
}

// Custom Hazard Marker Icon for Red Paths
function createHazardIcon() {
  const html = `
    <div class="relative flex items-center justify-center cursor-pointer">
      <div class="w-6 h-6 rounded-full bg-rose-600 border border-rose-400 text-white text-xs flex items-center justify-center shadow-md font-bold">
        ⚠️
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-hazard-pin',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
}

// Custom Radial Gradient Hotspot Icon
function createGradientHotspotIcon(spot: EnvironmentalSpot) {
  const size = Math.round(spot.radiusMeters / 4.2);
  const half = Math.round(size / 2);
  const gradId = `grad_${spot.id}`;

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group" style="width: ${size}px; height: ${size}px;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="absolute inset-0">
        <defs>
          <radialGradient id="${gradId}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stop-color="${spot.color}" stop-opacity="0.90" />
            <stop offset="25%" stop-color="${spot.color}" stop-opacity="0.65" />
            <stop offset="55%" stop-color="${spot.color}" stop-opacity="0.30" />
            <stop offset="80%" stop-color="${spot.color}" stop-opacity="0.10" />
            <stop offset="100%" stop-color="${spot.color}" stop-opacity="0.00" />
          </radialGradient>
        </defs>
        <circle cx="${half}" cy="${half}" r="${half - 2}" fill="url(#${gradId})" />
        <circle cx="${half}" cy="${half}" r="5" fill="${spot.color}" stroke="#18181b" stroke-width="1.5" />
      </svg>
      <div class="absolute -bottom-2 opacity-80 group-hover:opacity-100 transition-opacity bg-zinc-950 text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-200 shadow-md whitespace-nowrap">
        ${spot.valueLabel.split(' ')[0]} ${spot.valueLabel.split(' ')[1] || ''}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'radial-gradient-hotspot',
    iconSize: [size, size],
    iconAnchor: [half, half],
    popupAnchor: [0, -half]
  });
}

// Clean Grid Cell Corner Tag Icon
function createGridCellBadge(code: string, isCritical: boolean) {
  const bg = isCritical 
    ? 'bg-rose-950/90 border-rose-700 text-rose-300' 
    : 'bg-zinc-900/80 border-zinc-700 text-zinc-300';

  const html = `
    <div class="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold border shadow-sm whitespace-nowrap ${bg}">
      ${code}
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-grid-cell-badge',
    iconSize: [55, 18],
    iconAnchor: [27, 9]
  });
}

// Map Click Listener for Deploy Mode
function MapDeployClickListener({ isDeployModeActive, onMapClickDeploy }: { isDeployModeActive?: boolean; onMapClickDeploy?: (coord: LatLng) => void }) {
  useMapEvents({
    click(e) {
      if (isDeployModeActive && onMapClickDeploy) {
        onMapClickDeploy({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    }
  });
  return null;
}

// Sub-component to auto-pan when a vehicle is selected
function MapFollowSelected({ selectedVehicle }: { selectedVehicle: Vehicle | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (selectedVehicle) {
      map.flyTo(
        [selectedVehicle.currentLocation.lat, selectedVehicle.currentLocation.lng],
        Math.max(map.getZoom(), 14),
        { duration: 1.0 }
      );
    }
  }, [selectedVehicle?.id]);
  return null;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({
  vehicles,
  simState,
  onSelectVehicle,
  onSelectHazard,
  isDeployModeActive,
  onMapClickDeploy
}) => {
  const selectedVehicle = useMemo(() => {
    return vehicles.find(v => v.id === simState.selectedVehicleId) || vehicles[0];
  }, [vehicles, simState.selectedVehicleId]);

  // Tile provider URLs
  const tileUrls = {
    osm: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  };

  const attributions = {
    osm: '&copy; OpenStreetMap contributors',
    dark: '&copy; CARTO &copy; OpenStreetMap',
    satellite: 'Tiles &copy; Esri World Imagery',
    terrain: '&copy; OpenTopoMap'
  };

  // Filter active environmental data spots based on toggles
  const visibleSpots = useMemo(() => {
    return ENVIRONMENTAL_DATA_SPOTS.filter(spot => {
      if (spot.type === 'PRECIPITATION' && simState.activeDataLayers.precipitationSpots) return true;
      if (spot.type === 'POOR_SOIL' && simState.activeDataLayers.soilQualitySpots) return true;
      if (spot.type === 'STEEP_SLOPE' && simState.activeDataLayers.slopeGradientSpots) return true;
      if (spot.type === 'HISTORICAL_LANDSLIDE' && simState.activeDataLayers.historicalLandslides) return true;
      return false;
    });
  }, [simState.activeDataLayers]);

  return (
    <div className={`relative w-full h-full ${isDeployModeActive ? 'cursor-crosshair' : ''}`}>
      {/* Banner if Map Deploy Mode is Active */}
      {isDeployModeActive && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-cyan-950 text-cyan-200 border border-cyan-700 px-4 py-1.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-pulse">
          <span>📍 Click anywhere on the map to deploy convoy & compute AI route</span>
        </div>
      )}

      <MapContainer
        center={SHILLONG_CITY_CENTER}
        zoom={DEFAULT_CITY_ZOOM}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          url={tileUrls[simState.mapTileLayer]}
          attribution={attributions[simState.mapTileLayer]}
          maxZoom={18}
        />

        <MapFollowSelected selectedVehicle={selectedVehicle} />
        <MapDeployClickListener isDeployModeActive={isDeployModeActive} onMapClickDeploy={onMapClickDeploy} />

        {/* 0. Uniform Spatial Data Collection Grid */}
        {simState.activeDataLayers.spatialMicroGrid && SHILLONG_MICRO_PATCHES.map(patch => {
          const isCritical = patch.riskLevel === 'CRITICAL';
          const strokeColor = isCritical ? '#f43f5e' : '#52525b';
          const fillColor = isCritical ? '#f43f5e' : '#27272a';

          return (
            <React.Fragment key={patch.id}>
              <Polygon
                positions={patch.polygon.map(p => [p.lat, p.lng])}
                pathOptions={{
                  color: strokeColor,
                  weight: isCritical ? 1.5 : 1,
                  dashArray: '4, 4',
                  fillColor,
                  fillOpacity: isCritical ? 0.12 : 0.04
                }}
              >
                <Tooltip sticky>
                  <div className="p-3 bg-zinc-950 text-zinc-100 rounded-lg border border-zinc-800 shadow-xl min-w-[220px] font-sans">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-1.5">
                      <span className="text-[11px] font-mono font-bold text-zinc-200">{patch.sectorCode}</span>
                      <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${
                        isCritical ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}>
                        {isCritical ? 'CRITICAL RISK' : 'NORMAL'} ({patch.computedLSI}%)
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-100 mb-0.5">{patch.name}</div>
                    <div className="text-[10px] text-zinc-400 mb-2">{patch.subRegion} • 8.1 km² Grid Cell</div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-zinc-300 bg-zinc-900 p-2 rounded border border-zinc-800/80">
                      <div>Rain: <span className="text-cyan-300 font-semibold">{patch.precipitationMm} mm/h</span></div>
                      <div>DEM Slope: <span className="text-pink-300 font-semibold">{patch.slopeGradientDeg}°</span></div>
                      <div>Soil: <span className="text-amber-300 font-semibold">{patch.soilSaturationPercent}%</span></div>
                      <div>Slides: <span className="text-rose-300 font-semibold">{patch.historicalFailureCount}</span></div>
                    </div>
                  </div>
                </Tooltip>
              </Polygon>

              <Marker
                position={[patch.center.lat, patch.center.lng]}
                icon={createGridCellBadge(patch.sectorCode, isCritical)}
              />
            </React.Fragment>
          );
        })}

        {/* 1. Destination Central Warehouse Hub Marker */}
        <Marker
          position={[CENTRAL_WAREHOUSE.location.lat, CENTRAL_WAREHOUSE.location.lng]}
          icon={createWarehouseIcon()}
        >
          <Popup>
            <div className="p-3 max-w-[260px] font-sans">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1 mb-1.5">
                <span className="text-[10px] font-mono font-semibold text-emerald-400">DESTINATION WAREHOUSE</span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {CENTRAL_WAREHOUSE.stockLevelPercent}% CAPACITY
                </span>
              </div>
              <div className="font-semibold text-xs text-zinc-100 mb-1">{CENTRAL_WAREHOUSE.name}</div>
              <p className="text-xs text-zinc-400 leading-relaxed">{CENTRAL_WAREHOUSE.description}</p>
              <div className="mt-2 text-[11px] text-zinc-400 font-mono bg-zinc-900 p-1.5 rounded border border-zinc-800 flex justify-between">
                <span>Elevation: <strong className="text-zinc-200">{CENTRAL_WAREHOUSE.altitudeM}m</strong></span>
                <span>Capacity: <strong className="text-emerald-400">{CENTRAL_WAREHOUSE.capacityTons} T</strong></span>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* 2. Environmental Data Spots: Radial Gradient Hotspots */}
        {visibleSpots.map(spot => (
          <Marker
            key={spot.id}
            position={[spot.location.lat, spot.location.lng]}
            icon={createGradientHotspotIcon(spot)}
          >
            <Tooltip sticky>
              <div className="p-2.5 bg-zinc-950 text-zinc-100 rounded-lg border border-zinc-800 shadow-lg max-w-[220px] font-sans">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-1 mb-1">
                  <span className="text-[10px] font-mono font-semibold uppercase" style={{ color: spot.color }}>
                    {spot.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    Risk: {spot.severityScore}%
                  </span>
                </div>
                <div className="font-medium text-xs text-zinc-200 mb-0.5">{spot.name}</div>
                <div className="text-xs font-mono font-semibold mb-1" style={{ color: spot.color }}>
                  {spot.valueLabel}
                </div>
                <p className="text-[11px] text-zinc-400 leading-tight">{spot.description}</p>
              </div>
            </Tooltip>
          </Marker>
        ))}

        {/* 3. Vehicle Routes: GREEN for Safe Active, RED for Unsafe Alternatives (OSRM Snapped!) */}
        {vehicles.map(v => {
          const isSelected = simState.selectedVehicleId === v.id;
          const opacity = isSelected ? 1.0 : 0.5;

          return (
            <React.Fragment key={`routes-${v.id}`}>
              {v.availableRoutes.map(route => {
                const isGreen = route.isSafeOptimal;
                const strokeColor = isGreen ? '#10b981' : '#f43f5e';
                const weight = isSelected ? (isGreen ? 5 : 4) : 3;
                const dashArray = isGreen ? undefined : '6, 6';

                return (
                  <React.Fragment key={`rt-${v.id}-${route.id}`}>
                    <Polyline
                      positions={route.waypoints.map(w => [w.lat, w.lng])}
                      pathOptions={{
                        color: strokeColor,
                        weight,
                        opacity,
                        dashArray,
                        lineCap: 'round',
                        lineJoin: 'round'
                      }}
                      eventHandlers={{
                        click: () => {
                          if (!isGreen && route.associatedHazard) {
                            onSelectHazard(route.associatedHazard);
                          } else {
                            onSelectVehicle(v.id);
                          }
                        }
                      }}
                    >
                      <Tooltip sticky>
                        <div className="p-2.5 bg-zinc-950 text-zinc-100 rounded-lg border border-zinc-800 shadow-lg max-w-[240px] font-sans">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-1 mb-1">
                            <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                              isGreen ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}>
                              {isGreen ? 'SAFE CORRIDOR' : 'UNSAFE PATH'}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400">
                              {route.totalDistanceKm} km
                            </span>
                          </div>
                          <div className="font-medium text-xs text-zinc-200 mb-1">{route.name}</div>
                          <div className="text-[11px] text-zinc-400 mb-1">{route.whyRejectedOrChosen}</div>
                          {!isGreen && (
                            <div className="text-[10px] text-rose-300 font-semibold bg-rose-950/60 p-1 rounded border border-rose-800 text-center cursor-pointer">
                              Click to view Landslide Calculation
                            </div>
                          )}
                        </div>
                      </Tooltip>
                    </Polyline>

                    {/* Hazard Pin ONLY for Red Unsafe Route */}
                    {!isGreen && route.associatedHazard && (
                      <Marker
                        position={[route.associatedHazard.coordinates.lat, route.associatedHazard.coordinates.lng]}
                        icon={createHazardIcon()}
                        eventHandlers={{
                          click: () => {
                            if (route.associatedHazard) onSelectHazard(route.associatedHazard);
                          }
                        }}
                      >
                        <Tooltip direction="top">
                          <div className="p-1.5 bg-zinc-950 text-rose-300 text-xs font-semibold rounded border border-rose-900">
                            ⚠️ {route.associatedHazard.title} (Click to View)
                          </div>
                        </Tooltip>
                      </Marker>
                    )}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}

        {/* 4. Moving Uber-Style Fleet Vehicles (Only traversing Safe Green Paths!) */}
        {vehicles.map(vehicle => {
          const isSelected = simState.selectedVehicleId === vehicle.id;

          return (
            <Marker
              key={vehicle.id}
              position={[vehicle.currentLocation.lat, vehicle.currentLocation.lng]}
              icon={createVehicleIcon(vehicle.cargoType, vehicle.heading, isSelected, false)}
              eventHandlers={{
                click: () => onSelectVehicle(vehicle.id)
              }}
            >
              <Popup>
                <div className="p-3 min-w-[230px] font-sans">
                  <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-1 mb-1.5">
                    <span className="font-mono font-semibold text-zinc-200 text-xs">{vehicle.callsign}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      SAFE CORRIDOR
                    </span>
                  </div>

                  <div className="font-medium text-xs text-zinc-300">{vehicle.cargoDescription}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    {vehicle.originName.split(' ')[0]} → <span className="text-zinc-200 font-medium">Central Warehouse</span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px] bg-zinc-900 p-2 rounded border border-zinc-800 font-mono">
                    <div>Speed: <span className="text-zinc-200 font-semibold">{vehicle.speedKmph} km/h</span></div>
                    <div>Alt: <span className="text-zinc-200 font-semibold">{vehicle.altitudeM} m</span></div>
                    <div>Fuel: <span className="text-zinc-200">{vehicle.fuelPercent}%</span></div>
                    <div>Progress: <span className="text-emerald-400">{vehicle.progressPercent}%</span></div>
                  </div>

                  <button
                    onClick={() => onSelectVehicle(vehicle.id)}
                    className="w-full mt-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-md text-xs font-medium border border-zinc-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Inspect Safe vs Unsafe Routes</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

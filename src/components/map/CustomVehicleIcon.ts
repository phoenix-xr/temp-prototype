import L from 'leaflet';
import type { CargoType } from '../../types/logistics';

export function createVehicleIcon(cargoType: CargoType, heading: number, isSelected: boolean, isRerouted: boolean) {
  // Theme styling for Uber-style top-down vehicles
  let primaryColor = '#00f2fe';
  let accentColor = '#38bdf8';
  let cargoLabel = 'TRK';
  let vehicleType = 'truck'; // 'truck', 'ambulance', 'tanker', 'heavy'

  if (cargoType === 'CRITICAL_MEDICINE') {
    primaryColor = '#f43f5e';
    accentColor = '#fda4af';
    cargoLabel = 'MED';
    vehicleType = 'ambulance';
  } else if (cargoType === 'PDS_GRAINS') {
    primaryColor = '#10b981';
    accentColor = '#6ee7b7';
    cargoLabel = 'GRAIN';
    vehicleType = 'truck';
  } else if (cargoType === 'PETROLEUM_LPG') {
    primaryColor = '#f59e0b';
    accentColor = '#fde68a';
    cargoLabel = 'FUEL';
    vehicleType = 'tanker';
  } else if (cargoType === 'ORGANIC_PRODUCE') {
    primaryColor = '#06b6d4';
    accentColor = '#a5f3fc';
    cargoLabel = 'AGRI';
    vehicleType = 'truck';
  } else if (cargoType === 'DISASTER_RESCUE_EQUIPMENT') {
    primaryColor = '#a855f7';
    accentColor = '#d8b4fe';
    cargoLabel = 'NDRF';
    vehicleType = 'heavy';
  }

  // Uber-style realistic top-down SVG rendering
  let vehicleSvg = '';

  if (vehicleType === 'ambulance') {
    vehicleSvg = `
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.65));">
        <!-- Headlight Beams -->
        <polygon points="17,6 8,0 36,0 27,6" fill="rgba(254, 240, 138, 0.25)" />
        
        <!-- Vehicle Body (Top-down Ambulance) -->
        <rect x="14" y="6" width="16" height="30" rx="3.5" fill="#f8fafc" stroke="${primaryColor}" stroke-width="1.8"/>
        <!-- Front Windshield -->
        <path d="M16 11 Q22 8 28 11 L27 15 Q22 13 17 15 Z" fill="#0f172a"/>
        <!-- Red Medical Cross on Roof -->
        <rect x="20.5" y="19" width="3" height="9" rx="0.5" fill="#e11d48"/>
        <rect x="17.5" y="22" width="9" height="3" rx="0.5" fill="#e11d48"/>
        <!-- Emergency Flasher Beacon -->
        <circle cx="22" cy="13" r="1.8" fill="#38bdf8" class="animate-ping" style="transform-origin: 22px 13px;"/>
        <circle cx="22" cy="13" r="1.5" fill="#0284c7"/>
        <!-- Side mirrors -->
        <rect x="11.5" y="12" width="2.5" height="1.5" rx="0.5" fill="#cbd5e1"/>
        <rect x="30" y="12" width="2.5" height="1.5" rx="0.5" fill="#cbd5e1"/>
        <!-- Rear Bumper & Tail Lights -->
        <circle cx="15.5" cy="35" r="1" fill="#ef4444"/>
        <circle cx="28.5" cy="35" r="1" fill="#ef4444"/>
      </svg>
    `;
  } else if (vehicleType === 'tanker') {
    vehicleSvg = `
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.65));">
        <!-- Headlight Beams -->
        <polygon points="17,5 6,0 38,0 27,5" fill="rgba(254, 240, 138, 0.25)" />
        
        <!-- Cabin -->
        <rect x="14" y="5" width="16" height="9" rx="2.5" fill="#1e293b" stroke="${primaryColor}" stroke-width="1.5"/>
        <path d="M15.5 8 Q22 6 28.5 8 L28 11 Q22 9.5 16 11 Z" fill="#0284c7"/>
        
        <!-- Tanker Body (Cylindrical Top-Down) -->
        <rect x="13" y="15" width="18" height="23" rx="7" fill="#334155" stroke="${primaryColor}" stroke-width="1.8"/>
        <!-- Tank Hatch Domes -->
        <circle cx="22" cy="21" r="2.5" fill="${accentColor}" stroke="#0f172a" stroke-width="0.8"/>
        <circle cx="22" cy="30" r="2.5" fill="${accentColor}" stroke="#0f172a" stroke-width="0.8"/>
        <!-- Hazardous Fuel Stripes -->
        <line x1="16" y1="26" x2="28" y2="26" stroke="#f59e0b" stroke-width="2" stroke-dasharray="2,2"/>
        <!-- Side mirrors -->
        <rect x="11.5" y="9" width="2.5" height="1.5" rx="0.5" fill="#cbd5e1"/>
        <rect x="30" y="9" width="2.5" height="1.5" rx="0.5" fill="#cbd5e1"/>
      </svg>
    `;
  } else {
    // Heavy Logistics & Cargo Truck
    vehicleSvg = `
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.65));">
        <!-- Headlight Beams -->
        <polygon points="17,5 6,0 38,0 27,5" fill="rgba(254, 240, 138, 0.25)" />
        
        <!-- Front Cabin -->
        <rect x="14" y="5" width="16" height="10" rx="3" fill="#1e293b" stroke="${primaryColor}" stroke-width="1.5"/>
        <!-- Windshield -->
        <path d="M15.5 8.5 Q22 6.5 28.5 8.5 L28 12 Q22 10 16 12 Z" fill="#38bdf8" fill-opacity="0.8"/>
        
        <!-- Cargo Container Bed -->
        <rect x="13" y="16" width="18" height="22" rx="2" fill="#0f172a" stroke="${primaryColor}" stroke-width="1.8"/>
        <!-- Container Rib Lines -->
        <line x1="15" y1="20" x2="29" y2="20" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
        <line x1="15" y1="24" x2="29" y2="24" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
        <line x1="15" y1="28" x2="29" y2="28" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
        <line x1="15" y1="32" x2="29" y2="32" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
        
        <!-- Cargo Accent Band -->
        <rect x="15" y="25" width="14" height="6" rx="1" fill="${primaryColor}" fill-opacity="0.35"/>
        
        <!-- Side mirrors -->
        <rect x="11.5" y="9" width="2.5" height="1.5" rx="0.5" fill="#cbd5e1"/>
        <rect x="30" y="9" width="2.5" height="1.5" rx="0.5" fill="#cbd5e1"/>
        <!-- Tail lights -->
        <circle cx="15.5" cy="37.5" r="1.2" fill="#ef4444"/>
        <circle cx="28.5" cy="37.5" r="1.2" fill="#ef4444"/>
      </svg>
    `;
  }

  const selectionGlow = isSelected 
    ? `<div class="absolute -inset-1 rounded-full bg-cyan-400/40 animate-ping"></div><div class="absolute -inset-2 rounded-full border-2 border-cyan-300 shadow-glow-cyan"></div>` 
    : '';

  const rerouteBadge = isRerouted
    ? `<span class="absolute -top-2 -right-2 flex h-4 w-4 z-30"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span class="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[8px] font-bold text-slate-950 items-center justify-center">!</span></span>`
    : '';

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group">
      ${selectionGlow}
      ${rerouteBadge}
      
      <!-- Uber-style Rotating Vehicle -->
      <div style="transform: rotate(${heading}deg); transform-origin: 22px 22px; transition: transform 0.4s ease-out;" class="w-[44px] h-[44px] flex items-center justify-center">
        ${vehicleSvg}
      </div>

      <!-- Callsign Pill -->
      <div class="absolute -bottom-4 z-20 bg-slate-950/90 text-[9px] font-mono font-bold text-slate-200 px-1.5 py-0.5 rounded border border-white/20 whitespace-nowrap shadow-xl flex items-center gap-1 group-hover:border-cyan-400 group-hover:text-cyan-300">
        <span class="w-1.5 h-1.5 rounded-full" style="background: ${primaryColor};"></span>
        <span>${cargoLabel}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'uber-vehicle-marker',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
}

export function createIncidentIcon(type: string, _severity: string) {
  let bg = 'bg-rose-600';
  let icon = '⛰️';

  if (type === 'LANDSLIDE') icon = '⛰️';
  else if (type === 'MUDSLIDE') icon = '🌊';
  else if (type === 'FLASH_FLOOD') icon = '🌧️';

  const html = `
    <div class="relative flex items-center justify-center">
      <span class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-rose-500 opacity-40"></span>
      <div class="relative w-8 h-8 rounded-full ${bg} flex items-center justify-center border-2 border-white text-xs shadow-2xl cursor-pointer">
        ${icon}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-incident-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
}

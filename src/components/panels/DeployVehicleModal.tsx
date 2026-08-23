import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  MapPin, 
  Navigation, 
  Sparkles, 
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import type { CargoType, LatLng } from '../../types/logistics';
import { CENTRAL_WAREHOUSE } from '../../data/nerCorridors';

interface DeployVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (startCoord: LatLng, cargoType: CargoType, callsign: string) => Promise<void>;
  isDeployModeActive: boolean;
  onToggleMapDeployMode: (active: boolean) => void;
}

const PRESET_SPAWN_POINTS: { name: string; coord: LatLng; tag: string }[] = [
  { name: 'Umiam Lake Northern Checkpost', coord: { lat: 25.6450, lng: 91.8980 }, tag: 'NH-6 North' },
  { name: 'Mawngap High Mountain Junction', coord: { lat: 25.5380, lng: 91.7950 }, tag: 'South-West Ridge' },
  { name: 'Laitkor Peak Radar Station', coord: { lat: 25.5420, lng: 91.9350 }, tag: 'Eastern Heights' },
  { name: 'Happy Valley Military Depot', coord: { lat: 25.5720, lng: 91.9420 }, tag: 'East Ring Road' }
];

export const DeployVehicleModal: React.FC<DeployVehicleModalProps> = ({
  isOpen,
  onClose,
  onDeploy,
  isDeployModeActive,
  onToggleMapDeployMode
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [cargoType, setCargoType] = useState<CargoType>('DISASTER_RESCUE_EQUIPMENT');
  const [callsign, setCallsign] = useState<string>('NDRF-DELTA 05');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDeployPreset = async () => {
    setIsCalculating(true);
    const chosen = PRESET_SPAWN_POINTS[selectedPreset].coord;
    await onDeploy(chosen, cargoType, callsign);
    setIsCalculating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="relative w-full max-w-lg bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200">
              <Truck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">
                Deploy New Convoy & Calculate AI Route
              </h2>
              <p className="text-xs text-zinc-400">
                Dynamic OSRM Road Snapping & Geotechnical Risk Sampling
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors border border-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Destination Notice */}
          <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-300">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Target Destination: <strong>{CENTRAL_WAREHOUSE.name}</strong></span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              SAFE DEPOT
            </span>
          </div>

          {/* Spawn Option 1: Map Click Mode */}
          <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Option 1: Click Anywhere on Map
              </span>
              <button
                onClick={() => {
                  onToggleMapDeployMode(!isDeployModeActive);
                  onClose();
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors border ${
                  isDeployModeActive
                    ? 'bg-cyan-950 border-cyan-700 text-cyan-200'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                }`}
              >
                {isDeployModeActive ? 'Cancel Map Click' : 'Enable Map Click Crosshair'}
              </button>
            </div>
            <p className="text-zinc-400 text-[11px]">
              Enable map-click mode to drop a vehicle at any custom coordinates on the mountain road network.
            </p>
          </div>

          {/* Spawn Option 2: Preset Gateways */}
          <div className="space-y-2">
            <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-zinc-400" />
              Option 2: Select Regional Staging Base
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_SPAWN_POINTS.map((preset, idx) => (
                <button
                  key={preset.name}
                  onClick={() => setSelectedPreset(idx)}
                  className={`p-2.5 rounded-lg border text-left transition-colors flex flex-col justify-between ${
                    selectedPreset === idx
                      ? 'bg-zinc-900 border-emerald-600 shadow-sm'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                  }`}
                >
                  <div className="font-medium text-zinc-200 text-[11px]">{preset.name}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-1">{preset.tag}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cargo Type & Callsign */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Cargo Type</label>
              <select
                value={cargoType}
                onChange={(e) => setCargoType(e.target.value as CargoType)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono"
              >
                <option value="DISASTER_RESCUE_EQUIPMENT">🏗️ NDRF Rescue Machinery</option>
                <option value="CRITICAL_MEDICINE">🚑 Emergency Blood & Oxygen</option>
                <option value="PDS_GRAINS">🌾 PDS Food Grain Buffer</option>
                <option value="PETROLEUM_LPG">⛽ Generator Diesel Resupply</option>
                <option value="ORGANIC_PRODUCE">🚜 Perishable Cold Storage</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Unit Callsign</label>
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>
          </div>

          {/* AI Explain note */}
          <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>The algorithm will instantly query OSRM road geometry, sample 4x4 spatial hazard cells, and plot the optimal safe corridor.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-zinc-400 hover:text-zinc-200 text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDeployPreset}
            disabled={isCalculating}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {isCalculating ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Calculating Route...</span>
              </>
            ) : (
              <>
                <span>Calculate AI Route & Deploy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

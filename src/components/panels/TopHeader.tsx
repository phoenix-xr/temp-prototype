import React from 'react';
import { 
  Building2, 
  Radio, 
  Activity, 
  Sparkles,
  PlusCircle
} from 'lucide-react';
import type { SimulationState } from '../../types/logistics';

interface TopHeaderProps {
  simState: SimulationState;
  onToggleTileLayer: (layer: 'osm' | 'dark' | 'satellite' | 'terrain') => void;
  onToggleExplainModal: () => void;
  onOpenDeployModal: () => void;
  activeVehiclesCount: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  simState,
  onToggleTileLayer,
  onToggleExplainModal,
  onOpenDeployModal,
  activeVehiclesCount
}) => {
  return (
    <header className="relative z-20 w-full shadcn-panel border-b border-zinc-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 font-sans">
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100">
          <Radio className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight text-zinc-100 font-sans">
              NER-LOGIX <span className="text-zinc-400 font-normal">| Shillong Logistics Hub</span>
            </h1>
            <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              AI SAFE DISPATCH
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-normal">
            Predictive Landslide Risk & Safe Corridors to Regional Supply Warehouse
          </p>
        </div>
      </div>

      {/* Live Destination & Convoy Tickers */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-[10px] text-zinc-500 font-mono">DESTINATION HUB</div>
            <div className="text-xs font-medium text-zinc-200">Central Warehouse (Polo Link)</div>
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
          <Activity className="w-4 h-4 text-zinc-400" />
          <div>
            <div className="text-[10px] text-zinc-500 font-mono">ACTIVE FLEET</div>
            <div className="text-xs font-medium text-zinc-200">{activeVehiclesCount} Convoys En-Route</div>
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-1.5 flex items-center gap-2 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-zinc-300 font-semibold">Green:</span>
          <span className="text-zinc-400">Safe Path</span>
          <span className="text-zinc-600 mx-0.5">|</span>
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span className="text-zinc-300 font-semibold">Red:</span>
          <span className="text-zinc-400">Unsafe Path</span>
        </div>
      </div>

      {/* Controls & Layer Switches */}
      <div className="flex items-center gap-2">
        {/* Deploy Vehicle Button */}
        <button
          onClick={onOpenDeployModal}
          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          title="Deploy a custom vehicle anywhere on the map"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Deploy Convoy</span>
        </button>

        {/* AI Explainability Button */}
        <button
          onClick={onToggleExplainModal}
          className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded-lg text-xs font-medium border border-zinc-800 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden sm:inline">AI Model</span>
        </button>

        {/* Map Tile Layer Selector */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          <button
            onClick={() => onToggleTileLayer('osm')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              simState.mapTileLayer === 'osm' ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="OpenStreetMap Street View"
          >
            OSM
          </button>
          <button
            onClick={() => onToggleTileLayer('dark')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              simState.mapTileLayer === 'dark' ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Dark Tactical View"
          >
            Dark
          </button>
          <button
            onClick={() => onToggleTileLayer('satellite')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              simState.mapTileLayer === 'satellite' ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Satellite Imagery"
          >
            Sat
          </button>
          <button
            onClick={() => onToggleTileLayer('terrain')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              simState.mapTileLayer === 'terrain' ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Topographical Elevation"
          >
            Topo
          </button>
        </div>
      </div>
    </header>
  );
};

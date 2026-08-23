import React from 'react';
import { CloudRain, Droplets, Mountain, History, Grid, Layers, Route } from 'lucide-react';
import type { SimulationState } from '../../types/logistics';

interface DataLayerTogglesProps {
  activeDataLayers: SimulationState['activeDataLayers'];
  onToggleLayer: (layerKey: keyof SimulationState['activeDataLayers']) => void;
}

export const DataLayerToggles: React.FC<DataLayerTogglesProps> = ({
  activeDataLayers,
  onToggleLayer
}) => {
  return (
    <div className="absolute top-20 right-4 z-20 shadcn-panel rounded-xl p-3 shadow-lg border border-zinc-800 flex flex-col gap-2 w-64">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800 px-1">
        <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5 font-sans">
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          Spatial & Road Layers
        </span>
        <span className="text-[10px] text-zinc-500 font-mono">GIS FILTERS</span>
      </div>

      {/* 0. Road Accessibility Network (Safe / Moderate / Blocked) */}
      <button
        onClick={() => onToggleLayer('roadAccessibilityNetwork')}
        className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors border ${
          activeDataLayers.roadAccessibilityNetwork
            ? 'bg-zinc-800 border-emerald-500/50 text-emerald-200 shadow-sm'
            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
        }`}
      >
        <span className="flex items-center gap-2">
          <Route className="w-3.5 h-3.5 text-emerald-400" />
          <span>Road Accessibility Network</span>
        </span>
        <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
          activeDataLayers.roadAccessibilityNetwork ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-zinc-500 bg-zinc-900'
        }`}>
          {activeDataLayers.roadAccessibilityNetwork ? 'ON' : 'OFF'}
        </span>
      </button>

      {/* 1. Spatial Data Collection Grid */}
      <button
        onClick={() => onToggleLayer('spatialMicroGrid')}
        className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors border ${
          activeDataLayers.spatialMicroGrid
            ? 'bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm'
            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
        }`}
      >
        <span className="flex items-center gap-2">
          <Grid className="w-3.5 h-3.5 text-zinc-300" />
          <span>Data Collection Grid</span>
        </span>
        <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
          activeDataLayers.spatialMicroGrid ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 bg-zinc-900'
        }`}>
          {activeDataLayers.spatialMicroGrid ? 'ON' : 'OFF'}
        </span>
      </button>

      {/* 2. Precipitation Storm Cells */}
      <button
        onClick={() => onToggleLayer('precipitationSpots')}
        className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors border ${
          activeDataLayers.precipitationSpots
            ? 'bg-zinc-800 border-cyan-500/40 text-cyan-200 shadow-sm'
            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
        }`}
      >
        <span className="flex items-center gap-2">
          <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
          <span>Precipitation Cells</span>
        </span>
        <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
          activeDataLayers.precipitationSpots ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'text-zinc-500 bg-zinc-900'
        }`}>
          {activeDataLayers.precipitationSpots ? 'ON' : 'OFF'}
        </span>
      </button>

      {/* 3. Soil Moisture */}
      <button
        onClick={() => onToggleLayer('soilQualitySpots')}
        className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors border ${
          activeDataLayers.soilQualitySpots
            ? 'bg-zinc-800 border-amber-500/40 text-amber-200 shadow-sm'
            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
        }`}
      >
        <span className="flex items-center gap-2">
          <Droplets className="w-3.5 h-3.5 text-amber-400" />
          <span>Soil Pore Saturation</span>
        </span>
        <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
          activeDataLayers.soilQualitySpots ? 'bg-amber-950 text-amber-300 border border-amber-500/30' : 'text-zinc-500 bg-zinc-900'
        }`}>
          {activeDataLayers.soilQualitySpots ? 'ON' : 'OFF'}
        </span>
      </button>

      {/* 4. Steep Slope Gradient */}
      <button
        onClick={() => onToggleLayer('slopeGradientSpots')}
        className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors border ${
          activeDataLayers.slopeGradientSpots
            ? 'bg-zinc-800 border-pink-500/40 text-pink-200 shadow-sm'
            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
        }`}
      >
        <span className="flex items-center gap-2">
          <Mountain className="w-3.5 h-3.5 text-pink-400" />
          <span>Steep Slope DEMs</span>
        </span>
        <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
          activeDataLayers.slopeGradientSpots ? 'bg-pink-950 text-pink-300 border border-pink-500/30' : 'text-zinc-500 bg-zinc-900'
        }`}>
          {activeDataLayers.slopeGradientSpots ? 'ON' : 'OFF'}
        </span>
      </button>

      {/* 5. Historical Landslide Records */}
      <button
        onClick={() => onToggleLayer('historicalLandslides')}
        className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors border ${
          activeDataLayers.historicalLandslides
            ? 'bg-zinc-800 border-rose-500/40 text-rose-200 shadow-sm'
            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
        }`}
      >
        <span className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-rose-400" />
          <span>Historical Slide Log</span>
        </span>
        <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
          activeDataLayers.historicalLandslides ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'text-zinc-500 bg-zinc-900'
        }`}>
          {activeDataLayers.historicalLandslides ? 'ON' : 'OFF'}
        </span>
      </button>
    </div>
  );
};

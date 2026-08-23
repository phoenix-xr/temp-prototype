import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Gauge,
  Building2
} from 'lucide-react';
import type { SimulationState } from '../../types/logistics';

interface SimulatorControlBarProps {
  simState: SimulationState;
  onTogglePlay: () => void;
  onChangeSimSpeed: (speed: number) => void;
  onResetSimulation: () => void;
}

export const SimulatorControlBar: React.FC<SimulatorControlBarProps> = ({
  simState,
  onTogglePlay,
  onChangeSimSpeed,
  onResetSimulation
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 shadcn-panel rounded-xl p-2 shadow-lg border border-zinc-800 font-sans">
      <div className="flex items-center gap-2.5">
        {/* Play / Pause */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={onTogglePlay}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors text-xs ${
              simState.isPlaying 
                ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
            }`}
            title={simState.isPlaying ? 'Pause Fleet Movement' : 'Resume Fleet Movement'}
          >
            {simState.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{simState.isPlaying ? 'PAUSE' : 'START'}</span>
          </button>

          <button
            onClick={onResetSimulation}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Reset All Vehicles to Origin Bases"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Multiplier */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-lg gap-0.5">
          <Gauge className="w-3.5 h-3.5 text-zinc-500 ml-1.5 mr-1 hidden sm:block" />
          {[1, 2, 5].map(spd => (
            <button
              key={spd}
              onClick={() => onChangeSimSpeed(spd)}
              className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                simState.simSpeed === spd
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Destination Info */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-sans">
          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Destination: <strong className="text-zinc-100 font-medium">Central Warehouse</strong></span>
        </div>
      </div>
    </div>
  );
};

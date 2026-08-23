import React from 'react';
import { 
  X, 
  AlertTriangle, 
  CloudRain, 
  Droplets, 
  Mountain, 
  History, 
  MapPin, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import type { HazardRiskDetail } from '../../types/logistics';

interface RiskSpotModalProps {
  hazard: HazardRiskDetail | null;
  onClose: () => void;
}

export const RiskSpotModal: React.FC<RiskSpotModalProps> = ({ hazard, onClose }) => {
  if (!hazard) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="relative w-full max-w-xl bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 uppercase tracking-wider">
                  UNSAFE ROUTE RISK DETECTED
                </span>
                <span className="text-xs font-mono font-medium text-rose-400">
                  Risk Score: {hazard.riskScore}%
                </span>
              </div>
              <h2 className="text-sm font-semibold text-zinc-100 leading-snug">
                {hazard.title}
              </h2>
              <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="font-medium text-zinc-300">{hazard.roadName}</span>
                <span className="text-zinc-500">({hazard.locationName})</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors border border-zinc-800 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Multi-Factor Environmental Data Grid */}
          <div>
            <div className="text-[11px] font-medium text-zinc-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              Environmental Telemetry Triggering Hazard Calculation
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Rain */}
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-zinc-950 text-cyan-400 shrink-0 border border-zinc-800">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Precipitation</div>
                  <div className="text-sm font-mono font-semibold text-cyan-300">
                    {hazard.rainfallMm} <span className="text-[10px] font-normal text-zinc-500">mm/h</span>
                  </div>
                  <div className="text-[10px] text-rose-400 mt-0.5">Torrential Runoff</div>
                </div>
              </div>

              {/* Soil */}
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-zinc-950 text-amber-400 shrink-0 border border-zinc-800">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Soil Saturation</div>
                  <div className="text-sm font-mono font-semibold text-amber-300">
                    {hazard.soilSaturationPercent}%
                  </div>
                  <div className="text-[10px] text-rose-400 mt-0.5">Pore Pressure Critical</div>
                </div>
              </div>

              {/* Slope */}
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-zinc-950 text-pink-400 shrink-0 border border-zinc-800">
                  <Mountain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Slope Gradient</div>
                  <div className="text-sm font-mono font-semibold text-pink-300">
                    {hazard.slopeGradientDeg}° Incline
                  </div>
                  <div className="text-[10px] text-rose-400 mt-0.5">High Shear Angle</div>
                </div>
              </div>

              {/* Historical */}
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-zinc-950 text-purple-400 shrink-0 border border-zinc-800">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Past Slide Events</div>
                  <div className="text-sm font-mono font-semibold text-purple-300">
                    {hazard.historicalFailures} Landslides
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">GSI Inventory</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Decision Explainability Box */}
          <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5">
            <div className="font-mono text-zinc-200 font-semibold text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              AI Routing Safety Engine Recommendation
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              {hazard.aiExplanation}
            </p>
          </div>

          {/* Logistics Impact & Travel Delay */}
          <div className="p-3 rounded-lg bg-zinc-900 border border-rose-900/60 flex items-start justify-between gap-3 text-zinc-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-xs text-rose-300">
                  Estimated Logistics Impact
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  {hazard.impactOnLogistics}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800 font-mono">
              <div className="text-[9px] uppercase text-zinc-500">Delay Avoided</div>
              <div className="text-xs font-semibold text-rose-400">+{hazard.delayEstimateMin} mins</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 font-mono">
            GPS: {hazard.coordinates.lat.toFixed(4)}° N, {hazard.coordinates.lng.toFixed(4)}° E
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-md text-xs font-medium transition-colors border border-zinc-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

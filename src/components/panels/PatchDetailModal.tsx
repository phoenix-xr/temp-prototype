import React from 'react';
import { 
  X, 
  CloudRain, 
  Droplets, 
  Mountain, 
  History, 
  Radio, 
  MapPin, 
  Cpu, 
  Layers, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import type { SpatialMicroPatch } from '../../types/logistics';

interface PatchDetailModalProps {
  patch: SpatialMicroPatch | null;
  onClose: () => void;
}

export const PatchDetailModal: React.FC<PatchDetailModalProps> = ({ patch, onClose }) => {
  if (!patch) return null;

  const isCritical = patch.riskLevel === 'CRITICAL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-xl glass-panel-glow rounded-2xl overflow-hidden border-2 shadow-2xl flex flex-col max-h-[90vh] ${
        isCritical ? 'border-rose-500/70 shadow-glow-rose' : 'border-emerald-500/70 shadow-glow-emerald'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-start justify-between gap-3 ${
          isCritical ? 'bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 border-rose-500/30' : 'bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-emerald-500/30'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
              isCritical ? 'bg-rose-900/80 border-rose-400 text-rose-200' : 'bg-emerald-900/80 border-emerald-400 text-emerald-200'
            }`}>
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  isCritical ? 'bg-rose-600 text-white shadow' : 'bg-emerald-600 text-white shadow'
                }`}>
                  {patch.sectorCode}
                </span>
                <span className={`text-xs font-mono font-bold ${isCritical ? 'text-rose-300' : 'text-emerald-300'}`}>
                  Computed LSI Risk: {patch.computedLSI}% ({patch.riskLevel})
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white leading-snug font-sans">
                {patch.name}
              </h2>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{patch.subRegion} • Area: {patch.areaSqKm} km² • Alt: {patch.elevationMeanM}m MSL</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-white/10 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Grid */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <div className="text-[11px] font-mono uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Localized Spatial Micro-Climate & Geological Sensors
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Rain */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 shrink-0">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Precipitation (Patch)</div>
                  <div className="text-sm font-mono font-bold text-cyan-300">
                    {patch.precipitationMm} <span className="text-[10px] font-normal text-slate-400">mm/h</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">72h Accum: {patch.rain72hAccumulatedMm} mm</div>
                </div>
              </div>

              {/* Soil Saturation */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-950 text-amber-400 shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Soil Pore Saturation</div>
                  <div className="text-sm font-mono font-bold text-amber-300">
                    {patch.soilSaturationPercent}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[130px]">{patch.soilType}</div>
                </div>
              </div>

              {/* Slope */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-pink-500/30 flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-pink-950 text-pink-400 shrink-0">
                  <Mountain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">DEM Slope Gradient</div>
                  <div className="text-sm font-mono font-bold text-pink-300">
                    {patch.slopeGradientDeg}° Incline
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">ISRO CartoDEM 30m</div>
                </div>
              </div>

              {/* Historical */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/30 flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-purple-950 text-purple-400 shrink-0">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Past Slide Events</div>
                  <div className="text-sm font-mono font-bold text-purple-300">
                    {patch.historicalFailureCount} Landslides
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">GSI Inventory Log</div>
                </div>
              </div>
            </div>
          </div>

          {/* IoT Telemetry Nodes */}
          <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
            <div className="text-[11px] font-mono text-cyan-300 font-bold uppercase mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              Connected Ground IoT Telemetry Nodes
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300">
              <div className="bg-slate-950 p-2 rounded border border-white/5">
                <div className="text-[9px] text-slate-400">Doppler Radar</div>
                <div className="text-cyan-300 truncate">{patch.sensorFeeds.radarStation}</div>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-white/5">
                <div className="text-[9px] text-slate-400">Inclinometer</div>
                <div className="text-pink-300 truncate">{patch.sensorFeeds.inclinometerId}</div>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-white/5">
                <div className="text-[9px] text-slate-400">Soil Probe</div>
                <div className="text-amber-300 truncate">{patch.sensorFeeds.soilProbeId}</div>
              </div>
            </div>
          </div>

          {/* AI Road Impact */}
          <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
            isCritical ? 'bg-rose-950/70 border-rose-500/40 text-rose-200' : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
          }`}>
            {isCritical ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-xs font-mono uppercase">
                {isCritical ? 'AI ACTION: High-Risk Sector Avoided by Convoy Routing' : 'AI ACTION: All-Weather Safe Transit Corridor Verified'}
              </div>
              <p className="text-xs mt-0.5 leading-relaxed text-slate-300">
                {isCritical 
                  ? `Due to localized ${patch.precipitationMm} mm/h rainfall and ${patch.soilSaturationPercent}% soil moisture, road segments traversing ${patch.name} have been flagged RED and rejected.`
                  : `Micro-sector ${patch.name} exhibits low slope gradient (${patch.slopeGradientDeg}°) and stable subgrade. Optimal for heavy logistics trucks.`}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-white/10 bg-slate-950/90 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Sector Center: {patch.center.lat.toFixed(4)}° N, {patch.center.lng.toFixed(4)}° E
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all border border-white/10"
          >
            Close Patch View
          </button>
        </div>
      </div>
    </div>
  );
};

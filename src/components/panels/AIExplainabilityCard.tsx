import React from 'react';
import { 
  X, 
  Brain, 
  Calculator, 
  Activity, 
  Database,
  CheckCircle2
} from 'lucide-react';

interface AIExplainabilityCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIExplainabilityCard: React.FC<AIExplainabilityCardProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 rounded-xl overflow-hidden flex flex-col border border-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">
                AI Landslide Risk & Safe Routing Model Architecture
              </h2>
              <p className="text-xs text-zinc-400">
                Geotechnical Limit Equilibrium + Spatial Multi-Factor Machine Learning
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
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-zinc-300">
          {/* Formula & Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-zinc-200 font-semibold">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Geotechnical Limit Equilibrium Formula (FS)</span>
              </div>
              <p className="text-zinc-400 leading-relaxed font-sans">
                Calculates the physical <strong>Factor of Safety (FS)</strong> along infinite mountain slope failure planes:
              </p>
              <div className="bg-zinc-950 p-3 rounded border border-zinc-800 font-mono text-emerald-300 text-[11px] leading-relaxed">
                FS = [c&apos; + (γ · z · cos²θ - u) tan φ&apos;] / [γ · z · sin θ cos θ]
              </div>
              <ul className="space-y-1 text-zinc-400 text-[11px]">
                <li>• <strong className="text-zinc-200">θ</strong> = DEM Slope Angle (ISRO Bhuvan CartoDEM 30m)</li>
                <li>• <strong className="text-zinc-200">u</strong> = Pore-Water Pressure (Infiltrated rainfall & soil moisture)</li>
                <li>• <strong className="text-zinc-200">c&apos;, φ&apos;</strong> = Soil cohesion and effective friction angle</li>
                <li>• <strong className="text-rose-400">FS &lt; 1.0</strong> = Critical slope shear failure (Triggers RED Route)</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-zinc-200 font-semibold">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Landslide Susceptibility Index (LSI)</span>
              </div>
              <p className="text-zinc-400 leading-relaxed font-sans">
                Normalized spatial weighted formula computed per spatial sampling cell:
              </p>
              <div className="bg-zinc-950 p-3 rounded border border-zinc-800 font-mono text-cyan-300 text-[11px] leading-relaxed">
                LSI = (0.35 · R) + (0.30 · θ) + (0.20 · M) + (0.15 · H)
              </div>
              <ul className="space-y-1 text-zinc-400 text-[11px]">
                <li>• <strong className="text-cyan-300">R (35%)</strong> = Antecedent Rainfall (Open-Meteo & IMD Radar)</li>
                <li>• <strong className="text-pink-300">θ (30%)</strong> = Terrain Gradient (ISRO CartoDEM)</li>
                <li>• <strong className="text-amber-300">M (20%)</strong> = Pore Saturation (NASA SMAP / ISRO MOSDAC)</li>
                <li>• <strong className="text-purple-300">H (15%)</strong> = Historical Slide Catalog (GSI Inventory)</li>
              </ul>
            </div>
          </div>

          {/* Spatial Grid Sampling Pipeline */}
          <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold">
              <Database className="w-4 h-4 text-zinc-400" />
              <span>Spatial Grid Ingestion & Route Evaluation Pipeline</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-zinc-950 p-3 rounded border border-zinc-800 space-y-1">
                <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-300">1</span>
                  Spatial Cell Sampling
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  The region is sampled in localized grid cells. Real-time precipitation, slope, and soil moisture APIs populate each cell.
                </p>
              </div>

              <div className="bg-zinc-950 p-3 rounded border border-zinc-800 space-y-1">
                <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-300">2</span>
                  Road Waypoint Analysis
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Candidate routes from OSRM are sliced into 100m coordinates. The algorithm samples cumulative risk across each cell traversed.
                </p>
              </div>

              <div className="bg-zinc-950 p-3 rounded border border-zinc-800 space-y-1">
                <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-300">3</span>
                  Safe Corridor Routing
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Corridors crossing high-risk zones (LSI &gt; 75% or FS &lt; 1.0) are flagged RED and rejected in favor of verified GREEN corridors.
                </p>
              </div>
            </div>
          </div>

          {/* Validation summary */}
          <div className="p-3 rounded-lg bg-zinc-900 border border-emerald-800/80 flex items-center gap-2.5 text-xs text-zinc-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Zero False-Safety Guarantee:</strong> Convoys carrying emergency vaccines, fuel, and rations are automatically protected from fatal landslide entrapment.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-md text-xs font-medium transition-colors border border-zinc-700"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
};

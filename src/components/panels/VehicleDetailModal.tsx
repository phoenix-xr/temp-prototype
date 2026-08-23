import React from 'react';
import { 
  X, 
  TrendingUp, 
  Navigation, 
  Fuel, 
  Gauge, 
  CheckCircle2, 
  XCircle,
  Truck,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import type { Vehicle, HazardRiskDetail } from '../../types/logistics';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSelectHazard: (hazard: HazardRiskDetail) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onSelectHazard
}) => {
  if (!vehicle) return null;

  const safeRoute = vehicle.availableRoutes.find(r => r.isSafeOptimal) || vehicle.availableRoutes[0];
  const dangerRoutes = vehicle.availableRoutes.filter(r => !r.isSafeOptimal);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-950 rounded-xl overflow-hidden flex flex-col border border-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold font-mono text-zinc-100">
                  {vehicle.callsign}
                </h2>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  BOUND FOR CENTRAL WAREHOUSE
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-normal mt-0.5">
                Driver: <span className="text-zinc-200">{vehicle.driverName}</span> • Cargo: <span className="text-zinc-200 font-medium">{vehicle.cargoDescription} ({vehicle.cargoWeightTons} T)</span>
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Live Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mb-1 uppercase font-sans">
                <Gauge className="w-3.5 h-3.5 text-zinc-400" /> Speed
              </div>
              <div className="text-lg font-semibold text-zinc-100">
                {vehicle.speedKmph} <span className="text-xs font-normal text-zinc-400 font-sans">km/h</span>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mb-1 uppercase font-sans">
                <Navigation className="w-3.5 h-3.5 text-zinc-400" /> Elevation
              </div>
              <div className="text-lg font-semibold text-zinc-100">
                {vehicle.altitudeM} <span className="text-xs font-normal text-zinc-400 font-sans">m MSL</span>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mb-1 uppercase font-sans">
                <Fuel className="w-3.5 h-3.5 text-zinc-400" /> Fuel
              </div>
              <div className="text-lg font-semibold text-zinc-100">
                {vehicle.fuelPercent}%
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mb-1 uppercase font-sans">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Progress
              </div>
              <div className="text-lg font-semibold text-emerald-400">
                {vehicle.progressPercent}%
              </div>
            </div>
          </div>

          {/* AI Route Comparison: Chosen Green vs Rejected Red */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wide">
                Active Safe Route vs Rejected Alternative Routes
              </h3>
            </div>

            <div className="space-y-3">
              {/* 1. Chosen Safe Green Path */}
              <div className="p-3.5 rounded-lg bg-zinc-900 border border-emerald-800/80">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-xs text-emerald-300 font-mono">
                      {safeRoute.name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                      ACTIVE (GREEN)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                    <span>Dist: <strong className="text-zinc-200">{safeRoute.totalDistanceKm} km</strong></span>
                    <span>Duration: <strong className="text-zinc-200">{safeRoute.estimatedDurationMin} mins</strong></span>
                    <span>Risk: <strong className="text-emerald-400">{safeRoute.compositeRiskScore}% (LOW)</strong></span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-2 font-sans">
                  {safeRoute.description}
                </p>

                <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-sans">
                  {safeRoute.whyRejectedOrChosen}
                </div>
              </div>

              {/* 2. Rejected Dangerous Red Paths */}
              {dangerRoutes.map(dangerRoute => (
                <div 
                  key={dangerRoute.id}
                  className="p-3.5 rounded-lg bg-zinc-900 border border-rose-900/60"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="font-semibold text-xs text-rose-300 font-mono">
                        {dangerRoute.name}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-rose-950 text-rose-300 border border-rose-800">
                        REJECTED (RED)
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                      <span>Dist: <strong className="text-zinc-200">{dangerRoute.totalDistanceKm} km</strong></span>
                      <span>Duration: <strong className="text-zinc-200">{dangerRoute.estimatedDurationMin} mins</strong></span>
                      <span>Risk: <strong className="text-rose-400">{dangerRoute.compositeRiskScore}% (HIGH)</strong></span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-2 font-sans">
                    {dangerRoute.description}
                  </p>

                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-sans">
                    <div className="leading-relaxed">
                      {dangerRoute.whyRejectedOrChosen}
                    </div>

                    {dangerRoute.associatedHazard && (
                      <button
                        onClick={() => {
                          if (dangerRoute.associatedHazard) {
                            onClose();
                            onSelectHazard(dangerRoute.associatedHazard);
                          }
                        }}
                        className="shrink-0 px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-200 rounded text-xs font-medium border border-rose-800 transition-colors flex items-center gap-1.5"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Inspect Risk Formula</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
          <div className="text-xs text-zinc-400 font-sans">
            Origin: <span className="text-zinc-200">{vehicle.originName}</span> → Destination: <span className="text-zinc-200 font-medium">{vehicle.destinationName}</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-md text-xs font-medium transition-colors border border-zinc-700"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

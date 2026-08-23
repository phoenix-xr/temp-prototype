import React, { useState } from 'react';
import { 
  Truck, 
  Navigation, 
  Fuel, 
  Gauge, 
  ChevronRight, 
  Search,
  Route,
  CheckCircle2
} from 'lucide-react';
import type { Vehicle, CargoType } from '../../types/logistics';

interface FleetControlSidebarProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
  isOpen: boolean;
  onToggleOpen?: () => void;
}

export const FleetControlSidebar: React.FC<FleetControlSidebarProps> = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  isOpen
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.callsign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.cargoDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.destinationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'ALL' || v.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getCargoBadge = (type: CargoType) => {
    switch (type) {
      case 'CRITICAL_MEDICINE':
        return { label: 'CRITICAL MED', color: 'bg-rose-950 text-rose-300 border-rose-800' };
      case 'PDS_GRAINS':
        return { label: 'PDS GRAIN', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
      case 'PETROLEUM_LPG':
        return { label: 'PETRO / LPG', color: 'bg-amber-950 text-amber-300 border-amber-800' };
      case 'ORGANIC_PRODUCE':
        return { label: 'AGRI COLD', color: 'bg-cyan-950 text-cyan-300 border-cyan-800' };
      case 'DISASTER_RESCUE_EQUIPMENT':
        return { label: 'NDRF RESCUE', color: 'bg-purple-950 text-purple-300 border-purple-800' };
    }
  };

  return (
    <aside className={`fixed left-4 top-20 bottom-24 z-20 w-80 shadcn-panel rounded-xl flex flex-col transition-all duration-300 shadow-xl border border-zinc-800 font-sans ${
      isOpen ? 'translate-x-0 opacity-100' : '-translate-x-[340px] opacity-0 pointer-events-none'
    }`}>
      {/* Sidebar Header */}
      <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-zinc-100">
              Disaster Logistics Fleet
            </h2>
            <p className="text-[10px] text-zinc-400">En-Route to Central Warehouse</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-900 text-zinc-300 border border-zinc-800">
          {vehicles.length} Units
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-2.5 border-b border-zinc-800/80 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search callsign, cargo, origin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-8 pr-2 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>

        <div className="flex items-center gap-1 bg-zinc-900/60 p-0.5 rounded-md border border-zinc-800/80">
          {['ALL', 'EMERGENCY_ALPHA', 'HIGH'].map(pri => (
            <button
              key={pri}
              onClick={() => setFilterPriority(pri)}
              className={`flex-1 py-1 rounded text-[10px] font-mono transition-colors ${
                filterPriority === pri
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {pri === 'EMERGENCY_ALPHA' ? 'ALPHA' : pri}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {filteredVehicles.map(vehicle => {
          const isSelected = selectedVehicleId === vehicle.id;
          const badge = getCargoBadge(vehicle.cargoType);

          return (
            <div
              key={vehicle.id}
              onClick={() => onSelectVehicle(vehicle.id)}
              className={`p-3 rounded-lg border transition-colors cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-zinc-900 border-zinc-600 shadow-sm'
                  : 'bg-zinc-900/40 hover:bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              {/* Top Row: Callsign & Status */}
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span className="font-mono font-semibold text-xs text-zinc-100">
                  {vehicle.callsign}
                </span>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              {/* Cargo & Destination */}
              <div className="text-[11px] text-zinc-300 truncate mb-1">
                {vehicle.cargoDescription}
              </div>
              <div className="text-[10px] text-zinc-400 flex items-center gap-1 truncate mb-2">
                <span>{vehicle.originName.split(' ')[0]}</span>
                <span>→</span>
                <span className="text-zinc-200 font-medium">Central Warehouse</span>
              </div>

              {/* Telemetry Strip */}
              <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1.5 rounded text-[10px] font-mono text-zinc-300 mb-2 border border-zinc-800/60">
                <div className="flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-zinc-400" />
                  <span>{vehicle.speedKmph} km/h</span>
                </div>
                <div className="flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-zinc-400" />
                  <span>{vehicle.altitudeM}m</span>
                </div>
                <div className="flex items-center gap-1">
                  <Fuel className="w-3 h-3 text-zinc-400" />
                  <span>{vehicle.fuelPercent}%</span>
                </div>
              </div>

              {/* Route Progress Bar */}
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${vehicle.progressPercent}%` }}
                  className="h-full rounded-full transition-all duration-300 bg-emerald-500"
                />
              </div>

              {/* Status indicator */}
              <div className="mt-2 text-[9px] font-medium text-emerald-300 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/60 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">SAFE CORRIDOR VERIFIED</span>
              </div>

              {/* Click to inspect action */}
              <div className="mt-2 pt-1.5 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400 group-hover:text-zinc-200 transition-colors">
                <span className="flex items-center gap-1">
                  <Route className="w-3 h-3" />
                  Inspect Safe vs Unsafe Routes
                </span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

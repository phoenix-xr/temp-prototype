import { useState, useEffect, useCallback } from 'react';
import { createInitialVehicles } from './data/initialVehicles';
import { advanceVehicle } from './engine/simulationEngine';
import { calculateLiveRoute, createDynamicVehicle } from './engine/dynamicRouting';
import type { Vehicle, SimulationState, HazardRiskDetail, CargoType, LatLng } from './types/logistics';
import { TacticalMap } from './components/map/TacticalMap';
import { TopHeader } from './components/panels/TopHeader';
import { SimulatorControlBar } from './components/panels/SimulatorControlBar';
import { FleetControlSidebar } from './components/panels/FleetControlSidebar';
import { VehicleDetailModal } from './components/panels/VehicleDetailModal';
import { RiskSpotModal } from './components/panels/RiskSpotModal';
import { DeployVehicleModal } from './components/panels/DeployVehicleModal';
import { DataLayerToggles } from './components/panels/DataLayerToggles';
import { RoadAccessibilityLegendCard } from './components/panels/RoadAccessibilityLegendCard';
import { AIExplainabilityCard } from './components/panels/AIExplainabilityCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export function App() {
  // Base State
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => createInitialVehicles());

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedHazard, setSelectedHazard] = useState<HazardRiskDetail | null>(null);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState<boolean>(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);
  const [isDeployModeActive, setIsDeployModeActive] = useState<boolean>(false);

  // Simulation controls state
  const [simState, setSimState] = useState<SimulationState>({
    isPlaying: true,
    simSpeed: 1,
    selectedVehicleId: null,
    selectedHazardDetail: null,
    selectedPatch: null,
    mapTileLayer: 'osm',
    activeDataLayers: {
      spatialMicroGrid: false,
      roadAccessibilityNetwork: true, // Show Safe/Moderate/Blocked road accessibility network by default!
      precipitationSpots: true,
      soilQualitySpots: false,
      slopeGradientSpots: false,
      historicalLandslides: true
    }
  });

  // Sync simState selected objects
  useEffect(() => {
    setSimState(prev => ({ 
      ...prev, 
      selectedVehicleId, 
      selectedHazardDetail: selectedHazard
    }));
  }, [selectedVehicleId, selectedHazard]);

  // Toggle Environmental Data Layers
  const handleToggleDataLayer = useCallback((layerKey: keyof SimulationState['activeDataLayers']) => {
    setSimState(prev => ({
      ...prev,
      activeDataLayers: {
        ...prev.activeDataLayers,
        [layerKey]: !prev.activeDataLayers[layerKey]
      }
    }));
  }, []);

  // Reset simulation
  const handleResetSimulation = useCallback(() => {
    setVehicles(createInitialVehicles());
    setSelectedVehicleId(null);
    setSelectedHazard(null);
    setIsDeployModeActive(false);
  }, []);

  // Dynamic Route Calculation and Vehicle Deployment
  const handleDeployVehicle = useCallback(async (startCoord: LatLng, cargoType: CargoType, callsign: string) => {
    try {
      const { safeRoute } = await calculateLiveRoute(startCoord);
      const newVehicle = createDynamicVehicle(startCoord, safeRoute, cargoType, callsign);

      setVehicles(prev => [newVehicle, ...prev]);
      setSelectedVehicleId(newVehicle.id);
      setIsDeployModeActive(false);
    } catch (err) {
      console.error('Failed to calculate route:', err);
    }
  }, []);

  // Map Click Deploy Handler
  const handleMapClickDeploy = useCallback(async (coord: LatLng) => {
    await handleDeployVehicle(coord, 'DISASTER_RESCUE_EQUIPMENT', `NDRF-MAP ${Math.floor(10 + Math.random() * 90)}`);
  }, [handleDeployVehicle]);

  // Main Simulation Loop
  useEffect(() => {
    if (!simState.isPlaying) return;

    const interval = setInterval(() => {
      const deltaTimeSec = 0.5;

      setVehicles(prevVehicles => {
        return prevVehicles.map(v => {
          return advanceVehicle(v, deltaTimeSec, simState.simSpeed);
        });
      });
    }, 500);

    return () => clearInterval(interval);
  }, [simState.isPlaying, simState.simSpeed]);

  const currentSelectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#09090b] flex flex-col font-sans select-none text-zinc-100">
      {/* Top Header */}
      <TopHeader
        simState={simState}
        onToggleTileLayer={(layer) => setSimState(prev => ({ ...prev, mapTileLayer: layer }))}
        onToggleExplainModal={() => setIsExplainModalOpen(true)}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        activeVehiclesCount={vehicles.length}
      />

      {/* Main Full-Screen Tactical Map */}
      <main className="relative flex-1 w-full h-full">
        <TacticalMap
          vehicles={vehicles}
          simState={simState}
          onSelectVehicle={(id) => setSelectedVehicleId(id)}
          onSelectHazard={(hazard) => setSelectedHazard(hazard)}
          isDeployModeActive={isDeployModeActive}
          onToggleMapDeployMode={(active) => setIsDeployModeActive(active)}
          onMapClickDeploy={handleMapClickDeploy}
          onOpenDeployModal={() => setIsDeployModalOpen(true)}
        />

        {/* Environmental Prediction Data Layer Toggles Toolbar */}
        <DataLayerToggles
          activeDataLayers={simState.activeDataLayers}
          onToggleLayer={handleToggleDataLayer}
        />

        {/* Road Accessibility Legend Card (Safe / Moderate Risk / Blocked / No data) */}
        <RoadAccessibilityLegendCard
          isVisible={simState.activeDataLayers.roadAccessibilityNetwork}
          onToggle={() => handleToggleDataLayer('roadAccessibilityNetwork')}
        />

        {/* Floating Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute left-4 top-4 z-20 p-2 rounded-lg shadcn-panel text-zinc-300 hover:text-white transition-all shadow-md border border-zinc-800 flex items-center gap-1 text-xs font-sans font-medium ${
            isSidebarOpen ? 'translate-x-[330px]' : 'translate-x-0'
          }`}
          title={isSidebarOpen ? 'Collapse Fleet Panel' : 'Expand Fleet Panel'}
        >
          {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="hidden sm:inline">{isSidebarOpen ? 'HIDE FLEET' : 'SHOW FLEET'}</span>
        </button>

        {/* Fleet Control Sidebar */}
        <FleetControlSidebar
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={(id) => setSelectedVehicleId(id)}
          isOpen={isSidebarOpen}
        />

        {/* Simulator Bottom Control Bar */}
        <SimulatorControlBar
          simState={simState}
          onTogglePlay={() => setSimState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
          onChangeSimSpeed={(spd) => setSimState(prev => ({ ...prev, simSpeed: spd }))}
          onResetSimulation={handleResetSimulation}
        />
      </main>

      {/* Google Maps style Hazard & Landslide Risk Modal (when clicking Red Blocked Path or Hazard Pin) */}
      {selectedHazard && (
        <RiskSpotModal
          hazard={selectedHazard}
          onClose={() => setSelectedHazard(null)}
        />
      )}

      {/* Deploy Custom Convoy Modal */}
      <DeployVehicleModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        onDeploy={handleDeployVehicle}
        isDeployModeActive={isDeployModeActive}
        onToggleMapDeployMode={(active) => setIsDeployModeActive(active)}
      />

      {/* Vehicle Route Intelligence Inspector */}
      {currentSelectedVehicle && (
        <VehicleDetailModal
          vehicle={currentSelectedVehicle}
          onClose={() => setSelectedVehicleId(null)}
          onSelectHazard={(hazard) => setSelectedHazard(hazard)}
        />
      )}

      {/* AI Model Architecture Explainability Modal */}
      <AIExplainabilityCard
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
      />
    </div>
  );
}

export default App;

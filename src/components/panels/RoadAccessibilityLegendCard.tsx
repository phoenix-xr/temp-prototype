import React from 'react';
import { Route, ShieldAlert, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface RoadAccessibilityLegendCardProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const RoadAccessibilityLegendCard: React.FC<RoadAccessibilityLegendCardProps> = ({
  isVisible,
  onToggle
}) => {
  return (
    <div className="absolute bottom-20 left-4 z-20 bg-zinc-950/95 border border-zinc-800 rounded-xl p-3.5 shadow-2xl backdrop-blur-md w-56 font-sans">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2.5">
        <h3 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
          <Route className="w-4 h-4 text-emerald-400" />
          Road Accessibility
        </h3>
        <button
          onClick={onToggle}
          className="text-[10px] font-mono text-zinc-400 hover:text-zinc-200"
          title="Toggle network accessibility lines"
        >
          {isVisible ? 'HIDE' : 'SHOW'}
        </button>
      </div>

      <div className="space-y-2 text-xs">
        {/* 1. Safe */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-1 rounded-full bg-[#10b981]"></span>
            <span className="font-semibold text-zinc-200">Safe</span>
          </div>
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
        </div>

        {/* 2. Moderate Risk */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-1 rounded-full bg-[#f59e0b]"></span>
            <span className="font-semibold text-zinc-200">Moderate Risk</span>
          </div>
          <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />
        </div>

        {/* 3. Blocked */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-1 rounded-full bg-[#ef4444]"></span>
            <span className="font-semibold text-zinc-200">Blocked</span>
          </div>
          <ShieldAlert className="w-3.5 h-3.5 text-[#ef4444]" />
        </div>

        {/* 4. No data */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-0.5 border-t border-dashed border-zinc-400"></span>
            <span className="font-medium text-zinc-400">No data</span>
          </div>
          <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
        </div>
      </div>
    </div>
  );
};

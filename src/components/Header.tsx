import React from 'react';
import { AlertTriangle, RotateCcw, Volume2, VolumeX, ShieldAlert, Cpu } from 'lucide-react';
import { SystemState } from '../types/logistics';

interface HeaderProps {
  state: SystemState;
  assetUtilization: number;
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
  onSimulateBreakdown: () => void;
  onResetSandbox: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  assetUtilization,
  isAudioEnabled,
  onToggleAudio,
  onSimulateBreakdown,
  onResetSandbox,
}) => {
  const getStatusColor = () => {
    switch (state) {
      case 'BREAKDOWN':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/80';
      case 'OPTIMIZED':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/80';
      case 'NOMINAL':
      default:
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80';
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'BREAKDOWN':
        return 'BOTTLENECK CASCADE';
      case 'OPTIMIZED':
        return 'DYNAMIC REROUTE ACTIVE';
      case 'NOMINAL':
      default:
        return 'NOMINAL NETWORK FLOW';
    }
  };

  const getBarColor = () => {
    switch (state) {
      case 'BREAKDOWN':
        return 'bg-rose-500';
      case 'OPTIMIZED':
        return 'bg-amber-400';
      case 'NOMINAL':
      default:
        return 'bg-emerald-500';
    }
  };

  return (
    <header className="w-full bg-[#0d131f] border-b border-neutral-800/80 sticky top-0 z-30 shadow-lg shadow-black/20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Brand, YC Badge & Subtitle */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-cyan-500/20">
              <Cpu className="w-5 h-5 text-neutral-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                  SupplyChain Logic &amp; Cost Tracker
                </h1>
                <span className="text-[11px] font-mono tracking-wider uppercase text-cyan-400 bg-cyan-950/50 border border-cyan-800/60 px-2 py-0.5 rounded">
                  YC W26 Prototype
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Autonomous Supply Mesh Topology &amp; Deadhead Cost Governance
              </p>
            </div>
          </div>
        </div>

        {/* Center: Real-time Asset Utilization Status Bar */}
        <div className="flex items-center gap-3 bg-[#080d16] border border-neutral-800 px-3.5 py-1.5 rounded-md min-w-[280px] lg:min-w-[340px]">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-400 font-medium">Asset Utilization Efficiency</span>
              <span className="font-mono font-bold text-neutral-100 tabular-nums">
                {assetUtilization.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ease-out ${getBarColor()}`}
                style={{ width: `${Math.min(100, Math.max(10, assetUtilization))}%` }}
              />
            </div>
          </div>
          <div className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusColor()} whitespace-nowrap`}>
            {getStatusText()}
          </div>
        </div>

        {/* Right: Sound toggle and Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap justify-end">
          <button
            onClick={onToggleAudio}
            title={isAudioEnabled ? 'Mute Industrial Sound FX' : 'Enable Industrial Sound FX'}
            className="p-2 text-neutral-400 hover:text-neutral-200 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 rounded transition-colors"
            aria-label="Toggle sound feedback"
          >
            {isAudioEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>

          <button
            onClick={onResetSandbox}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-600 rounded transition-all shadow-sm active:scale-[0.98] whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
            <span>Reset Logistics Sandbox</span>
          </button>

          <button
            onClick={onSimulateBreakdown}
            disabled={state === 'BREAKDOWN'}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded transition-all shadow-sm active:scale-[0.98] whitespace-nowrap ${
              state === 'BREAKDOWN'
                ? 'bg-rose-950/40 text-rose-300 border border-rose-800/50 cursor-not-allowed opacity-80'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40 hover:shadow-rose-900/30 border border-rose-500'
            }`}
          >
            {state === 'BREAKDOWN' ? (
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span>
              {state === 'BREAKDOWN' ? 'Breakdown Active' : 'Simulate Logistics Breakdown'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};

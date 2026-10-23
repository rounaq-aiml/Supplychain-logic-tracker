import React from 'react';
import { 
  DollarSign, 
  Fuel, 
  AlertTriangle, 
  Zap, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldAlert, 
  Gauge, 
  Navigation
} from 'lucide-react';
import { SystemMetrics, SystemState, RemediationStrategy } from '../types/logistics';
import { REMEDIATION_STRATEGIES } from '../constants/initialData';

interface MetricsAndCostPanelProps {
  state: SystemState;
  metrics: SystemMetrics;
  selectedStrategyId: string;
  onSelectStrategy: (id: string) => void;
  onExecuteOptimization: () => void;
}

export const MetricsAndCostPanel: React.FC<MetricsAndCostPanelProps> = ({
  state,
  metrics,
  selectedStrategyId,
  onSelectStrategy,
  onExecuteOptimization,
}) => {
  // Capacity waste gauge calculation
  // Waste index ranges from 0.0 to 1.0
  // Arc calculation for SVG half/three-quarter dial
  const wasteValue = metrics.capacityWasteIndex;
  const isSevere = state === 'BREAKDOWN';
  const isOptimized = state === 'OPTIMIZED';

  // Degree on 180 deg semi-circle
  const gaugePercent = Math.min(100, Math.max(0, wasteValue * 100));
  const gaugeRotation = (gaugePercent / 100) * 180; // 0 to 180 deg

  const getDialColor = () => {
    if (isSevere) return '#ef4444'; // Red
    if (isOptimized) return '#38bdf8'; // Sky blue / cyan
    return '#10b981'; // Green
  };

  const getWasteStatusText = () => {
    if (isSevere) return '0.95 SEVERE';
    if (isOptimized) return `${wasteValue.toFixed(3)} STABILIZED`;
    return `${wasteValue.toFixed(3)} OPTIMAL`;
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Real-time Freight & Fuel Spend Card */}
      <div
        className={`rounded-lg bg-[#0a0f19] border p-4.5 transition-all duration-300 shadow-md ${
          isSevere
            ? 'border-rose-600/80 bg-rose-950/20 shadow-rose-950/40 ring-1 ring-rose-500/30'
            : isOptimized
            ? 'border-amber-600/70 bg-amber-950/15'
            : 'border-neutral-800'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded ${
                isSevere
                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}
            >
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Total Freight Spend
              </span>
              <p className="text-[11px] text-neutral-400">
                {isSevere
                  ? 'Runaway cost surge detected'
                  : isOptimized
                  ? 'Stabilized dynamic trajectory'
                  : 'Baseline network burn'}
              </p>
            </div>
          </div>

          <div
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              isSevere
                ? 'text-rose-300 bg-rose-950/80 border-rose-700 animate-pulse font-bold'
                : 'text-neutral-400 bg-neutral-900 border-neutral-800'
            }`}
          >
            {isSevere ? 'SPIKE RATE ACTIVE' : '+ $0.10 / sec'}
          </div>
        </div>

        {/* Big Tabular Counter */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight tabular-nums text-white">
            ${metrics.freightSpend.toFixed(2)}
          </span>
          <span
            className={`text-xs font-mono font-semibold flex items-center ${
              isSevere ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {isSevere ? (
              <>
                <ArrowUpRight className="w-4 h-4 animate-bounce" />
                +$182.40 Surge
              </>
            ) : (
              'Steady Flow'
            )}
          </span>
        </div>

        {/* Secondary spend indicators */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-800/80 text-xs">
          <div className="bg-[#070b13] p-2.5 rounded border border-neutral-800/80">
            <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
              <Fuel className="w-3.5 h-3.5 text-amber-400" />
              <span>Fuel Burn Rate</span>
            </div>
            <div className="font-mono text-sm font-bold text-neutral-100 tabular-nums">
              {metrics.fuelBurnRateHourly} <span className="text-xs text-neutral-400 font-normal">gal/hr</span>
            </div>
          </div>

          <div className="bg-[#070b13] p-2.5 rounded border border-neutral-800/80">
            <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Deadhead Miles</span>
            </div>
            <div className="font-mono text-sm font-bold text-neutral-100 tabular-nums">
              {metrics.deadheadMileage} <span className="text-xs text-neutral-400 font-normal">mi waste</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Operational Capacity Waste Index Dial */}
      <div
        className={`rounded-lg bg-[#0a0f19] border p-4.5 transition-all duration-300 shadow-md ${
          isSevere
            ? 'border-rose-600/80 bg-rose-950/20 shadow-rose-950/30'
            : 'border-neutral-800'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-cyan-400">
              <Gauge className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Capacity Waste Index
            </span>
          </div>

          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
              isSevere
                ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                : isOptimized
                ? 'bg-sky-950 text-sky-300 border-sky-800'
                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
            }`}
          >
            {getWasteStatusText()}
          </span>
        </div>

        {/* Visual Gauge Meter */}
        <div className="relative flex flex-col items-center justify-center py-2">
          <svg className="w-48 h-28" viewBox="0 0 200 120">
            {/* Background Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#1e293b"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Safe zone arc (0 to 0.15) */}
            <path
              d="M 20 100 A 80 80 0 0 1 50 48"
              fill="none"
              stroke="#059669"
              strokeWidth="4"
              strokeDasharray="2 4"
            />
            {/* Danger zone arc (0.80 to 1.0) */}
            <path
              d="M 150 48 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#dc2626"
              strokeWidth="4"
              strokeDasharray="2 4"
            />

            {/* Needle Pivot & Line */}
            <g transform={`rotate(${gaugeRotation - 90}, 100, 100)`}>
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="28"
                stroke={getDialColor()}
                strokeWidth="3.5"
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
                style={{ filter: `drop-shadow(0 0 4px ${getDialColor()})` }}
              />
              <circle cx="100" cy="100" r="7" fill="#0f172a" stroke={getDialColor()} strokeWidth="3" />
            </g>
          </svg>

          {/* Scale labels */}
          <div className="w-full flex justify-between px-6 text-[10px] font-mono text-neutral-400 -mt-2">
            <span className="text-emerald-400">0.00 (NOMINAL)</span>
            <span className="text-neutral-400">0.50 (WARN)</span>
            <span className="text-rose-400">1.00 (CRITICAL)</span>
          </div>

          <p className="text-[11px] text-neutral-400 text-center mt-2">
            {isSevere
              ? 'Severe empty backhaul loops consuming 95% unmonetized trailer capacity.'
              : 'Waste coefficient stabilized under threshold (< 0.05 index target).'}
          </p>
        </div>
      </div>

      {/* 3. Remediation Routing Choice Box */}
      <div className="rounded-lg bg-[#0a0f19] border border-neutral-800 p-4.5 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Remediation Routing Engine
              </span>
              <p className="text-[11px] text-neutral-400">
                Contingency dispatch protocols
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              isSevere
                ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse font-bold'
                : isOptimized
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800'
            }`}
          >
            {isSevere ? 'ACTION REQUIRED' : isOptimized ? 'REMEDIED' : 'STANDBY'}
          </span>
        </div>

        {/* PROMINENT ORANGE ACTION BUTTON (Triggered/Revealed when in BREAKDOWN state) */}
        {isSevere && (
          <div className="p-3 rounded-lg bg-amber-950/50 border-2 border-amber-500 shadow-lg shadow-amber-950/60 animate-pulse-slow">
            <div className="flex items-center gap-2 mb-2 text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>High-Priority Intervention Required</span>
            </div>
            <p className="text-[11px] text-amber-200/90 mb-3 leading-relaxed">
              Interstate Multi-Modal corridor jammed. Execute route optimization to isolate Freight_Transit_03 and establish secondary bypass conduit.
            </p>
            <button
              onClick={onExecuteOptimization}
              className="w-full py-2.5 px-4 rounded bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-neutral-950" />
              <span>Execute Route Optimization</span>
            </button>
          </div>
        )}

        {/* Strategy Selection List */}
        <div className="space-y-2 pt-1">
          <label className="text-[11px] text-neutral-400 font-medium">
            Available Remediation Vectors:
          </label>
          {REMEDIATION_STRATEGIES.map((strat) => {
            const isSelected = selectedStrategyId === strat.id;
            return (
              <div
                key={strat.id}
                onClick={() => onSelectStrategy(strat.id)}
                className={`p-2.5 rounded border cursor-pointer transition-all text-xs ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/30'
                    : 'border-neutral-800 bg-[#070b13] hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-neutral-200 mb-1">
                  <span>{strat.title}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                      strat.riskFactor === 'LOW'
                        ? 'text-emerald-400 border-emerald-800 bg-emerald-950/40'
                        : 'text-amber-400 border-amber-800 bg-amber-950/40'
                    }`}
                  >
                    {strat.riskFactor} RISK
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mb-2 leading-relaxed">
                  {strat.description}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400/90 pt-1 border-t border-neutral-800/80">
                  <span>{strat.costDelta}</span>
                  <span>{strat.latencyReduction}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* If in Optimized State: Informational badge */}
        {isOptimized && (
          <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px]">
              Optimization Protocol Active: Blocked corridor isolated, deadhead waste loops arrested.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

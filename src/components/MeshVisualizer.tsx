import React from 'react';
import { 
  Building2, 
  Warehouse, 
  TrainTrack, 
  ShieldCheck, 
  AlertOctagon, 
  ArrowRight,
  TrendingUp, 
  Radio, 
  Maximize2,
  CheckCircle2
} from 'lucide-react';
import { HubNode, SystemState } from '../types/logistics';

interface MeshVisualizerProps {
  state: SystemState;
  hubs: HubNode[];
  selectedHubId: string | null;
  onSelectHub: (id: string) => void;
}

export const MeshVisualizer: React.FC<MeshVisualizerProps> = ({
  state,
  hubs,
  selectedHubId,
  onSelectHub,
}) => {
  // Hub lookups
  const hub1 = hubs.find((h) => h.id === 'hub_01') || hubs[0];
  const hub2 = hubs.find((h) => h.id === 'hub_02') || hubs[1];
  const hub3 = hubs.find((h) => h.id === 'hub_03') || hubs[2];
  const hub4 = hubs.find((h) => h.id === 'hub_04') || hubs[3];

  const getHubIcon = (type: HubNode['type']) => {
    switch (type) {
      case 'processing':
        return <Building2 className="w-5 h-5 text-cyan-400" />;
      case 'vault':
        return <Warehouse className="w-5 h-5 text-blue-400" />;
      case 'transit':
        return <TrainTrack className="w-5 h-5 text-amber-400" />;
      case 'compliance':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    }
  };

  // SVG dimensions for vector paths
  // Coordinates in 1000x600 viewBox
  // Hub 1: (200, 150)
  // Hub 2: (800, 150)
  // Hub 3: (800, 450)
  // Hub 4: (200, 450)

  // Color logic for Route 2 (Hub 2 -> Hub 3)
  // NOMINAL: cyan/green
  // BREAKDOWN: bright red
  // OPTIMIZED: orange (closed/altered boundary path)
  const getRoute2Stroke = () => {
    if (state === 'BREAKDOWN') return '#ef4444'; // Bright red
    if (state === 'OPTIMIZED') return '#f97316'; // Orange altered/closed path
    return '#06b6d4'; // Cyan nominal
  };

  const getRoute2Glow = () => {
    if (state === 'BREAKDOWN') return 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.9))';
    if (state === 'OPTIMIZED') return 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.7))';
    return 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.6))';
  };

  return (
    <div className="relative w-full rounded-lg bg-[#070b12] border border-neutral-800 overflow-hidden shadow-xl flex flex-col">
      {/* Visualizer Top Bar */}
      <div className="px-4 py-2.5 border-b border-neutral-800/80 bg-[#0b101a] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
            Autonomous Mesh Topology (Active Route Loop)
          </span>
          <span className="text-[11px] font-mono text-neutral-500">
            · 4 Regional Nodes · Closed Loop Payload Dispatch
          </span>
        </div>

        {/* State banner */}
        <div className="flex items-center gap-2">
          {state === 'BREAKDOWN' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs font-mono font-medium animate-pulse">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              <span>BOTTLENECK DETECTED: SEGMENT HUB_02 → HUB_03</span>
            </div>
          )}
          {state === 'OPTIMIZED' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/80 border border-amber-800/80 text-amber-300 text-xs font-mono font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>DYNAMIC BYPASS ROUTING ENGAGED · NODE_03 QUARANTINED</span>
            </div>
          )}
          {state === 'NOMINAL' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>SYNCHRONIZED DISPATCH · ZERO CONGESTION</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full min-h-[460px] lg:min-h-[500px] flex items-center justify-center p-4 select-none">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }}
        />

        {/* SVG Route Lines Layer */}
        <svg
          viewBox="0 0 1000 600"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradients & Filters */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ROUTE 1: Hub 1 (Refinery Midwest, 200, 150) -> Hub 2 (Distro Vault, 800, 150) */}
          <path
            d="M 230 150 L 770 150"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeDasharray="8 8"
            className="animate-route-flow opacity-85"
            style={{ filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))' }}
          />

          {/* ROUTE 2: Hub 2 (Distro Vault, 800, 150) -> Hub 3 (Freight Transit, 800, 450) */}
          {/* In BREAKDOWN, this turns bright red with bottleneck alarm pulse */}
          {/* In OPTIMIZED, this turns orange representing altered/closed path */}
          <path
            d="M 800 180 L 800 420"
            fill="none"
            stroke={getRoute2Stroke()}
            strokeWidth={state === 'BREAKDOWN' ? '5.5' : '3.5'}
            strokeDasharray={state === 'BREAKDOWN' ? '6 6' : '8 8'}
            className={
              state === 'BREAKDOWN'
                ? 'animate-route-flow-fast'
                : state === 'OPTIMIZED'
                ? 'opacity-40'
                : 'animate-route-flow opacity-85'
            }
            style={{ filter: getRoute2Glow() }}
          />

          {/* ROUTE 3: Hub 3 (Freight Transit, 800, 450) -> Hub 4 (Gate Auditor, 200, 450) */}
          <path
            d="M 770 450 L 230 450"
            fill="none"
            stroke={state === 'OPTIMIZED' ? '#64748b' : state === 'BREAKDOWN' ? '#f43f5e' : '#06b6d4'}
            strokeWidth="3.5"
            strokeDasharray="8 8"
            className={
              state === 'OPTIMIZED'
                ? 'opacity-30'
                : 'animate-route-flow opacity-85'
            }
            style={{
              filter:
                state === 'BREAKDOWN'
                  ? 'drop-shadow(0 0 6px rgba(244, 63, 94, 0.4))'
                  : 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.5))',
            }}
          />

          {/* ROUTE 4: Hub 4 (Gate Auditor, 200, 450) -> Hub 1 (Refinery Midwest, 200, 150) */}
          <path
            d="M 200 420 L 200 180"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeDasharray="8 8"
            className="animate-route-flow-reverse opacity-85"
            style={{ filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))' }}
          />

          {/* OPTIMIZED DYNAMIC BYPASS ROUTE: Hub 2 (Distro Vault, 800, 150) -> Hub 4 (Gate Auditor, 200, 450) */}
          {/* Active and highlighted when in OPTIMIZED state */}
          {state === 'OPTIMIZED' && (
            <g>
              <path
                d="M 770 170 Q 500 300 230 430"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeDasharray="10 6"
                className="animate-route-flow-fast"
                style={{ filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.8))' }}
              />
              {/* Dynamic route label in center */}
              <rect x="420" y="285" width="160" height="26" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
              <text x="500" y="302" fill="#e0f2fe" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">
                BYPASS CHANNEL ACTIVE
              </text>
            </g>
          )}

          {/* Breakdown bottleneck indicator icon overlay */}
          {state === 'BREAKDOWN' && (
            <g transform="translate(775, 285)">
              <rect x="-60" y="-14" width="130" height="28" rx="4" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
              <text x="5" y="4" fill="#fecaca" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">
                ! SEVERE BOTTLENECK
              </text>
            </g>
          )}
        </svg>

        {/* Four Hub Cards positioned in responsive layout */}
        <div className="relative z-20 w-full h-full grid grid-cols-1 md:grid-cols-2 gap-y-16 md:gap-y-24 gap-x-12 p-2 sm:p-6">
          
          {/* 1. Refinery_Hub_01 (Midwest Processing) */}
          <div
            onClick={() => onSelectHub(hub1.id)}
            className={`group cursor-pointer bg-[#0f1726]/90 backdrop-blur-sm border rounded-lg p-4 transition-all duration-300 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 ${
              selectedHubId === hub1.id
                ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                : 'border-neutral-800'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-cyan-950/60 border border-cyan-800/80">
                  {getHubIcon(hub1.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white tracking-wide">
                      {hub1.code}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                      NOMINAL
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">
                    {hub1.subtitle}
                  </span>
                </div>
              </div>
              <Maximize2 className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400 transition-colors" />
            </div>

            <div className="text-[11px] text-neutral-400 mb-3 flex items-center justify-between">
              <span>{hub1.location}</span>
              <span className="font-mono text-neutral-300">{hub1.nominalLatency}ms sync</span>
            </div>

            {/* Metrics progress bar */}
            <div className="space-y-1.5 border-t border-neutral-800/80 pt-2.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-neutral-400">Payload Load</span>
                <span className="text-neutral-200">
                  {hub1.currentLoad.toLocaleString()} / {hub1.capacity.toLocaleString()} TEU
                </span>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all"
                  style={{ width: `${(hub1.currentLoad / hub1.capacity) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                <span>Throughput: {hub1.telemetry.throughputTonsHr} T/h</span>
                <span className="font-mono text-cyan-400">RFID: {hub1.telemetry.rfidAccuracy}%</span>
              </div>
            </div>
          </div>

          {/* 2. Distro_Node_02 (Coastal Execution Vault) */}
          <div
            onClick={() => onSelectHub(hub2.id)}
            className={`group cursor-pointer bg-[#0f1726]/90 backdrop-blur-sm border rounded-lg p-4 transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 ${
              selectedHubId === hub2.id
                ? 'border-blue-400 ring-2 ring-blue-500/30'
                : hub2.status === 'degraded'
                ? 'border-rose-600/70 bg-rose-950/20'
                : 'border-neutral-800'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-blue-950/60 border border-blue-800/80">
                  {getHubIcon(hub2.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white tracking-wide">
                      {hub2.code}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        hub2.status === 'degraded'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                          : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                      }`}
                    >
                      {hub2.status === 'degraded' ? 'APRON CONGESTION' : 'NOMINAL'}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">
                    {hub2.subtitle}
                  </span>
                </div>
              </div>
              <Maximize2 className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-400 transition-colors" />
            </div>

            <div className="text-[11px] text-neutral-400 mb-3 flex items-center justify-between">
              <span>{hub2.location}</span>
              <span className="font-mono text-neutral-300">
                {hub2.nominalLatency}ms sync
              </span>
            </div>

            {/* Metrics progress bar */}
            <div className="space-y-1.5 border-t border-neutral-800/80 pt-2.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-neutral-400">Vault Capacity</span>
                <span className="text-neutral-200">
                  {hub2.currentLoad.toLocaleString()} / {hub2.capacity.toLocaleString()} TEU
                </span>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    hub2.status === 'degraded' ? 'bg-rose-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${(hub2.currentLoad / hub2.capacity) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                <span>Dwell: {hub2.telemetry.dwellTimeHours}h</span>
                <span className="font-mono text-blue-400">Carriers: {hub2.telemetry.activeCarriers}</span>
              </div>
            </div>
          </div>

          {/* 4. Gate_Auditor_04 (Customs & Compliance) */}
          <div
            onClick={() => onSelectHub(hub4.id)}
            className={`group cursor-pointer bg-[#0f1726]/90 backdrop-blur-sm border rounded-lg p-4 transition-all duration-300 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 ${
              selectedHubId === hub4.id
                ? 'border-emerald-400 ring-2 ring-emerald-500/30'
                : 'border-neutral-800'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-emerald-950/60 border border-emerald-800/80">
                  {getHubIcon(hub4.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white tracking-wide">
                      {hub4.code}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                      COMPLIANCE CLEAR
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">
                    {hub4.subtitle}
                  </span>
                </div>
              </div>
              <Maximize2 className="w-3.5 h-3.5 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
            </div>

            <div className="text-[11px] text-neutral-400 mb-3 flex items-center justify-between">
              <span>{hub4.location}</span>
              <span className="font-mono text-neutral-300">{hub4.nominalLatency}ms audit</span>
            </div>

            {/* Metrics progress bar */}
            <div className="space-y-1.5 border-t border-neutral-800/80 pt-2.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-neutral-400">Auditor Throughput</span>
                <span className="text-neutral-200">
                  {hub4.currentLoad.toLocaleString()} / {hub4.capacity.toLocaleString()} TEU
                </span>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${(hub4.currentLoad / hub4.capacity) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                <span>LoRaWAN: Encrypted</span>
                <span className="font-mono text-emerald-400">Pass: 100% Verified</span>
              </div>
            </div>
          </div>

          {/* 3. Freight_Transit_03 (Interstate Multi-Modal) */}
          {/* IN OPTIMIZED STATE: Opacity lowered, badge 'QUARANTINED / REROUTED' */}
          {/* IN BREAKDOWN STATE: Bottlenecked, high alarm */}
          <div
            onClick={() => onSelectHub(hub3.id)}
            className={`group cursor-pointer bg-[#0f1726]/90 backdrop-blur-sm border rounded-lg p-4 transition-all duration-300 ${
              state === 'OPTIMIZED'
                ? 'opacity-40 border-amber-800/80 bg-neutral-950/80'
                : hub3.status === 'bottleneck'
                ? 'border-rose-500 ring-2 ring-rose-500/40 bg-rose-950/30 shadow-lg shadow-rose-950/50'
                : selectedHubId === hub3.id
                ? 'border-amber-400 ring-2 ring-amber-500/30'
                : 'border-neutral-800 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded border ${
                    state === 'OPTIMIZED'
                      ? 'bg-neutral-900 border-neutral-700'
                      : hub3.status === 'bottleneck'
                      ? 'bg-rose-950/80 border-rose-800'
                      : 'bg-amber-950/60 border-amber-800/80'
                  }`}
                >
                  {getHubIcon(hub3.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white tracking-wide">
                      {hub3.code}
                    </span>
                    {state === 'OPTIMIZED' ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/80 font-bold">
                        QUARANTINED / REROUTED
                      </span>
                    ) : hub3.status === 'bottleneck' ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/90 text-rose-300 border border-rose-700 animate-pulse font-bold">
                        BOTTLENECK CRITICAL
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                        NOMINAL
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">
                    {hub3.subtitle}
                  </span>
                </div>
              </div>
              <Maximize2 className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400 transition-colors" />
            </div>

            <div className="text-[11px] text-neutral-400 mb-3 flex items-center justify-between">
              <span>{hub3.location}</span>
              <span className="font-mono text-neutral-300">
                {state === 'OPTIMIZED' ? '0ms (BYPASSED)' : `${hub3.nominalLatency}ms lag`}
              </span>
            </div>

            {/* Metrics progress bar */}
            <div className="space-y-1.5 border-t border-neutral-800/80 pt-2.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-neutral-400">Corridor Load</span>
                <span className="text-neutral-200">
                  {state === 'OPTIMIZED' ? '0 TEU (TRAFFIC DRAINED)' : `${hub3.currentLoad.toLocaleString()} / ${hub3.capacity.toLocaleString()} TEU`}
                </span>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    state === 'OPTIMIZED'
                      ? 'bg-neutral-600'
                      : hub3.status === 'bottleneck'
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                  }`}
                  style={{
                    width:
                      state === 'OPTIMIZED'
                        ? '6%'
                        : `${(hub3.currentLoad / hub3.capacity) * 100}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                <span>
                  {state === 'OPTIMIZED'
                    ? 'Isolated by Optimizer'
                    : hub3.status === 'bottleneck'
                    ? 'Empty Backhaul Surge'
                    : `Throughput: ${hub3.telemetry.throughputTonsHr} T/h`}
                </span>
                <span
                  className={`font-mono ${
                    hub3.status === 'bottleneck' ? 'text-rose-400 font-bold' : 'text-amber-400'
                  }`}
                >
                  {hub3.status === 'bottleneck' ? 'STALL DETECTED' : 'Dispatch: Active'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mesh Visualizer Footer Strip */}
      <div className="px-4 py-2 border-t border-neutral-800/80 bg-[#090d16] flex items-center justify-between text-xs text-neutral-400 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 rounded-full bg-emerald-400"></span>
            <span>Nominal Vector Flow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 rounded-full bg-rose-500"></span>
            <span>Bottleneck Blockade</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 rounded-full bg-amber-400"></span>
            <span>Rerouted / Altered Boundary</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 rounded-full bg-cyan-400"></span>
            <span>Dynamic Bypass Channel</span>
          </div>
        </div>
        <div className="font-mono text-[11px] text-neutral-500">
          Tip: Click any regional hub card to inspect live telemetry &amp; carriers
        </div>
      </div>
    </div>
  );
};

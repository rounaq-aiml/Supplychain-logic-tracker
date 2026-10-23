import React, { useEffect } from 'react';
import { 
  X, 
  Building2, 
  Warehouse, 
  TrainTrack, 
  ShieldCheck, 
  Clock, 
  Fuel, 
  Radio, 
  Truck, 
  BarChart3, 
  CheckCircle,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { HubNode, SystemState } from '../types/logistics';

interface HubDetailModalProps {
  hub: HubNode | null;
  state: SystemState;
  onClose: () => void;
}

export const HubDetailModal: React.FC<HubDetailModalProps> = ({ hub, state, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!hub) return null;

  const getHubIcon = () => {
    switch (hub.type) {
      case 'processing':
        return <Building2 className="w-6 h-6 text-cyan-400" />;
      case 'vault':
        return <Warehouse className="w-6 h-6 text-blue-400" />;
      case 'transit':
        return <TrainTrack className="w-6 h-6 text-amber-400" />;
      case 'compliance':
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
    }
  };

  const isQuarantined = hub.id === 'hub_03' && state === 'OPTIMIZED';
  const isBottleneck = hub.id === 'hub_03' && state === 'BREAKDOWN';
  const isDegraded = hub.id === 'hub_02' && state === 'BREAKDOWN';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-[#0c121e] border border-neutral-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#080d16] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
              {getHubIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{hub.code}</h3>
                {isQuarantined ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                    QUARANTINED / REROUTED
                  </span>
                ) : isBottleneck ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 animate-pulse">
                    CRITICAL BOTTLENECK
                  </span>
                ) : isDegraded ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                    APRON CONGESTION
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                    OPERATIONAL NOMINAL
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400">{hub.subtitle} · {hub.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Status banner if problem */}
          {isBottleneck && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-700/80 flex items-start gap-3 text-rose-200 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-300 block mb-0.5">
                  Interstate Congestion &amp; Empty Backhaul Alarm
                </span>
                Severe gridlock on multi-modal freight arterial corridor. Idle auxiliary fuel burn escalated to 480 gal/hr. Chassis dwell time exceeded 14.6 hours.
              </div>
            </div>
          )}

          {isQuarantined && (
            <div className="p-3 rounded-lg bg-amber-950/50 border border-amber-700/80 flex items-start gap-3 text-amber-200 text-xs">
              <CheckCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block mb-0.5">
                  Corridor Quarantined by Autonomous Optimizer
                </span>
                Inbound trailers have been safely drained and redirected onto the dynamic bypass vector to Gate_Auditor_04. Runaway fuel burn neutralized.
              </div>
            </div>
          )}

          {/* TEU Capacity & Load */}
          <div className="bg-[#080d16] p-4 rounded-lg border border-neutral-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-400">Total Asset Utilization</span>
              <span className="text-neutral-100 font-bold">
                {hub.currentLoad.toLocaleString()} / {hub.capacity.toLocaleString()} TEU
              </span>
            </div>
            <div className="w-full bg-neutral-900 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isBottleneck ? 'bg-rose-500' : isQuarantined ? 'bg-amber-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${Math.min(100, (hub.currentLoad / hub.capacity) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-neutral-500 pt-1">
              <span>Sync Latency: {hub.nominalLatency}ms</span>
              <span>Available Margin: {(hub.capacity - hub.currentLoad).toLocaleString()} TEU</span>
            </div>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#080d16] p-3 rounded border border-neutral-800">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Average Dwell Time</span>
              </div>
              <div className="font-mono text-base font-bold text-white">
                {hub.telemetry.dwellTimeHours} <span className="text-xs text-neutral-500 font-normal">hrs</span>
              </div>
            </div>

            <div className="bg-[#080d16] p-3 rounded border border-neutral-800">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Throughput</span>
              </div>
              <div className="font-mono text-base font-bold text-white">
                {hub.telemetry.throughputTonsHr} <span className="text-xs text-neutral-500 font-normal">Tons/hr</span>
              </div>
            </div>

            <div className="bg-[#080d16] p-3 rounded border border-neutral-800">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <Fuel className="w-4 h-4 text-amber-400" />
                <span>Fuel Burn</span>
              </div>
              <div className="font-mono text-base font-bold text-white">
                {hub.telemetry.fuelBurnGallonsHr} <span className="text-xs text-neutral-500 font-normal">gal/hr</span>
              </div>
            </div>

            <div className="bg-[#080d16] p-3 rounded border border-neutral-800">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <Radio className="w-4 h-4 text-blue-400" />
                <span>RFID Accuracy</span>
              </div>
              <div className="font-mono text-base font-bold text-white">
                {hub.telemetry.rfidAccuracy}%
              </div>
            </div>
          </div>

          {/* Active Dispatches */}
          <div className="bg-[#080d16] p-3.5 rounded border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-neutral-400" />
                <span>Connected Fleet Carriers</span>
              </div>
              <span className="font-mono text-neutral-400">{hub.telemetry.activeCarriers} Dispatched</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Automated bills of lading and cryptographic container locks synchronized with LoRaWAN mesh gateways across all staging bays.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#080d16] border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

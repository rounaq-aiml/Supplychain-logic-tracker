import React from 'react';
import { Package, Truck, ArrowRight, ShieldCheck, Thermometer, AlertCircle } from 'lucide-react';
import { SystemState } from '../types/logistics';

interface PayloadItem {
  id: string;
  tag: string;
  contents: string;
  origin: string;
  destination: string;
  weightTons: number;
  tempStatus: string;
  carrier: string;
  transitStatus: 'IN_TRANSIT' | 'CONGESTED' | 'REROUTED';
}

interface PayloadInspectorProps {
  state: SystemState;
}

export const PayloadInspector: React.FC<PayloadInspectorProps> = ({ state }) => {
  const payloads: PayloadItem[] = [
    {
      id: 'PL-9402',
      tag: 'EDI-856 #MW-9402',
      contents: 'Petrochemical Polymers (Bulk)',
      origin: 'Refinery_Hub_01',
      destination: 'Distro_Node_02',
      weightTons: 24.8,
      tempStatus: 'Ambient (21°C)',
      carrier: 'SwiftTrans Intermodal',
      transitStatus: 'IN_TRANSIT',
    },
    {
      id: 'PL-8819',
      tag: 'EDI-856 #NJ-8819',
      contents: 'Cold-Chain Biologics & Pharmaceuticals',
      origin: 'Distro_Node_02',
      destination: 'Freight_Transit_03',
      weightTons: 18.2,
      tempStatus: state === 'BREAKDOWN' ? 'WARMING (-12°C ALARM)' : 'Cold (-18°C Stable)',
      carrier: 'Apex Reefer Logistics',
      transitStatus: state === 'BREAKDOWN' ? 'CONGESTED' : state === 'OPTIMIZED' ? 'REROUTED' : 'IN_TRANSIT',
    },
    {
      id: 'PL-7301',
      tag: 'EDI-856 #SL-7301',
      contents: 'Tier-1 Automotive Assemblies',
      origin: 'Freight_Transit_03',
      destination: 'Gate_Auditor_04',
      weightTons: 32.5,
      tempStatus: 'Ambient (18°C)',
      carrier: 'BNSF Double-Stack Rail',
      transitStatus: state === 'BREAKDOWN' ? 'CONGESTED' : state === 'OPTIMIZED' ? 'REROUTED' : 'IN_TRANSIT',
    },
    {
      id: 'PL-4109',
      tag: 'EDI-856 #LR-4109',
      contents: 'Cross-Border Electronics Hardware',
      origin: 'Gate_Auditor_04',
      destination: 'Refinery_Hub_01',
      weightTons: 14.1,
      tempStatus: 'Climate Controlled (20°C)',
      carrier: 'Union Pacific Intermodal',
      transitStatus: 'IN_TRANSIT',
    },
  ];

  return (
    <div className="w-full rounded-lg bg-[#070b13] border border-neutral-800 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
            Active Payload Manifests (In-Flight Telemetry)
          </span>
        </div>
        <span className="text-[11px] font-mono text-neutral-500">
          Continuous RFID Handshake · 4 Active Transits
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {payloads.map((item) => {
          const isCongested = item.transitStatus === 'CONGESTED';
          const isRerouted = item.transitStatus === 'REROUTED';

          return (
            <div
              key={item.id}
              className={`p-3 rounded border text-xs transition-all ${
                isCongested
                  ? 'border-rose-700/80 bg-rose-950/20 shadow-sm shadow-rose-950/30'
                  : isRerouted
                  ? 'border-amber-700/80 bg-amber-950/20'
                  : 'border-neutral-800 bg-[#090e18] hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 font-mono text-[11px]">
                <span className="font-bold text-neutral-200">{item.id}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] border ${
                    isCongested
                      ? 'text-rose-300 bg-rose-950 border-rose-800 animate-pulse font-bold'
                      : isRerouted
                      ? 'text-amber-300 bg-amber-950 border-amber-800'
                      : 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                  }`}
                >
                  {isCongested ? 'HALTED' : isRerouted ? 'BYPASSING' : 'ON-SCHEDULE'}
                </span>
              </div>

              <div className="font-semibold text-neutral-300 text-xs truncate mb-2" title={item.contents}>
                {item.contents}
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mb-2 font-mono">
                <span className="text-neutral-300 truncate max-w-[70px]">{item.origin.replace('_Hub', '').replace('_Node', '')}</span>
                <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="text-neutral-300 truncate max-w-[70px]">{item.destination.replace('_Hub', '').replace('_Node', '')}</span>
              </div>

              <div className="space-y-1 pt-2 border-t border-neutral-800/80 text-[10px] text-neutral-400">
                <div className="flex justify-between">
                  <span>Weight:</span>
                  <span className="font-mono text-neutral-200">{item.weightTons} T</span>
                </div>
                <div className="flex justify-between">
                  <span>Carrier:</span>
                  <span className="truncate max-w-[110px] text-neutral-300">{item.carrier}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thermal:</span>
                  <span className={`font-mono ${isCongested ? 'text-rose-400 font-bold' : 'text-neutral-300'}`}>
                    {item.tempStatus}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

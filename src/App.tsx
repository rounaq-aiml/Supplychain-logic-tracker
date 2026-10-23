/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLogisticsStateMachine } from './hooks/useLogisticsStateMachine';
import { Header } from './components/Header';
import { MeshVisualizer } from './components/MeshVisualizer';
import { OperationalTickerConsole } from './components/OperationalTickerConsole';
import { MetricsAndCostPanel } from './components/MetricsAndCostPanel';
import { HubDetailModal } from './components/HubDetailModal';
import { PayloadInspector } from './components/PayloadInspector';

export default function App() {
  const {
    state,
    hubs,
    metrics,
    logs,
    selectedHubId,
    setSelectedHubId,
    selectedStrategyId,
    setSelectedStrategyId,
    isAudioEnabled,
    toggleAudio,
    triggerBreakdown,
    triggerOptimization,
    resetSandbox,
    clearLogs,
  } = useLogisticsStateMachine();

  const selectedHub = hubs.find((h) => h.id === selectedHubId) || null;

  return (
    <div className="min-h-screen bg-[#070b12] text-neutral-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* 1. HEADER */}
      <Header
        state={state}
        assetUtilization={metrics.assetUtilizationEfficiency}
        isAudioEnabled={isAudioEnabled}
        onToggleAudio={toggleAudio}
        onSimulateBreakdown={triggerBreakdown}
        onResetSandbox={resetSandbox}
      />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-[1640px] w-full mx-auto p-3 sm:p-5 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Main Visualizer & Terminal Column (8 Cols on Desktop) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* 2. LIVE MESH VISUALIZER */}
            <MeshVisualizer
              state={state}
              hubs={hubs}
              selectedHubId={selectedHubId}
              onSelectHub={(id) => setSelectedHubId(id)}
            />

            {/* 3. OPERATIONAL TICKER CONSOLE */}
            <OperationalTickerConsole
              logs={logs}
              state={state}
              onClearLogs={clearLogs}
            />

            {/* IN-FLIGHT PAYLOAD MANIFEST STRIP */}
            <PayloadInspector state={state} />
          </div>

          {/* Right Metrics & Cost Panel (4 Cols on Desktop) */}
          <div className="lg:col-span-4 sticky top-20 flex flex-col gap-5">
            {/* 4. METRICS & COST PANEL */}
            <MetricsAndCostPanel
              state={state}
              metrics={metrics}
              selectedStrategyId={selectedStrategyId}
              onSelectStrategy={setSelectedStrategyId}
              onExecuteOptimization={triggerOptimization}
            />
          </div>

        </div>
      </main>

      {/* Interactive Hub Detail Modal */}
      <HubDetailModal
        hub={selectedHub}
        state={state}
        onClose={() => setSelectedHubId(null)}
      />

      {/* Quiet Industrial Footer */}
      <footer className="w-full bg-[#080d16] border-t border-neutral-800/80 px-4 sm:px-6 py-3 text-xs text-neutral-400 mt-auto">
        <div className="max-w-[1640px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-neutral-400">SupplyChain Logic &amp; Cost Tracker</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-400">Autonomous Carrier Routing State Machine</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-400">
            <span>Runtime Engine: Node.js/Vite React</span>
            <span>·</span>
            <span>State: <strong className="text-neutral-200">{state}</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

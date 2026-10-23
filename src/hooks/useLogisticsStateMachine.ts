import { useState, useEffect, useRef, useCallback } from 'react';
import { HubNode, LogEntry, SystemMetrics, SystemState } from '../types/logistics';
import { INITIAL_HUBS, NOMINAL_LOG_TEMPLATES, REMEDIATION_STRATEGIES } from '../constants/initialData';
import { soundFx } from '../utils/audioFeedback';

function getTimestamp(): string {
  const now = new Date();
  const hrs = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  const secs = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  return `${hrs}:${mins}:${secs}.${ms}`;
}

export function useLogisticsStateMachine() {
  const [state, setState] = useState<SystemState>('NOMINAL');
  const [hubs, setHubs] = useState<HubNode[]>(INITIAL_HUBS);
  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>(REMEDIATION_STRATEGIES[0].id);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [logFilter, setLogFilter] = useState<'ALL' | 'CRIT' | 'INFO'>('ALL');

  const [metrics, setMetrics] = useState<SystemMetrics>({
    freightSpend: 12.40,
    fuelBurnRateHourly: 395.9,
    capacityWasteIndex: 0.038,
    assetUtilizationEfficiency: 96.4,
    activePayloadsInTransit: 142,
    deadheadMileage: 12,
    co2EmissionsTons: 4.2,
  });

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      timestamp: getTimestamp(),
      level: 'INFO',
      category: 'TELEMETRY',
      message: 'SupplyChain Logic core engine v2.6 initialized. 4 regional mesh hubs online.',
    },
    {
      id: 'init-2',
      timestamp: getTimestamp(),
      level: 'INFO',
      category: 'MANIFEST',
      message: 'Global asset tracking telemetry synchronized. Route loop operating at nominal thresholds.',
    },
  ]);

  // Keep ref to current state so intervals have latest reference
  const stateRef = useRef<SystemState>('NOMINAL');
  stateRef.current = state;

  const logIndexRef = useRef(0);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    setIsAudioEnabled((prev) => {
      const next = !prev;
      soundFx.enabled = next;
      if (next) soundFx.playClick();
      return next;
    });
  }, []);

  // Helper to add a log entry
  const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: getTimestamp(),
      ...entry,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 199)]); // keep latest 200 logs
  }, []);

  // 1. INTERVAL ENGINE FOR NOMINAL STATE & TICKING
  useEffect(() => {
    const interval = setInterval(() => {
      const currentState = stateRef.current;

      if (currentState === 'NOMINAL') {
        // Spend ticks up by $0.10 increments
        setMetrics((prev) => ({
          ...prev,
          freightSpend: +(prev.freightSpend + 0.10).toFixed(2),
          fuelBurnRateHourly: +(390 + Math.sin(Date.now() / 2000) * 8).toFixed(1),
          // capacity waste stays under 0.05
          capacityWasteIndex: +(0.038 + Math.sin(Date.now() / 3000) * 0.006).toFixed(3),
          assetUtilizationEfficiency: +(96.2 + Math.sin(Date.now() / 4000) * 0.8).toFixed(1),
          activePayloadsInTransit: 140 + Math.floor(Math.sin(Date.now() / 1500) * 4),
          deadheadMileage: 12 + Math.floor(Math.random() * 2),
        }));

        // Print nominal background logistics transaction string every second
        const template = NOMINAL_LOG_TEMPLATES[logIndexRef.current % NOMINAL_LOG_TEMPLATES.length];
        logIndexRef.current += 1;
        addLog({
          level: 'INFO',
          category: template.category,
          message: template.message,
        });
      } else if (currentState === 'BREAKDOWN') {
        // Spike spend rapidly in breakdown
        setMetrics((prev) => ({
          ...prev,
          freightSpend: +(prev.freightSpend + (3.40 + Math.random() * 2.8)).toFixed(2),
          fuelBurnRateHourly: +(1480 + Math.random() * 60).toFixed(1),
          capacityWasteIndex: 0.95, // severe
          assetUtilizationEfficiency: +(41.2 + Math.sin(Date.now() / 2000) * 1.5).toFixed(1),
          activePayloadsInTransit: Math.max(88, prev.activePayloadsInTransit - 1),
          deadheadMileage: prev.deadheadMileage + 4,
          co2EmissionsTons: +(prev.co2EmissionsTons + 0.08).toFixed(2),
        }));

        // Occasional critical cascading messages in breakdown
        if (Math.random() > 0.45) {
          const breakdownLogs = [
            'CRITICAL: Chassis demurrage penalty clock active (+ $45/hr on 32 halted loads).',
            'HAZARD: Refrigeration battery drain threshold exceeded on stranded Reefer convoy.',
            'TELEMETRY ERROR: Deadhead miles escalating: 340 miles without revenue backhaul.',
            'ALARM: Coastal Execution Vault staging apron reached 100% saturation capacity.',
            'DISPATCH RETRY: Carrier timeout on Freight_Transit_03 interstate gateway arterial.',
          ];
          const msg = breakdownLogs[Math.floor(Math.random() * breakdownLogs.length)];
          addLog({
            level: 'CRIT',
            category: 'FUEL',
            message: msg,
          });
        }
      } else if (currentState === 'OPTIMIZED') {
        // Optimized state spend ticks up slowly at normalized rate
        setMetrics((prev) => ({
          ...prev,
          freightSpend: +(prev.freightSpend + 0.12).toFixed(2),
          fuelBurnRateHourly: +(405 + Math.sin(Date.now() / 2500) * 6).toFixed(1),
          capacityWasteIndex: +(0.041 + Math.sin(Date.now() / 3500) * 0.005).toFixed(3),
          assetUtilizationEfficiency: +(94.8 + Math.sin(Date.now() / 3000) * 0.5).toFixed(1),
          activePayloadsInTransit: Math.min(138, prev.activePayloadsInTransit + 1),
        }));

        // Periodic recovery telemetry
        if (Math.random() > 0.6) {
          const optLogs = [
            'OPTIMIZER: Dynamic multi-modal bypass flow verified at 430 Tons/hr nominal.',
            'DISPATCH: Gate_Auditor_04 clearing rerouted freight with 0s regulatory hold.',
            'FUEL: Deadhead loop suppression active; fuel burn aligned with baseline trajectory.',
            'TELEMETRY: Quarantined node Freight_Transit_03 holding safe maintenance status.',
          ];
          addLog({
            level: 'INFO',
            category: 'OPTIMIZER',
            message: optLogs[Math.floor(Math.random() * optLogs.length)],
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [addLog]);

  // ACTION: Simulate Logistics Breakdown
  const triggerBreakdown = useCallback(() => {
    soundFx.playAlert();
    setState('BREAKDOWN');

    // Update hubs: Freight_Transit_03 is bottlenecked, Distro_Node_02 is degraded
    setHubs((prev) =>
      prev.map((h) => {
        if (h.id === 'hub_03') {
          return {
            ...h,
            status: 'bottleneck',
            currentLoad: h.capacity,
            nominalLatency: 285,
            telemetry: {
              ...h.telemetry,
              dwellTimeHours: 14.6,
              throughputTonsHr: 42.0,
              fuelBurnGallonsHr: 480.0,
            },
          };
        }
        if (h.id === 'hub_02') {
          return {
            ...h,
            status: 'degraded',
            currentLoad: 24500,
            nominalLatency: 140,
            telemetry: {
              ...h.telemetry,
              dwellTimeHours: 7.2,
              fuelBurnGallonsHr: 340.0,
            },
          };
        }
        return h;
      })
    );

    // Spike freight spend instantly to $182.40, capacity waste to 0.95 SEVERE
    setMetrics((prev) => ({
      ...prev,
      freightSpend: 182.40,
      capacityWasteIndex: 0.95,
      fuelBurnRateHourly: 1480.5,
      assetUtilizationEfficiency: 41.2,
      deadheadMileage: 188,
    }));

    // Immediately print critical cascading errors in red text inside terminal
    // Required exact phrase: "CRITICAL DELAY: Interstate congestion detected on Freight_Transit_03, triggering empty backhaul waste loops"
    addLog({
      level: 'CRIT',
      category: 'TELEMETRY',
      message: 'CRITICAL DELAY: Interstate congestion detected on Freight_Transit_03, triggering empty backhaul waste loops',
    });
    addLog({
      level: 'CRIT',
      category: 'FUEL',
      message: 'RUNAWAY COST SPIKE: Freight spend surged to $182.40 baseline; waste index escalated to 0.95 SEVERE.',
    });
    addLog({
      level: 'CRIT',
      category: 'MANIFEST',
      message: 'BOTTLENECK IDENTIFIED: Distro_Node_02 -> Freight_Transit_03 transport corridor blocked.',
    });
    addLog({
      level: 'WARN',
      category: 'OPTIMIZER',
      message: 'ATTENTION: Remediation routing engine armed. Review contingency strategies in control panel.',
    });
  }, [addLog]);

  // ACTION: Execute Route Optimization
  const triggerOptimization = useCallback(() => {
    soundFx.playOptimizedChime();
    setState('OPTIMIZED');

    // Safely bypass blocked route node by lowering its opacity and giving it a "QUARANTINED / REROUTED" badge
    setHubs((prev) =>
      prev.map((h) => {
        if (h.id === 'hub_03') {
          return {
            ...h,
            status: 'quarantined',
            currentLoad: 1200,
            nominalLatency: 0,
            telemetry: {
              ...h.telemetry,
              dwellTimeHours: 0.2,
              throughputTonsHr: 0,
              fuelBurnGallonsHr: 12.0,
            },
          };
        }
        if (h.id === 'hub_02') {
          return {
            ...h,
            status: 'nominal',
            currentLoad: 18200,
            nominalLatency: 32,
            telemetry: {
              ...h.telemetry,
              dwellTimeHours: 2.5,
              fuelBurnGallonsHr: 130.0,
            },
          };
        }
        return {
          ...h,
          status: 'nominal',
        };
      })
    );

    // Drop capacity waste factor back to normal thresholds, asset utilization recovers
    setMetrics((prev) => ({
      ...prev,
      capacityWasteIndex: 0.041,
      fuelBurnRateHourly: 412.0,
      assetUtilizationEfficiency: 94.8,
    }));

    // Required success remediation logs:
    // "Activating dynamic rerouting engine... Runaway fuel waste mitigated successfully."
    addLog({
      level: 'ACTION',
      category: 'OPTIMIZER',
      message: 'Activating dynamic rerouting engine... Runaway fuel waste mitigated successfully.',
    });
    addLog({
      level: 'INFO',
      category: 'DISPATCH',
      message: 'Freight_Transit_03 isolated. Status set to QUARANTINED / REROUTED.',
    });
    addLog({
      level: 'INFO',
      category: 'MANIFEST',
      message: 'Dynamic direct arterial established: Distro_Node_02 bypass corridor routing directly to Gate_Auditor_04.',
    });
    addLog({
      level: 'INFO',
      category: 'FUEL',
      message: 'Backhaul deadhead loops collapsed. Baseline distribution cycles resumed.',
    });
  }, [addLog]);

  // ACTION: Reset Logistics Sandbox
  const resetSandbox = useCallback(() => {
    soundFx.playClick();
    setState('NOMINAL');
    setHubs(INITIAL_HUBS);
    setSelectedHubId(null);
    setMetrics({
      freightSpend: 12.40,
      fuelBurnRateHourly: 395.9,
      capacityWasteIndex: 0.038,
      assetUtilizationEfficiency: 96.4,
      activePayloadsInTransit: 142,
      deadheadMileage: 12,
      co2EmissionsTons: 4.2,
    });
    setLogs([
      {
        id: `${Date.now()}-reset`,
        timestamp: getTimestamp(),
        level: 'INFO',
        category: 'OPTIMIZER',
        message: 'Logistics sandbox reset to baseline nominal parameters. All network conduits restored.',
      },
    ]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
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
    logFilter,
    setLogFilter,
    triggerBreakdown,
    triggerOptimization,
    resetSandbox,
    clearLogs,
  };
}

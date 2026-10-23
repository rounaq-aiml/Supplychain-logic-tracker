export type SystemState = 'NOMINAL' | 'BREAKDOWN' | 'OPTIMIZED';

export interface HubNode {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  location: string;
  coordinates: { x: number; y: number }; // Percentage 0-100 on canvas
  type: 'processing' | 'vault' | 'transit' | 'compliance';
  capacity: number; // in TEU or units
  currentLoad: number;
  nominalLatency: number; // in ms
  status: 'nominal' | 'degraded' | 'bottleneck' | 'quarantined';
  telemetry: {
    dwellTimeHours: number;
    throughputTonsHr: number;
    fuelBurnGallonsHr: number;
    rfidAccuracy: number;
    activeCarriers: number;
  };
}

export interface RouteConnection {
  id: string;
  from: string;
  to: string;
  status: 'nominal' | 'bottleneck' | 'bypassed' | 'rerouted';
  distanceMiles: number;
  activePayloads: number;
  color: string;
  isBypass?: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'CRIT' | 'ACTION';
  category: 'TELEMETRY' | 'MANIFEST' | 'FUEL' | 'AUDIT' | 'DISPATCH' | 'OPTIMIZER';
  message: string;
}

export interface RemediationStrategy {
  id: string;
  title: string;
  description: string;
  costDelta: string;
  latencyReduction: string;
  efficiencyGain: string;
  riskFactor: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface SystemMetrics {
  freightSpend: number;
  fuelBurnRateHourly: number;
  capacityWasteIndex: number; // 0.0 to 1.0
  assetUtilizationEfficiency: number; // percentage 0-100%
  activePayloadsInTransit: number;
  deadheadMileage: number;
  co2EmissionsTons: number;
}

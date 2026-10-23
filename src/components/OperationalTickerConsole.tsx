import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Download, Trash2, Pause, Play, Check } from 'lucide-react';
import { LogEntry, SystemState } from '../types/logistics';

interface OperationalTickerConsoleProps {
  logs: LogEntry[];
  state: SystemState;
  onClearLogs: () => void;
}

export const OperationalTickerConsole: React.FC<OperationalTickerConsoleProps> = ({
  logs,
  state,
  onClearLogs,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CRIT' | 'INFO'>('ALL');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to top when new logs arrive (or bottom depending on order)
  // Our logs array has newest logs at index 0 or bottom: let's render newest at top or scrollable
  // Since logs are [newLog, ...prev], the top is the newest entry, which is immediately visible!
  // If user scrolls, autoScroll can maintain view
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'CRIT') return log.level === 'CRIT' || log.level === 'WARN';
    if (filter === 'INFO') return log.level === 'INFO' || log.level === 'ACTION';
    return true;
  });

  const handleCopyLogs = () => {
    const text = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.category}] [${l.level}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportLogs = () => {
    const text = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.category}] [${l.level}] ${l.message}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supplychain_log_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLogStyle = (log: LogEntry) => {
    if (log.level === 'CRIT') {
      return {
        badgeClass: 'text-rose-400 bg-rose-950/70 border-rose-800',
        textClass: 'text-rose-300 font-medium font-mono',
      };
    }
    if (log.level === 'ACTION') {
      return {
        badgeClass: 'text-amber-400 bg-amber-950/70 border-amber-800',
        textClass: 'text-amber-200 font-semibold font-mono',
      };
    }
    if (log.level === 'WARN') {
      return {
        badgeClass: 'text-amber-400 bg-amber-950/70 border-amber-800',
        textClass: 'text-amber-300 font-mono',
      };
    }
    return {
      badgeClass: 'text-neutral-400 bg-neutral-900 border-neutral-800',
      textClass: 'text-neutral-300 font-mono',
    };
  };

  return (
    <div className="w-full rounded-lg bg-[#070b13] border border-neutral-800 flex flex-col shadow-lg overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="px-3.5 py-2.5 bg-[#0b101a] border-b border-neutral-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* Terminal indicator dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <span className="text-neutral-500 font-mono text-xs">/</span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-300 font-semibold">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>operational_ticker_daemon</span>
          </div>
          {state === 'BREAKDOWN' && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 animate-pulse">
              ALERTS ACTIVE
            </span>
          )}
        </div>

        {/* Filter controls & actions */}
        <div className="flex items-center gap-1.5">
          {/* Segmented filter */}
          <div className="flex items-center p-0.5 bg-neutral-900 rounded border border-neutral-800 text-[11px]">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2 py-0.5 rounded transition-colors ${
                filter === 'ALL'
                  ? 'bg-neutral-800 text-neutral-100 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All ({logs.length})
            </button>
            <button
              onClick={() => setFilter('CRIT')}
              className={`px-2 py-0.5 rounded transition-colors ${
                filter === 'CRIT'
                  ? 'bg-rose-950 text-rose-300 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Alerts
            </button>
            <button
              onClick={() => setFilter('INFO')}
              className={`px-2 py-0.5 rounded transition-colors ${
                filter === 'INFO'
                  ? 'bg-neutral-800 text-cyan-300 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              System
            </button>
          </div>

          {/* Autoscroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            title={autoScroll ? 'Pause automatic scroll' : 'Resume automatic scroll'}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-xs transition-colors"
          >
            {autoScroll ? (
              <Pause className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          {/* Copy logs */}
          <button
            onClick={handleCopyLogs}
            title="Copy logs to clipboard"
            className="p-1.5 text-neutral-400 hover:text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-xs transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <span className="text-[11px] font-mono px-1">Copy</span>
            )}
          </button>

          {/* Export logs */}
          <button
            onClick={handleExportLogs}
            title="Export logs as TXT"
            className="p-1.5 text-neutral-400 hover:text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Clear logs */}
          <button
            onClick={onClearLogs}
            title="Clear console output"
            className="p-1.5 text-neutral-400 hover:text-rose-400 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Window */}
      <div
        ref={scrollRef}
        className="p-3 h-52 sm:h-56 overflow-y-auto terminal-scrollbar font-mono text-xs space-y-1.5 bg-[#05080f]/95 select-text"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-neutral-500 italic py-6 text-center">
            No terminal output matches the current filter.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const style = getLogStyle(log);
            return (
              <div
                key={log.id}
                className="flex items-start gap-2 hover:bg-white/[0.02] px-1 py-0.5 rounded leading-relaxed transition-colors"
              >
                <span className="text-neutral-500 shrink-0 text-[11px] select-none">
                  [{log.timestamp}]
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded border shrink-0 uppercase tracking-wider font-semibold select-none ${style.badgeClass}`}
                >
                  {log.category}
                </span>
                <span className={`break-words flex-1 text-[12px] ${style.textClass}`}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Terminal Sub-Status Bar */}
      <div className="px-3 py-1.5 bg-[#0a0f19] border-t border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Daemon: ACTIVE (1s polling cadence)</span>
        </div>
        <div className="text-neutral-500">
          Showing {filteredLogs.length} events · UTF-8
        </div>
      </div>
    </div>
  );
};

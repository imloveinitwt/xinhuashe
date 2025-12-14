
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Minimize2, Maximize2, Trash2, Bug, AlertTriangle, Info, XCircle } from 'lucide-react';

type LogType = 'log' | 'warn' | 'error' | 'info';

interface LogMessage {
  id: string;
  type: LogType;
  content: string;
  timestamp: string;
}

const DebugConsole: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Save original methods
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    const formatArgs = (args: any[]) => {
      return args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return '[Circular/Object]';
          }
        }
        return String(arg);
      }).join(' ');
    };

    const addLog = (type: LogType, args: any[]) => {
      const newLog: LogMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        content: formatArgs(args),
        timestamp: new Date().toLocaleTimeString([], { hour12: false })
      };
      
      setLogs(prev => {
        const next = [...prev, newLog];
        if (next.length > 500) return next.slice(next.length - 500); // Limit history
        return next;
      });
    };

    // Override methods
    console.log = (...args) => {
      originalLog.apply(console, args);
      addLog('log', args);
    };

    console.warn = (...args) => {
      originalWarn.apply(console, args);
      addLog('warn', args);
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      addLog('error', args);
    };

    console.info = (...args) => {
      originalInfo.apply(console, args);
      addLog('info', args);
    };

    // Cleanup
    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen, isMinimized]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-[9999] bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-all active:scale-95 border border-slate-700 opacity-50 hover:opacity-100"
        title="打开调试控制台"
      >
        <Terminal className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div 
      className={`fixed left-4 right-4 md:left-auto md:right-4 z-[9999] bg-[#0d1117] border border-slate-700 shadow-2xl rounded-xl overflow-hidden flex flex-col font-mono text-sm transition-all duration-300 ease-in-out ${
        isMinimized ? 'bottom-4 h-12 w-auto min-w-[200px]' : 'bottom-4 h-[320px] md:w-[600px]'
      }`}
    >
      {/* Header */}
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700 select-none">
        <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
          <Terminal className="w-4 h-4" />
          <span>Console ({logs.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLogs([])} className="p-1 text-slate-400 hover:text-white" title="清空">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 text-slate-400 hover:text-white">
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-red-400">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Logs Body */}
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar bg-[#0d1117]">
          {logs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
              <Bug className="w-8 h-8 opacity-50" />
              <p className="text-xs">暂无日志</p>
            </div>
          )}
          {logs.map((log) => (
            <div 
              key={log.id} 
              className={`p-1.5 rounded text-xs break-all flex gap-2 border-l-2 ${
                log.type === 'error' ? 'bg-red-900/20 text-red-300 border-red-500' :
                log.type === 'warn' ? 'bg-amber-900/20 text-amber-300 border-amber-500' :
                log.type === 'info' ? 'bg-blue-900/20 text-blue-300 border-blue-500' :
                'text-slate-300 border-slate-600 hover:bg-white/5'
              }`}
            >
              <span className="text-slate-500 flex-shrink-0 select-none">[{log.timestamp}]</span>
              <div className="flex-1 whitespace-pre-wrap font-mono">
                {log.content}
              </div>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  );
};

export default DebugConsole;

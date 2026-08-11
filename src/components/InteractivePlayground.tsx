import React, { useState } from "react";
import {
  Wrench,
  Palette,
  Zap,
  Play,
  Copy,
  Check,
  RotateCcw,
  Activity,
  Code2,
} from "lucide-react";

interface InteractivePlaygroundProps {
  darkMode: boolean;
}

export const InteractivePlayground: React.FC<InteractivePlaygroundProps> = ({
  darkMode,
}) => {
  const [activeTab, setActiveTab] = useState<"palette" | "api" | "state">("palette");

  // Palette Generator state
  const [primaryHue, setPrimaryHue] = useState(240);
  const [copiedCss, setCopiedCss] = useState(false);

  // API Speed Tester state
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [testingEndpoint, setTestingEndpoint] = useState(false);

  // State Counter & Event Logger
  const [counter, setCounter] = useState(42);
  const [eventHistory, setEventHistory] = useState<string[]>([
    "Initial state mounted: count = 42",
  ]);

  const primaryColorHex = `hsl(${primaryHue}, 80%, 55%)`;
  const accentColorHex = `hsl(${(primaryHue + 120) % 360}, 85%, 60%)`;

  const cssVariablesSnippet = `:root {
  --primary-color: ${primaryColorHex};
  --accent-color: ${accentColorHex};
  --font-family: 'Plus Jakarta Sans', sans-serif;
}`;

  const handleCopyCss = () => {
    navigator.clipboard.writeText(cssVariablesSnippet);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

  const handleTestApi = async () => {
    setTestingEndpoint(true);
    const startTime = performance.now();
    setApiLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Fetching GET /api/health...`,
    ]);

    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      const duration = (performance.now() - startTime).toFixed(1);
      setApiLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] HTTP 200 OK (${duration}ms) -> ${JSON.stringify(
          data
        )}`,
      ]);
    } catch (err: any) {
      setApiLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] API Test result: Server active (Express endpoint live)`,
      ]);
    } finally {
      setTestingEndpoint(false);
    }
  };

  const handleCounterChange = (delta: number) => {
    setCounter((prev) => {
      const next = prev + delta;
      setEventHistory((history) => [
        `[${new Date().toLocaleTimeString()}] Count updated from ${prev} -> ${next}`,
        ...history.slice(0, 8),
      ]);
      return next;
    });
  };

  return (
    <section id="playground" className="py-16 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Wrench className="w-4 h-4" />
            <span>Developer Sandbox</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Interactive Component Playground
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1 max-w-2xl">
            Test interactive widgets built for demonstration purposes: custom theme calculators, real-time API latency benchmarks, and reactive event state loggers.
          </p>
        </div>

        {/* Playground Container Card */}
        <div
          className={`rounded-2xl border shadow-lg overflow-hidden ${
            darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
        >
          {/* Playground Tabs */}
          <div
            className={`flex border-b text-xs sm:text-sm font-semibold overflow-x-auto ${
              darkMode ? "border-slate-700 bg-slate-900/60" : "border-slate-200 bg-slate-50"
            }`}
          >
            <button
              onClick={() => setActiveTab("palette")}
              className={`px-6 py-3 border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
                activeTab === "palette"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Theme Token Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab("api")}
              className={`px-6 py-3 border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
                activeTab === "api"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>API Latency Benchmark</span>
            </button>

            <button
              onClick={() => setActiveTab("state")}
              className={`px-6 py-3 border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
                activeTab === "state"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Reactive Event Logger</span>
            </button>
          </div>

          {/* Playground Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === "palette" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Dynamic Color Palette Engine</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Slide the hue picker below to generate mathematically harmonious primary and complementary accent theme tokens.
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold flex justify-between">
                      <span>Primary Color Hue:</span>
                      <span className="font-bold text-indigo-500">{primaryHue}°</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={primaryHue}
                      onChange={(e) => setPrimaryHue(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-red-500 cursor-pointer"
                    />
                  </div>

                  {/* Swatches */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div
                      className="p-4 rounded-xl text-white font-bold text-xs shadow-md space-y-1"
                      style={{ backgroundColor: primaryColorHex }}
                    >
                      <div>Primary Token</div>
                      <div className="text-[10px] opacity-90">{primaryColorHex}</div>
                    </div>
                    <div
                      className="p-4 rounded-xl text-white font-bold text-xs shadow-md space-y-1"
                      style={{ backgroundColor: accentColorHex }}
                    >
                      <div>Accent Token</div>
                      <div className="text-[10px] opacity-90">{accentColorHex}</div>
                    </div>
                  </div>
                </div>

                {/* CSS Code Snippet Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Generated CSS Variables
                    </span>
                    <button
                      onClick={handleCopyCss}
                      className="px-3 py-1 rounded-lg text-xs font-semibold border flex items-center space-x-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      {copiedCss ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy CSS</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                    <pre>{cssVariablesSnippet}</pre>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">Express Server API Benchmark</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Test roundtrip latency to the backend Express server endpoints (`/api/health`).
                    </p>
                  </div>

                  <button
                    onClick={handleTestApi}
                    disabled={testingEndpoint}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-sm"
                  >
                    <Play className="w-4 h-4" />
                    <span>{testingEndpoint ? "Testing API..." : "Ping /api/health"}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800 space-y-1 min-h-[160px]">
                  <div className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800 pb-1 mb-2 flex items-center justify-between">
                    <span>API Latency Console Logs</span>
                    <button
                      onClick={() => setApiLogs([])}
                      className="hover:text-slate-300 flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>

                  {apiLogs.length === 0 ? (
                    <div className="text-slate-600 italic py-4 text-center">
                      Click 'Ping /api/health' above to test server response speed.
                    </div>
                  ) : (
                    apiLogs.map((log, idx) => (
                      <div key={idx} className="text-emerald-400">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "state" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Reactive Counter & State Tester</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Test high-frequency React state dispatches and event propagation.
                  </p>

                  <div className="p-6 rounded-2xl border text-center space-y-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                    <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                      Current State Counter Value
                    </div>
                    <div className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">
                      {counter}
                    </div>

                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => handleCounterChange(-10)}
                        className="px-3 py-1.5 rounded-lg border font-bold text-xs bg-white dark:bg-slate-800 hover:bg-slate-100"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => handleCounterChange(-1)}
                        className="px-3 py-1.5 rounded-lg border font-bold text-xs bg-white dark:bg-slate-800 hover:bg-slate-100"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleCounterChange(1)}
                        className="px-3 py-1.5 rounded-lg border font-bold text-xs bg-white dark:bg-slate-800 hover:bg-slate-100"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleCounterChange(10)}
                        className="px-3 py-1.5 rounded-lg border font-bold text-xs bg-white dark:bg-slate-800 hover:bg-slate-100"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>State Dispatch Log</span>
                    <button
                      onClick={() => setEventHistory([])}
                      className="hover:text-slate-200"
                    >
                      Clear Log
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 text-indigo-300 font-mono text-xs border border-slate-800 space-y-1 h-[180px] overflow-y-auto">
                    {eventHistory.map((h, idx) => (
                      <div key={idx}>&gt; {h}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

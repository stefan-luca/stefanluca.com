import React, { useState } from "react";
import {
  X,
  ExternalLink,
  Github,
  Star,
  CheckCircle,
  Copy,
  Check,
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Project } from "../types";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  darkMode: boolean;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  darkMode,
}) => {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState<"overview" | "code" | "sandbox">(
    "overview"
  );
  const [copiedCode, setCopiedCode] = useState(false);

  // Sandbox state variables for live simulation
  const [testConcurrentUsers, setTestConcurrentUsers] = useState(250);
  const [testCacheHitRate, setTestCacheHitRate] = useState(94);
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([
    "System ready. Click 'Run Load Test' to trigger simulated load test.",
  ]);

  const handleCopyCode = () => {
    if (project.codeSnippet?.code) {
      navigator.clipboard.writeText(project.codeSnippet.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleRunSimulation = () => {
    setIsRunningSim(true);
    setSimLogs([
      "Initializing load test against endpoint...",
      `Simulating ${testConcurrentUsers} concurrent active user sessions...`,
      "Verifying JWT token validation overhead: 1.2ms...",
    ]);

    setTimeout(() => {
      setSimLogs((prev) => [
        ...prev,
        `Cache hit ratio: ${testCacheHitRate}%`,
        `Average response time: ${(120 - testCacheHitRate * 0.8).toFixed(1)}ms`,
        "STATUS 200 OK: 100% throughput verified across test nodes.",
        "Load simulation completed successfully!",
      ]);
      setIsRunningSim(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div
        className={`relative w-full max-w-4xl rounded-2xl shadow-2xl border overflow-hidden z-10 transition-all max-h-[90vh] flex flex-col ${
          darkMode
            ? "bg-slate-900 border-slate-700 text-slate-100"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 z-20 ${
            darkMode ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-600 text-white">
              {project.category}
            </span>
            <h3 className="text-xl font-bold truncate max-w-md">{project.title}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div
          className={`px-6 border-b flex space-x-6 text-xs sm:text-sm font-semibold ${
            darkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"
          }`}
        >
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Overview & Architecture
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`py-3 border-b-2 transition-colors flex items-center space-x-1 ${
              activeTab === "code"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Code Highlights</span>
          </button>
          <button
            onClick={() => setActiveTab("sandbox")}
            className={`py-3 border-b-2 transition-colors flex items-center space-x-1 ${
              activeTab === "sandbox"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Interactive Sandbox</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Image Preview Banner */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Project Summary
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {project.fullDescription}
                </p>
              </div>

              {/* Key Highlights */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Technical Architecture Highlights
                </h4>
                <ul className="space-y-2">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs sm:text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-200">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Pills */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Technologies & Frameworks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "code" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Core Implementation ({project.codeSnippet?.language || "typescript"})
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1 rounded-lg text-xs font-medium border flex items-center space-x-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
                <pre>{project.codeSnippet?.code || `// Sample snippet for ${project.title}\nconsole.log("Project test suite loaded!");`}</pre>
              </div>
            </div>
          )}

          {activeTab === "sandbox" && (
            <div className="space-y-6">
              <div
                className={`p-4 rounded-xl border ${
                  darkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-sm font-bold mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Live System Performance Simulator</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Adjust simulated load parameters below to test how {project.title} responds under varying network & concurrency conditions.
                </p>

                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex justify-between mb-1">
                      <span>Simulated Users:</span>
                      <span className="font-bold text-indigo-500">{testConcurrentUsers} users</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="2000"
                      step="10"
                      value={testConcurrentUsers}
                      onChange={(e) => setTestConcurrentUsers(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex justify-between mb-1">
                      <span>Redis Cache Hit Rate:</span>
                      <span className="font-bold text-indigo-500">{testCacheHitRate}%</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="99"
                      value={testCacheHitRate}
                      onChange={(e) => setTestCacheHitRate(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={handleRunSimulation}
                  disabled={isRunningSim}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-2 transition-all disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isRunningSim ? "Simulating..." : "Run Simulated Stress Test"}</span>
                </button>
              </div>

              {/* Console Output */}
              <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800 pb-1 mb-2 flex items-center justify-between">
                  <span>Simulation Telemetry Output</span>
                  <button
                    onClick={() =>
                      setSimLogs(["System ready. Click 'Run Simulated Stress Test'."])
                    }
                    className="hover:text-slate-300 flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
                {simLogs.map((log, idx) => (
                  <div key={idx} className="text-emerald-400">
                    &gt; {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Links */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="flex items-center space-x-3 text-xs">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repo</span>
            </a>
            <span>•</span>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Application</span>
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

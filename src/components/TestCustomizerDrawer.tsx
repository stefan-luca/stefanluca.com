import React, { useState } from "react";
import {
  X,
  Sliders,
  Plus,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  Save,
  Layers,
} from "lucide-react";
import { DeveloperProfile, Project } from "../types";

interface TestCustomizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DeveloperProfile;
  onUpdateProfile: (updated: DeveloperProfile) => void;
  onResetProfiles: () => void;
  darkMode: boolean;
}

export const TestCustomizerDrawer: React.FC<TestCustomizerDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onResetProfiles,
  darkMode,
}) => {
  if (!isOpen) return null;

  const [activeSection, setActiveSection] = useState<"profile" | "addProject" | "json">(
    "profile"
  );

  // Editable Profile fields state
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [bio, setBio] = useState(profile.bio);
  const [email, setEmail] = useState(profile.email);
  const [location, setLocation] = useState(profile.location);

  // New Project State
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjCategory, setNewProjCategory] = useState<
    "Full Stack" | "Frontend UI" | "AI / ML" | "DevOps" | "Mobile"
  >("Full Stack");
  const [newProjShortDesc, setNewProjShortDesc] = useState("");
  const [newProjTags, setNewProjTags] = useState("React, TypeScript, Express");

  // JSON Import/Export
  const [jsonInput, setJsonInput] = useState(JSON.stringify(profile, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = () => {
    onUpdateProfile({
      ...profile,
      name,
      title,
      bio,
      email,
      location,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjShortDesc.trim()) return;

    const newProject: Project = {
      id: `proj-custom-${Date.now()}`,
      title: newProjTitle.trim(),
      shortDescription: newProjShortDesc.trim(),
      fullDescription: `${newProjShortDesc.trim()} Built for testing custom project additions in the portfolio sandbox.`,
      category: newProjCategory,
      tags: newProjTags.split(",").map((t) => t.trim()).filter(Boolean),
      featured: true,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=500",
      githubUrl: "https://github.com/example/custom-test-project",
      liveUrl: "https://example.com",
      stars: 42,
      metrics: "Custom Test Project",
      highlights: ["Dynamically added via Test Control Panel", "Verified reactive state updates"],
    };

    onUpdateProfile({
      ...profile,
      projects: [newProject, ...profile.projects],
    });

    setNewProjTitle("");
    setNewProjShortDesc("");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.name || !parsed.projects) {
        throw new Error("Invalid profile JSON structure.");
      }
      onUpdateProfile(parsed);
      setJsonError(null);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON input.");
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.id}_portfolio_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      {/* Slide-over Drawer */}
      <div
        className={`relative w-full max-w-md h-full shadow-2xl border-l z-10 flex flex-col transition-all ${
          darkMode
            ? "bg-slate-900 border-slate-800 text-slate-100"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {/* Drawer Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-base">Test Customizer Panel</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation */}
        <div
          className={`px-6 border-b flex space-x-4 text-xs font-semibold ${
            darkMode ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-50"
          }`}
        >
          <button
            onClick={() => setActiveSection("profile")}
            className={`py-3 border-b-2 transition-colors ${
              activeSection === "profile"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Edit Profile
          </button>

          <button
            onClick={() => setActiveSection("addProject")}
            className={`py-3 border-b-2 transition-colors ${
              activeSection === "addProject"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            + Add Project
          </button>

          <button
            onClick={() => setActiveSection("json")}
            className={`py-3 border-b-2 transition-colors ${
              activeSection === "json"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Import/Export
          </button>
        </div>

        {/* Success Banner */}
        {savedSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeSection === "profile" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-slate-50 border-slate-300 text-slate-800"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-slate-50 border-slate-300 text-slate-800"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Short Bio Summary
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-slate-50 border-slate-300 text-slate-800"
                  }`}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                      darkMode
                        ? "bg-slate-800 border-slate-700 text-slate-100"
                        : "bg-slate-50 border-slate-300 text-slate-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                      darkMode
                        ? "bg-slate-800 border-slate-700 text-slate-100"
                        : "bg-slate-50 border-slate-300 text-slate-800"
                    }`}
                  />
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          )}

          {activeSection === "addProject" && (
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="e.g. AI Workflow Orchestrator"
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-slate-50 border-slate-300 text-slate-800"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  value={newProjCategory}
                  onChange={(e) =>
                    setNewProjCategory(
                      e.target.value as "Full Stack" | "Frontend UI" | "AI / ML" | "DevOps" | "Mobile"
                    )
                  }
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-slate-50 border-slate-300 text-slate-800"
                  }`}
                >
                  <option value="Full Stack">Full Stack</option>
                  <option value="Frontend UI">Frontend UI</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Mobile">Mobile</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Short Description *
                </label>
                <textarea
                  rows={3}
                  value={newProjShortDesc}
                  onChange={(e) => setNewProjShortDesc(e.target.value)}
                  placeholder="Brief overview of what this test project does..."
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-slate-50 border-slate-300 text-slate-800"
                  }`}
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newProjTags}
                  onChange={(e) => setNewProjTags(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-slate-50 border-slate-300 text-slate-800"
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Test Project</span>
              </button>
            </form>
          )}

          {activeSection === "json" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Profile JSON Specification</span>
                <button
                  onClick={handleExportJson}
                  className="px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center space-x-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>

              <textarea
                rows={10}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className={`w-full p-3 font-mono text-xs rounded-xl border outline-none ${
                  darkMode
                    ? "bg-slate-950 border-slate-800 text-indigo-300"
                    : "bg-slate-900 border-slate-800 text-emerald-400"
                }`}
              ></textarea>

              {jsonError && (
                <div className="text-xs text-rose-500 font-semibold">{jsonError}</div>
              )}

              <button
                onClick={handleImportJson}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Apply Imported JSON</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Reset */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between sticky bottom-0 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}
        >
          <button
            onClick={onResetProfiles}
            className="text-xs font-semibold text-rose-500 hover:underline flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Preset Profiles</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

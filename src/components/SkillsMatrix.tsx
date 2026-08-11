import React, { useState } from "react";
import { Cpu, Search, ThumbsUp, CheckCircle, Flame } from "lucide-react";
import { SkillCategory } from "../types";

interface SkillsMatrixProps {
  skillCategories: SkillCategory[];
  darkMode: boolean;
}

export const SkillsMatrix: React.FC<SkillsMatrixProps> = ({
  skillCategories,
  darkMode,
}) => {
  const [filterQuery, setFilterQuery] = useState("");
  const [endorsementsState, setEndorsementsState] = useState<
    Record<string, { count: number; endorsed: boolean }>
  >({});

  const handleEndorse = (skillName: string, initialCount: number) => {
    setEndorsementsState((prev) => {
      const current = prev[skillName] || { count: initialCount, endorsed: false };
      return {
        ...prev,
        [skillName]: {
          count: current.endorsed ? current.count - 1 : current.count + 1,
          endorsed: !current.endorsed,
        },
      };
    });
  };

  return (
    <section id="skills" className="py-16 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4" />
              <span>Technical Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Skills & Proficiency Matrix
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1 max-w-xl">
              Verified core engineering competencies. Click the endorsement button on any skill to test interactive state updates.
            </p>
          </div>

          {/* Filter Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search skill (e.g. React)..."
              className={`w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-all ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-500"
                  : "bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-indigo-600"
              }`}
            />
          </div>
        </div>

        {/* Skill Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((cat, idx) => {
            const filteredItems = cat.items.filter((item) =>
              item.name.toLowerCase().includes(filterQuery.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border shadow-sm transition-all ${
                  darkMode
                    ? "bg-slate-800/90 border-slate-700"
                    : "bg-white border-slate-200"
                }`}
              >
                <h3 className="text-lg font-bold mb-4 pb-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span>{cat.categoryName}</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                    {filteredItems.length} skills
                  </span>
                </h3>

                <div className="space-y-4">
                  {filteredItems.map((item) => {
                    const currentEndorsement = endorsementsState[item.name] || {
                      count: item.endorsements,
                      endorsed: false,
                    };

                    return (
                      <div key={item.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                            <span>{item.name}</span>
                            {item.level >= 95 && (
                              <Flame
                                className="w-3.5 h-3.5 text-amber-500 fill-amber-500"
                                title="Top Proficiency"
                              />
                            )}
                          </span>

                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] text-slate-400">
                              {item.years} yrs exp
                            </span>

                            {/* Endorse Button */}
                            <button
                              onClick={() => handleEndorse(item.name, item.endorsements)}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center space-x-1 transition-colors border ${
                                currentEndorsement.endorsed
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : darkMode
                                  ? "bg-slate-700/60 border-slate-600 text-slate-300 hover:bg-slate-600"
                                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                              }`}
                              title="Endorse this skill for testing"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>{currentEndorsement.count}</span>
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${item.level}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

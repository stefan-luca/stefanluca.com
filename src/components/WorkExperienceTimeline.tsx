import React from "react";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { WorkExperience } from "../types";

interface WorkExperienceTimelineProps {
  experiences: WorkExperience[];
  darkMode: boolean;
}

export const WorkExperienceTimeline: React.FC<WorkExperienceTimelineProps> = ({
  experiences,
  darkMode,
}) => {
  return (
    <section id="experience" className="py-16 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Briefcase className="w-4 h-4" />
            <span>Career Path</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Work Experience Timeline
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1 max-w-xl">
            A history of staff engineering roles, team leadership, and measurable product impacts.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full border-4 shadow-sm flex items-center justify-center transition-transform group-hover:scale-125 ${
                  exp.isCurrent
                    ? "bg-indigo-600 border-indigo-200 dark:border-indigo-900"
                    : "bg-slate-400 dark:bg-slate-600 border-white dark:border-slate-900"
                }`}
              >
                {exp.isCurrent && <span className="w-2 h-2 rounded-full bg-white"></span>}
              </div>

              {/* Experience Card */}
              <div
                className={`p-6 sm:p-8 rounded-2xl border shadow-sm transition-all group-hover:shadow-md ${
                  darkMode
                    ? "bg-slate-800/90 border-slate-700"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {exp.role}
                    </h3>
                    <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {exp.company}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.period}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{exp.location}</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {exp.summary}
                </p>

                {/* Key Achievements */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Key Achievements
                  </h4>
                  <ul className="space-y-1.5">
                    {exp.achievements.map((ach, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills used */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  {exp.skillsUsed.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

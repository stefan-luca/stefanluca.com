import React, { useState } from "react";
import {
  Search,
  Star,
  ExternalLink,
  Github,
  Maximize2,
  Sparkles,
  Layers,
  BarChart2,
} from "lucide-react";
import { Project } from "../types";

interface ProjectShowcaseProps {
  projects: Project[];
  darkMode: boolean;
  onSelectProject: (project: Project) => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  projects,
  darkMode,
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Full Stack", "Frontend UI", "AI / ML", "DevOps"];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === "All" || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-16 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              <span>Portfolio Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Featured Engineering Projects
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1 max-w-xl">
              Explore web applications, AI integrations, and cloud architectures. Click any project to open the interactive sandbox modal.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by tech or keyword..."
              className={`w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-all ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-500"
                  : "bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-indigo-600"
              }`}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : darkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div
            className={`p-12 text-center rounded-2xl border ${
              darkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
            }`}
          >
            <p className="text-slate-500 text-sm">
              No projects found matching "{searchQuery}". Try selecting "All" or clearing search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`group rounded-2xl border overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                  darkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-slate-200"
                }`}
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium border border-slate-700/50">
                      {project.category}
                    </div>

                    {/* Featured / Star Count */}
                    <div className="absolute top-3 right-3 flex items-center space-x-2">
                      {project.featured && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 font-bold text-[10px] flex items-center space-x-1">
                          <Sparkles className="w-3 h-3" />
                          <span>FEATURED</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-amber-400 font-medium text-xs flex items-center space-x-1 border border-slate-700">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{project.stars}</span>
                      </span>
                    </div>

                    {/* Quick Metrics Bar if available */}
                    {project.metrics && (
                      <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-indigo-950/80 backdrop-blur-md border border-indigo-700/50 text-indigo-200 text-xs flex items-center space-x-1.5">
                        <BarChart2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="font-medium truncate">{project.metrics}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md ${
                            darkMode
                              ? "bg-slate-700/60 text-slate-300"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 mt-4">
                  <div className="flex items-center space-x-3 pt-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center space-x-1 text-xs"
                      title="View GitHub Code"
                    >
                      <Github className="w-4 h-4" />
                      <span className="hidden sm:inline">Code</span>
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center space-x-1 text-xs"
                      title="Live App URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">Live Demo</span>
                    </a>
                  </div>

                  <button
                    onClick={() => onSelectProject(project)}
                    className="pt-3 inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>Sandbox Modal</span>
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

import React from "react";
import {
  MapPin,
  Mail,
  Github,
  Linkedin,
  Twitter,
  FileDown,
  Sparkles,
  Briefcase,
  Code2,
  Award,
  CheckCircle2,
} from "lucide-react";
import { DeveloperProfile } from "../types";

interface HeroProps {
  profile: DeveloperProfile;
  darkMode: boolean;
  onOpenAiChat: () => void;
  onOpenCustomizer: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  profile,
  darkMode,
  onOpenAiChat,
  onOpenCustomizer,
}) => {
  const handleDownloadResume = () => {
    // Generate test resume download content
    const resumeText = `=====================================================
RESUME: ${profile.name}
${profile.title}
Email: ${profile.email} | Location: ${profile.location}
GitHub: ${profile.github} | LinkedIn: ${profile.linkedin}
=====================================================

BIO:
${profile.bio}

ABOUT ME:
${profile.aboutMe}

KEY SKILLS:
${profile.skills.map((cat) => `- ${cat.categoryName}: ${cat.items.map((i) => i.name).join(", ")}`).join("\n")}

WORK EXPERIENCE:
${profile.experience
  .map(
    (exp) => `* ${exp.role} @ ${exp.company} (${exp.period})
  Location: ${exp.location}
  Summary: ${exp.summary}
  Achievements:\n  - ${exp.achievements.join("\n  - ")}
`
  )
  .join("\n")}

PROJECT SHOWCASE:
${profile.projects.map((p) => `* ${p.title} (${p.category}): ${p.shortDescription}`).join("\n")}
`;

    const blob = new Blob([resumeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.name.toLowerCase().replace(/\s+/g, "_")}_test_resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background Subtle Pattern Gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-60 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-medium shadow-xs bg-indigo-50/80 border-indigo-200 text-indigo-800 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{profile.statusBadge}</span>
            </div>

            {/* Title & Name */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Hi, I'm{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {profile.name}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-300">
                {profile.title}
              </p>
            </div>

            {/* Location & Contact Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4 text-indigo-500" />
                <span>{profile.email}</span>
              </div>
            </div>

            {/* Bio summary */}
            <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
              {profile.bio}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md hover:bg-indigo-500 transition-all hover:scale-[1.02]"
              >
                <Code2 className="w-4 h-4" />
                <span>Explore Work</span>
              </a>

              <button
                onClick={onOpenAiChat}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold text-sm shadow-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all"
              >
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Ask AI Bio Assistant</span>
              </button>

              <button
                onClick={handleDownloadResume}
                className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
                title="Export & Download test profile details as plain text"
              >
                <FileDown className="w-4 h-4 text-slate-500" />
                <span>Download Resume</span>
              </button>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Connect:
              </span>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={profile.twitter}
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="X/Twitter Profile"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Profile Card / Avatar Column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group max-w-sm w-full">
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition duration-500"></div>

              {/* Main Card */}
              <div
                className={`relative rounded-3xl p-6 border shadow-2xl transition-all ${
                  darkMode
                    ? "bg-slate-800/95 border-slate-700"
                    : "bg-white/95 border-slate-200"
                }`}
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-6 shadow-md border border-slate-200 dark:border-slate-700">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs flex items-center justify-between">
                    <span className="font-medium">Test Mode Active</span>
                    <button
                      onClick={onOpenCustomizer}
                      className="text-[11px] underline text-indigo-300 hover:text-indigo-200"
                    >
                      Edit Details
                    </button>
                  </div>
                </div>

                {/* Quick Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`p-3 rounded-2xl border ${
                      darkMode
                        ? "bg-slate-900/60 border-slate-700"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Experience</span>
                    </div>
                    <div className="text-xl font-bold">
                      {profile.stats.yearsExperience}+ Years
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-2xl border ${
                      darkMode
                        ? "bg-slate-900/60 border-slate-700"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Projects</span>
                    </div>
                    <div className="text-xl font-bold">
                      {profile.stats.projectsCompleted}+ Built
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-2xl border ${
                      darkMode
                        ? "bg-slate-900/60 border-slate-700"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <Award className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Commits</span>
                    </div>
                    <div className="text-xl font-bold">
                      {profile.stats.codeCommits}+
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-2xl border ${
                      darkMode
                        ? "bg-slate-900/60 border-slate-700"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Satisfaction</span>
                    </div>
                    <div className="text-xl font-bold">
                      {profile.stats.satisfactionRate}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from "react";
import { Code2, ArrowUp, Github, Linkedin, Twitter, Sparkles } from "lucide-react";
import { DeveloperProfile } from "../types";

interface FooterProps {
  profile: DeveloperProfile;
  darkMode: boolean;
  onOpenCustomizer: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  profile,
  darkMode,
  onOpenCustomizer,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className={`border-t transition-colors py-12 ${
        darkMode
          ? "bg-slate-950 border-slate-800 text-slate-400"
          : "bg-slate-50 border-slate-200 text-slate-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-slate-100 text-base">
              <div className="p-1 rounded-md bg-indigo-600 text-white">
                <Code2 className="w-4 h-4" />
              </div>
              <span>{profile.name} — Portfolio Showcase</span>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              {profile.title} • Built for testing and demonstrating React 19, TypeScript, Express, and Gemini AI.
            </p>
          </div>

          {/* Socials & Back-to-top */}
          <div className="flex items-center space-x-4">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg border hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg border hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={profile.twitter}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg border hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-xs"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Interactive Portfolio Test Suite Active</span>
            <button
              onClick={onOpenCustomizer}
              className="ml-2 font-semibold underline text-indigo-500 hover:text-indigo-400"
            >
              Control Panel
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

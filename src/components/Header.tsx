import React, { useState } from "react";
import {
  Code2,
  Sparkles,
  SlidersHorizontal,
  Moon,
  Sun,
  ChevronDown,
  UserCheck,
  Inbox,
  Menu,
  X,
} from "lucide-react";
import { DeveloperProfile } from "../types";

interface HeaderProps {
  currentProfile: DeveloperProfile;
  profiles: DeveloperProfile[];
  onSelectProfile: (id: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAiChat: () => void;
  onOpenCustomizer: () => void;
  onOpenInbox: () => void;
  unreadCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentProfile,
  profiles,
  onSelectProfile,
  darkMode,
  onToggleDarkMode,
  onOpenAiChat,
  onOpenCustomizer,
  onOpenInbox,
  unreadCount,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Playground", href: "#playground" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-200 border-b ${
        darkMode
          ? "bg-slate-900/90 border-slate-800 text-slate-100"
          : "bg-white/90 border-slate-200 text-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Profile Switcher */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 font-semibold text-lg tracking-tight">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <Code2 className="w-5 h-5" />
            </div>
            <span>{currentProfile.name}</span>
          </div>

          {/* Profile Switcher Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className={`flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full font-medium border transition-colors ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
              }`}
              title="Switch developer test profile"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Test Profile</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {profileDropdownOpen && (
              <div
                className={`absolute left-0 mt-2 w-56 rounded-xl shadow-xl border p-1 z-50 ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Test Profile
                </div>
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProfile(p.id);
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      p.id === currentProfile.id
                        ? "bg-indigo-600 text-white font-medium"
                        : darkMode
                        ? "hover:bg-slate-700 text-slate-300"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-[10px] opacity-80 line-clamp-1">
                        {p.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`transition-colors ${
                darkMode
                  ? "text-slate-300 hover:text-indigo-400"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions / Test Controls */}
        <div className="flex items-center space-x-2">
          {/* AI Assistant Button */}
          <button
            onClick={onOpenAiChat}
            className="flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:from-indigo-500 hover:to-violet-500 transition-all"
            title="Ask AI Assistant about developer skills and experience"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Test Inbox Button */}
          <button
            onClick={onOpenInbox}
            className={`relative p-2 rounded-lg border transition-colors ${
              darkMode
                ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
            }`}
            title="View Test Contact Form Submissions"
          >
            <Inbox className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Test Suite / Customizer Drawer Trigger */}
          <button
            onClick={onOpenCustomizer}
            className={`p-2 rounded-lg border transition-colors flex items-center space-x-1 ${
              darkMode
                ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
            }`}
            title="Open Test Customizer Panel"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-semibold hidden lg:inline">Test Control</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-lg border transition-colors ${
              darkMode
                ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
            }`}
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-slate-300 dark:border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-b px-4 py-3 space-y-3 ${
            darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-300 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-400 col-span-2">Switch Test Profile</span>
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectProfile(p.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-xs p-2 rounded-lg text-left ${
                  p.id === currentProfile.id
                    ? "bg-indigo-600 text-white font-medium"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col space-y-2 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-indigo-600"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

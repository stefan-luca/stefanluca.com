import React, { useState, useEffect } from "react";
import { presetProfiles } from "./data/initialData";
import { DeveloperProfile, Project } from "./types";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProjectShowcase } from "./components/ProjectShowcase";
import { ProjectDetailModal } from "./components/ProjectDetailModal";
import { SkillsMatrix } from "./components/SkillsMatrix";
import { WorkExperienceTimeline } from "./components/WorkExperienceTimeline";
import { InteractivePlayground } from "./components/InteractivePlayground";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { ContactSection } from "./components/ContactSection";
import { TestInboxModal } from "./components/TestInboxModal";
import { AiChatAssistant } from "./components/AiChatAssistant";
import { TestCustomizerDrawer } from "./components/TestCustomizerDrawer";
import { Footer } from "./components/Footer";

export default function App() {
  // Profiles state
  const [profiles, setProfiles] = useState<DeveloperProfile[]>(() => {
    const saved = localStorage.getItem("portfolio_profiles_test");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return presetProfiles;
      }
    }
    return presetProfiles;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>("alex-rivers");
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Modal / Drawer visibility state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  // Sync active profile
  const currentProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0] || presetProfiles[0];

  // Save profile changes
  const handleUpdateProfile = (updated: DeveloperProfile) => {
    const nextProfiles = profiles.map((p) => (p.id === updated.id ? updated : p));
    setProfiles(nextProfiles);
    localStorage.setItem("portfolio_profiles_test", JSON.stringify(nextProfiles));
  };

  const handleResetProfiles = () => {
    setProfiles(presetProfiles);
    localStorage.removeItem("portfolio_profiles_test");
  };

  // Sync document dark class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 font-sans selection:bg-indigo-500 selection:text-white ${
        darkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"
      }`}
    >
      {/* Navigation Header */}
      <Header
        currentProfile={currentProfile}
        profiles={profiles}
        onSelectProfile={(id) => setActiveProfileId(id)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenAiChat={() => setAiChatOpen(true)}
        onOpenCustomizer={() => setCustomizerOpen(true)}
        onOpenInbox={() => {
          setInboxOpen(true);
          setUnreadCount(0);
        }}
        unreadCount={unreadCount}
      />

      {/* Main Content Area */}
      <main>
        {/* Hero Banner Section */}
        <Hero
          profile={currentProfile}
          darkMode={darkMode}
          onOpenAiChat={() => setAiChatOpen(true)}
          onOpenCustomizer={() => setCustomizerOpen(true)}
        />

        {/* Filterable Projects Showcase */}
        <ProjectShowcase
          projects={currentProfile.projects}
          darkMode={darkMode}
          onSelectProject={(project) => setSelectedProject(project)}
        />

        {/* Interactive Skills Matrix */}
        <SkillsMatrix
          skillCategories={currentProfile.skills}
          darkMode={darkMode}
        />

        {/* Career Experience Timeline */}
        <WorkExperienceTimeline
          experiences={currentProfile.experience}
          darkMode={darkMode}
        />

        {/* Live Interactive Sandbox / Component Playground */}
        <InteractivePlayground darkMode={darkMode} />

        {/* Peer Testimonials Section */}
        <TestimonialsSection
          testimonials={currentProfile.testimonials}
          darkMode={darkMode}
        />

        {/* Functional Contact Form Section */}
        <ContactSection
          profile={currentProfile}
          darkMode={darkMode}
          onMessageSent={() => setUnreadCount((prev) => prev + 1)}
          onOpenInbox={() => setInboxOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        profile={currentProfile}
        darkMode={darkMode}
        onOpenCustomizer={() => setCustomizerOpen(true)}
      />

      {/* Modals and Drawers */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        darkMode={darkMode}
      />

      <AiChatAssistant
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        profile={currentProfile}
        darkMode={darkMode}
      />

      <TestInboxModal
        isOpen={inboxOpen}
        onClose={() => setInboxOpen(false)}
        darkMode={darkMode}
      />

      <TestCustomizerDrawer
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        profile={currentProfile}
        onUpdateProfile={handleUpdateProfile}
        onResetProfiles={handleResetProfiles}
        darkMode={darkMode}
      />
    </div>
  );
}

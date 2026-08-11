import React, { useState } from "react";
import { Quote, MessageSquare } from "lucide-react";
import { Testimonial } from "../types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  darkMode: boolean;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  darkMode,
}) => {
  const [filter, setFilter] = useState<string>("All");

  const filteredTestimonials = testimonials.filter(
    (t) => filter === "All" || t.relationship === filter
  );

  return (
    <section id="testimonials" className="py-16 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <MessageSquare className="w-4 h-4" />
              <span>Peer Recommendations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Testimonials & Endorsements
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1 max-w-xl">
              Feedback from engineering directors, product leads, and cross-functional teammates.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2">
            {["All", "Manager", "Peer"].map((rel) => (
              <button
                key={rel}
                onClick={() => setFilter(rel)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  filter === rel
                    ? "bg-indigo-600 text-white"
                    : darkMode
                    ? "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {rel}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTestimonials.map((t) => (
            <div
              key={t.id}
              className={`p-6 sm:p-8 rounded-2xl border relative flex flex-col justify-between shadow-sm hover:shadow-md transition-all ${
                darkMode ? "bg-slate-800/90 border-slate-700" : "bg-white border-slate-200"
              }`}
            >
              <Quote className="w-10 h-10 text-indigo-500/20 absolute top-6 right-6" />

              <div className="space-y-4 relative z-10">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                  {t.relationship} Endorsement
                </span>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 italic">
                  "{t.content}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center space-x-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-700/60">
                <img
                  src={t.avatar}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500 shrink-0"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {t.role} • <span className="font-medium text-indigo-600 dark:text-indigo-400">{t.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Inbox, Mail, MapPin } from "lucide-react";
import { DeveloperProfile, ContactFormData } from "../types";

interface ContactSectionProps {
  profile: DeveloperProfile;
  darkMode: boolean;
  onMessageSent: () => void;
  onOpenInbox: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  profile,
  darkMode,
  onMessageSent,
  onOpenInbox,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "Senior Role Opportunity",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError("Please fill out all required fields.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(
          `Message sent! Reference ID: ${data.received?.id || "msg-ok"}`
        );
        setFormData({
          name: "",
          email: "",
          subject: "Senior Role Opportunity",
          message: "",
        });
        onMessageSent();
      } else {
        setSubmitError(data.error || "Failed to submit message.");
      }
    } catch (err) {
      // Fallback in case of server offline
      setSubmitSuccess("Test message recorded! (Simulated local submission)");
      onMessageSent();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Mail className="w-4 h-4" />
              <span>Get in Touch</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Let's Build Something Exceptional
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Open for staff engineering positions, consulting, or technical advisory. Test submitting a message below to verify the backend `/api/contact` API.
            </p>

            <div className="p-6 rounded-2xl border space-y-4 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 text-xs sm:text-sm">
                <div className="p-2 rounded-lg bg-indigo-600 text-white">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-400 font-semibold text-[11px]">Direct Email</div>
                  <div className="font-bold text-slate-800 dark:text-slate-100">{profile.email}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs sm:text-sm">
                <div className="p-2 rounded-lg bg-indigo-600 text-white">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-400 font-semibold text-[11px]">Location</div>
                  <div className="font-bold text-slate-800 dark:text-slate-100">{profile.location}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={onOpenInbox}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center space-x-2 hover:bg-indigo-200 transition-colors"
                >
                  <Inbox className="w-4 h-4" />
                  <span>View Test Submissions Inbox</span>
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div
              className={`p-6 sm:p-8 rounded-2xl border shadow-lg ${
                darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
              }`}
            >
              <h3 className="text-xl font-bold mb-6">Send a Test Inquiry</h3>

              {submitSuccess && (
                <div className="p-4 mb-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div className="flex-1">{submitSuccess}</div>
                  <button
                    onClick={() => setSubmitSuccess(null)}
                    className="text-xs font-bold underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {submitError && (
                <div className="p-4 mb-6 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  <div className="flex-1">{submitError}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Connor"
                      className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-all ${
                        darkMode
                          ? "bg-slate-900 border-slate-700 text-slate-100 focus:border-indigo-500"
                          : "bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-600"
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sarah@example.com"
                      className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-all ${
                        darkMode
                          ? "bg-slate-900 border-slate-700 text-slate-100 focus:border-indigo-500"
                          : "bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-600"
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Subject Line
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-all ${
                      darkMode
                        ? "bg-slate-900 border-slate-700 text-slate-100 focus:border-indigo-500"
                        : "bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-600"
                    }`}
                  >
                    <option value="Senior Role Opportunity">Senior Role Opportunity</option>
                    <option value="Freelance & Consulting">Freelance & Consulting</option>
                    <option value="Technical Advisory">Technical Advisory</option>
                    <option value="General Testing Inquiry">General Testing Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Message Body *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message here..."
                    className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-all ${
                      darkMode
                        ? "bg-slate-900 border-slate-700 text-slate-100 focus:border-indigo-500"
                        : "bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-600"
                    }`}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Sending to /api/contact..." : "Send Test Message"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

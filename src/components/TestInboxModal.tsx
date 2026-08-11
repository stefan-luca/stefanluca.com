import React, { useState, useEffect } from "react";
import { X, Inbox, Mail, RefreshCw, CheckCircle, Clock } from "lucide-react";
import { TestMessage } from "../types";

interface TestInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const TestInboxModal: React.FC<TestInboxModalProps> = ({
  isOpen,
  onClose,
  darkMode,
}) => {
  if (!isOpen) return null;

  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div
        className={`relative w-full max-w-3xl rounded-2xl shadow-2xl border overflow-hidden z-10 max-h-[85vh] flex flex-col ${
          darkMode
            ? "bg-slate-900 border-slate-700 text-slate-100"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 z-20 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Inbox className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold">Test Contact Submissions Inbox</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchMessages}
              disabled={loading}
              className="p-1.5 rounded-lg border text-xs flex items-center space-x-1 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Refresh inbox"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No test messages received yet. Submit a message in the Contact form to see it appear here in real time!
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border transition-all ${
                  darkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm">{msg.name}</span>
                    <span className="text-xs text-slate-400">(&lt;{msg.email}&gt;)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(msg.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                  Subject: {msg.subject}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  {msg.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-3 border-t text-xs flex items-center justify-between ${
            darkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
          }`}
        >
          <span>Showing {messages.length} test submission(s)</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

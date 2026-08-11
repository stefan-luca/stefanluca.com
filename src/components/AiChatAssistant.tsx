import React, { useState, useRef, useEffect } from "react";
import { X, Sparkles, Send, Bot, User, Trash2, HelpCircle } from "lucide-react";
import { DeveloperProfile, ChatMessage } from "../types";

interface AiChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DeveloperProfile;
  darkMode: boolean;
}

export const AiChatAssistant: React.FC<AiChatAssistantProps> = ({
  isOpen,
  onClose,
  profile,
  darkMode,
}) => {
  if (!isOpen) return null;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: `Hello! I am ${profile.name}'s AI Bio Assistant powered by Gemini. Ask me anything about ${profile.name}'s technical skills, project architectures, work experience, or availability!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    `What is ${profile.name.split(" ")[0]}'s top tech stack?`,
    `Summarize ${profile.name.split(" ")[0]}'s AI project experience.`,
    `Is ${profile.name.split(" ")[0]} open to staff roles?`,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          profile,
        }),
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.reply || "Thank you for asking! Explore the projects showcase below for more details.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isFallback: data.isFallback,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: `[Local Response] ${profile.name} specializes in ${profile.skills[0]?.items.map((i) => i.name).slice(0, 3).join(", ") || "React, TypeScript"}. Feel free to contact via the email in the hero section!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Drawer Dialog */}
      <div
        className={`relative w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden z-10 h-[80vh] flex flex-col ${
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
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Ask {profile.name}'s AI Assistant</h3>
              <div className="text-[10px] text-slate-400">Powered by Gemini 2.5 Server API</div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() =>
                setMessages([
                  {
                    id: "reset-1",
                    sender: "ai",
                    text: `Chat cleared. Ask me anything about ${profile.name}!`,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                ])
              }
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  msg.sender === "user"
                    ? "bg-indigo-600"
                    : "bg-gradient-to-r from-purple-600 to-pink-600"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] space-y-1`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : darkMode
                      ? "bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-none"
                      : "bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <div
                  className={`text-[10px] text-slate-400 px-1 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 py-2">
              <Bot className="w-4 h-4 animate-bounce text-indigo-500" />
              <span>AI is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Sample Prompts */}
        <div
          className={`px-6 py-2 border-t overflow-x-auto flex space-x-2 ${
            darkMode ? "bg-slate-950/80 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}
        >
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div
          className={`p-4 border-t sticky bottom-0 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask anything about ${profile.name}...`}
              className={`flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border outline-none transition-all ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-500"
                  : "bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-indigo-600"
              }`}
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

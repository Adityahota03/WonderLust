import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  Send, 
  Trash2, 
  Compass, 
  Bot, 
  User, 
  ChevronDown, 
  RotateCcw,
  Zap,
  Globe2
} from 'lucide-react';
import { chatbotAPI } from '../../services/api';

const INITIAL_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: `👋 **Hi there, explorer!** I'm **WanderBot**, your AI travel concierge powered by Groq high-speed AI.\n\nAsk me anything: custom multi-day itineraries, top hotels in Bali or Paris, transport advice, or budget travel tips!`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

// Formatter to render basic markdown: bold, bullet points, headers, emojis cleanly
const FormattedMessage = ({ text }) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-slate-800">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet point
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-brand-500 font-bold leading-5">•</span>
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(bulletText) }} />
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-brand-600 font-semibold min-w-[1.2rem]">{numMatch[1]}.</span>
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(numMatch[2]) }} />
            </div>
          );
        }

        // Headers
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-slate-900 text-sm pt-1" dangerouslySetInnerHTML={{ __html: formatInline(trimmed.substring(4)) }} />
          );
        }
        if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
          return (
            <h3 key={idx} className="font-bold text-slate-900 text-base pt-1.5" dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace(/^#+\s*/, '')) }} />
          );
        }

        return (
          <p key={idx} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
        );
      })}
    </div>
  );
};

// Helper to format inline markdown like **bold**, *italic*, and `code`
function formatInline(str) {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-xs font-mono text-brand-600">$1</code>');
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('wanderlust_chat_messages');
      return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
    } catch {
      return [INITIAL_MESSAGE];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Persist messages in session storage
  useEffect(() => {
    try {
      sessionStorage.setItem('wanderlust_chat_messages', JSON.stringify(messages));
    } catch (e) {
      console.warn('Could not save chat messages to sessionStorage', e);
    }
  }, [messages]);

  // Load starter suggestions from backend
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await chatbotAPI.getSuggestions();
        if (res.data?.suggestions) {
          setSuggestions(res.data.suggestions);
        }
      } catch (err) {
        // Fallback default suggestions
        setSuggestions([
          { id: '1', title: '3 Days in Tokyo 🗼', prompt: 'Can you design a 3-day itinerary for Tokyo?' },
          { id: '2', title: 'Top Stays in Bali 🌴', prompt: 'What are the best areas and hotels to stay in Bali?' },
          { id: '3', title: 'Europe on a Budget 🎒', prompt: 'Give me practical tips for budget travel across Europe.' },
          { id: '4', title: 'Romantic Paris Spots 🥐', prompt: 'What are romantic hidden gems and bistros in Paris?' }
        ]);
      }
    };
    fetchSuggestions();
  }, []);

  // Auto scroll to bottom
  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('auto');
      setTimeout(() => inputRef.current?.focus(), 150);
      setHasUnread(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('smooth');
    }
  }, [messages, loading]);

  const handleSend = async (messageText) => {
    const query = (messageText || input).trim();
    if (!query || loading) return;

    setInput('');

    const userMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Send conversation context to backend
      const apiPayload = newMessages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));

      const res = await chatbotAPI.sendMessage(apiPayload);
      const replyText = res.data?.reply || "I couldn't process that response. Please try again!";

      const botMessage = {
        id: `b-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        model: res.data?.model,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "⚠️ I encountered a temporary connection issue reaching the AI service. Please verify your internet connection or try again in a few seconds.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    try {
      sessionStorage.removeItem('wanderlust_chat_messages');
    } catch {}
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <button
              id="open-chatbot-btn"
              onClick={() => setIsOpen(true)}
              className="group flex items-center gap-3 px-4 py-3.5 rounded-full bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 text-white shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 border border-white/20 transition-all duration-300"
              aria-label="Open AI Travel Assistant"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-brand-700 rounded-full animate-pulse" />
              </div>
              
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold leading-tight flex items-center gap-1">
                  WanderBot AI
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-white/20 rounded">Groq</span>
                </p>
                <p className="text-[11px] text-brand-100 font-normal">Plan your dream trip</p>
              </div>

              {hasUnread && (
                <span className="sm:hidden absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full ring-2 ring-white" />
              )}
            </button>
          </motion.div>
        )}
      </div>

      {/* Chat Window Drawer / Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[440px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200/90 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white flex items-center justify-between shadow-sm relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-md">
                    <Compass className="w-5 h-5 text-white animate-spin-slow" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-sm tracking-tight">WanderBot AI</h3>
                    <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-400/30 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-amber-300" />
                      Groq
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">Your AI Travel Concierge</p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Clear chat history"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close chatbot window"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Suggestion Chips (if few messages) */}
            {messages.length <= 2 && suggestions.length > 0 && (
              <div className="bg-slate-50 border-b border-slate-200/80 px-3 py-2">
                <p className="text-[11px] font-medium text-slate-500 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-600" />
                  Popular Travel Inquiries:
                </p>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {suggestions.map((sug) => (
                    <button
                      key={sug.id}
                      onClick={() => handleSend(sug.prompt)}
                      disabled={loading}
                      className="whitespace-nowrap px-2.5 py-1 text-xs rounded-full bg-white border border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50/50 transition-all shadow-2xs font-medium"
                    >
                      {sug.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/50">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        isUser
                          ? 'bg-brand-600 text-white'
                          : 'bg-gradient-to-tr from-slate-800 to-brand-800 text-amber-300 shadow-2xs'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Content Bubble */}
                    <div className={`max-w-[82%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 shadow-sm text-sm ${
                          isUser
                            ? 'bg-brand-600 text-white rounded-br-xs'
                            : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs'
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        ) : (
                          <FormattedMessage text={msg.content} />
                        )}
                      </div>

                      {/* Timestamp & info */}
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing / Loading indicator */}
              {loading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-slate-800 to-brand-800 text-amber-300 flex items-center justify-center shrink-0 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-200/90 rounded-2xl rounded-bl-xs px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
                      <Globe2 className="w-3.5 h-3.5 text-brand-600 animate-spin" />
                      Scanning travel guides
                    </span>
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Toolbar */}
            <div className="p-3 bg-white border-t border-slate-200/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about Bali, Paris, 3-day itinerary..."
                    disabled={loading}
                    className="w-full px-3.5 py-2.5 pr-9 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-brand-500 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden transition-all"
                  />
                  {input.trim() && (
                    <button
                      type="button"
                      onClick={() => setInput('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center transition-all duration-200 shadow-sm shrink-0 active:scale-95"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-amber-500" />
                  Ultra-fast responses via Groq API
                </span>
                <span>Press Enter to send</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

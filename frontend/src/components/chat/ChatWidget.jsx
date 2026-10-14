import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { chatAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTrip } from '../../context/TripContext';

const ChatWidget = () => {
  const { user } = useAuth();
  const { activeTrip } = useTrip();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Namaste! I am your **TripSync AI Copilot**. Ask me anything about multi-modal routes, drone rules, vegetarian food spots, or budget hacks!'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'I have ₹12,000 and 3 days. Suggest a trip plan.',
    'Delayed 2 hours at Jaipur junction. What to do nearby?',
    'What are the drone flying rules for Amber Fort?',
    'Night safety advice for solo female travelers?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage({
        message: textToSend,
        context: {
          destinationCity: activeTrip?.destinationCity,
          totalBudget: activeTrip?.totalBudget,
          userName: user?.name
        }
      });

      if (res.data?.success) {
        setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Sorry, I encountered an issue connecting to the travel AI service. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-sky-400 p-0.5 shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
          title="Open AI Travel Assistant"
        >
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-brand-400 group-hover:rotate-12 transition-transform" />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[550px] bg-[#101726] border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  TripSync AI Copilot
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[10px] text-slate-400">Intelligent Travel Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 hover:text-white whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-brand-400" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-tr-sm'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800/80 rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-xs text-slate-400">
                <Bot className="w-4 h-4 text-brand-400 animate-spin" />
                Thinking & checking telemetry...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-900/90 border-t border-slate-800 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask about trains, golden hour, food..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;

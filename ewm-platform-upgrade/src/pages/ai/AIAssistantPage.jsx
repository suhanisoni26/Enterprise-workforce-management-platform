/**
 * AI Operations Assistant — ChatGPT-style interface.
 * Wire `sendToAI()` to your real AI endpoint; currently simulates a response
 * so the interface is fully functional out of the box.
 */

import { useEffect, useRef, useState } from 'react';
import { HiOutlineSparkles, HiOutlinePaperAirplane, HiOutlineUser, HiOutlineTrash } from 'react-icons/hi';

const SUGGESTIONS = [
  'Summarize pending leave requests this week',
  'Who is on Shift A — Engineering today?',
  'Draft a payroll reminder for finance',
  'How many employees joined this quarter?',
];

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your AI Operations Assistant. Ask me about attendance, leave, payroll, or employee records." },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendToAI = async (text) => {
    // Replace this simulated delay with a real call, e.g.:
    // const { data } = await aiService.ask(text);
    await new Promise((r) => setTimeout(r, 1000));
    return `Here's a placeholder response for: "${text}". Connect this assistant to your AI Ops endpoint to return real, data-backed answers.`;
  };

  const handleSend = async (text) => {
    const value = (text ?? input).trim();
    if (!value || isTyping) return;
    setMessages((prev) => [...prev, { role: 'user', text: value }]);
    setInput('');
    setIsTyping(true);
    try {
      const reply = await sendToAI(value);
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Something went wrong reaching the AI service. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => setMessages([{ role: 'assistant', text: "Chat cleared. What would you like to know?" }]);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
            <HiOutlineSparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#F8FAFC]" style={{ fontFamily: 'var(--font-display)' }}>AI Operations Assistant</h1>
            <p className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold">Always learning your workforce data</p>
          </div>
        </div>
        <button onClick={clearChat} className="p-2 rounded-lg text-[#64748B] hover:text-white hover:bg-white/5 transition-colors">
          <HiOutlineTrash className="w-4 h-4" />
        </button>
      </div>

      {/* Message list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar rounded-2xl border p-5 sm:p-7 space-y-6"
        style={{ backgroundColor: 'var(--surface, #1E293B)', borderColor: 'var(--border-color, rgba(148,163,184,0.12))' }}
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: m.role === 'user' ? 'rgba(148,163,184,0.12)' : 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              }}
            >
              {m.role === 'user' ? <HiOutlineUser className="w-4 h-4 text-[#94A3B8]" /> : <HiOutlineSparkles className="w-4 h-4 text-white" />}
            </div>
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                m.role === 'user' ? 'rounded-tr-sm text-white' : 'rounded-tl-sm text-[#E2E8F0]'
              }`}
              style={{
                backgroundColor: m.role === 'user' ? '#3B82F6' : 'var(--surface-muted, #172033)',
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
              <HiOutlineSparkles className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5" style={{ backgroundColor: 'var(--surface-muted, #172033)' }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-pulse"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="px-3.5 py-2 rounded-full text-[11px] font-medium text-[#94A3B8] border hover:text-white hover:border-[rgba(59,130,246,0.4)] transition-colors"
              style={{ borderColor: 'var(--border-color, rgba(148,163,184,0.16))' }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <div className="mt-4 flex items-center gap-3 p-2 rounded-2xl border" style={{ backgroundColor: 'var(--surface, #1E293B)', borderColor: 'var(--border-color, rgba(148,163,184,0.12))' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about employees, attendance, leave, payroll..."
          className="flex-1 bg-transparent px-3 py-2.5 text-xs text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
        >
          <HiOutlinePaperAirplane className="w-4 h-4 rotate-90" />
        </button>
      </div>
    </div>
  );
};

export default AIAssistantPage;

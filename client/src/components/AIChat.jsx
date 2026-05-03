import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { sendChat } from '../services/api.js';
import './AIChat.css';

const AIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Namaste ${user?.name?.split(' ')[0] || 'there'}! 🇮🇳 I'm your CivicVerse AI assistant. Ask me anything about Indian elections, voting procedures, ECI rules, or your voter rights. I support all 22 official languages!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput(''); setLoading(true);
    try {
      const res = await sendChat(userMsg.content, messages.slice(-10));
      setMessages(prev => [...prev, {
        role: 'assistant', content: res.data.response,
        sentiment: res.data.sentiment, provider: res.data.provider
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally { setLoading(false); }
  };

  return (
    <section className="chat-section">
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-avatar-ai"><Bot size={20} /></div>
            <div><h2>CivicVerse AI</h2><p>Powered by Mistral + Gemini</p></div>
          </div>
          <div className="chat-sentiment-badge">
            <Sparkles size={14} /> Sentiment-Aware
          </div>
        </div>
        <div className="chat-messages">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div key={i} className={`chat-msg ${m.role}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}>
                <div className="msg-avatar">
                  {m.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`msg-bubble ${m.role === 'assistant' ? 'ai-response-card' : ''}`}>
                  <p>{m.content}</p>
                  {m.sentiment && <span className="msg-sentiment">Sentiment: {m.sentiment}</span>}
                  {m.provider && <span className="msg-provider">via {m.provider}</span>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div className="chat-msg assistant" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="msg-avatar"><Bot size={16} /></div>
              <div className="msg-bubble ai-response-card typing-indicator">
                <span /><span /><span />
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>
        <form className="chat-input-bar" onSubmit={e => { e.preventDefault(); handleSend(); }}>
          <input type="text" placeholder="Ask about elections, voting rights, ECI rules..."
            value={input} onChange={e => setInput(e.target.value)} disabled={loading} />
          <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            disabled={loading || !input.trim()}>
            <Send size={18} />
          </motion.button>
        </form>
      </div>
    </section>
  );
};
export default AIChat;

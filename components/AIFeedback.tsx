
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { Transaction } from '../types';

interface Props {
  expenses: Transaction[];
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

/**
 * A simple formatter to render bold (**), italics (*), and lists (-) from AI responses.
 */
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  
  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        // Handle list items
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const content = line.replace(/^[\-\*]\s+/, '');
          return (
            <div key={idx} className="flex gap-3 pl-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span dangerouslySetInnerHTML={{ 
                __html: content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') 
              }} />
            </div>
          );
        }
        
        // Handle normal lines with bold/italic
        const formattedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
          
        return (
          <p key={idx} dangerouslySetInnerHTML={{ __html: formattedLine }} className={line.trim() === '' ? 'h-2' : ''} />
        );
      })}
    </div>
  );
};

const AIFeedback: React.FC<Props> = ({ expenses }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatting]);

  const getAdvice = async () => {
    setLoading(true);
    const feedback = await geminiService.getFinancialAdvice(expenses, []);
    setAdvice(feedback);
    setLoading(false);
    
    if (chatMessages.length === 0) {
      setChatMessages([{ 
        role: 'ai', 
        text: "Hello! I've analyzed your monthly transactions. **Based on your data**, I've found some areas where we can optimize. \n\nWhat would you like to discuss further?" 
      }]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isChatting) return;

    const userMsg = userInput.trim();
    setUserInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatting(true);

    try {
      const response = await geminiService.chatWithAdvisor(userMsg, expenses, chatMessages);
      setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an issue. Could you please try asking again?" }]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header / Primary Advice Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black mb-4 leading-tight">AI Strategy Center</h2>
            <p className="text-indigo-100 font-medium text-lg leading-relaxed opacity-90">
              Get objective, data-driven feedback on your finances. Our advisor helps detect leaks and finds opportunities for wealth growth.
            </p>
          </div>
          <button 
            onClick={getAdvice}
            disabled={loading}
            className="whitespace-nowrap px-10 py-5 bg-white text-indigo-700 rounded-[1.5rem] font-black text-lg shadow-xl hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading && <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-700 rounded-full animate-spin"></div>}
            <span>{loading ? 'Processing...' : 'Generate New Insight'}</span>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[-40px] right-[-40px] w-80 h-80 bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-60px] left-[-40px] w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>
      </div>

      {/* Primary Advice Insight Card */}
      {advice && (
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-start gap-8">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl shadow-sm border border-indigo-100">💡</div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-tight flex items-center gap-2">
                Executive Briefing
                <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] uppercase font-black rounded-full tracking-widest">Active Insight</span>
              </h3>
              <div className="text-gray-700 text-lg leading-relaxed bg-indigo-50/20 p-8 rounded-[2rem] border border-indigo-50 shadow-inner">
                <FormattedText text={advice} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Chat Interface */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-indigo-50/50 flex flex-col h-[650px] overflow-hidden">
        {/* Chat Header */}
        <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">🤖</div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Wealth Advisor Chat</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Always Online</p>
              </div>
            </div>
          </div>
          {chatMessages.length > 0 && (
            <button 
              onClick={() => setChatMessages([])}
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-rose-500 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100"
            >
              Reset Session
            </button>
          )}
        </div>

        {/* Messages Content */}
        <div className="flex-1 p-10 overflow-y-auto space-y-8 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:20px_20px]">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-40">
              <div className="text-7xl mb-6">🤝</div>
              <p className="text-xl font-black text-gray-900">Your Personal Strategist</p>
              <p className="text-sm font-bold text-gray-400 max-w-xs mt-3">Ask about savings, category limits, or local investment trends.</p>
            </div>
          ) : (
            chatMessages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-xs shadow-sm ${
                  msg.role === 'user' ? 'bg-gray-100 text-gray-500' : 'bg-indigo-600 text-white'
                }`}>
                  {msg.role === 'user' ? 'ME' : 'AI'}
                </div>
                <div className={`max-w-[75%] px-7 py-5 rounded-[2rem] text-[15px] font-medium leading-relaxed shadow-sm border ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none border-indigo-700' 
                  : 'bg-white text-gray-800 rounded-tl-none border-gray-100'
                }`}>
                  <FormattedText text={msg.text} />
                </div>
              </div>
            ))
          )}
          
          {isChatting && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xs font-black shadow-sm">AI</div>
              <div className="bg-white px-6 py-4 rounded-[1.5rem] rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSendMessage} className="p-8 bg-gray-50/80 border-t border-gray-100 flex gap-4 backdrop-blur-sm">
          <input 
            type="text"
            className="flex-1 bg-white border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-indigo-100 font-medium text-sm transition-all shadow-sm placeholder:text-gray-300"
            placeholder="E.g. Explain how my entertainment spend compares to my budget..."
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!userInput.trim() || isChatting}
            className="bg-indigo-600 text-white px-8 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            <span className="font-black text-sm tracking-widest uppercase">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIFeedback;

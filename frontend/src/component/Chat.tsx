import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { BsCheckAll } from 'react-icons/bs';

type Message = {
  text: string;
  from: 'user' | 'bot';
  time: string;
};

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      text: input,
      from: 'user',
      time: formattedTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      const botMessage: Message = {
        text: `${data.emotion}`,
        from: 'bot',
        time: formattedTime,
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
      }, 600);
    } catch (err) {
      console.error('API error:', err);
    }
  };

  const toggleAuth = () => {
    setIsSignedIn(!isSignedIn);
  };

  return (
    <div className="h-screen w-full bg-[#0a1014] flex justify-center items-center">
      <div className="flex flex-col h-full w-full sm:h-[95vh] sm:w-[95vw] md:h-[90vh] md:max-w-3xl bg-[#111b21] text-white rounded-lg shadow-2xl overflow-hidden border border-gray-700">

        
        <div className="bg-[#202c33] p-4 flex items-center justify-between border-b border-[#2a2f32]">
          <h1 className="text-lg font-semibold tracking-wide">Emotion Analyzer</h1>
          <button
            onClick={toggleAuth}
            className="bg-green-600 hover:bg-green-700 text-sm px-4 py-1 rounded-full transition"
          >
            {isSignedIn ? 'Sign Out' : 'Sign In'}
          </button>
        </div>


        <div className="flex-1 overflow-y-auto px-4 py-3 bg-chat-pattern bg-cover custom-scrollbar space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`relative max-w-[80%] md:max-w-md px-4 py-2 rounded-2xl text-sm break-words shadow-md
                ${msg.from === 'user'
                  ? 'bg-[#005c4b] text-white rounded-br-none'
                  : 'bg-[#2a2f32] text-white rounded-bl-none'}`}
              >
                <p className="leading-snug">{msg.text}</p>
                <div className="flex justify-end items-center space-x-1 mt-1 text-xs text-gray-400">
                  <span>{msg.time}</span>
                  {msg.from === 'user' && <BsCheckAll className="text-blue-400 ml-1" />}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>


        <div className="p-3 bg-[#202c33] flex items-center gap-2 border-t border-[#2a2f32]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 px-4 py-2 rounded-full bg-[#2a2f32] text-white placeholder-gray-400 outline-none text-sm"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 hover:bg-green-700 p-3 rounded-full text-white transition"
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;

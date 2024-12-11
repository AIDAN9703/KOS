'use client'

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function Chatbot() {
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'bot'}[]>([
    {text: "Welcome to KOS Yachts! How can I assist you today?", sender: 'bot'}
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

 /* useEffect(() => {
    // Open the chatbot after a short delay when the component mounts
    const timer = setTimeout(() => setIsOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);*/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, {text: input, sender: 'user'}]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:5000/api/chat', { message: input });
      setMessages(prev => [...prev, {
        text: response.data.message,
        sender: 'bot'
      }]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      setMessages(prev => [...prev, {
        text: "I'm sorry, I'm having trouble processing your request right now.",
        sender: 'bot'
      }]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 text-white p-2 z-50 text-semibold tracking-widest border-b-2 border-white hover:border-gold transition-colors duration-300"
      >
        Chat with AI
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl overflow-hidden z-50">
      <div className="bg-gold text-white p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">KOS Yachts AI Assistant</h2>
        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="h-96 overflow-y-auto p-4 bg-gray-100">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <span className={`inline-block p-2 rounded-lg ${
              message.sender === 'user' 
                ? 'bg-gold text-white rounded-br-none' 
                : 'bg-white text-black rounded-bl-none'
            }`}>
              {message.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <button 
            type="submit" 
            className="bg-gold text-white px-4 py-2 rounded-r-lg hover:bg-gold-dark transition-colors flex items-center"
          >
            <PaperAirplaneIcon className="h-5 w-5 mr-2" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

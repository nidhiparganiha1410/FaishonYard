import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Mic, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

type Message = {
    id: string;
    sender: 'user' | 'bot';
    text: string;
};

const SUGGESTIONS = [
    "Find newest products",
    "Show latest posts",
    "Help me choose a gift"
];

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'initial', sender: 'bot', text: 'how can help you dear' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Handle Speech Recognition (Voice Input)
    const toggleListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(transcript);
            setIsListening(false);
            // Automatically send immediately or wait for user confirmation
            // We'll leave it in input for user to review
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const handleSend = (text: string) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        // Simulate bot reply
        setTimeout(() => {
            let replyText = "I'm processing your request. Currently, this is a simulated response.";
            const lowerText = text.toLowerCase();

            if (lowerText.includes('product') || lowerText.includes('shop')) {
                replyText = "I recommend exploring 'The Archive' - our curated shop collection recently updated with avant-garde pieces.";
            } else if (lowerText.includes('post') || lowerText.includes('article') || lowerText.includes('read')) {
                replyText = "Our latest editorial covers 'The Future of Digital Couture'. You can find it on the homepage.";
            }

            const botMsg: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: replyText };
            setMessages(prev => [...prev, botMsg]);
        }, 800);
    };

    return (
        <>
            {/* Floating Button / Robot Trigger */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] flex items-center justify-center transition-all duration-500",
                    isOpen ? "w-14 h-14 rounded-full bg-white text-brand-black border border-black/10 shadow-2xl" : "bg-transparent"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div key="chat" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="relative pointer-events-auto cursor-pointer">
                            
                            {/* Popup Bubble */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="absolute -top-14 right-4 w-40 bg-white border border-black/10 shadow-xl rounded-2xl rounded-br-sm p-3 z-50 pointer-events-none"
                            >
                                <p className="text-[11px] font-bold text-brand-black text-center leading-tight">
                                    how can I help you
                                </p>
                                <div className="absolute -bottom-1 right-4 w-3 h-3 bg-white border-b border-r border-black/10 transform rotate-45"></div>
                            </motion.div>

                            {/* Floating Robot */}
                            <motion.img 
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                src="/assets/walking-robot.png" 
                                alt="Helpful Robot" 
                                className="w-24 h-36 md:w-28 md:h-40 object-contain drop-shadow-2xl" 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        className="fixed bottom-28 right-8 z-[100] w-[350px] bg-white border border-black/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-brand-gray p-4 border-b border-black/5 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-[#EFEFEF] rounded-full flex items-center justify-center mr-3 overflow-hidden border border-black/10 shadow-sm">
                                    <img src="/assets/walking-robot.png" alt="AI Agent" className="w-[120%] h-[120%] object-contain object-top mt-2" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#E54D16]">AI Assistant</h3>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">Online</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white">
                            {messages.map((msg) => (
                                <div key={msg.id} className={cn("flex", msg.sender === 'user' ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-[85%] px-4 py-3 text-sm font-medium leading-relaxed rounded-2xl",
                                        msg.sender === 'user'
                                            ? "bg-brand-black text-white rounded-br-sm"
                                            : "bg-brand-gray text-brand-black border border-black/5 rounded-bl-sm"
                                    )}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggestions */}
                        {messages.length === 1 && (
                            <div className="px-4 py-2 flex flex-wrap gap-2 fade-in">
                                {SUGGESTIONS.map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(suggestion)}
                                        className="px-3 py-1.5 bg-brand-gray border border-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-black/60 hover:text-black hover:border-black/20 transition-all text-left"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-black/5 flex items-center space-x-2">
                            <button
                                onClick={toggleListening}
                                className={cn(
                                    "p-2 rounded-full transition-colors",
                                    isListening ? "bg-red-50 text-red-500 animate-pulse" : "bg-brand-gray text-black/40 hover:text-brand-black"
                                )}
                            >
                                <Mic className="w-5 h-5" />
                            </button>
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                                placeholder="Ask me anything..."
                                className="flex-1 min-w-0 bg-transparent text-sm font-medium placeholder:text-black/30 placeholder:font-normal focus:outline-none"
                            />
                            <button
                                onClick={() => handleSend(inputValue)}
                                disabled={!inputValue.trim()}
                                className="p-2 bg-brand-black text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

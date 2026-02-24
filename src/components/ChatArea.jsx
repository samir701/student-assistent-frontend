import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export function ChatArea({ messages, isLoading }) {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth" ref={scrollRef}>
            {messages.length === 0 && !isLoading && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                    <div className="p-4 rounded-full bg-blue-500/10 text-blue-400">
                        <Sparkles size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">How can I assist your studies today?</h2>
                    <p className="text-gray-400 max-w-md">Select a mode and ask anything about your exams, research, or programming assignments.</p>
                </div>
            )}

            <AnimatePresence>
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                            "flex w-full items-start gap-4",
                            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <div className={cn(
                            "p-2 rounded-xl shrink-0 shadow-lg",
                            msg.role === 'user' ? "bg-blue-600 text-white" : "bg-gray-800 text-blue-400 border border-white/5"
                        )}>
                            {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>

                        <div className={cn(
                            "max-w-[85%] md:max-w-[70%] rounded-2xl p-4 md:p-6 shadow-2xl",
                            msg.role === 'user'
                                ? "bg-blue-600/90 text-white rounded-tr-none"
                                : "glass text-gray-200 rounded-tl-none border-white/5 prose prose-invert prose-sm md:prose-base max-w-none"
                        )}>
                            {msg.role === 'user' ? (
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            ) : (
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            )}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {isLoading && (
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-xl bg-gray-800 text-blue-400 shrink-0 border border-white/5 shadow-lg">
                        <Bot size={20} />
                    </div>
                    <div className="glass rounded-2xl rounded-tl-none p-6 flex items-center gap-3 text-blue-400 border-white/5">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="text-sm font-medium">Assistant is thinking...</span>
                    </div>
                </div>
            )}
        </div>
    );
}

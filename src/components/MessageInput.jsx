import React, { useState, useRef } from 'react';
import { Send, Paperclip, GraduationCap, Code, FileText, Search, Brain, Zap, X, FileSearch } from 'lucide-react';
import { cn } from '../lib/utils';

const MODES = [
    { id: 'exam', name: 'Exam', icon: GraduationCap, color: 'text-orange-400' },
    { id: 'research', name: 'Research', icon: Search, color: 'text-purple-400' },
    { id: 'programming', name: 'Coding', icon: Code, color: 'text-green-400' },
    { id: 'short_notes', name: 'Notes', icon: FileText, color: 'text-blue-400' },
    { id: 'concept_breakdown', name: 'Concepts', icon: Brain, color: 'text-pink-400' },
    { id: 'auto', name: 'Auto', icon: Zap, color: 'text-yellow-400' },
];

export function MessageInput({ onSendMessage, onFileUpload, isLoading }) {
    const [message, setMessage] = useState('');
    const [selectedMode, setSelectedMode] = useState('exam');
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if ((message.trim() || file) && !isLoading) {
            if (file) {
                onFileUpload(file);
                setFile(null);
            } else {
                onSendMessage(message, selectedMode);
                setMessage('');
            }
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent">
            <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                    {MODES.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setSelectedMode(mode.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 border",
                                selectedMode === mode.id
                                    ? "bg-white/10 border-white/20 text-white shadow-lg"
                                    : "bg-white/5 border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/10"
                            )}
                        >
                            <mode.icon size={14} className={mode.color} />
                            {mode.name}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="relative group">
                    <div className="relative glass rounded-2xl border-white/10 overflow-hidden shadow-2xl focus-within:border-blue-500/50 transition-colors">
                        {file && (
                            <div className="px-4 pt-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg text-sm border border-blue-500/20">
                                    <FileSearch size={16} />
                                    <span className="truncate max-w-[200px]">{file.name}</span>
                                    <button onClick={() => setFile(null)} className="hover:text-blue-200 ml-2">
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder={file ? "Add context to your file analysis..." : "Type your query here..."}
                            className="w-full bg-transparent p-4 pr-32 md:p-6 outline-none text-gray-100 placeholder-gray-500 resize-none h-16 md:h-20 scrollbar-hide"
                            disabled={isLoading}
                        />

                        <div className="absolute right-4 bottom-4 flex items-center gap-2">
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf,.docx"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="p-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition-all active:scale-95"
                                title="Upload PDF or DOCX"
                            >
                                <Paperclip size={20} />
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || (!message.trim() && !file)}
                                className={cn(
                                    "p-2.5 rounded-xl transition-all active:scale-90 shadow-lg",
                                    message.trim() || file
                                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                                        : "bg-gray-800 text-gray-600 cursor-not-allowed"
                                )}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="mt-2 text-[10px] text-center text-gray-600 font-medium">
                        Press Enter to send, Shift + Enter for new line. Supports PDF and DOCX analysis.
                    </div>
                </form>
            </div>
        </div>
    );
}

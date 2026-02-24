import React from 'react';
import { MessageSquare, Plus, Clock, History } from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar({ sessions, currentSession, onSessionSelect, onNewChat }) {
    const sessionIds = Object.keys(sessions).reverse();

    return (
        <div className="w-80 h-full glass border-r border-white/10 flex flex-col hidden md:flex">
            <div className="p-4 border-b border-white/10">
                <button
                    onClick={onNewChat}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-all font-medium shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    <Plus size={20} />
                    New Assistant Chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
                <div className="flex items-center gap-2 px-3 py-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    <History size={14} />
                    Recent Inquiries
                </div>
                <div className="space-y-1">
                    {sessionIds.map((id) => {
                        const lastMsg = sessions[id][sessions[id].length - 1];
                        const displayTitle = lastMsg?.content.substring(0, 30) + (lastMsg?.content.length > 30 ? '...' : '') || 'Empty Chat';

                        return (
                            <button
                                key={id}
                                onClick={() => onSessionSelect(id)}
                                className={cn(
                                    "w-full p-4 rounded-xl text-left transition-all flex items-start gap-4 group",
                                    currentSession === id
                                        ? "bg-white/10 border-white/10 text-white shadow-xl"
                                        : "hover:bg-white/5 text-gray-400 hover:text-gray-200"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    currentSession === id ? "bg-blue-500/20 text-blue-400" : "bg-gray-800 text-gray-500"
                                )}>
                                    <MessageSquare size={18} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium truncate">{displayTitle}</p>
                                    <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                                        <Clock size={10} />
                                        {id}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-4 border-t border-white/10 text-center">
                <p className="text-[10px] text-gray-600 font-medium tracking-widest uppercase">
                    Smart Student Assistant
                </p>
            </div>
        </div>
    );
}

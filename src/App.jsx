import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { MessageInput } from './components/MessageInput';
import { Sparkles, Menu, X } from 'lucide-react';
import { cn } from './lib/utils';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [sessions, setSessions] = useState({});
  const [currentSessionId, setCurrentSessionId] = useState(`session_${Date.now()}`);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history`);
      setSessions(response.data);
      if (Object.keys(response.data).length > 0 && !messages.length) {
        // Optionally load the most recent session
        // const latestId = Object.keys(response.data).reverse()[0];
        // handleSessionSelect(latestId);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleSendMessage = async (content, mode) => {
    const userMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/ask`, {
        question: content,
        session_id: currentSessionId,
        mode: mode
      });

      if (response.data.error) {
        setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${response.data.error}` }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: response.data.answer }]);
        fetchHistory(); // Refresh history for sidebar
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Connection error. Is the backend running?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages((prev) => [
        ...prev,
        { role: 'user', content: `Uploaded file: ${file.name}` },
        { role: 'assistant', content: `# File Analysis: ${response.data.filename}\n\n${response.data.analysis}` }
      ]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Failed to analyze file. Only PDF and DOCX are supported.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionSelect = (id) => {
    setCurrentSessionId(id);
    setMessages(sessions[id] || []);
  };

  const handleNewChat = () => {
    const newId = `session_${Date.now()}`;
    setCurrentSessionId(newId);
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-[#020617] text-gray-100 overflow-hidden font-sans">
      <Sidebar
        sessions={sessions}
        currentSession={currentSessionId}
        onSessionSelect={handleSessionSelect}
        onNewChat={handleNewChat}
      />

      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 glass shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Sparkles size={20} />
            </div>
            <h1 className="font-bold text-lg tracking-tight">Student Assistant</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-500 bg-white/5 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Gemini 2.5 Flash Online
            </div>
            <button
              className="md:hidden p-2 hover:bg-white/5 rounded-lg"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        <ChatArea messages={messages} isLoading={isLoading} />

        <MessageInput
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default App;

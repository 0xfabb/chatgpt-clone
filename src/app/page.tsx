"use client";
import React, { useRef, FormEvent, useEffect, useState, ChangeEvent } from "react";
import { Message as VercelMessage } from 'ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = VercelMessage;

// SVG ICONS (inline for demo, replace with real SVGs or icon lib as needed)
const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#19C37D" /></svg>
);
const NewChatIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 4v12m6-6H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
);
const SearchIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2"/><path d="M15 15l3.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
);
const LibraryIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
);
const SoraIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/></svg>
);
const GPTsIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="5" y="5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
);
const PlusIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
);
const ToolsIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-4.828l-2.121-2.122m3.121-1.05h.01m-3.131 5.303L9 13.172m4.243-4.243L11.12 11.05m-1.05-3.121h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const MicIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 10v1a7 7 0 0 1-14 0v-1m7 11v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const UserAvatar = () => (
  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-8 h-8 rounded-full object-cover" />
);
const SettingsIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/></svg>
);
const UpArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const GptMessageIcon = () => (
  <div className="w-8 h-8 bg-[#19C37D] rounded-full flex items-center justify-center flex-shrink-0">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.467 4.5H4.533C3.686 4.5 3 5.186 3 6.033V15.467C3 16.314 3.686 17 4.533 17H7.5V21L12.428 17H19.467C20.314 17 21 16.314 21 15.467V6.033C21 5.186 20.314 4.5 19.467 4.5Z" fill="white"/>
    </svg>
  </div>
);
const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/></svg>
);
const ClipboardIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
);
const ThumbsUpIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M17 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6h3a2 2 0 0 1 2 2Z"/></svg>
);
const ThumbsDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"/><path d="M7 14V8a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6h3a2 2 0 0 1 2 2Z"/></svg>
);
const RefreshIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
);

function Sidebar() {
  return (
    <aside className="flex flex-col w-[260px] h-full bg-[#181818] text-white border-r border-black/10 select-none">
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center gap-2 mb-4 mt-2">
          <LogoIcon />
          <span className="font-bold text-lg tracking-tight">ChatGPT</span>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#343541] hover:bg-[#40414f] transition font-medium">
          <NewChatIcon /> New chat
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#343541] transition font-medium">
          <SearchIcon /> Search chats
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#343541] transition font-medium">
          <LibraryIcon /> Library
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#343541] transition font-medium">
          <SoraIcon /> Sora
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#343541] transition font-medium">
          <GPTsIcon /> GPTs
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="text-xs text-gray-400 mb-2">Chats</div>
       
      </div>
      <div className="p-2 border-t border-[#2d2d2d] flex flex-col gap-2">
        <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#2d2d2d] transition-colors text-sm">
          <SettingsIcon /> Upgrade plan
        </button>
        <div className="text-xs text-[#a0a0a0]">More access to the best models</div>
      </div>
    </aside>
  );
}

function ChatHeader() {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-black/10  text-white shadow-sm">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg">ChatGPT</span>
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-[#2d2d2d] rounded-full transition-colors"><SettingsIcon /></button>
        <UserAvatar />
      </div>
    </header>
  );
}

function ChatInput({ value, onChange, onSend, loading }: { value: string; onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void; onSend: (e: FormEvent) => void; loading: boolean; }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 256; // Cap the height
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center px-4 pb-4">
      <form onSubmit={onSend} className="w-full">
        <div className="flex flex-col w-full p-2 border border-gray-700 bg-[#2d2d2d] rounded-2xl">
          <div className="flex items-end w-full">
            <div className="flex items-center gap-1 self-start pt-2">
              <button type="button" className="p-2 text-gray-400 hover:bg-gray-700 rounded-full transition"><PlusIcon /></button>
            </div>
            <textarea
              ref={textareaRef}
              className="flex-1 bg-transparent resize-none focus:outline-none text-white placeholder:text-gray-500 overflow-y-auto max-h-[256px] pl-2 self-center"
              placeholder="Ask anything"
              value={value}
              onChange={onChange}
              rows={1}
              disabled={loading}
              autoFocus
              onKeyDown={handleKeyDown}
            />
            <div className="flex items-center gap-2 self-end">
              <button type="button" className="p-2 text-gray-400 hover:bg-gray-700 rounded-full transition"><MicIcon /></button>
              <button
                type="submit"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-colors text-black disabled:bg-[#3d3d3d] disabled:text-[#a0a0a0] disabled:cursor-not-allowed"
                disabled={!value.trim() || loading}
                aria-label="Send"
              >
                <UpArrowIcon />
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="text-center text-xs text-[#a0a0a0] pt-2">
        ChatGPT can make mistakes. Check important info. See Cookie Preferences.
      </div>
    </div>
  );
}

function ChatMessage({ message, onEditSubmit }: { message: Message, onEditSubmit: (id: string, content: string) => Promise<void> }) {
  const isUser = message.role === "user";
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (editedContent.trim() && editedContent.trim() !== message.content) {
      onEditSubmit(message.id, editedContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave(e);
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isUser) {
    return (
      <div className="group flex justify-end w-full">
        <div className="w-full max-w-2xl relative">
          {isEditing ? (
            <form onSubmit={handleSave} className="w-full">
              <textarea
                ref={textareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 bg-[#40414F] border border-gray-600/50 rounded-2xl resize-none focus:outline-none text-white"
                rows={1}
              />
              <div className="flex gap-2 mt-2 justify-end">
                <button type="submit" className="px-4 py-1.5 bg-[#19C37D] text-white rounded-md text-sm hover:bg-[#15a367] font-medium">
                  Save & Submit
                </button>
                <button type="button" onClick={handleCancel} className="px-4 py-1.5 bg-[#3d3d3d] text-white rounded-md text-sm hover:bg-[#4d4d4d] font-medium">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="relative flex justify-end">
              <div className="px-4 py-2 bg-[#33353E] rounded-2xl text-white">
                {message.content}
              </div>
              <button 
                onClick={() => setIsEditing(true)} 
                className="absolute right-full mr-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <EditIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Assistant Message
  return (
    <div className="flex w-full max-w-2xl">
      <div className="flex-1 space-y-2">
        <div className="prose prose-invert max-w-none text-white">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="flex gap-4 w-full max-w-2xl animate-pulse">
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  
  const processStream = async (reader: ReadableStreamDefaultReader<Uint8Array>, initialMessages: Message[]) => {
      const assistantId = (Date.now() + 1).toString();
      const assistantMessage: Message = { id: assistantId, role: 'assistant', content: '' };
      setMessages([...initialMessages, assistantMessage]);

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prevMessages => 
            prevMessages.map(msg => 
                msg.id === assistantId 
                    ? { ...msg, content: msg.content + chunk } 
                    : msg
            )
        );
      }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.body) throw new Error('No response body');
      await processStream(response.body.getReader(), newMessages);

    } catch (error) {
      console.error("Error fetching chat response:", error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, something went wrong.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (messageId: string, content: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const updatedUserMessage = { ...messages[messageIndex], content };
    
    const messagesForApi = messages.slice(0, messageIndex).concat(updatedUserMessage);
    
    setMessages(messagesForApi);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesForApi }),
      });

      if (!response.body) throw new Error('No response body');
      await processStream(response.body.getReader(), messagesForApi);

    } catch (error) {
      console.error("Error regenerating response:", error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, something went wrong while regenerating.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#212121]">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full bg-[#212121]">
        <ChatHeader />
        <main className="flex-1 overflow-y-auto px-2 sm:px-0 py-6 flex flex-col gap-8 items-center">
          <div className="flex flex-col gap-8 max-w-2xl w-full">
            {messages.length === 0 && !isLoading && (
              <div className="text-[#a0a0a0] text-center mt-16 text-4xl font-semibold mb-8">ChatGPT</div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onEditSubmit={handleEditSubmit} />
            ))}
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && <LoadingMessage />}
            <div ref={messagesEndRef} />
          </div>
        </main>
        <ChatInput value={input} onChange={handleInputChange} onSend={handleSubmit} loading={isLoading} />
      </div>
    </div>
  );
} 





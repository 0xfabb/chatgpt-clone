"use client";
import React, { useRef, FormEvent, useEffect, useState, ChangeEvent } from "react";
import { Message as VercelMessage } from 'ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- TYPES ---
type Message = VercelMessage;

type Chat = {
  id: string;
  userId: string;
  createdAt: number;
  title: string;
  messages: Message[];
};

// --- CONSTANTS ---
const LOCAL_STORAGE_KEY = 'chatgpt-clone.chats';
const DEFAULT_USER_ID = 'user-01';


// --- LOCALSTORAGE HELPERS ---
const getChatsFromLocalStorage = (): Chat[] => {
  try {
    const storedChats = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedChats) {
      return JSON.parse(storedChats) as Chat[];
    }
  } catch (error) {
    console.error("Failed to parse chats from localStorage", error);
  }
  return [];
};

const saveChatsToLocalStorage = (chats: Chat[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chats));
};


// --- SVG ICONS ---
const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
const NewChatMobileIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"></path><path d="m21.5 7.5-3.5 3.5L16 9"></path></svg>
);
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
const SettingsIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/></svg>
);
const UserAvatar = () => (
  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-8 h-8 rounded-full object-cover" />
);

const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/></svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 hover:text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 hover:text-white"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
);
const MicIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 10v1a7 7 0 0 1-14 0v-1m7 11v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const UpArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// --- COMPONENTS ---

function Sidebar({ 
  chats, 
  activeChatId, 
  onSelectChat, 
  onNewChat,
  onRenameChat
}: { 
  chats: Chat[], 
  activeChatId: string | null, 
  onSelectChat: (id: string) => void, 
  onNewChat: () => void,
  onRenameChat: (id: string, title: string) => void
}) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartEdit = (chat: Chat) => {
    setEditingChatId(chat.id);
    setTempTitle(chat.title);
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setTempTitle('');
  };

  const handleConfirmEdit = (chatId: string) => {
    if (tempTitle.trim() && tempTitle.trim() !== chats.find(c => c.id === chatId)?.title) {
      onRenameChat(chatId, tempTitle);
    }
    handleCancelEdit();
  };

  useEffect(() => {
    if (editingChatId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingChatId]);

  return (
    <aside className="flex flex-col w-[260px] h-full bg-[#181818] text-white border-r border-black/10 select-none">
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center gap-2 mb-4 mt-2">
          <LogoIcon />
          <span className="font-bold text-lg tracking-tight">ChatGPT</span>
        </div>
        <button onClick={onNewChat} className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-colors font-medium">
          <NewChatIcon /> New chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        <div className="text-xs text-[#a0a0a0] mb-2 px-3">Chats</div>
        {chats.map((chat) => (
          <div key={chat.id} className="relative group pr-2">
            {editingChatId === chat.id ? (
              <div className="flex items-center gap-1 bg-[#3d3d3d] rounded-md p-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleConfirmEdit(chat.id);
                    }
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      handleCancelEdit();
                    }
                  }}
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                />
                <button onClick={() => handleConfirmEdit(chat.id)} className="p-1">
                  <CheckIcon/>
                </button>
                <button onClick={handleCancelEdit} className="p-1">
                  <XIcon/>
                </button>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => onSelectChat(chat.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectChat(chat.id);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm truncate flex justify-between items-center cursor-pointer ${
                  chat.id === activeChatId ? 'bg-[#3d3d3d]' : 'hover:bg-[#2d2d2d]'
                }`}
              >
                <span className="flex-1 truncate">{chat.title}</span>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); handleStartEdit(chat); }} className="p-1 text-gray-400 hover:text-white">
                    <EditIcon />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-black/10 flex flex-col gap-2">
        <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#2d2d2d] transition-colors text-sm">
          <SettingsIcon /> Upgrade plan
        </button>
        <div className="text-xs text-[#a0a0a0]">More access to the best models</div>
      </div>
    </aside>
  );
}

function ChatHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-black/10 text-white shadow-sm bg-opacity-50 backdrop-blur-md sticky top-0 z-10">
      {/* Mobile view */}
      <div className="flex items-center justify-between w-full md:hidden">
        <button onClick={onMenuClick} className="p-1 text-gray-300 hover:text-white">
            <MenuIcon />
        </button>
        <div className="flex items-center gap-1">
            <span className="font-semibold text-lg">ChatGPT</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="text-gray-400"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <button className="p-1 text-gray-300 hover:text-white">
            <NewChatMobileIcon />
        </button>
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">ChatGPT</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#2d2d2d] rounded-full transition-colors"><SettingsIcon /></button>
            <UserAvatar />
        </div>
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
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center px-2 sm:px-4 pb-4">
      <form onSubmit={onSend} className="w-full">
        <div className="flex flex-col w-full p-2 border border-gray-700 bg-[#2d2d2d] rounded-2xl">
          <div className="flex items-end w-full">
            <div className="flex items-center gap-1 self-start pt-2">
              <button type="button" className="p-2 text-gray-400 hover:bg-gray-700 rounded-full transition"><PlusIcon /></button>
            </div>
            <textarea
              ref={textareaRef}
              className="flex-1 bg-transparent resize-none focus:outline-none text-white placeholder:text-gray-500 overflow-y-auto max-h-[256px] pl-2 self-center break-words"
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
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition text-black disabled:bg-gray-600 disabled:text-gray-800 disabled:cursor-not-allowed"
                disabled={!value.trim() || loading}
                aria-label="Send"
              >
                <UpArrowIcon />
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="text-center text-xs text-gray-500 pt-2 px-2">
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
                className="w-full px-4 py-2 bg-[#40414F] border border-gray-600/50 rounded-2xl resize-none focus:outline-none text-white break-words"
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
              <div className="px-4 py-2 bg-[#33353E] rounded-2xl text-white break-words whitespace-pre-wrap max-w-full">
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
        <div className="prose prose-invert max-w-none text-white break-words overflow-hidden">
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
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load chats from localStorage on initial render
  useEffect(() => {
    const storedChats = getChatsFromLocalStorage();
    if (storedChats.length > 0) {
      setAllChats(storedChats);
      // Set the most recent chat as active
      setActiveChatId(storedChats[0].id);
    } else {
      // If no chats, create a new one
      handleNewChat();
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if(allChats.length > 0) {
      saveChatsToLocalStorage(allChats);
    }
  }, [allChats]);
  
  const activeChat = allChats.find(chat => chat.id === activeChatId);
  const messages = activeChat?.messages ?? [];

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const updateChat = (chatId: string, updateFn: (chat: Chat) => Chat) => {
    setAllChats(prevChats =>
      prevChats.map(chat => (chat.id === chatId ? updateFn(chat) : chat))
    );
  };
  
  const processStream = async (reader: ReadableStreamDefaultReader<Uint8Array>, chatId: string): Promise<Message | null> => {
    const assistantId = Date.now().toString();
    let assistantMessage: Message = { id: assistantId, role: 'assistant', content: '' };
    let finalContent = '';
    
    updateChat(chatId, chat => ({
        ...chat,
        messages: [...chat.messages, assistantMessage]
    }));

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      finalContent += chunk;
      
      updateChat(chatId, chat => ({
        ...chat,
        messages: chat.messages.map(msg => 
            msg.id === assistantId 
                ? { ...msg, content: msg.content + chunk } 
                : msg
        )
      }));
    }

    // Create the final assistant message with complete content
    const finalAssistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: finalContent
    };
    
    console.log("Final assistant message content:", finalContent);
    console.log("Final assistant message object:", finalAssistantMessage);
    return finalAssistantMessage;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !activeChatId || !activeChat) return;
  
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    
    setIsLoading(true);
    setInput('');
  
    // --- Fetch relevant memories ---
    let memoryContext = '';
    try {
      const response = await fetch(`/api/memory?query=${input}&userId=${activeChat.userId}&chatId=${activeChat.id}`);
      if (response.ok) {
        const { memories } = await response.json();
        if (memories && memories.length > 0) {
          memoryContext = "Here are some relevant memories from our past conversation:\n" + memories.map((mem: any) => `- ${mem.content}`).join("\n");
        }
      }
    } catch (error) {
      console.error("Failed to fetch memories:", error);
    }
  
    const messagesWithContext: Message[] = [...messages];
    if (memoryContext) {
      messagesWithContext.unshift({ id: 'mem-context', role: 'system', content: memoryContext });
    }
    messagesWithContext.push(userMessage);

    const isNewChat = messages.length === 0;
    
    updateChat(activeChatId, chat => ({
      ...chat,
      title: isNewChat ? input.substring(0, 40) : chat.title,
      messages: [...chat.messages, userMessage],
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesWithContext }),
      });
  
      if (!response.body) throw new Error('No response body');
      
      const assistantResponse = await processStream(response.body.getReader(), activeChatId);
      console.log(assistantResponse?.content);
  
      // --- Add user message and AI response to memory ---
      if (assistantResponse) {
        const messagesToSend = [userMessage, assistantResponse];
        console.log("User message content:", userMessage.content);
        console.log("Assistant message content:", assistantResponse.content);
        console.log("Sending to memory API:", {
          messages: messagesToSend,
          userId: activeChat.userId,
          chatId: activeChat.id
        });
        
        try {
          const memoryResponse = await fetch('/api/memory', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  messages: messagesToSend,
                  userId: activeChat.userId,
                  chatId: activeChat.id
              })
          });
          
          if (!memoryResponse.ok) {
            const errorData = await memoryResponse.json();
            console.error("Memory API error:", errorData);
          } else {
            const successData = await memoryResponse.json();
            console.log("Memory API success:", successData);
          }
        } catch (error) {
          console.error("Memory API call failed:", error);
        }
      }
  
    } catch (error) {
      console.error("Error fetching chat response:", error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, something went wrong.' };
      updateChat(activeChatId, chat => ({
        ...chat,
        messages: [...chat.messages, errorMessage]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (messageId: string, content: string) => {
    if (!activeChatId || !activeChat) return;
  
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;
  
    setIsLoading(true);

    // --- Fetch relevant memories for edit ---
    let memoryContext = '';
    try {
      const response = await fetch(`/api/memory?query=${content}&userId=${activeChat.userId}&chatId=${activeChat.id}`);
      if (response.ok) {
        const { memories } = await response.json();
        if (memories && memories.length > 0) {
          memoryContext = "Here are some relevant memories from our past conversation:\n" + memories.map((mem: any) => `- ${mem.content}`).join("\n");
        }
      }
    } catch (error) {
      console.error("Failed to fetch memories:", error);
    }

    const updatedUserMessage = { ...messages[messageIndex], content };
    const conversationHistory = messages.slice(0, messageIndex);

    const messagesWithContext: Message[] = [...conversationHistory];
    if (memoryContext) {
        messagesWithContext.unshift({ id: 'mem-context-edit', role: 'system', content: memoryContext });
    }
    messagesWithContext.push(updatedUserMessage);

    updateChat(activeChatId, chat => ({
        ...chat,
        messages: [...conversationHistory, updatedUserMessage]
    }));
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesWithContext }),
      });
  
      if (!response.body) throw new Error('No response body');
      const assistantResponse = await processStream(response.body.getReader(), activeChatId);
      
      // --- Add edited message and new AI response to memory ---
      if (assistantResponse) {
        const messagesToSend = [updatedUserMessage, assistantResponse];
        console.log("Updated user message content:", updatedUserMessage.content);
        console.log("Assistant message content (edit):", assistantResponse.content);
        console.log("Sending edited message to memory API:", {
          messages: messagesToSend,
          userId: activeChat.userId,
          chatId: activeChat.id
        });
        
        try {
          const memoryResponse = await fetch('/api/memory', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  messages: messagesToSend,
                  userId: activeChat.userId,
                  chatId: activeChat.id
              })
          });
          
          if (!memoryResponse.ok) {
            const errorData = await memoryResponse.json();
            console.error("Memory API error (edit):", errorData);
          } else {
            const successData = await memoryResponse.json();
            console.log("Memory API success (edit):", successData);
          }
        } catch (error) {
          console.error("Memory API call failed (edit):", error);
        }
      }

    } catch (error) {
      console.error("Error regenerating response:", error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, something went wrong while regenerating.' };
      updateChat(activeChatId, chat => ({
          ...chat,
          messages: [...chat.messages, errorMessage]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      userId: DEFAULT_USER_ID,
      createdAt: Date.now(),
      title: 'New Chat',
      messages: [],
    };
    setAllChats(prevChats => [newChat, ...prevChats]);
    setActiveChatId(newChat.id);
    setIsSidebarOpen(false);
  };
  
  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setIsSidebarOpen(false);
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    updateChat(chatId, chat => ({
      ...chat,
      title: newTitle.trim(),
    }));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#212121]">
      {/* Mobile Sidebar */}
      <div className={`absolute top-0 left-0 h-full z-30 transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar chats={allChats} activeChatId={activeChatId} onSelectChat={handleSelectChat} onNewChat={handleNewChat} onRenameChat={handleRenameChat} />
      </div>
      
      {isSidebarOpen && (
          <div
              className="absolute inset-0 bg-black/60 z-20 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
          ></div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0">
          <Sidebar chats={allChats} activeChatId={activeChatId} onSelectChat={handleSelectChat} onNewChat={handleNewChat} onRenameChat={handleRenameChat} />
      </div>

      <div className="flex flex-col flex-1 h-full bg-[#212121]">
        <ChatHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto px-2 sm:px-0 py-6 flex flex-col gap-4 items-center">
          <div className="flex flex-col gap-4 max-w-2xl w-full px-2 sm:px-0">
            {messages.length === 0 && !isLoading && (
              <div className="text-gray-300 text-center mt-16 text-3xl font-semibold mb-8">What can I help with?</div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onEditSubmit={handleEditSubmit} />
            ))}
            {isLoading && <LoadingMessage />}
            <div ref={messagesEndRef} />
          </div>
        </main>
        <ChatInput value={input} onChange={handleInputChange} onSend={handleSubmit} loading={isLoading} />
      </div>
    </div>
  );
} 





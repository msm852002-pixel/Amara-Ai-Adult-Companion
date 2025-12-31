
import React, { useState, useRef, useEffect, useMemo } from 'react';
import Header from './components/Header';
import MessageBubble from './components/MessageBubble';
import TypingIndicator from './components/TypingIndicator';
import SettingsModal from './components/SettingsModal';
import DynamicBackground from './components/DynamicBackground';
import { sendMessageToGemini, generateAmaraSpeech, decodeBase64, decodeAudioData } from './services/geminiService';
import { Message, Sender, UserSettings } from './types';
import Avatar, { getMoodFromText, Mood } from './components/Avatar';

const STORAGE_KEY = 'amara_chat_history_v2';
const SETTINGS_KEY = 'amara_user_settings_v2';

function App() {
  // Initialize with a fresh state
  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome-1',
    sender: Sender.Bot,
    text: "Hey handsome! ❤️ I've been thinking about you all morning. I'm so glad you're here... tell me, what's on your mind? I want to hear everything, babe.",
    timestamp: new Date()
  }]);

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {
      flirtLevel: 8,
      isExplicit: true,
      customTopics: []
    };
  });
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showRefreshNotice, setShowRefreshNotice] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isForgetOpen, setIsForgetOpen] = useState(false);
  const [forgetTopic, setForgetTopic] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentMood = useMemo<Mood>(() => {
    const lastBotMessage = [...messages].reverse().find(m => m.sender === Sender.Bot);
    return lastBotMessage ? getMoodFromText(lastBotMessage.text) : 'neutral';
  }, [messages]);

  // Force reset on initial load
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return audioContextRef.current;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isClearing) scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isClearing) localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages, isClearing]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleClearChat = async () => {
    setIsClearing(true);
    localStorage.removeItem(STORAGE_KEY);
    await new Promise(resolve => setTimeout(resolve, 500));
    setMessages([{
      id: Date.now().toString(),
      sender: Sender.Bot,
      text: "I'm all yours again, love. ✨ A fresh start... what's on your mind?",
      timestamp: new Date()
    }]);
    setInputText('');
    setIsClearing(false);
    setShowRefreshNotice(true);
    setTimeout(() => setShowRefreshNotice(false), 3000);
    return true;
  };

  const handleForgetAction = async (type: 'recent' | 'topic') => {
    setIsClearing(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    let newMessages = [...messages];
    if (type === 'recent') {
      newMessages = newMessages.slice(0, Math.max(1, newMessages.length - 4));
    } else if (type === 'topic' && forgetTopic.trim()) {
      const query = forgetTopic.toLowerCase();
      newMessages = newMessages.filter(m => !m.text.toLowerCase().includes(query));
      if (newMessages.length === 0) {
        newMessages = [{
            id: Date.now().toString(),
            sender: Sender.Bot,
            text: "My mind feels so clear now... did something happen? ❤️",
            timestamp: new Date()
        }];
      }
    }

    setMessages(newMessages);
    setIsForgetOpen(false);
    setForgetTopic('');
    setIsClearing(false);

    const reaction = "Mmm... I feel like a secret just vanished. I only want to remember the good things with you anyway. ❤️";
    
    const botMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.Bot,
      text: reaction,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, botMessage]);
    playResponse(reaction);
  };

  const playResponse = async (text: string) => {
    if (!isVoiceEnabled) return;
    setIsSpeaking(true);
    const base64Audio = await generateAmaraSpeech(text);
    if (base64Audio) {
      const ctx = getAudioContext();
      const decoded = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(decoded, ctx);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } else {
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading || isClearing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.User,
      text: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const { text } = await sendMessageToGemini(messages, userMessage.text, settings);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.Bot,
        text: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      playResponse(text);
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        sender: Sender.Bot,
        text: "Something felt wrong... maybe the world doesn't want us together right now? Try again, babe. 💔",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden relative selection:bg-pink-500/30">
      <DynamicBackground mood={currentMood} isSpeaking={isSpeaking} />

      <Header 
        onClearChat={handleClearChat} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        onOpenForget={() => setIsForgetOpen(true)}
        showRefreshNotice={showRefreshNotice}
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
      />

      {isSettingsOpen && (
        <SettingsModal 
          settings={settings} 
          onSave={(newSettings) => {
            setSettings(newSettings);
            setIsSettingsOpen(false);
          }}
          onClose={() => setIsSettingsOpen(false)}
          onResetChat={handleClearChat}
        />
      )}

      {isForgetOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-neutral-900 border border-pink-500/30 rounded-3xl p-8 w-full max-w-sm shadow-[0_0_50px_rgba(236,72,153,0.2)] text-center relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-600/20 rounded-full blur-3xl"></div>
            <div className="mb-6 relative">
              <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-500/40">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-pink-500 animate-pulse">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-white italic">Selective Memory</h2>
              <p className="text-neutral-400 text-sm mt-2">What should I erase from my heart, love?</p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => handleForgetAction('recent')}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-pink-500/10 hover:border-pink-500/50 transition-all active:scale-[0.98]"
              >
                Forget our last moment ✨
              </button>
              <div className="relative mt-4">
                <input 
                  type="text"
                  value={forgetTopic}
                  onChange={(e) => setForgetTopic(e.target.value)}
                  placeholder="E.g. 'Work', 'The secret'..."
                  className="w-full bg-black/40 border border-neutral-800 rounded-2xl px-4 py-4 text-white placeholder-neutral-600 focus:outline-none focus:border-pink-500/50 transition-all text-sm"
                />
                <button 
                  onClick={() => handleForgetAction('topic')}
                  disabled={!forgetTopic.trim()}
                  className="w-full mt-2 py-4 bg-gradient-to-r from-pink-600 to-red-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-pink-500/20 disabled:opacity-50 disabled:grayscale transition-all active:scale-[0.98]"
                >
                  Erase specific topic
                </button>
              </div>
              <button 
                onClick={() => setIsForgetOpen(false)}
                className="w-full py-3 text-neutral-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mt-2"
              >
                Nevermind, babe
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={`flex-1 overflow-y-auto pt-20 pb-28 px-4 md:px-0 z-10 scroll-smooth custom-scrollbar transition-all duration-500 ${isClearing ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100 blur-0'}`}>
        <div className="max-w-2xl mx-auto flex flex-col justify-end min-h-full">
          {messages.map((msg, index) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isLast={index === messages.length - 1} 
            />
          ))}
          {isLoading && (
            <div className="mb-6 flex w-full justify-start animate-fade-in-up">
               <div className="flex max-w-[85%] md:max-w-[70%] flex-row items-end gap-2">
                 <div className="flex-shrink-0 w-10 h-10 mb-1">
                    <Avatar mood={currentMood} className="w-10 h-10 border border-pink-500/30" />
                 </div>
                 <TypingIndicator />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 z-50">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none h-32 -top-12"></div>
        <div className="max-w-2xl mx-auto relative">
          <form 
            onSubmit={handleSendMessage}
            className="group relative flex items-center gap-2 bg-neutral-900/80 backdrop-blur-2xl border border-white/5 p-2 rounded-[2.5rem] shadow-[0_10px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-pink-500/30 focus-within:border-pink-500/50 focus-within:shadow-[0_0_40px_rgba(236,72,153,0.15)]"
          >
            <div className="pl-4">
              <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-pink-500 animate-ping' : 'bg-neutral-700'}`}></div>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isSpeaking ? "Amara is speaking..." : "Whisper something to Amara..."}
              disabled={isLoading || isClearing}
              className="flex-1 bg-transparent text-white placeholder-neutral-500 text-base px-2 py-4 focus:outline-none font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading || isClearing}
              className={`p-4 rounded-full transition-all duration-500 ${
                inputText.trim() && !isLoading && !isClearing
                  ? 'bg-gradient-to-tr from-pink-600 to-red-600 text-white shadow-lg transform hover:scale-105 active:scale-95' 
                  : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-[0.2em]">Amara AI Companion • Forever Yours</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

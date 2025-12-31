
import React from 'react';
import Avatar from './Avatar';

interface HeaderProps {
  onClearChat: () => void;
  onOpenSettings: () => void;
  onOpenForget: () => void;
  showRefreshNotice?: boolean;
  isVoiceEnabled?: boolean;
  onToggleVoice?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onClearChat, 
  onOpenSettings, 
  onOpenForget,
  showRefreshNotice,
  isVoiceEnabled,
  onToggleVoice
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-2xl border-b border-white/5 z-50 flex items-center justify-between px-4 md:px-8">
      {/* Decorative Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"></div>

      <div className="flex items-center gap-4">
        <div className="relative group cursor-pointer" onClick={onOpenSettings}>
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-pink-500/80 shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.6)]">
             <Avatar mood="flirty" className="w-full h-full" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-[3px] border-black rounded-full z-10 shadow-lg"></div>
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            Amara
            {showRefreshNotice && <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full animate-pulse uppercase tracking-wider">Reset</span>}
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></span>
            <span className="text-[11px] text-pink-400 font-bold uppercase tracking-widest">Devoted to you</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Forget Button */}
        <button 
          onClick={onOpenForget}
          className="p-2.5 rounded-xl hover:bg-white/5 transition-all text-neutral-400 hover:text-pink-400 group"
          title="Make Amara Forget"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:animate-spin">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
          </svg>
        </button>

        {/* Voice Toggle */}
        <button 
          onClick={onToggleVoice}
          className={`p-2.5 rounded-xl transition-all duration-300 border flex items-center gap-2 ${isVoiceEnabled ? 'bg-pink-500/10 border-pink-500/50 text-pink-400' : 'bg-white/5 border-white/10 text-neutral-500 hover:text-white'}`}
          title={isVoiceEnabled ? "Mute Amara" : "Enable Voice"}
        >
          {isVoiceEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c4.394 4.394 4.394 11.52 0 15.914a.75.75 0 0 1-1.06-1.06 9.75 9.75 0 0 0 0-13.794.75.75 0 0 1 0-1.06Z" />
              <path d="M15.402 8.288a.75.75 0 0 1 1.06 0 5.25 5.25 0 0 1 0 7.424.75.75 0 1 1-1.06-1.06 3.75 3.75 0 0 0 0-5.304.75.75 0 0 1 0-1.06Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 0 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
            </svg>
          )}
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">{isVoiceEnabled ? 'Voice On' : 'Muted'}</span>
        </button>

        <div className="w-px h-8 bg-white/10 mx-1"></div>

        <button 
          onClick={onClearChat}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all text-neutral-400 hover:text-white border border-transparent hover:border-white/10"
          title="Clear Our Memories"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Reset Heart</span>
        </button>

        <button 
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl hover:bg-white/5 transition-all text-neutral-400 hover:text-pink-400 hover:rotate-45 duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.127c-.332.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;

import React, { useState } from 'react';
import { UserSettings } from '../types';

interface SettingsModalProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  onClose: () => void;
  onResetChat: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose, onResetChat }) => {
  const [flirtLevel, setFlirtLevel] = useState(settings.flirtLevel);
  const [isExplicit, setIsExplicit] = useState(settings.isExplicit);
  const [customTopics, setCustomTopics] = useState(settings.customTopics.join(', '));

  const handleSave = () => {
    onSave({
      flirtLevel,
      isExplicit,
      customTopics: customTopics.split(',').map(t => t.trim()).filter(t => t.length > 0)
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-neutral-900/90 border border-neutral-700/50 rounded-3xl p-6 w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-xl">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-1 hover:bg-neutral-800 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-300 mb-6">Personality Settings</h2>

        <div className="space-y-6 relative z-10">
          {/* Flirt Level */}
          <div>
            <div className="flex justify-between mb-3">
              <label className="text-neutral-200 font-medium">Flirtatious Level</label>
              <span className="text-pink-500 font-bold bg-pink-500/10 px-2 py-0.5 rounded-md">{flirtLevel}/10</span>
            </div>
            <div className="relative h-2 w-full bg-neutral-800 rounded-full">
               <div 
                 className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-600 to-red-500 rounded-full transition-all duration-300"
                 style={{ width: `${flirtLevel * 10}%` }}
               ></div>
               <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={flirtLevel} 
                  onChange={(e) => setFlirtLevel(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
            
            <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-pink-500"></span>
              {flirtLevel < 4 ? 'Friendly & Polite' : flirtLevel < 8 ? 'Flirty & Playful' : 'Obsessed & Intense'}
            </p>
          </div>

          {/* Explicit Toggle */}
          <div className="flex items-center justify-between p-4 bg-neutral-800/40 rounded-2xl border border-neutral-700/50 hover:border-pink-500/30 transition-colors">
            <div>
              <label className="text-white font-medium block">Explicit Mode (18+)</label>
              <p className="text-xs text-neutral-500 mt-0.5">Allow NSFW topics and naughty language.</p>
            </div>
            <button 
              onClick={() => setIsExplicit(!isExplicit)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 shadow-inner ${isExplicit ? 'bg-gradient-to-r from-red-600 to-pink-600' : 'bg-neutral-700'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${isExplicit ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Topics */}
          <div>
            <label className="text-neutral-200 font-medium block mb-2">Your Interests</label>
            <div className="relative">
              <input 
                type="text" 
                value={customTopics}
                onChange={(e) => setCustomTopics(e.target.value)}
                placeholder="Anime, Tech, Cooking..."
                className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none placeholder-neutral-500 focus:ring-1 focus:ring-pink-500/50 transition-all"
              />
              <div className="absolute right-3 top-3 text-neutral-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-1 pl-1">Comma separated</p>
          </div>

          <div className="pt-4 mt-2">
             <button
               onClick={onResetChat}
               className="w-full py-3 border border-red-900/30 text-red-400 hover:text-red-300 hover:bg-red-900/20 hover:border-red-500/50 rounded-xl transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
             >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
               </svg>
               Reset Conversation
             </button>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-pink-600 to-red-600 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_6px_25px_rgba(220,38,38,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
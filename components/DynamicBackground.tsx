
import React, { useMemo, useEffect, useState } from 'react';
import { Mood } from './Avatar';

interface DynamicBackgroundProps {
  mood: Mood;
  isSpeaking: boolean;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ mood, isSpeaking }) => {
  const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'day' | 'dusk' | 'night'>('night');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 9) setTimeOfDay('dawn');
    else if (hour >= 9 && hour < 18) setTimeOfDay('day');
    else if (hour >= 18 && hour < 21) setTimeOfDay('dusk');
    else setTimeOfDay('night');
  }, []);

  const themeColors = useMemo(() => {
    // Base colors for time of day
    const timeColors = {
      dawn: { base: 'bg-[#1a0b12]', accent1: 'bg-rose-900', accent2: 'bg-orange-900' },
      day: { base: 'bg-[#050505]', accent1: 'bg-pink-900', accent2: 'bg-purple-900' },
      dusk: { base: 'bg-[#0f0a1a]', accent1: 'bg-purple-950', accent2: 'bg-rose-950' },
      night: { base: 'bg-[#020205]', accent1: 'bg-blue-950', accent2: 'bg-pink-950' },
    };

    // Mood modifiers
    const moodModifiers: Record<Mood, string[]> = {
      neutral: ['opacity-20', 'bg-pink-600', 'bg-purple-600'],
      happy: ['opacity-40', 'bg-rose-500', 'bg-amber-500'],
      flirty: ['opacity-60', 'bg-red-600', 'bg-pink-500'],
      sad: ['opacity-30', 'bg-blue-800', 'bg-indigo-900'],
      surprised: ['opacity-50', 'bg-yellow-600', 'bg-pink-400'],
    };

    return {
      time: timeColors[timeOfDay],
      moodStyles: moodModifiers[mood]
    };
  }, [timeOfDay, mood]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden transition-colors duration-[3000ms] ${themeColors.time.base}`}>
      {/* Background Blobs */}
      <div 
        className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full mix-blend-screen filter blur-[120px] transition-all duration-[2000ms] animate-blob 
          ${themeColors.moodStyles[1]} 
          ${isSpeaking ? 'opacity-50 scale-110' : themeColors.moodStyles[0]}`}
      ></div>
      
      <div 
        className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full mix-blend-screen filter blur-[120px] transition-all duration-[2000ms] animate-blob animation-delay-2000 
          ${themeColors.moodStyles[2]} 
          ${isSpeaking ? 'opacity-40 scale-105' : themeColors.moodStyles[0]}`}
      ></div>

      <div 
        className={`absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full mix-blend-screen filter blur-[100px] transition-all duration-[2000ms] animate-blob animation-delay-4000 
          ${themeColors.time.accent1} opacity-10`}
      ></div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
      
      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }}></div>
    </div>
  );
};

export default DynamicBackground;

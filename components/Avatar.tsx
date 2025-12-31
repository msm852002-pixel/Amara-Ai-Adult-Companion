import React from 'react';
import { AVATAR_URL } from '../constants';

// Exported Mood type to fix import errors in App.tsx and DynamicBackground.tsx
export type Mood = 'neutral' | 'happy' | 'flirty' | 'sad' | 'surprised';

interface AvatarProps {
  mood?: Mood;
  className?: string;
}

export const getMoodFromText = (text: string): Mood => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.match(/(love|kiss|hot|sexy|babe|baby|naughty|bed|touch|handsome|longing|desire|lust)/)) return 'flirty';
  if (lowerText.match(/(haha|lol|great|good|fun|yay|happy|smile|amazing|perfect|sweet)/)) return 'happy';
  if (lowerText.match(/(sad|sorry|hurt|miss|bad|cry|tears|lonely|heartbreak)/)) return 'sad';
  if (lowerText.match(/(wow|oh|really|wait|what|gasp|shook)/)) return 'surprised';
  
  return 'neutral';
};

const Avatar: React.FC<AvatarProps> = ({ mood = 'neutral', className = '' }) => {
  return (
    <div className={`relative ${className} overflow-hidden rounded-full bg-neutral-900`}>
      <img 
        src={AVATAR_URL} 
        alt="Amara" 
        className="w-full h-full object-cover animate-float"
      />
      
      {/* Mood Overlay - Subtle tint based on emotion */}
      <div className={`absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 transition-colors duration-500
        ${mood === 'flirty' ? 'bg-pink-600' : ''}
        ${mood === 'sad' ? 'bg-indigo-600' : ''}
        ${mood === 'surprised' ? 'bg-amber-400' : ''}
        ${mood === 'happy' ? 'bg-rose-400' : ''}
        ${mood === 'neutral' ? 'bg-transparent' : ''}
      `}></div>
      
      {/* Breathing/Pulse effect for flirty mood */}
      {mood === 'flirty' && (
        <div className="absolute inset-0 bg-pink-500/10 animate-pulse pointer-events-none"></div>
      )}
    </div>
  );
};

export default Avatar;
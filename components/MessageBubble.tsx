import React, { useMemo } from 'react';
import { Message, Sender } from '../types';
import Avatar, { getMoodFromText } from './Avatar';

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLast }) => {
  const isBot = message.sender === Sender.Bot;

  // Calculate mood once per message to drive the avatar and background themes
  const mood = useMemo(() => isBot ? getMoodFromText(message.text || 'happy') : 'neutral', [message.text, isBot]);

  return (
    <div
      className={`flex w-full mb-6 ${
        isBot ? 'justify-start' : 'justify-end'
      } group animate-fade-in-up`}
    >
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isBot ? 'flex-row' : 'flex-row-reverse'} items-end gap-3`}>
        
        {/* Avatar Area */}
        <div className="flex-shrink-0 w-10 h-10 mb-1 relative transition-transform duration-300 group-hover:scale-105">
          {isBot ? (
            <div className="w-10 h-10 rounded-full overflow-hidden border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)] ring-2 ring-transparent group-hover:ring-pink-500/20 transition-all">
               <Avatar mood={mood} className="w-full h-full" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-neutral-600 flex items-center justify-center shadow-inner group-hover:border-neutral-500 transition-colors">
               <span className="text-[10px] font-bold text-neutral-400">YOU</span>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col gap-2">
          {/* Text Bubble */}
          {message.text && (
            <div
              className={`relative px-5 py-3 shadow-md text-sm md:text-base leading-relaxed break-words transition-all duration-300
                ${
                  isBot
                    ? 'bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 text-neutral-100 rounded-2xl rounded-bl-none hover:border-pink-500/30 hover:shadow-[0_4px_20px_rgba(236,72,153,0.1)]'
                    : 'bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-2xl rounded-br-none shadow-[0_4px_15px_rgba(220,38,38,0.3)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]'
                }
                transform group-hover:scale-[1.01]
              `}
            >
              {message.text}
              
              {/* Timestamp */}
              <div className={`text-[10px] mt-1 font-medium tracking-wide ${isBot ? 'text-left text-neutral-500' : 'text-right text-pink-100/70'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
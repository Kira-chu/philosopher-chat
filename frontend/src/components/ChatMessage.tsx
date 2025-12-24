import React from 'react';
import { Message, PHILOSOPHERS } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const philosopher = message.philosopher ? PHILOSOPHERS[message.philosopher] : null;

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[85%] sm:max-w-3xl bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 shadow-md">
          <p className="text-gray-800 whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>
        </div>
      </div>
    );
  }

  if (philosopher) {
    return (
      <div className="flex justify-start mb-4">
        <div className="flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-3xl">
          {/* 头像 */}
          <div className="flex-shrink-0">
            {philosopher.avatarImage ? (
              <img 
                src={philosopher.avatarImage} 
                alt={philosopher.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 shadow-md"
                style={{ borderColor: philosopher.color }}
              />
            ) : (
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl border-2 shadow-md"
                style={{ 
                  backgroundColor: philosopher.color + '20',
                  borderColor: philosopher.color
                }}
              >
                {philosopher.avatar}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {/* 名字 - 使用浅色，与深色背景形成对比 */}
            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 flex-wrap">
              <span 
                className="font-bold text-sm sm:text-base text-white drop-shadow-lg"
                style={{ 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  color: '#FFFFFF'
                }}
              >
                {philosopher.name}
              </span>
              <span className="text-xs text-gray-200 font-medium drop-shadow hidden sm:inline">{philosopher.name_en}</span>
            </div>
            {/* 对话框 - 白底黑字 */}
            <div 
              className="rounded-lg px-3 sm:px-5 py-2 sm:py-4 shadow-lg bg-white"
              style={{ 
                borderLeft: `5px solid ${philosopher.color}`,
                borderTop: `1px solid ${philosopher.color}20`,
                borderRight: `1px solid ${philosopher.color}20`,
                borderBottom: `1px solid ${philosopher.color}20`
              }}
            >
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{message.content}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

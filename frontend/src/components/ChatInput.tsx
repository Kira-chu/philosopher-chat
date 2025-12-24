import React, { useState, useRef } from 'react';
import { PHILOSOPHERS } from '../types';

interface ChatInputProps {
  onSend: (message: string, mentions?: string[]) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionStart, setMentionStart] = useState(-1);
  const [mentionQuery, setMentionQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const philosopherNames = Object.keys(PHILOSOPHERS);
  const allPhilosophers = ['所有人', ...philosopherNames];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setInput(value);

    // 检测@符号
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      // 如果@后面没有空格或换行，显示提示
      if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        setMentionStart(lastAtIndex);
        setMentionQuery(textAfterAt.toLowerCase());
        setShowMentionList(true);
      } else {
        setShowMentionList(false);
      }
    } else {
      setShowMentionList(false);
    }
  };

  const handleMentionSelect = (name: string) => {
    if (mentionStart === -1) return;
    
    const beforeAt = input.substring(0, mentionStart);
    const afterCursor = input.substring(mentionStart + 1 + mentionQuery.length);
    const newInput = beforeAt + '@' + name + ' ' + afterCursor;
    
    setInput(newInput);
    setShowMentionList(false);
    setMentionStart(-1);
    setMentionQuery('');
    
    // 聚焦到输入框
    setTimeout(() => {
      textareaRef.current?.focus();
      const newCursorPos = mentionStart + name.length + 2; // @ + name + space
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      // 提取@的哲学家
      const mentions: string[] = [];
      const mentionRegex = /@(所有人|[\u4e00-\u9fa5·]+)/g;
      let match;
      while ((match = mentionRegex.exec(input)) !== null) {
        const mentioned = match[1];
        if (mentioned === '所有人') {
          mentions.push('所有人');
        } else {
          mentions.push(mentioned);
        }
      }
      
      onSend(input.trim(), mentions);
      setInput('');
      setShowMentionList(false);
    }
  };

  const filteredPhilosophers = allPhilosophers.filter(name => 
    name.toLowerCase().includes(mentionQuery) || name === '所有人'
  );

  return (
    <form onSubmit={handleSubmit} className="sticky bottom-0 bg-white p-2 sm:p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex gap-2 relative flex-col sm:flex-row">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (showMentionList) {
                // @提示列表显示时，Enter选择第一个
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (filteredPhilosophers.length > 0) {
                    handleMentionSelect(filteredPhilosophers[0]);
                  }
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  // 可以添加键盘导航
                }
              } else {
                // @提示列表未显示时，Enter直接发送
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !isLoading) {
                    const mentions: string[] = [];
                    const mentionRegex = /@(所有人|[\u4e00-\u9fa5·]+)/g;
                    let match;
                    while ((match = mentionRegex.exec(input)) !== null) {
                      const mentioned = match[1];
                      if (mentioned === '所有人') {
                        mentions.push('所有人');
                      } else {
                        mentions.push(mentioned);
                      }
                    }
                    onSend(input.trim(), mentions);
                    setInput('');
                    setShowMentionList(false);
                  }
                }
              }
            }}
            placeholder="输入你的想法或研究问题"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm sm:text-base"
            rows={2}
            disabled={isLoading}
          />
          
          {/* @提示列表 */}
          {showMentionList && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
              {filteredPhilosophers.length > 0 ? (
                filteredPhilosophers.map((name) => {
                  const philosopher = name === '所有人' ? null : PHILOSOPHERS[name];
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleMentionSelect(name)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
                    >
                      {name === '所有人' ? (
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                          全
                        </div>
                      ) : philosopher && (
                        philosopher.avatarImage ? (
                          <img 
                            src={philosopher.avatarImage} 
                            alt={philosopher.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg">
                            {philosopher.avatar}
                          </div>
                        )
                      )}
                      <span className={name === '所有人' ? 'font-bold text-purple-600' : ''}>
                        {name === '所有人' ? '@所有人' : name}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-2 text-gray-500">没有找到匹配的哲学家</div>
              )}
            </div>
          )}
        </div>
        
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base whitespace-nowrap"
              >
                {isLoading ? '思考中...' : '发送'}
              </button>
      </div>
    </form>
  );
};

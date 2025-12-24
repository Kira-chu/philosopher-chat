import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Message } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (userInput: string, mentions: string[] = []) => {
    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content: userInput
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_input: userInput,
          mentions: mentions
        }),
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法读取响应流');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保留最后一个不完整的行

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'message') {
                const message: Message = {
                  role: data.message.role,
                  content: data.message.content,
                  philosopher: data.message.philosopher
                };
                setMessages(prev => [...prev, message]);
              } else if (data.type === 'done') {
                setIsLoading(false);
                return;
              } else if (data.type === 'error') {
                throw new Error(data.error);
              }
            } catch (e) {
              console.error('解析消息失败:', e);
            }
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('发送失败:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '抱歉，发生了错误。请检查后端服务是否正常运行，以及 DeepSeek API Key 是否正确配置。',
        philosopher: '系统'
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* 水印 */}
      <div className="fixed top-2 left-2 z-50 text-gray-400 text-sm opacity-60 pointer-events-none font-light">
        🐱 made by Kira
      </div>
      
      <header className="bg-white shadow-sm py-3 sm:py-4">
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">💭 哲学家群聊</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">与马克思、韦伯、福柯、哈耶克、尼采展开思想碰撞</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center text-white mt-10 sm:mt-20">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">开始你的思想碰撞</h2>
              <p className="text-base sm:text-lg opacity-90 px-2">输入你的想法或研究问题，与五位哲学家展开辩论</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-center mb-4">
              <div className="text-white">哲学家们正在思考...</div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}

export default App;


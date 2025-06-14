
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou a IA da Uptake Education. Como posso ajudá-lo hoje?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular resposta da IA (aqui você conectará sua automação)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Obrigado pela sua mensagem! Esta é uma resposta simulada. Em breve, nossa IA estará processando suas solicitações em tempo real.',
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-[#EEF36A]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/761d61f6-b873-4336-9fff-a075dd5b3ba8.png" 
              alt="Uptake Education" 
              className="h-12 w-auto"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#0A014F]">
                Assistente IA - Uptake Education
              </h1>
              <p className="text-gray-600 text-sm">
                Inteligência artificial para educação
              </p>
            </div>
            <div className="flex items-center space-x-2 text-green-500">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 container mx-auto px-4 py-6 bg-gray-800">
        <ScrollArea className="h-full">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-animation flex items-start space-x-3 ${
                  message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.isUser 
                    ? 'bg-[#EEF36A] text-[#0A014F]' 
                    : 'bg-[#0A014F] text-white'
                }`}>
                  {message.isUser ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`flex flex-col max-w-xs lg:max-w-md ${
                  message.isUser ? 'items-end' : 'items-start'
                }`}>
                  <div className={`px-4 py-3 rounded-2xl shadow-md ${
                    message.isUser
                      ? 'bg-[#0A014F] text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 px-2">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start space-x-3 message-animation">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0A014F] text-white flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-md border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="pr-12 py-3 text-base border-2 border-gray-200 focus:border-[#EEF36A] rounded-xl"
                disabled={isTyping}
              />
            </div>
            <Button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-[#0A014F] hover:bg-[#050027] text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <Send size={20} />
            </Button>
          </form>
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500">
              Powered by Uptake Education AI • Seus dados são protegidos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

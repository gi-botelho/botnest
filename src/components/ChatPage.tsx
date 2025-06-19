import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Sparkles, User, Bot, MessageSquare, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { AgentConfig } from '@/config/agents';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatPageProps {
  config: AgentConfig;
}

const ChatPage: React.FC<ChatPageProps> = ({ config }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: config.initialMessage,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus no input após a resposta da IA
  useEffect(() => {
    if (!isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

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
    const messageText = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      console.log('Enviando mensagem para o webhook:', messageText);
      console.log('URL do webhook:', config.webhookUrl);
      
      const requestData = {
        message: messageText,
        timestamp: new Date().toISOString(),
        userId: 'user-' + Date.now(),
        agentId: config.id,
      };
      
      console.log('Dados da requisição:', requestData);

      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro HTTP:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // Obter a resposta como texto (webhook sempre retorna texto simples)
      const responseText = await response.text();
      console.log('Resposta do webhook:', responseText);
      
      // Usar o texto diretamente como resposta da IA
       const aiResponseText = responseText.trim() || 'Desculpe, não consegui processar sua mensagem.';
       console.log('Texto da resposta processado:', aiResponseText);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem para o webhook:', error);
      
      let errorMessage = 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.';
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conectividade. Verifique sua conexão com a internet e tente novamente.';
        console.error('Erro de CORS ou conectividade detectado');
      } else if (error instanceof Error) {
        console.error('Detalhes do erro:', error.message);
        if (error.message.includes('500')) {
          errorMessage = 'O servidor está com problemas internos. Tente novamente em alguns instantes.';
        }
      }
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponse]);
      
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar com o servidor. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-white relative">
      {/* Header */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 shadow-xl border-b-4 backdrop-blur-sm relative overflow-hidden"
        style={{
          background: `linear-gradient(to bottom right, ${config.theme.primaryColor}, ${config.theme.secondaryColor})`,
          borderBottomColor: config.theme.accentColor
        }}
      >
        {/* Efeito de brilho sutil no fundo */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent header-shimmer"></div>
        
        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg float-animation">
                <img 
                  src={config.theme.logoUrl} 
                  alt={config.theme.companyName} 
                  className="h-10 w-auto drop-shadow-sm"
                />
              </div>
              <div className="hidden sm:block flex flex-col justify-center">
                <p className="text-blue-200 text-sm font-medium mt-2">{config.description}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm border border-white/20 shadow-lg">
                <div className="w-3 h-3 bg-green-400 rounded-full soft-pulse shadow-lg"></div>
                <span className="text-sm font-medium text-white drop-shadow-sm">Online</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Linha decorativa animada */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 soft-pulse"
          style={{
            background: `linear-gradient(to right, ${config.theme.accentColor}, #fbbf24, ${config.theme.accentColor})`
          }}
        ></div>
      </div>

      {/* Chat Messages */}
      <div className="absolute top-20 left-0 right-0 bottom-20 overflow-hidden">
        <div className="container mx-auto px-4 py-6 h-full">
          <ScrollArea className="h-full">
          <div className="space-y-6 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-animation flex items-start space-x-4 ${
                  message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                    message.isUser 
                      ? 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-500 border border-slate-200/60' 
                      : 'bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60'
                  }`}
                  style={{
                    color: message.isUser ? undefined : config.theme.primaryColor
                  }}
                >
                  {message.isUser ? (
                    <User size={24} className="drop-shadow-sm" />
                  ) : (
                    <Bot size={24} className="drop-shadow-sm" />
                  )}
                </div>
                <div className={`flex flex-col max-w-xs lg:max-w-md ${
                  message.isUser ? 'items-end' : 'items-start'
                }`}>
                  <div className={`px-5 py-4 rounded-2xl shadow-lg backdrop-blur-sm border ${
                    message.isUser
                      ? 'rounded-br-md border-yellow-300/30'
                      : 'text-white rounded-bl-md border-blue-300/30'
                  }`}
                  style={{
                    background: message.isUser 
                      ? `linear-gradient(to bottom right, ${config.theme.accentColor}, #fde047)`
                      : `linear-gradient(to bottom right, ${config.theme.primaryColor}, ${config.theme.secondaryColor})`,
                    color: message.isUser ? config.theme.primaryColor : 'white'
                  }}
                  >
                    <p className="text-sm leading-relaxed font-medium">{message.text}</p>
                  </div>
                  <span className="text-xs text-slate-500 mt-2 px-2 font-medium">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start space-x-4 message-animation">
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 flex items-center justify-center shadow-lg"
                  style={{ color: config.theme.primaryColor }}
                >
                  <Bot size={24} className="drop-shadow-sm" />
                </div>
                <div 
                  className="text-white px-5 py-4 rounded-2xl rounded-bl-md shadow-lg backdrop-blur-sm border border-blue-300/30"
                  style={{
                    background: `linear-gradient(to bottom right, ${config.theme.primaryColor}, ${config.theme.secondaryColor})`
                  }}
                >
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-white rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-white rounded-full typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          </ScrollArea>
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white/80 backdrop-blur-sm shadow-lg z-40">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={config.placeholder}
                className="pr-12 py-3 text-base border-2 border-gray-200 rounded-xl bg-white/90 backdrop-blur-sm"
                style={{
                  borderColor: inputValue ? config.theme.accentColor : undefined
                }}
                disabled={isTyping}
              />
            </div>
            <Button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              style={{
                background: `linear-gradient(to right, ${config.theme.primaryColor}, ${config.theme.secondaryColor})`,
                '--hover-bg': `linear-gradient(to right, ${config.theme.primaryColor}dd, ${config.theme.secondaryColor}dd)`
              } as React.CSSProperties}
            >
              <Zap size={20} />
            </Button>
          </form>
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500">
              {config.footerText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

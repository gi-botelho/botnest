import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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
    const messageText = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      console.log('Enviando mensagem para o webhook:', messageText);
      console.log('URL do webhook:', 'https://webhook.auriosai.com/webhook/uptakeChat');
      
      const requestData = {
        message: messageText,
        timestamp: new Date().toISOString(),
        userId: 'user-' + Date.now(),
      };
      
      console.log('Dados da requisição:', requestData);

      const response = await fetch('https://webhook.auriosai.com/webhook/uptakeChat', {
        method: 'POST',
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

      const data = await response.json();
      console.log('Resposta do webhook recebida:', data);

      // Processar a resposta do webhook - verificar diferentes formatos possíveis
      let aiResponseText = 'Desculpe, não consegui processar sua mensagem.';
      
      if (data.response) {
        aiResponseText = data.response;
      } else if (data.message) {
        aiResponseText = data.message;
      } else if (data.text) {
        aiResponseText = data.text;
      } else if (data.reply) {
        aiResponseText = data.reply;
      } else if (typeof data === 'string') {
        aiResponseText = data;
      }
      
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-[#0A014F] shadow-lg border-b-4 border-[#EEF36A]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <img 
              src="/lovable-uploads/fb0c58e3-a882-42fa-945a-aad3f487c103.png" 
              alt="Uptake Education" 
              className="h-12 w-auto"
            />
            <div className="flex items-center space-x-2 text-white">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 container mx-auto px-4 py-6">
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
                    ? 'bg-gradient-to-br from-[#EEF36A] to-yellow-300 text-[#0A014F]' 
                    : 'bg-gradient-to-br from-[#0A014F] to-indigo-700 text-white'
                }`}>
                  {message.isUser ? (
                    <MessageCircle size={24} className="drop-shadow-sm" />
                  ) : (
                    <MessageCircle size={24} className="drop-shadow-sm" />
                  )}
                </div>
                <div className={`flex flex-col max-w-xs lg:max-w-md ${
                  message.isUser ? 'items-end' : 'items-start'
                }`}>
                  <div className={`px-5 py-4 rounded-2xl shadow-lg backdrop-blur-sm border ${
                    message.isUser
                      ? 'bg-gradient-to-br from-[#EEF36A] to-yellow-200 text-[#0A014F] rounded-br-md border-yellow-300/30'
                      : 'bg-gradient-to-br from-[#0A014F] to-indigo-700 text-white rounded-bl-md border-blue-300/30'
                  }`}>
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
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#0A014F] to-indigo-700 text-white flex items-center justify-center shadow-lg">
                  <MessageCircle size={24} className="drop-shadow-sm" />
                </div>
                <div className="bg-gradient-to-br from-[#0A014F] to-indigo-700 text-white px-5 py-4 rounded-2xl rounded-bl-md shadow-lg backdrop-blur-sm border border-blue-300/30">
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

      {/* Input Area */}
      <div className="border-t bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="pr-12 py-3 text-base border-2 border-gray-200 focus:border-[#EEF36A] rounded-xl bg-white/90 backdrop-blur-sm"
                disabled={isTyping}
              />
            </div>
            <Button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-[#0A014F] to-indigo-700 hover:from-[#050027] hover:to-indigo-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
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

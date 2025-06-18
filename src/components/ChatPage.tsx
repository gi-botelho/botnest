
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
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
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/fb0c58e3-a882-42fa-945a-aad3f487c103.png" 
              alt="Uptake Education" 
              className="h-12 w-auto"
            />
            <div className="flex-1">
              <p className="text-white text-sm">
                Inteligência artificial para educação
              </p>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 container mx-auto px-4 py-6">
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
                      ? 'bg-[#EEF36A] text-[#0A014F] rounded-br-none'
                      : 'bg-[#0A014F] text-white rounded-bl-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 px-2">
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
                <div className="bg-[#0A014F] px-4 py-3 rounded-2xl rounded-bl-none shadow-md text-white">
                  <div className="flex space-x-1">
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

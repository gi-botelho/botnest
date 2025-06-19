import React from 'react';
import { useParams } from 'react-router-dom';
import ChatPage from './ChatPage';
import { getAgentConfig, uptakeConfig } from '@/config/agents';

const AgentRouter: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  
  // Se não há agentId na URL, usa a configuração da Uptake como padrão
  const config = agentId ? getAgentConfig(agentId) : uptakeConfig;
  
  // Se o agente não foi encontrado, mostra erro
  if (agentId && !config) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-200">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Agente não encontrado</h1>
          <p className="text-gray-600 mb-4">
            O agente "{agentId}" não existe ou não está ativo.
          </p>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }
  
  return <ChatPage config={config} />;
};

export default AgentRouter;
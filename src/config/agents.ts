// Configurações dos agentes para a plataforma SaaS Aurios AI

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  webhookUrl: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl: string;
    companyName: string;
  };
  initialMessage: string;
  placeholder: string;
  footerText: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Configuração padrão da Uptake (migrada do código atual)
export const uptakeConfig: AgentConfig = {
  id: 'uptake-education',
  name: 'Uptake Education AI',
  description: 'Assistente inteligente para gestão educacional',
  webhookUrl: 'https://webhook.auriosai.com/webhook/uptakeChat',
  theme: {
    primaryColor: '#0A014F',
    secondaryColor: '#4F46E5',
    accentColor: '#EEF36A',
    logoUrl: '/lovable-uploads/fb0c58e3-a882-42fa-945a-aad3f487c103.png',
    companyName: 'Uptake Education'
  },
  initialMessage: 'Olá! Sou a IA da Uptake Education. Como posso ajudá-lo hoje?',
  placeholder: 'Digite sua mensagem...',
  footerText: 'Powered by Aurios AI • Seus dados são protegidos',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Configurações de exemplo para demonstração
export const demoConfigs: AgentConfig[] = [
  uptakeConfig,
  {
    id: 'demo-healthcare',
    name: 'HealthCare Assistant',
    description: 'Assistente para área da saúde',
    webhookUrl: 'https://webhook.auriosai.com/webhook/healthcare',
    theme: {
      primaryColor: '#059669',
      secondaryColor: '#10B981',
      accentColor: '#34D399',
      logoUrl: '/placeholder.svg',
      companyName: 'HealthCare Plus'
    },
    initialMessage: 'Olá! Sou seu assistente de saúde. Como posso ajudá-lo?',
    placeholder: 'Descreva seus sintomas ou dúvidas...',
    footerText: 'Powered by Aurios AI • Consulte sempre um médico',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-finance',
    name: 'Finance Bot',
    description: 'Assistente financeiro inteligente',
    webhookUrl: 'https://webhook.auriosai.com/webhook/finance',
    theme: {
      primaryColor: '#1E40AF',
      secondaryColor: '#3B82F6',
      accentColor: '#60A5FA',
      logoUrl: '/placeholder.svg',
      companyName: 'FinanceAI'
    },
    initialMessage: 'Bem-vindo! Sou seu consultor financeiro virtual.',
    placeholder: 'Pergunte sobre investimentos, economia...',
    footerText: 'Powered by Aurios AI • Não é aconselhamento financeiro',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Função para buscar configuração por ID
export const getAgentConfig = (agentId: string): AgentConfig | undefined => {
  return demoConfigs.find(config => config.id === agentId);
};

// Função para listar todos os agentes ativos
export const getActiveAgents = (): AgentConfig[] => {
  return demoConfigs.filter(config => config.isActive);
};
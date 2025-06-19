import React, { useState } from 'react';
import { Plus, Settings, Eye, ExternalLink, Palette, Globe, MessageSquare, TrendingUp, Users, Edit } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getActiveAgents, AgentConfig } from '@/config/agents';
import { useTheme } from '@/hooks/use-theme';

const Dashboard: React.FC = () => {
  const [agents] = useState<AgentConfig[]>(getActiveAgents());
  const { theme } = useTheme();

  const handlePreviewAgent = (agentId: string) => {
    window.open(`/agent/${agentId}`, '_blank');
  };

  const handleEditAgent = (agentId: string) => {
    // TODO: Implementar modal de edição
    console.log('Editar agente:', agentId);
  };

  const handleCreateAgent = () => {
    // TODO: Implementar modal de criação
    console.log('Criar novo agente');
  };

  return (
    <div 
      className="min-h-screen bg-background"
      style={{
        backgroundImage: theme === 'dark' ? 'url(/fundo-abstrato-escuro.jpg)' : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm header-card">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={theme === 'dark' ? '/botnest-fundo-escuro.png' : '/botnest-fundo-claro.png'}
                alt="Botnest Logo"
                className="h-16 w-auto object-contain drop-shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  // Fallback para o ícone se a imagem não carregar
                  const fallback = document.createElement('div');
                  fallback.innerHTML = '<svg class="h-16 w-16 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>';
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button 
                onClick={handleCreateAgent}
                className="bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-700 hover:to-purple-900 text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Agente
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 pt-32">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="neo-card border-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Agentes</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{agents.length}</div>
              <p className="text-xs text-muted-foreground">
                {agents.filter(a => a.isActive).length} agentes ativos de {agents.length} total
              </p>
            </CardContent>
          </Card>
          
          <Card className="neo-card border-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversas Hoje</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">1,234</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +20.1% em relação a ontem
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Agents Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Seus Agentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="neo-card hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${agent.theme.primaryColor}, ${agent.theme.secondaryColor})`
                        }}
                      >
                        <img 
                          src={agent.theme.logoUrl} 
                          alt={agent.theme.companyName}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<MessageSquare class="w-6 h-6 text-white" />';
                          }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription>{agent.description}</CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={agent.isActive ? "default" : "secondary"}
                      className={agent.isActive ? "bg-green-100 text-green-800" : ""}
                    >
                      {agent.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Palette className="h-4 w-4 mr-2" />
                    <div className="flex space-x-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: agent.theme.primaryColor }}
                      ></div>
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: agent.theme.secondaryColor }}
                      ></div>
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: agent.theme.accentColor }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditAgent(agent.id)}
                      className="neo-button w-10 h-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handlePreviewAgent(agent.id)}
                      className="neo-button w-10 h-8"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="neo-card">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Gerencie sua plataforma de agentes inteligentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col space-y-2 neo-button hover:-translate-y-1 transition-transform duration-300">
                <Plus className="h-6 w-6" />
                <span>Criar Agente</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2 neo-button hover:-translate-y-1 transition-transform duration-300">
                <Settings className="h-6 w-6" />
                <span>Configurações</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2 neo-button hover:-translate-y-1 transition-transform duration-300">
                <Globe className="h-6 w-6" />
                <span>Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2 neo-button hover:-translate-y-1 transition-transform duration-300">
                <Palette className="h-6 w-6" />
                <span>Temas</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
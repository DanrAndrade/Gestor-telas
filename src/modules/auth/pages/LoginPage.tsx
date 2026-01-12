import React from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Importar useNavigate
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { AuthLayout } from '../layouts/AuthLayout';

export function LoginPage() {
  const navigate = useNavigate(); // 2. Inicializar o hook de navegação

  // 3. Função para lidar com o "Login"
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Evita recarregar a página
    
    // Aqui entraria a lógica de API (validar senha, pegar token, etc)
    console.log("Fazendo login...");
    
    // Por enquanto, redireciona direto para o Dashboard
    navigate('/dashboard'); 
  };

  return (
    <AuthLayout 
      title="Bem-vindo" 
      subtitle="Insira suas credenciais para acessar o painel."
    >
      {/* 4. Adicionar onSubmit no formulário */}
      <form onSubmit={handleLogin} className="space-y-6">
        <Input 
          label="E-mail" 
          type="email" 
          placeholder="ex: doutor@hemocentro.gov.br" 
          icon={User}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-sm font-semibold text-ui-text">Senha</label>
            <Link 
              to="/forgot-password" 
              className="text-xs font-semibold text-brand-red hover:text-brand-dark transition-colors"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          
          <Input 
            type="password" 
            placeholder="••••••••" 
            icon={Lock}
          />
        </div>

        <div className="pt-4">
          {/* 5. Garantir que o botão seja type="submit" */}
          <Button type="submit" className="w-full py-4 text-base group">
            Acessar Sistema
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-xs text-ui-muted">
          Problemas com acesso?{' '}
          <a href="#" className="font-semibold text-ui-text hover:text-brand-red hover:underline transition-colors">
            Contate o suporte de TI
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
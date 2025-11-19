'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await auth.signIn(formData.email, formData.password);
        if (error) throw error;
        router.push('/dashboard');
      } else {
        const { error } = await auth.signUp(formData.email, formData.password, formData.name);
        if (error) throw error;
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E90FF] to-[#0066CC] mb-4">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 font-inter">GTFit</h1>
          <p className="text-gray-400 font-inter">Seu parceiro fitness premium</p>
        </div>

        {/* Card de Login */}
        <div className="bg-[#1A1A1A] rounded-3xl p-8 shadow-2xl border border-gray-800">
          <div className="flex gap-2 mb-6">
            <Button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 rounded-xl transition-all duration-300 ${
                isLogin
                  ? 'bg-[#1E90FF] text-white hover:bg-[#1E90FF]/90'
                  : 'bg-transparent text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              Login
            </Button>
            <Button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 rounded-xl transition-all duration-300 ${
                !isLogin
                  ? 'bg-[#1E90FF] text-white hover:bg-[#1E90FF]/90'
                  : 'bg-transparent text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              Cadastro
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300 font-inter">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[#0D0D0D] border-gray-700 text-white placeholder:text-gray-500 rounded-xl h-12 focus:border-[#1E90FF] transition-all"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-inter">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-[#0D0D0D] border-gray-700 text-white placeholder:text-gray-500 rounded-xl h-12 pl-11 focus:border-[#1E90FF] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 font-inter">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-[#0D0D0D] border-gray-700 text-white placeholder:text-gray-500 rounded-xl h-12 pl-11 pr-11 focus:border-[#1E90FF] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm font-inter">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1E90FF] to-[#0066CC] text-white rounded-xl h-12 font-semibold hover:shadow-lg hover:shadow-[#1E90FF]/50 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>

            {isLogin && (
              <button
                type="button"
                className="w-full text-center text-sm text-gray-400 hover:text-[#1E90FF] transition-colors font-inter"
              >
                Esqueceu sua senha?
              </button>
            )}
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6 font-inter">
          Ao continuar, você concorda com nossos Termos de Uso
        </p>
      </div>
    </div>
  );
}

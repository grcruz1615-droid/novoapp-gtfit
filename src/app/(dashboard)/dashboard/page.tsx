'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Dumbbell, 
  Flame, 
  TrendingUp, 
  Apple, 
  Activity,
  Calendar,
  Target,
  Award,
  ChevronRight,
  Menu,
  User,
  LogOut
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Stats do dia
  const [dailyStats] = useState({
    caloriesConsumed: 1450,
    caloriesGoal: 2000,
    caloriesBurned: 320,
    waterIntake: 1.5,
    waterGoal: 2.5,
    workoutsCompleted: 1,
    workoutsGoal: 1,
    streak: 7
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data } = await auth.getUser();
      if (!data.user) {
        router.push('/login');
      } else {
        setUser(data.user);
      }
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  const caloriesProgress = (dailyStats.caloriesConsumed / dailyStats.caloriesGoal) * 100;
  const waterProgress = (dailyStats.waterIntake / dailyStats.waterGoal) * 100;
  const workoutProgress = (dailyStats.workoutsCompleted / dailyStats.workoutsGoal) * 100;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E90FF] to-[#0066CC] flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white font-inter">GTFit</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-400 hover:text-white"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-inter">
            Olá, {user?.user_metadata?.name || 'Atleta'}! 👋
          </h2>
          <p className="text-gray-400 font-inter">Vamos conquistar seus objetivos hoje</p>
        </div>

        {/* Streak Card */}
        <Card className="bg-gradient-to-r from-[#1E90FF] to-[#0066CC] border-0 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1 font-inter">Sequência Atual</p>
              <p className="text-3xl font-bold text-white font-inter">{dailyStats.streak} dias</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Flame className="w-8 h-8 text-white" />
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Calorias */}
          <Card className="bg-[#1A1A1A] border-gray-800 p-6 hover:border-[#1E90FF]/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Apple className="w-6 h-6 text-orange-500" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm mb-2 font-inter">Calorias Consumidas</p>
            <p className="text-2xl font-bold text-white mb-3 font-inter">
              {dailyStats.caloriesConsumed} / {dailyStats.caloriesGoal}
            </p>
            <Progress value={caloriesProgress} className="h-2 bg-gray-800" />
          </Card>

          {/* Treino */}
          <Card className="bg-[#1A1A1A] border-gray-800 p-6 hover:border-[#1E90FF]/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E90FF]/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#1E90FF]" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm mb-2 font-inter">Treinos Hoje</p>
            <p className="text-2xl font-bold text-white mb-3 font-inter">
              {dailyStats.workoutsCompleted} / {dailyStats.workoutsGoal}
            </p>
            <Progress value={workoutProgress} className="h-2 bg-gray-800" />
          </Card>

          {/* Calorias Queimadas */}
          <Card className="bg-[#1A1A1A] border-gray-800 p-6 hover:border-[#1E90FF]/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-red-500" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm mb-2 font-inter">Calorias Queimadas</p>
            <p className="text-2xl font-bold text-white mb-3 font-inter">
              {dailyStats.caloriesBurned} kcal
            </p>
            <div className="flex items-center gap-2 text-green-500 text-sm font-inter">
              <TrendingUp className="w-4 h-4" />
              <span>+12% vs ontem</span>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 font-inter">Ações Rápidas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button className="h-auto py-6 flex flex-col gap-2 bg-[#1A1A1A] border border-gray-800 hover:border-[#1E90FF] hover:bg-[#1A1A1A] text-white">
              <Apple className="w-6 h-6 text-[#1E90FF]" />
              <span className="text-sm font-inter">Registrar Refeição</span>
            </Button>
            <Button className="h-auto py-6 flex flex-col gap-2 bg-[#1A1A1A] border border-gray-800 hover:border-[#1E90FF] hover:bg-[#1A1A1A] text-white">
              <Dumbbell className="w-6 h-6 text-[#1E90FF]" />
              <span className="text-sm font-inter">Iniciar Treino</span>
            </Button>
            <Button className="h-auto py-6 flex flex-col gap-2 bg-[#1A1A1A] border border-gray-800 hover:border-[#1E90FF] hover:bg-[#1A1A1A] text-white">
              <Calendar className="w-6 h-6 text-[#1E90FF]" />
              <span className="text-sm font-inter">Ver Plano</span>
            </Button>
            <Button className="h-auto py-6 flex flex-col gap-2 bg-[#1A1A1A] border border-gray-800 hover:border-[#1E90FF] hover:bg-[#1A1A1A] text-white">
              <Target className="w-6 h-6 text-[#1E90FF]" />
              <span className="text-sm font-inter">Metas</span>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 font-inter">Atividade Recente</h3>
          <Card className="bg-[#1A1A1A] border-gray-800 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium font-inter">Treino Completo!</p>
                  <p className="text-gray-400 text-sm font-inter">Treino de Peito e Tríceps - 45 min</p>
                </div>
                <span className="text-gray-500 text-sm font-inter">Hoje</span>
              </div>
              
              <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Apple className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium font-inter">Refeição Registrada</p>
                  <p className="text-gray-400 text-sm font-inter">Almoço - 650 kcal</p>
                </div>
                <span className="text-gray-500 text-sm font-inter">2h atrás</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1E90FF]/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#1E90FF]" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium font-inter">Nova Meta Alcançada!</p>
                  <p className="text-gray-400 text-sm font-inter">7 dias de sequência</p>
                </div>
                <span className="text-gray-500 text-sm font-inter">Hoje</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

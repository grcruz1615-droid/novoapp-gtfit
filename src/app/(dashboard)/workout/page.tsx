'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Play, Clock, Target, Flame, ChevronRight } from 'lucide-react';
import { WorkoutPlan, Exercise } from '@/lib/types';

export default function WorkoutPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);

  // Mock workout plans
  const [plans] = useState<WorkoutPlan[]>([
    {
      id: '1',
      user_id: 'user1',
      name: 'Treino Iniciante - ABC',
      description: 'Programa básico para quem está começando',
      exercises: [
        {
          id: '1',
          name: 'Supino Reto',
          sets: 3,
          reps: 12,
          rest_seconds: 60,
          muscle_group: 'Peito',
          illustration_url: '/exercises/supino.jpg'
        },
        {
          id: '2',
          name: 'Puxada na Frente',
          sets: 3,
          reps: 12,
          rest_seconds: 60,
          muscle_group: 'Costas',
          illustration_url: '/exercises/puxada.jpg'
        },
        {
          id: '3',
          name: 'Agachamento',
          sets: 3,
          reps: 15,
          rest_seconds: 90,
          muscle_group: 'Pernas',
          illustration_url: '/exercises/agachamento.jpg'
        }
      ],
      difficulty: 'beginner',
      duration_minutes: 45,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      user_id: 'user1',
      name: 'Treino Intermediário - Push/Pull',
      description: 'Programa avançado para ganho de força',
      exercises: [
        {
          id: '4',
          name: 'Supino Inclinado com Halteres',
          sets: 4,
          reps: 10,
          rest_seconds: 90,
          muscle_group: 'Peito',
          illustration_url: '/exercises/supino-inclinado.jpg'
        },
        {
          id: '5',
          name: 'Remada Curvada',
          sets: 4,
          reps: 10,
          rest_seconds: 90,
          muscle_group: 'Costas',
          illustration_url: '/exercises/remada.jpg'
        },
        {
          id: '6',
          name: 'Leg Press',
          sets: 4,
          reps: 12,
          rest_seconds: 60,
          muscle_group: 'Pernas',
          illustration_url: '/exercises/leg-press.jpg'
        }
      ],
      difficulty: 'intermediate',
      duration_minutes: 60,
      created_at: new Date().toISOString()
    }
  ]);

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-500';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500';
      case 'advanced': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return difficulty;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

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
              <h1 className="text-xl font-bold text-white font-inter">Plano de Treino</h1>
            </div>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!selectedPlan ? (
          <>
            {/* Today's Workout */}
            <Card className="bg-gradient-to-r from-[#1E90FF] to-[#0066CC] border-0 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1 font-inter">Treino de Hoje</p>
                  <p className="text-2xl font-bold text-white mb-2 font-inter">Peito e Tríceps</p>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>45 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      <span>320 kcal</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-white text-[#1E90FF] hover:bg-gray-100">
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar
                </Button>
              </div>
            </Card>

            {/* Workout Plans */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4 font-inter">Planos de Treino</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className="bg-[#1A1A1A] border-gray-800 p-6 hover:border-[#1E90FF]/50 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-2 font-inter">{plan.name}</h4>
                        <p className="text-gray-400 text-sm mb-3 font-inter">{plan.description}</p>
                        <Badge className={getDifficultyColor(plan.difficulty)}>
                          {getDifficultyText(plan.difficulty)}
                        </Badge>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-inter">Exercícios</span>
                        <span className="text-white font-inter">{plan.exercises.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-inter">Duração</span>
                        <span className="text-white font-inter">{plan.duration_minutes} min</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Plan Details */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setSelectedPlan(null)}
                className="text-gray-400 hover:text-white mb-4"
              >
                ← Voltar aos Planos
              </Button>

              <Card className="bg-[#1A1A1A] border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 font-inter">{selectedPlan.name}</h2>
                    <p className="text-gray-400 font-inter">{selectedPlan.description}</p>
                  </div>
                  <Badge className={getDifficultyColor(selectedPlan.difficulty)}>
                    {getDifficultyText(selectedPlan.difficulty)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm font-inter">Exercícios</p>
                    <p className="text-2xl font-bold text-white font-inter">{selectedPlan.exercises.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm font-inter">Duração</p>
                    <p className="text-2xl font-bold text-white font-inter">{selectedPlan.duration_minutes} min</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm font-inter">Dificuldade</p>
                    <p className="text-lg font-bold text-white font-inter capitalize">{getDifficultyText(selectedPlan.difficulty)}</p>
                  </div>
                </div>

                <Button className="w-full bg-[#1E90FF] hover:bg-[#0066CC] text-white py-3 mb-6">
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Treino
                </Button>
              </Card>
            </div>

            {/* Exercises List */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 font-inter">Exercícios</h3>
              <div className="space-y-4">
                {selectedPlan.exercises.map((exercise, index) => (
                  <Card key={exercise.id} className="bg-[#1A1A1A] border-gray-800 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#1E90FF]/10 flex items-center justify-center text-[#1E90FF] font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-2 font-inter">{exercise.name}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-gray-400 text-sm font-inter">Séries</p>
                            <p className="text-white font-bold font-inter">{exercise.sets}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400 text-sm font-inter">Repetições</p>
                            <p className="text-white font-bold font-inter">{exercise.reps}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400 text-sm font-inter">Descanso</p>
                            <p className="text-white font-bold font-inter">{exercise.rest_seconds}s</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400 text-sm font-inter">Grupo</p>
                            <p className="text-[#1E90FF] font-bold font-inter">{exercise.muscle_group}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF] hover:text-white"
                          onClick={() => setCurrentExercise(exercise)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Ver Demonstração
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Exercise Modal/Demo */}
        {currentExercise && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-[#1A1A1A] border-gray-800 p-6 max-w-md w-full">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2 font-inter">{currentExercise.name}</h3>
                <p className="text-gray-400 font-inter">Grupo muscular: {currentExercise.muscle_group}</p>
              </div>

              {/* Placeholder for exercise illustration */}
              <div className="w-full h-48 bg-[#2A2A2A] rounded-lg flex items-center justify-center mb-6">
                <Target className="w-16 h-16 text-[#1E90FF]" />
                <p className="text-gray-400 ml-4 font-inter">Ilustração 3D</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm font-inter">Séries</p>
                  <p className="text-white font-bold text-lg font-inter">{currentExercise.sets}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm font-inter">Reps</p>
                  <p className="text-white font-bold text-lg font-inter">{currentExercise.reps}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm font-inter">Descanso</p>
                  <p className="text-white font-bold text-lg font-inter">{currentExercise.rest_seconds}s</p>
                </div>
              </div>

              <Button
                className="w-full bg-[#1E90FF] hover:bg-[#0066CC] text-white"
                onClick={() => setCurrentExercise(null)}
              >
                Fechar
              </Button>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
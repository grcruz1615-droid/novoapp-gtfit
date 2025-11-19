'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ChefHat, ShoppingCart, Plus, Target, Calendar } from 'lucide-react';

interface NutritionPlan {
  id: string;
  name: string;
  description: string;
  meals: Meal[];
  shoppingList: string[];
  created_at: string;
}

interface Meal {
  type: string;
  foods: string[];
  calories: number;
}

export default function NutritionPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlan | null>(null);

  // Mock data for demonstration
  const [mockPlans] = useState<NutritionPlan[]>([
    {
      id: '1',
      name: 'Plano de Emagrecimento',
      description: 'Dieta balanceada para perda de peso saudável',
      meals: [
        { type: 'Café da Manhã', foods: ['Aveia com frutas', 'Iogurte natural', 'Café preto'], calories: 350 },
        { type: 'Almoço', foods: ['Peito de frango grelhado', 'Arroz integral', 'Salada verde'], calories: 450 },
        { type: 'Jantar', foods: ['Salmão assado', 'Quinoa', 'Brócolis'], calories: 400 },
        { type: 'Lanches', foods: ['Maçã', 'Nozes', 'Iogurte'], calories: 200 }
      ],
      shoppingList: ['Aveia', 'Frutas frescas', 'Iogurte natural', 'Peito de frango', 'Arroz integral', 'Salmão', 'Quinoa'],
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Plano de Ganho de Massa',
      description: 'Alto em proteínas para ganho muscular',
      meals: [
        { type: 'Café da Manhã', foods: ['Ovos mexidos', 'Pão integral', 'Abacate'], calories: 500 },
        { type: 'Almoço', foods: ['Carne vermelha', 'Batata doce', 'Vegetais'], calories: 650 },
        { type: 'Jantar', foods: ['Atum', 'Massa integral', 'Espinafre'], calories: 550 },
        { type: 'Lanches', foods: ['Whey protein', 'Banana', 'Amêndoas'], calories: 300 }
      ],
      shoppingList: ['Ovos', 'Pão integral', 'Abacate', 'Carne vermelha', 'Batata doce', 'Atum', 'Whey protein'],
      created_at: new Date().toISOString()
    }
  ]);

  useEffect(() => {
    checkUser();
    // In a real app, load from database
    setPlans(mockPlans);
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
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white font-inter">Planejador Nutricional</h1>
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
        {/* Create Plan Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="w-full bg-[#1E90FF] hover:bg-[#0066CC] text-white py-4"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Novo Plano Nutricional
          </Button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="bg-[#1A1A1A] border-gray-800 p-6 hover:border-[#1E90FF]/50 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 font-inter">{plan.name}</h3>
                  <p className="text-gray-400 text-sm font-inter">{plan.description}</p>
                </div>
                <Target className="w-8 h-8 text-[#1E90FF]" />
              </div>

              <div className="space-y-3">
                {plan.meals.slice(0, 3).map((meal, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm font-inter">{meal.type}</span>
                    <span className="text-[#1E90FF] text-sm font-inter">{meal.calories} kcal</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-gray-500 text-xs font-inter">
                  {plan.shoppingList.length} itens na lista de compras
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Selected Plan Details */}
        {selectedPlan && (
          <Card className="bg-[#1A1A1A] border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white font-inter">{selectedPlan.name}</h3>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300"
                onClick={() => setSelectedPlan(null)}
              >
                Fechar
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Meals */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 font-inter">Refeições do Dia</h4>
                <div className="space-y-4">
                  {selectedPlan.meals.map((meal, index) => (
                    <Card key={index} className="bg-[#2A2A2A] border-gray-700 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-white font-medium font-inter">{meal.type}</h5>
                        <span className="text-[#1E90FF] font-bold font-inter">{meal.calories} kcal</span>
                      </div>
                      <ul className="text-gray-300 text-sm space-y-1">
                        {meal.foods.map((food, foodIndex) => (
                          <li key={foodIndex} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1E90FF]"></div>
                            {food}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Shopping List */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 font-inter flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Lista de Compras
                </h4>
                <Card className="bg-[#2A2A2A] border-gray-700 p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedPlan.shoppingList.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-[#1E90FF]"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="mt-6">
                  <Button className="w-full bg-[#1E90FF] hover:bg-[#0066CC] text-white">
                    <Calendar className="w-5 h-5 mr-2" />
                    Ativar Este Plano
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Create Plan Form */}
        {showForm && (
          <Card className="bg-[#1A1A1A] border-gray-800 p-6">
            <h3 className="text-xl font-bold text-white mb-6 font-inter">Criar Novo Plano Nutricional</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan_name" className="text-white">Nome do Plano</Label>
                  <Input
                    id="plan_name"
                    className="bg-[#2A2A2A] border-gray-700 text-white"
                    placeholder="Ex: Plano de Emagrecimento"
                  />
                </div>
                <div>
                  <Label htmlFor="goal" className="text-white">Objetivo</Label>
                  <Select>
                    <SelectTrigger className="bg-[#2A2A2A] border-gray-700 text-white">
                      <SelectValue placeholder="Selecione o objetivo" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-gray-700">
                      <SelectItem value="weight_loss">Perda de Peso</SelectItem>
                      <SelectItem value="muscle_gain">Ganho de Massa</SelectItem>
                      <SelectItem value="maintenance">Manutenção</SelectItem>
                      <SelectItem value="health">Saúde Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Descrição</Label>
                <Textarea
                  id="description"
                  className="bg-[#2A2A2A] border-gray-700 text-white"
                  placeholder="Descreva o plano nutricional..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-[#1E90FF] hover:bg-[#0066CC] text-white">
                  Criar Plano
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-gray-700 text-gray-300">
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}
      </main>
    </div>
  );
}
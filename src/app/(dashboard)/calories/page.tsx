'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Plus, Apple, Coffee, Utensils, Cookie } from 'lucide-react';
import { CalorieEntry } from '@/lib/types';

export default function CaloriesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<CalorieEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    food_name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    meal_type: 'breakfast' as const,
    photo_url: ''
  });

  useEffect(() => {
    checkUser();
    loadEntries();
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

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('calorie_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Erro ao carregar entradas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('calorie_entries')
        .insert({
          user_id: user.id,
          food_name: formData.food_name,
          calories: parseInt(formData.calories),
          protein: parseFloat(formData.protein) || 0,
          carbs: parseFloat(formData.carbs) || 0,
          fats: parseFloat(formData.fats) || 0,
          meal_type: formData.meal_type,
          photo_url: formData.photo_url || null
        });

      if (error) throw error;

      setFormData({
        food_name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        meal_type: 'breakfast',
        photo_url: ''
      });
      setShowForm(false);
      loadEntries();
    } catch (error) {
      console.error('Erro ao salvar entrada:', error);
    }
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="w-5 h-5" />;
      case 'lunch': return <Utensils className="w-5 h-5" />;
      case 'dinner': return <Utensils className="w-5 h-5" />;
      case 'snack': return <Cookie className="w-5 h-5" />;
      default: return <Apple className="w-5 h-5" />;
    }
  };

  const getMealColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'text-orange-500';
      case 'lunch': return 'text-blue-500';
      case 'dinner': return 'text-purple-500';
      case 'snack': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  const todayTotal = entries
    .filter(entry => new Date(entry.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, entry) => sum + entry.calories, 0);

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E90FF] to-[#0066CC] flex items-center justify-center">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white font-inter">Contador de Calorias</h1>
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
        {/* Today's Summary */}
        <Card className="bg-gradient-to-r from-[#1E90FF] to-[#0066CC] border-0 p-6 mb-6">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-2 font-inter">Calorias Hoje</p>
            <p className="text-4xl font-bold text-white mb-2 font-inter">{todayTotal}</p>
            <p className="text-white/60 text-sm font-inter">Meta: 2000 kcal</p>
          </div>
        </Card>

        {/* Add Entry Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="w-full bg-[#1E90FF] hover:bg-[#0066CC] text-white py-4"
          >
            <Plus className="w-5 h-5 mr-2" />
            Registrar Refeição
          </Button>
        </div>

        {/* Add Entry Form */}
        {showForm && (
          <Card className="bg-[#1A1A1A] border-gray-800 p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="food_name" className="text-white">Nome do Alimento</Label>
                  <Input
                    id="food_name"
                    value={formData.food_name}
                    onChange={(e) => setFormData({...formData, food_name: e.target.value})}
                    className="bg-[#2A2A2A] border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="meal_type" className="text-white">Tipo de Refeição</Label>
                  <Select value={formData.meal_type} onValueChange={(value: any) => setFormData({...formData, meal_type: value})}>
                    <SelectTrigger className="bg-[#2A2A2A] border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-gray-700">
                      <SelectItem value="breakfast">Café da Manhã</SelectItem>
                      <SelectItem value="lunch">Almoço</SelectItem>
                      <SelectItem value="dinner">Jantar</SelectItem>
                      <SelectItem value="snack">Lanche</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="calories" className="text-white">Calorias</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({...formData, calories: e.target.value})}
                    className="bg-[#2A2A2A] border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="protein" className="text-white">Proteína (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    value={formData.protein}
                    onChange={(e) => setFormData({...formData, protein: e.target.value})}
                    className="bg-[#2A2A2A] border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="carbs" className="text-white">Carboidratos (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    value={formData.carbs}
                    onChange={(e) => setFormData({...formData, carbs: e.target.value})}
                    className="bg-[#2A2A2A] border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="fats" className="text-white">Gorduras (g)</Label>
                  <Input
                    id="fats"
                    type="number"
                    step="0.1"
                    value={formData.fats}
                    onChange={(e) => setFormData({...formData, fats: e.target.value})}
                    className="bg-[#2A2A2A] border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="photo_url" className="text-white">URL da Foto (opcional)</Label>
                <Input
                  id="photo_url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
                  className="bg-[#2A2A2A] border-gray-700 text-white"
                  placeholder="Cole a URL da foto do prato"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-[#1E90FF] hover:bg-[#0066CC] text-white">
                  Salvar
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-gray-700 text-gray-300">
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Recent Entries */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 font-inter">Refeições Recentes</h3>
          <div className="space-y-3">
            {entries.map((entry) => (
              <Card key={entry.id} className="bg-[#1A1A1A] border-gray-800 p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center ${getMealColor(entry.meal_type)}`}>
                    {getMealIcon(entry.meal_type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium font-inter">{entry.food_name}</p>
                    <p className="text-gray-400 text-sm font-inter">
                      {entry.calories} kcal • P: {entry.protein}g • C: {entry.carbs}g • G: {entry.fats}g
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#1E90FF] font-bold font-inter">{entry.calories} kcal</p>
                    <p className="text-gray-500 text-sm font-inter capitalize">{entry.meal_type}</p>
                  </div>
                </div>
                {entry.photo_url && (
                  <div className="mt-3">
                    <img src={entry.photo_url} alt={entry.food_name} className="w-full h-32 object-cover rounded-lg" />
                  </div>
                )}
              </Card>
            ))}
            {entries.length === 0 && (
              <Card className="bg-[#1A1A1A] border-gray-800 p-8 text-center">
                <Apple className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-inter">Nenhuma refeição registrada ainda</p>
                <p className="text-gray-500 text-sm font-inter mt-2">Comece registrando sua primeira refeição!</p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Brain, CheckCircle, XCircle, Trophy } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function QuizPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions: Question[] = [
    {
      id: '1',
      question: 'Qual é a frequência recomendada de exercícios cardiovasculares por semana?',
      options: ['1-2 vezes', '3-5 vezes', 'Todos os dias', 'Nunca'],
      correctAnswer: 1,
      explanation: 'A recomendação geral é 3-5 sessões de exercícios cardiovasculares por semana, com duração de 30-60 minutos cada.'
    },
    {
      id: '2',
      question: 'Qual macronutriente é essencial para a construção e reparo muscular?',
      options: ['Carboidratos', 'Proteínas', 'Gorduras', 'Vitaminas'],
      correctAnswer: 1,
      explanation: 'As proteínas fornecem os aminoácidos necessários para a síntese proteica muscular e recuperação após exercícios.'
    },
    {
      id: '3',
      question: 'Quanto tempo de sono é recomendado para adultos saudáveis?',
      options: ['4-5 horas', '6-7 horas', '7-9 horas', '10+ horas'],
      correctAnswer: 2,
      explanation: 'Adultos devem dormir entre 7-9 horas por noite para recuperação adequada, saúde mental e performance física.'
    },
    {
      id: '4',
      question: 'Qual é o benefício principal da hidratação adequada durante exercícios?',
      options: ['Aumenta a força', 'Previne cãibras e fadiga', 'Queima mais calorias', 'Melhora o humor'],
      correctAnswer: 1,
      explanation: 'A hidratação adequada ajuda a regular a temperatura corporal, transportar nutrientes e prevenir cãibras musculares.'
    },
    {
      id: '5',
      question: 'Qual exercício é mais eficaz para fortalecer o core?',
      options: ['Flexão', 'Agachamento', 'Prancha', 'Corrida'],
      correctAnswer: 2,
      explanation: 'A prancha trabalha todos os músculos do core de forma isométrica, sendo excelente para força e estabilidade.'
    }
  ];

  useEffect(() => {
    checkUser();
    setAnswers(new Array(questions.length).fill(null));
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

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(newAnswers[currentQuestion + 1]);
      } else {
        setShowResult(true);
        setQuizCompleted(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return answer === questions[index].correctAnswer ? score + 1 : score;
    }, 0);
  };

  const getScoreMessage = (score: number) => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return { message: 'Excelente! Você é um expert em fitness!', color: 'text-green-500' };
    if (percentage >= 60) return { message: 'Bom trabalho! Continue aprendendo!', color: 'text-yellow-500' };
    return { message: 'Continue estudando. Todo mundo começa de algum lugar!', color: 'text-red-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const score = calculateScore();
  const scoreData = getScoreMessage(score);

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E90FF] to-[#0066CC] flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white font-inter">Quiz de Conhecimento</h1>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!showResult ? (
          <>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 font-inter">Pergunta {currentQuestion + 1} de {questions.length}</span>
                <span className="text-[#1E90FF] font-bold font-inter">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-gray-800" />
            </div>

            {/* Question Card */}
            <Card className="bg-[#1A1A1A] border-gray-800 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 font-inter">
                {questions[currentQuestion].question}
              </h2>

              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                className="space-y-4"
              >
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                      className="border-gray-600 text-[#1E90FF]"
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="text-gray-300 font-inter cursor-pointer flex-1 py-3 px-4 rounded-lg border border-gray-700 hover:border-[#1E90FF]/50 transition-colors"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="border-gray-700 text-gray-300 disabled:opacity-50"
                >
                  Anterior
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className="bg-[#1E90FF] hover:bg-[#0066CC] text-white disabled:opacity-50"
                >
                  {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}
                </Button>
              </div>
            </Card>
          </>
        ) : (
          <>
            {/* Results */}
            <Card className="bg-[#1A1A1A] border-gray-800 p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-[#1E90FF]/10 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-[#1E90FF]" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-4 font-inter">Quiz Concluído!</h2>

              <div className="mb-6">
                <p className="text-6xl font-bold text-[#1E90FF] mb-2 font-inter">{score}/{questions.length}</p>
                <p className={`text-lg font-inter ${scoreData.color}`}>{scoreData.message}</p>
              </div>

              <div className="space-y-4 mb-8">
                {questions.map((question, index) => (
                  <Card key={question.id} className="bg-[#2A2A2A] border-gray-700 p-4">
                    <div className="flex items-start gap-3">
                      {answers[index] === question.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-white font-medium mb-2 font-inter">{question.question}</p>
                        <p className="text-gray-400 text-sm font-inter">{question.explanation}</p>
                        {answers[index] !== question.correctAnswer && (
                          <p className="text-red-400 text-sm mt-2 font-inter">
                            Sua resposta: {question.options[answers[index] || 0]}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    setCurrentQuestion(0);
                    setSelectedAnswer(null);
                    setAnswers(new Array(questions.length).fill(null));
                    setShowResult(false);
                    setQuizCompleted(false);
                  }}
                  variant="outline"
                  className="border-gray-700 text-gray-300"
                >
                  Refazer Quiz
                </Button>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-[#1E90FF] hover:bg-[#0066CC] text-white"
                >
                  Voltar ao Dashboard
                </Button>
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
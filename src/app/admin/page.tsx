"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import type { ChatStep } from '@/lib/types';
import { chatFlow } from '@/lib/chat-flow';
import { BarChart, LogOut, Users, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StepAnalytics {
  count: number;
  dropOff: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Record<string, StepAnalytics>>({});
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
    } else {
      fetchAnalytics();
    }
  }, [router]);

  const fetchAnalytics = async () => {
    try {
        const db = getFirestore(app);
        const funnelSnapshot = await getDocs(collection(db, 'funnel_analytics'));
        
        const stepCounts: Record<string, number> = {};
        const uniqueUsers = new Set<string>();

        funnelSnapshot.forEach(doc => {
            const data = doc.data();
            uniqueUsers.add(data.userId);
            if (data.stepId) {
                stepCounts[data.stepId] = (stepCounts[data.stepId] || 0) + 1;
            }
        });
        
        setTotalUsers(uniqueUsers.size);

        const calculatedAnalytics: Record<string, StepAnalytics> = {};
        let previousStepCount = uniqueUsers.size > 0 ? stepCounts['step_1'] || uniqueUsers.size : 0;
        
        // Ensure even steps not present in analytics are included
        const allSteps = chatFlow.map(step => step.id);
        
        for (let i = 0; i < allSteps.length; i++) {
            const stepId = `step_${allSteps[i]}`;
            const currentStepCount = stepCounts[stepId] || 0;
            
            let dropOff = 0;
            if (previousStepCount > 0 && i > 0) {
                 const previousStepId = `step_${allSteps[i - 1]}`;
                 const prevCount = stepCounts[previousStepId] || (i === 0 ? uniqueUsers.size : 0);
                 if (prevCount > 0) {
                    dropOff = ((prevCount - currentStepCount) / prevCount) * 100;
                 }
            }


            calculatedAnalytics[stepId] = {
                count: currentStepCount,
                dropOff: parseFloat(dropOff.toFixed(1)),
            };

            if (currentStepCount > 0) {
              previousStepCount = currentStepCount;
            }
        }


        setAnalytics(calculatedAnalytics);
    } catch (error) {
        console.error("Error fetching analytics:", error);
    } finally {
        setLoading(false);
    }
  };

  const getStepDescription = (stepId: string): string => {
    const id = parseInt(stepId.split('_')[1]);
    const step = chatFlow.find(s => s.id === id);
    if (!step) return "Etapa desconhecida";

    let description = `[${step.type.toUpperCase()}]`;
    if (step.content) {
        description += ` - ${step.content.substring(0, 50)}...`;
    } else if (step.type === 'calculator') {
        description += " - Calculadora de Saúde";
    } else if (step.type === 'report') {
        description += " - Relatório de IMC";
    }
    return description;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold">Carregando dados...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BarChart className="h-8 w-8 text-teal-600" />
            <h1 className="text-2xl font-bold text-gray-900">Painel de Análise do Funil</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Pessoas que iniciaram a conversa</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Progresso no Funil</h2>
          <div className="space-y-6">
            {chatFlow.map((step, index) => {
              const stepId = `step_${step.id}`;
              const data = analytics[stepId] || { count: 0, dropOff: 0 };
              const initialUsers = analytics['step_1']?.count || totalUsers;
              const progress = initialUsers > 0 ? (data.count / initialUsers) * 100 : 0;

              return (
                <div key={stepId} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-gray-700">{index + 1}. {getStepDescription(stepId)}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500" title="Usuários que chegaram nesta etapa">
                        <Users className="h-4 w-4" />
                        <span>{data.count}</span>
                      </div>
                       {index > 0 && (
                        <div className="flex items-center gap-2 text-sm text-red-500" title="Taxa de queda da etapa anterior para esta">
                          <TrendingDown className="h-4 w-4" />
                          <span>{data.dropOff}%</span>
                        </div>
                       )}
                    </div>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

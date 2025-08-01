
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Progress } from './ui/progress';
import { Droplet } from 'lucide-react';
import { calculateIMC, getIMCCategory, calculateWaterIntake } from '@/lib/utils';
import type { UserInfo } from '@/lib/types';

interface ReportCardProps {
  userInfo: UserInfo;
}

export const ReportCard = React.forwardRef<HTMLDivElement, ReportCardProps>(({ userInfo }, ref) => {
  const imc = calculateIMC(userInfo.weight, userInfo.height);
  const imcCategory = getIMCCategory(imc);
  const waterIntake = calculateWaterIntake(userInfo.weight);

  const getProgressValue = (imc: number) => {
      if (imc < 18.5) return (imc / 18.5) * 25;
      if (imc < 25) return 25 + ((imc - 18.5) / 6.5) * 25;
      if (imc < 30) return 50 + ((imc - 25) / 5) * 25;
      if (imc < 40) return 75 + ((imc - 30) / 10) * 25;
      return 100;
  }
  
  return (
    <Card ref={ref} className="w-full max-w-sm mx-auto my-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Seu Relatório de Saúde</CardTitle>
        <CardDescription>Uma análise inicial da sua jornada.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* IMC Section */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">Índice de Massa Corporal (IMC)</h3>
          <div className={`p-4 rounded-lg text-center ${imcCategory.bgColor}`}>
            <p className={`text-4xl font-bold ${imcCategory.color}`}>{imc}</p>
            <p className={`font-semibold ${imcCategory.color}`}>{imcCategory.category}</p>
          </div>
          <div className="relative pt-1">
            <Progress value={getProgressValue(imc)} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Abaixo</span>
              <span>Normal</span>
              <span>Sobrepeso</span>
              <span>Obesidade</span>
            </div>
          </div>
        </div>
        
        {/* Water Intake Section */}
        <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">Hidratação Diária Ideal</h3>
            <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg flex items-center justify-center gap-4">
                <Droplet className="h-10 w-10 text-blue-500" />
                <div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{waterIntake} ml</p>
                    <p className="text-sm text-blue-500 dark:text-blue-400">por dia</p>
                </div>
            </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center bg-teal-50 dark:bg-teal-900/50 p-3 rounded-lg">
            <p className="text-sm text-teal-700 dark:text-teal-200">
                Este é o primeiro passo! Com o <span className="font-bold">GrãoKiseca</span>, você pode alcançar seu peso ideal de forma saudável e natural.
            </p>
        </div>
      </CardContent>
    </Card>
  );
});

ReportCard.displayName = 'ReportCard';

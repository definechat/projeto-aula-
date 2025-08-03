
"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Progress } from './ui/progress';
import { Droplet, Weight, Download } from 'lucide-react';
import { calculateIMC, getIMCCategory, calculateWaterIntake, calculateIdealWeight } from '@/lib/utils';
import type { UserInfo } from '@/lib/types';
import { Button } from './ui/button';
import html2canvas from 'html2canvas';

const AudioPlayer = dynamic(() => import('@/components/audio-player').then(mod => mod.AudioPlayer), {
  ssr: false,
  loading: () => <div className="h-10 w-full animate-pulse rounded-lg bg-gray-300 dark:bg-gray-600 mt-4" />,
});

interface ReportCardProps {
  userInfo: UserInfo;
  hasInteracted: boolean;
}

export const ReportCard = React.forwardRef<HTMLDivElement, ReportCardProps>(({ userInfo, hasInteracted }, ref) => {
  const imc = calculateIMC(userInfo.weight, userInfo.height);
  const imcCategory = getIMCCategory(imc);
  const waterIntake = calculateWaterIntake(userInfo.weight, userInfo.activityLevel, userInfo.gender);
  const idealWeight = calculateIdealWeight(userInfo.height);
  const weightToLose = userInfo.weight - idealWeight.max;
  const cardRef = React.useRef<HTMLDivElement>(null);


  const handleDownload = () => {
    if (cardRef.current) {
      html2canvas(cardRef.current, { 
          useCORS: true,
          backgroundColor: null, // Use a transparent background
          scale: 2 // Increase resolution
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'meu-relatorio-de-saude.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };


  const getProgressValue = (imc: number) => {
      if (imc < 18.5) return (imc / 18.5) * 25;
      if (imc < 25) return 25 + ((imc - 18.5) / 6.5) * 25;
      if (imc < 30) return 50 + ((imc - 25) / 5) * 25;
      if (imc < 40) return 75 + ((imc - 30) / 10) * 25;
      return 100;
  }
  
  const getProgressGradient = (imc: number) => {
    if (imc >= 25) { // Sobrepeso e acima
      return "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600";
    }
    if (imc >= 18.5) { // Normal
      return "bg-green-500";
    }
    return "bg-blue-500"; // Abaixo do peso
  }

  return (
    <Card ref={cardRef} className="w-full max-w-sm mx-auto my-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl">
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
            <Progress value={getProgressValue(imc)} className={`h-3`} indicatorClassName={getProgressGradient(imc)} />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Abaixo</span>
              <span>Normal</span>
              <span>Sobrepeso</span>
              <span>Obesidade</span>
            </div>
          </div>
        </div>

        {/* Ideal Weight Section */}
         <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">Meta de Peso Saudável</h3>
            <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg flex items-center justify-center gap-4">
                <Weight className="h-10 w-10 text-green-500" />
                <div>
                    <p className="text-lg font-bold text-green-600 dark:text-green-300">
                      Seu peso ideal é entre {idealWeight.min}kg e {idealWeight.max}kg.
                    </p>
                    {weightToLose > 0 && (
                       <p className="text-sm text-green-500 dark:text-green-400">
                           Você precisa eliminar cerca de <span className="font-bold">{weightToLose.toFixed(1)}kg</span> para atingir o limite saudável.
                       </p>
                    )}
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
        <div className="text-center bg-teal-50 dark:bg-teal-900/50 p-3 rounded-lg space-y-4">
            <p className="text-sm text-teal-700 dark:text-teal-200">
                Este é o primeiro passo! Você pode alcançar seu peso ideal de forma saudável e natural.
            </p>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">Este é o seu Relatório de Saúde.</p>
        <Button onClick={handleDownload} className="w-full bg-teal-500 hover:bg-teal-600">
          <Download className="mr-2 h-4 w-4" />
          Baixar Relatório
        </Button>
         <div className="w-full mt-4">
           <AudioPlayer 
              id="report-audio"
              src="https://enchanting-pithivier-62b278.netlify.app/"
              autoplay={true}
              hasInteracted={hasInteracted}
              duration={47}
            />
         </div>
      </CardFooter>
    </Card>
  );
});

ReportCard.displayName = 'ReportCard';

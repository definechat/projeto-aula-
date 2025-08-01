
"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Weight, Ruler, Calculator } from 'lucide-react';
import type { UserInfo } from '@/lib/types';

interface IMCFormProps {
    onSubmit: (data: UserInfo) => void;
}

export function IMCForm({ onSubmit }: IMCFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<UserInfo>();

    const onFormSubmit: SubmitHandler<UserInfo> = (data) => {
        onSubmit({
            weight: Number(data.weight),
            height: Number(data.height),
        });
    };

    return (
        <Card className="w-full max-w-sm mx-auto my-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-6 w-6 text-teal-500" />
                        Calculadora de Saúde
                    </CardTitle>
                    <CardDescription>
                        Insira seus dados para gerarmos um relatório personalizado para você.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="weight" className="flex items-center gap-2">
                            <Weight className="h-4 w-4" /> Peso (em kg)
                        </Label>
                        <Input 
                            id="weight" 
                            type="number" 
                            placeholder="Ex: 70"
                            {...register('weight', { required: 'Peso é obrigatório', valueAsNumber: true, min: { value: 20, message: 'Peso inválido' } })}
                        />
                        {errors.weight && <p className="text-xs text-red-500 mt-1">{errors.weight.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height" className="flex items-center gap-2">
                            <Ruler className="h-4 w-4" /> Altura (em cm)
                        </Label>
                        <Input 
                            id="height" 
                            type="number" 
                            placeholder="Ex: 175"
                            {...register('height', { required: 'Altura é obrigatória', valueAsNumber: true, min: { value: 100, message: 'Altura inválida' } })}
                        />
                        {errors.height && <p className="text-xs text-red-500 mt-1">{errors.height.message}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                        Calcular e Ver Relatório
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

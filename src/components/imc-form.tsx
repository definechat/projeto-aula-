
"use client";

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Weight, Ruler, Calculator, Venus, Mars, PersonStanding, Bike } from 'lucide-react';
import type { UserInfo } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface IMCFormProps {
    onSubmit: (data: UserInfo) => void;
}

export function IMCForm({ onSubmit }: IMCFormProps) {
    const { register, handleSubmit, control, formState: { errors } } = useForm<UserInfo>({
        defaultValues: {
            gender: 'female',
            activityLevel: 'sedentary'
        }
    });

    const onFormSubmit: SubmitHandler<UserInfo> = (data) => {
        onSubmit({
            ...data,
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
                     <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Venus className="h-4 w-4" /> Sexo
                        </Label>
                        <Controller
                            name="gender"
                            control={control}
                            rules={{ required: 'Por favor, selecione o sexo' }}
                            render={({ field }) => (
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="female" id="female" />
                                        <Label htmlFor="female">Mulher</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="male" id="male" />
                                        <Label htmlFor="male">Homem</Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                         {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                           <PersonStanding className="h-4 w-4" /> Nível de Atividade
                        </Label>
                         <Controller
                            name="activityLevel"
                            control={control}
                            rules={{ required: 'Por favor, selecione o nível de atividade' }}
                            render={({ field }) => (
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="sedentary" id="sedentary" />
                                        <Label htmlFor="sedentary">Sedentária</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="active" id="active" />
                                        <Label htmlFor="active">Me exercito</Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                         {errors.activityLevel && <p className="text-xs text-red-500 mt-1">{errors.activityLevel.message}</p>}
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


import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { UserInfo } from './types';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateIMC = (weight: number, height: number) => {
    if (height === 0) return 0;
    const heightInMeters = height / 100;
    const imc = weight / (heightInMeters * heightInMeters);
    return parseFloat(imc.toFixed(2));
};

export const getIMCCategory = (imc: number) => {
    if (imc < 18.5) return { category: "Abaixo do peso", color: "text-blue-500", bgColor: "bg-blue-100" };
    if (imc < 24.9) return { category: "Peso normal", color: "text-green-500", bgColor: "bg-green-100" };
    if (imc < 29.9) return { category: "Sobrepeso", color: "text-yellow-500", bgColor: "bg-yellow-100" };
    if (imc < 34.9) return { category: "Obesidade Grau I", color: "text-orange-500", bgColor: "bg-orange-100" };
    if (imc < 39.9) return { category: "Obesidade Grau II", color: "text-red-500", bgColor: "bg-red-200" };
    return { category: "Obesidade Grau III", color: "text-red-700", bgColor: "bg-red-200" };
};

export const calculateWaterIntake = (weight: number, activityLevel: 'sedentary' | 'active', gender: 'male' | 'female') => {
    let water = weight * 35;
    if (activityLevel === 'active') {
        water += 500;
    }
    // Optional: Add a small adjustment for gender if desired, but base formula is standard.
    // if (gender === 'male') {
    //   water += 200;
    // }
    return Math.round(water);
};


export const calculateIdealWeight = (height: number) => {
    const heightInMeters = height / 100;
    // Using BMI range of 18.5 to 24.9
    const minWeight = 18.5 * (heightInMeters * heightInMeters);
    const maxWeight = 24.9 * (heightInMeters * heightInMeters);
    return {
        min: parseFloat(minWeight.toFixed(1)),
        max: parseFloat(maxWeight.toFixed(1))
    };
}

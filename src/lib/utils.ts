import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSecurityLevel(length: number): { level: string; color: string } {
  if (length >= 100) return { level: 'Excellent', color: 'bg-green-500' }
  if (length >= 80) return { level: 'Very Good', color: 'bg-blue-500' }
  if (length >= 60) return { level: 'Good', color: 'bg-yellow-500' }
  return { level: 'Minimum', color: 'bg-orange-500' }
}

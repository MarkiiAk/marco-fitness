import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date
  return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

export function todayISO(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' })
}

export function formatKcal(kcal: number): string {
  return `${Math.round(kcal).toLocaleString('es-MX')} kcal`
}

export function formatKg(kg: number): string {
  return `${kg.toFixed(1)} kg`
}

export function formatDelta(current: number, previous: number, unit = ''): string {
  const delta = current - previous
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta.toFixed(1)}${unit}`
}

export function getDiaSemana(fecha: string): string {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  const d = new Date(fecha + 'T00:00:00')
  return dias[d.getDay()]
}

export function getTipoDia(fecha: string): 'semana' | 'finde' {
  const d = new Date(fecha + 'T00:00:00')
  const day = d.getDay()
  return day === 0 || day === 6 ? 'finde' : 'semana'
}

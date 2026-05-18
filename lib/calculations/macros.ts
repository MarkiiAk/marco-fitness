import type { Database } from '@/types/database'

type FoodItem = Database['public']['Tables']['food_catalog']['Row']

export interface MacroResult {
  kcal: number
  proteina_g: number
  carbs_g: number
  grasa_g: number
}

export function calcMacros(alimento: FoodItem, cantidadG: number): MacroResult {
  const ratio = cantidadG / alimento.porcion_g
  return {
    kcal:       +( alimento.kcal       * ratio).toFixed(1),
    proteina_g: +( alimento.proteina_g * ratio).toFixed(1),
    carbs_g:    +( alimento.carbs_g    * ratio).toFixed(1),
    grasa_g:    +( alimento.grasa_g    * ratio).toFixed(1),
  }
}

export function sumMacros(items: MacroResult[]): MacroResult {
  return items.reduce(
    (acc, item) => ({
      kcal:       +(acc.kcal       + item.kcal).toFixed(1),
      proteina_g: +(acc.proteina_g + item.proteina_g).toFixed(1),
      carbs_g:    +(acc.carbs_g    + item.carbs_g).toFixed(1),
      grasa_g:    +(acc.grasa_g    + item.grasa_g).toFixed(1),
    }),
    { kcal: 0, proteina_g: 0, carbs_g: 0, grasa_g: 0 }
  )
}

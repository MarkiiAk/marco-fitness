const WATCH_DISCOUNT = 0.20

export function adjustWatchCalories(rawKcal: number): number {
  return Math.round(rawKcal * (1 - WATCH_DISCOUNT))
}

export function calcDeficit(calorias_watch_adj: number, total_kcal: number): number {
  return Math.round(calorias_watch_adj - total_kcal)
}

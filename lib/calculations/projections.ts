// 1 kg de grasa ≈ 7,700 kcal
const KCAL_PER_KG = 7700

export function proyectarFechaMeta(
  pesoActual: number,
  pesoMeta: number,
  deficitSemanalPromedio: number
): Date | null {
  if (deficitSemanalPromedio <= 0) return null
  const kgsAPerder = pesoActual - pesoMeta
  if (kgsAPerder <= 0) return new Date()
  const semanasEstimadas = (kgsAPerder * KCAL_PER_KG) / deficitSemanalPromedio
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + Math.ceil(semanasEstimadas * 7))
  return fecha
}

export function calcPorcentajeProgreso(
  pesoInicial: number,
  pesoActual: number,
  pesoMeta: number
): number {
  const totalAPerder = pesoInicial - pesoMeta
  const perdido = pesoInicial - pesoActual
  if (totalAPerder <= 0) return 100
  return Math.min(100, Math.round((perdido / totalAPerder) * 100))
}

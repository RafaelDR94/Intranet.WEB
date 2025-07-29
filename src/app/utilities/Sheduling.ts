export function getMaxAvailableMinutes(
  date: string,
  startTime: string,
  allReservations: { date: string; startTime: string; duration: number; id: string }[]
): number {
  // 1) Filtrar solo las reservas que sean el mismo día
  const sameDay = allReservations
    .filter(r => r.date === date)
    // convertir cada reserva a { start: minutosDesdeMedianoche, end: minutosDesdeMedianoche }
    .map(r => {
      const [h, m] = r.startTime.split(':').map(Number);
      const start = h * 60 + m;
      const end = start + r.duration;
      return { id: r.id, start, end };
    });

  // 2) Convertir startTime a minutos desde medianoche
  const [h0, m0] = startTime.split(':').map(Number);
  const start0 = h0 * 60 + m0;

  // 3) Buscar la reserva “inmediata” posterior (con start > start0), 
  //    ordenando por hora de inicio
  let nextStart: number | null = null;

  for (const r of sameDay) {
    if (r.start > start0) {
      if (nextStart === null || r.start < nextStart) {
        nextStart = r.start;
      }
    }
  }

  // 4) Si no hay “siguiente reserva”, la hora límite es 18:00 (18*60 = 1080)
  const endOfDay = 18 * 60;
  if (nextStart === null) {
    return Math.max(0, endOfDay - start0);
  }

  // 5) Sino, la diferencia es (nextStart - start0)
  const diff = nextStart - start0;
  return Math.max(0, diff);
}
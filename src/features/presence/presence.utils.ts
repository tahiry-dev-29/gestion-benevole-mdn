/**
 * Calcule la durée travaillée en minutes à partir de l'heure d'arrivée et de départ.
 * Retourne null si l'une des deux heures est manquante ou si départ < arrivée.
 */
export function computeHeures(
  arrivee: string | null,
  depart: string | null
): number | null {
  if (!arrivee || !depart) return null;

  const [arrH, arrM] = arrivee.split(":").map(Number);
  const [depH, depM] = depart.split(":").map(Number);

  const arrMinutes = arrH * 60 + arrM;
  const depMinutes = depH * 60 + depM;

  if (depMinutes < arrMinutes) return null;

  return depMinutes - arrMinutes;
}

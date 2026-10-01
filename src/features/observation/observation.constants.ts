export const MOIS_LABELS = [
  "",
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export const CURRENT_YEAR = new Date().getFullYear();
export const CURRENT_MONTH = new Date().getMonth() + 1;
export const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);
export const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

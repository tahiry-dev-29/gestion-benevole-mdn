export type CreditPeriod = { from: Date; to: Date };

export function creditPeriod(year: number, month?: number): CreditPeriod {
  return month
    ? {
        from: new Date(Date.UTC(year, month - 1, 1)),
        to: new Date(Date.UTC(year, month, 1)),
      }
    : {
        from: new Date(Date.UTC(year, 0, 1)),
        to: new Date(Date.UTC(year + 1, 0, 1)),
      };
}

export type CreditForTotal = {
  user_id: number;
  montant: number;
  user: { nom: string; prenom: string };
};

export function calculateCreditTotals(credits: CreditForTotal[]) {
  const centsByUser = new Map<number, { benevole: string; cents: number }>();
  for (const credit of credits) {
    const current = centsByUser.get(credit.user_id);
    centsByUser.set(credit.user_id, {
      benevole: `${credit.user.prenom} ${credit.user.nom}`,
      cents: (current?.cents ?? 0) + Math.round(credit.montant * 100),
    });
  }

  const parBenevole = Array.from(centsByUser, ([userId, value]) => ({
    userId,
    benevole: value.benevole,
    total: value.cents / 100,
  })).sort((a, b) => b.total - a.total || a.userId - b.userId);

  return {
    parBenevole,
    totalGlobal:
      parBenevole.reduce(
        (total, entry) => total + Math.round(entry.total * 100),
        0
      ) / 100,
  };
}

/**
 * Détection (côté serveur uniquement) de l'état de configuration Auth0.
 * Le fournisseur Auth0 n'affiche son bouton que lorsque l'ensemble des
 * variables d'environnement requises sont renseignées.
 */
export function isAuth0Enabled(): boolean {
  return Boolean(
    process.env.AUTH0_CLIENT_ID &&
    process.env.AUTH0_CLIENT_SECRET &&
    process.env.AUTH0_ISSUER
  );
}

# Audit Lighthouse — pages publiques

Date : 2026-10-02  
Build : production locale (`pnpm build` puis `next start`)  
Origine : `http://localhost:3001`, avec `NEXTAUTH_URL` limité à localhost  
Lighthouse : 13.5.0  
Navigateur : Chrome for Testing 153.0.8010.12  
Forme : mobile, une mesure par page

| Page           | Performance | Accessibilité | Bonnes pratiques | SEO |      LCP |    FCP |    TBT | CLS |
| -------------- | ----------: | ------------: | ---------------: | --: | -------: | -----: | -----: | --: |
| `/activites`   |          95 |           100 |              100 | 100 | 1 545 ms | 944 ms | 266 ms |   0 |
| `/partages`    |          98 |           100 |              100 | 100 | 1 861 ms | 917 ms | 139 ms |   0 |
| `/temoignages` |          97 |           100 |              100 | 100 | 1 510 ms | 910 ms | 185 ms |   0 |

Lighthouse a d'abord signalé l'absence de `robots.txt`, lequel était redirigé vers `/login`. Les fichiers `app/robots.ts` et `app/sitemap.ts` ont été ajoutés, et le proxy autorise maintenant leur lecture anonyme. Les mesures finales indiquent un score SEO de 100 sur les trois pages.

Le contrôle bfcache reste désactivé car ces pages SSR dynamiques sont servies avec `Cache-Control: no-store`. Le service worker met en cache les pages publiques éligibles ; le rechargement hors ligne de `/activites` a été vérifié dans Chromium.

## Limites

- Ces mesures sont locales et ne remplacent pas l'audit du domaine de production.
- Les pages publiques étaient dans leur état vide normal, sans activités, partages ou témoignages publiés dans les fixtures de l'audit.
- L'installation et la mise à jour du service worker sur appareil Android/iOS n'ont pas été vérifiées.
- Une seule mesure a été prise par page ; les scores sont des résultats de laboratoire et peuvent varier selon la charge.

# Review — témoignages PWA polish + contraste (tâche 17.4, plan-001) — 2026-10-05 13:20

| Field | Value |
|---|---|
| Project | `gestion-benevole` |
| Scope | `-diff` — `git diff -- src/features/temoignage/ app/admin/temoignages/ app/globals.css` (diff global écarté : contient le WIP d'autres sessions, hors périmètre) |
| Base → Head | `c3ae777 → working tree` (aucun commit intermédiaire ; revue du diff local) |
| Date | 2026-10-05 13:20 |
| Verdict | **Approve** (0 blocking ; 2 points opérationnels pour `thr-commit`, 0 changement de code requis) |
| Files reviewed | 4 fichiers, +98/-12 lignes (hors `globals.css` WIP thème) |

## 1. Verdict & blocking points (reminder)

> Le diff de la tâche est propre : aucun défaut bloquant, les corrections
> sont prouvées en navigateur (captures avant/après) et les tests unitaires
> passent. Les deux points « Important » sont des conditions de périmètre de
> commit, pas des défauts de code.

- Blocking: `0`
- Important: `2` — (a) `src/components/ui/textarea.tsx` est **untracked** : le formulaire l'importe désormais, le commit doit l'inclure ou le build casse ; (b) `app/globals.css` contient 254 lignes de thème « Glass Liquid Blue » WIP d'une autre session — mes 2 lignes de tokens de contraste y sont embarquées, décision de périmètre requise.
- Minor: `2` (groupés §4)
- Production-safety (§4): `0` — pas de var d'env, migration, changement d'interface, check sauté ou dérive CI dans le diff ; rollback = revert 2 lignes de tokens.

## 2. Before / After

### 2.1 `src/features/temoignage/temoignage-form.tsx:55` — textarea sans focus visible

**Before** :

```tsx
<textarea
  className="min-h-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
  name="contenu"
  minLength={20}
  maxLength={2000}
  required
/>
```

**After** :

```tsx
<Textarea
  name="contenu"
  minLength={20}
  maxLength={2000}
  required
  placeholder="Décrivez votre expérience avec la Maison du Numérique…"
  aria-describedby={CONTENU_HINT_ID}
  className="min-h-32"
/>
```

**Flow (Mermaid — only if behavior/flow changes)** :

```mermaid
graph LR
    Before[Focus clavier invisible<br/>outline:none, shadow:none] --> After[Anneau focus-visible:ring-2<br/>boxShadow rgb(61,158,255) 0 0 0 4px]
```

*Why it holds:* le composant shadcn `Textarea` apporte l'anneau `focus-visible` du design system ; vérifié en navigateur (computed `boxShadow` contient l'anneau), plus placeholder et hint `aria-describedby` (20–2000 caractères).

### 2.2 `src/features/temoignage/temoignage-moderation-actions.tsx:54` — suppression irréversible sans confirmation

**Before** :

```tsx
<Button size="sm" variant="destructive" disabled={pending}
  onClick={() => moderate("supprimer")}>
  Supprimer
</Button>
```

**After** :

```tsx
<Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
  <DialogTrigger render={<Button size="sm" variant="destructive" disabled={pending} />}>
    Supprimer
  </DialogTrigger>
  <DialogContent showCloseButton={false}>
    <DialogHeader>
      <DialogTitle>Supprimer ce témoignage ?</DialogTitle>
      <DialogDescription>
        L&apos;action est irréversible : le témoignage sera définitivement
        retiré, y compris de la liste publique.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter showCloseButton>
      <Button variant="destructive" disabled={pending}
        onClick={async () => { setConfirmOpen(false); await moderate("supprimer"); }}>
        {pending ? "Suppression…" : "Supprimer définitivement"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

*Why it holds:* action irréversible protégée par confirmation explicite (plan §7) ; pattern `DialogTrigger render=` conforme à `src/features/excel/import-export-buttons.tsx:145` ; titre + description + fermeture Escape/« Close » présents (a11y dialogue). Parcours réel prouvé : dialogue → confirmation → ligne retirée → état vide → toast « Témoignage supprimé. ».

### 2.3 `app/globals.css:70,86` — contraste AA échoué sur boutons (light)

**Before** :

```css
--primary: 210 100% 52%;        /* blanc/texte = 3.61:1 — FAIL 4.5:1 */
--destructive: 0 84% 60%;       /* blanc/texte = 3.78:1 — FAIL 4.5:1 */
```

**After** :

```css
--primary: 210 100% 45%;        /* 4.58:1 — PASS */
--destructive: 0 84% 50%;       /* 4.52:1 — PASS */
```

*Why it holds:* même teinte, luminosité réduite ; mesuré avec `contrast-check.py` du skill. Dark inchangé (déjà 6.94:1/…). Effet global : tous les boutons primary/destructive light s'assombrissent légèrement.

## 3. Best practices & patterns used (with examples)

- **Confirmation d'action irréversible** — *where:* `temoignage-moderation-actions.tsx:54` : dialogue avec description de la conséquence, bouton de confirmation distinct et désactivé pendant l'envoi.
- **Hint accessible lié au champ** — *where:* `temoignage-form.tsx:60` : `aria-describedby` + `id` stable, texte « 20 à 2000 caractères… » visible et annoncé par les AT.
- **État vide actionnable** — *where:* `app/admin/temoignages/page.tsx:52` : ligne `colSpan=4` expliquant l'absence et la prochaine action (« Les soumissions du public apparaîtront ici »).
- **Toast spécifique à l'action** — *where:* `temoignage-moderation-actions.tsx:16` : table `MESSAGES` indexée par l'action au lieu d'un message générique.

## 4. Summary & Recommendations (table)

| # | Category | File:line | Issue (1 line) | Recommended fix (1 line) | Effort |
|---|---|---|---|---|---|
| 1 | Important (commit scope) | `src/components/ui/textarea.tsx` | Dépendance ajoutée vers un fichier **untracked** (WIP d'une autre session) | Inclure le fichier dans le même commit, sinon le build casse | S |
| 2 | Important (commit scope) | `app/globals.css` | Le fichier contient le thème WIP non commité d'une autre session (254 lignes) hors de mes 2 lignes | thr-commit décide : inclure le thème (état vivant, validé par S8.6) ou exclure (perd la correction de contraste) | S |
| 3 | Minor | `temoignage-form.tsx:14` | `CONTENU_HINT_ID` dupliqué si le formulaire monte deux fois | Rendre l'id par instance si multi-instance un jour | S |
| 4 | Minor | (design-system) | Boutons 36–40 px < cible tactile 44 px | Décision globale thr-planning, déjà consignée dans decisions.md | M |

## 5. Recommendations (list)

- [x] Preuve navigateur avant/après capturée (`outputs/17-testimonials-pwa/`) + cycle E2E frais 6/6 (`e2e-report.json`) : soumission anonyme → `EN_ATTENTE` sans rebuild → dialogue de suppression → état vide → contenu absent publiquement
- [x] Tests unitaires (`pnpm vitest run src/features/temoignage` → 5/5), eslint 0 erreur, tsc propre sur les fichiers
- [ ] `thr-commit` : inclure `src/components/ui/textarea.tsx` (point 1) et trancher `app/globals.css` (point 2)
- [ ] Suivi S9 : appareils réels (installation/mise à jour SW), Lighthouse production
- Decision logged in `.agents/memory/decisions.md`: yes (3 lignes datées 2026-10-05 : polish UI, tokens contraste, cible tactile routée à thr-planning)

---
*Generated by `thr-review` — full chat report + this file. Never commit any quoted secrets (mask `***`).*

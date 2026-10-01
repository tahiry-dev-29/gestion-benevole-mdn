-- Migration custom : évolution de l'enum `Role` sans perte de données.
-- INTERDIT de drop/recreate l'enum : on RENAME la valeur existante puis on
-- ajoute les nouvelles valeurs dans l'ordre attendu par le schéma.
ALTER TYPE "Role" RENAME VALUE 'BENEVOLE' TO 'VOLUNTEER';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN' BEFORE 'ADMIN';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'USER' AFTER 'VOLUNTEER';

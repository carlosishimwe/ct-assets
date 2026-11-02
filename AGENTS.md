# ct-assets

Assets visuels Notion (icônes et couvertures), servis depuis ce dépôt.

## Socle commun MARRON

Règles communes à tous les dépôts, dans `github.com/carlosishimwe/marron-cockpit-agent` (branche `main`).

* Avant toute écriture, lire `skills/regles-marron/SKILL.md`.
* Au début, lire le journal (`select public.memoire_journal();`) ; à la fin, « on clôture » : `skills/journal-session/SKILL.md`.
* Accès à la base : connecteur Composio de Carlos (chargé à la demande, le chercher s'il n'apparaît pas), outil `SUPABASE_BETA_RUN_SQL_QUERY`, projet `dnvdmgvrcscclvletung`, `read_only` à faux même pour lire (sinon « permission denied »).
* `git pull` avant tout : une copie locale peut avoir des jours de retard.
* Les décisions validées font foi : `skills/fiche-decisions/SKILL.md`.
* Qui possède quel schéma Supabase : `docs/OWNERSHIP.md`.
* Sans le dépôt : `select pilotage.doctrine_socle();`, `pilotage.doctrine_carte()` et `pilotage.doctrine_skill('journal-session')`.

# Cortex, vision : le pas suivant

> Forgé avec Jérôme, session du 12.06.2026. Ce dossier capitalise une réflexion qui ne vivait
> que dans une conversation. Il s'appuie sur `../DOCTRINE.md` (la référence du Cortex actuel)
> et ne la remplace pas : il décrit l'étape d'après.

## En une phrase

Le Cortex d'aujourd'hui est un cerveau qui **sait** (mémoire déclarative : guide + memory,
injectée par les réflexes). Le pas suivant lui ajoute deux choses : une mémoire qui **sait faire**
(des capacités exécutables) et une **portabilité** (se brancher hors de Claude Code, partout où
il y a de l'IA).

## Pourquoi ce dossier existe

Doctrine outils de la maison : capitaliser, ne jamais laisser perdre une réflexion à forte valeur.
Tout ce qui suit a été pensé en une soirée et n'était écrit nulle part. C'est maintenant un socle
réutilisable, et un support de vente.

## Rangement

Placé dans `Perso/Tools/Whytcard-cortex/docs/vision/`, à côté de `DOCTRINE.md`. Niveau profond,
donc hors du périmètre de `STRUCTURE.md` (qui ne régit que les dossiers de niveau 1 et 2 de la
workspace) : rien à y déclarer. Vérifié avant création.

## Index

- `00-le-pas-suivant.md` : le constat, les deux mémoires, le lien avec le bug fondateur (la mémoire qui se pollue).
- `01-argumentaire-sceptique.md` : « former plutôt qu'interdire », l'argumentaire prêt à servir à qui te prend pour un fou. Vendable tel quel.
- `02-design-capacites.md` : la mémoire procédurale, concrètement (le dossier `capabilities/`, le catalogue, le cycle de vie).
- `03-portabilite-mcp.md` : « se lier à tout outil IA », et la nuance honnête face à la doctrine actuelle.

## Statut

Vision validée sur deux pivots par Jérôme : (1) les capacités vivent dans le plugin ;
(2) elles se déclenchent par un catalogue injecté plus un rappel. Un point reste ouvert :
jusqu'où Cortex va seul pour créer une capacité (proposer et faire valider, ou écrire le script
tout seul). À trancher avant l'implémentation.

# 00. Le pas suivant

## Le constat

Cortex actuel a une seule mémoire, la déclarative : ce qu'il sait. Le `guide.md` (comment bien
travailler ici) et le `memory.md` (les faits vérifiés), injectés au bon moment par les réflexes.
C'est puissant, mais c'est passif : Cortex rappelle, il n'exécute pas. Tout le travail lourd
retombe sur le modèle, raisonné token par token, à chaque fois, sans capitalisation.

## L'ajout : une seconde mémoire, procédurale

À côté du « savoir que », le « savoir faire » : une bibliothèque de capacités exécutables que
l'agent appelle pour décharger le lourd. Déterministe, rapide, sans brûler de tokens à
re-bricoler ce qui a déjà été résolu une fois. Les deux mémoires se répondent :

- déclarative : ce qu'il sait (jugement, principes, faits). Évolue par apprentissage.
- procédurale : ce qu'il sait faire (les capacités vérifiées). Évolue par découverte.

C'est l'analogie humaine exacte : savoir que Paris est une capitale (déclaratif) et savoir faire
du vélo (procédural) ne sont ni stockés au même endroit, ni de la même façon.

## Le but

Décharger les tâches lourdes sur du code, garder le modèle pour le jugement. Et que le stock de
capacités grossisse tout seul, au fil du travail, comme la mémoire grossit au fil des sessions.

## Le lien avec le bug fondateur

Ce chantier est né d'un bug réel : la mémoire de ce projet s'était polluée (des dates fausses,
des couches contradictoires sur la cible et le catalogue empilées sans nettoyage). Cause racine :
la mémoire s'écrit en ajout (`Add-Content`) et jamais en remplacement, donc les vieilles couches
ne sont pas corrigées, elles s'accumulent.

Or « nettoyer et consolider la mémoire » est exactement une tâche lourde que personne ne fait à
la main. Dans le Cortex à deux mémoires, elle devient la première capacité : `cortex-consolidate`.
La vision répare le problème qui l'a fait naître. C'est le cas d'essai idéal, celui qui prouve le
mécanisme sur du réel avant de l'élargir.

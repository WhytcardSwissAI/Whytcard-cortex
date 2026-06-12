# 02. La mémoire procédurale, concrètement

## Le dossier

Dans le plugin, à côté de `hooks/` et `skills/` :

```
Whytcard-cortex/
  capabilities/
    index.json              ← le catalogue : c'est lui qu'on injecte en session
    <slug>/
      capability.mjs|.py     ← le script exécutable
      README.md              ← usage, arguments, sorties
      test.mjs               ← la preuve que ça marche
```

`index.json` : une ligne compacte par capacité (nom, ce que ça fait, quand l'utiliser, comment
l'appeler). Même rôle que `MEMORY.md` pour les souvenirs. Court par design : c'est ce que Cortex
met sous les yeux de l'agent à chaque session.

## Trois greffes sur les hooks existants

On n'écrit pas un nouveau Cortex, on étend celui qui tourne déjà :

- `orient` (SessionStart) : injecte le catalogue en plus de la mémoire. Au démarrage, l'agent
  sait ce qu'il sait ET ce qu'il sait faire.
- `frame` (UserPromptSubmit) : avant d'agir, rappelle « une capacité fait-elle déjà ce job ? ».
  Le catalogue suggère, l'agent décide et lance. Jamais d'exécution silencieuse imposée par un hook.
- `learn` (PostToolUse) : le réflexe qui demande aujourd'hui « qu'est-ce que ça t'apprend ? »
  demandera aussi « tu viens de faire ça lourdement à la main, je le fige en capacité ? ».
  Le même réflexe nourrit les deux mémoires.

## Le cycle de vie d'une capacité

```
découverte (tâche lourde faite à la main)
  → learn propose de la figer   (ou /cortex-capability-add manuel)
  → script + README + test
  → RÈGLE D'ENTRÉE : générique (zéro hardcodé) + documenté + test vert
  → entre au catalogue
  → réutilisée à la place du bricolage
  → améliorée en boucle (faux positif, lenteur) jusqu'à l'optimal
```

La règle d'entrée, c'est la doctrine produit de la maison appliquée : rien n'entre au catalogue
sans être générique, documenté et vérifié. La consolidation de la mémoire (`cortex-consolidate`)
est la première à passer ce cycle, parce qu'elle répare un besoin déjà constaté.

## Langage

Agnostique : Cortex appelle un exécutable avec des arguments et lit sa sortie (JSON). Node (`.mjs`)
par défaut, pour rester cohérent avec les hooks et la règle « zéro dépendance » du plugin. Python
autorisé pour ce qui s'y prête (data, scraping).

## Cohérence avec la doctrine

Une capacité ne s'auto-exécute jamais : le catalogue propose, l'agent tranche. C'est
« des questions, pas des ordres » prolongé au faire, et c'est aussi la serrure sur l'irréversible
(rien de lourd ne part sans décision explicite).

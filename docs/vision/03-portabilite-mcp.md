# 03. Se lier à tout outil IA

## La vision

Cortex cesse d'être « un plugin pour Claude Code » pour devenir un cerveau portable, branchable
partout où il y a de l'IA. Architecture cible :

- un **noyau** agnostique : les deux mémoires (déclarative et procédurale), la logique, la trace.
  Ne dépend d'aucun hôte.
- des **adaptateurs** par hôte : les hooks pour Claude Code (intégration profonde, déjà là),
  un serveur MCP pour brancher n'importe quel autre agent compatible, et demain d'autres prises.

C'est la doctrine moule mot pour mot : moteur générique au centre, adaptateurs par instance autour.

## MCP, la prise universelle

MCP (Model Context Protocol) est le standard d'interconnexion que les agents adoptent. Exposer la
mémoire et les capacités de Cortex comme serveur MCP, c'est permettre à tout client compatible de
« brancher son cerveau Cortex ». Le produit décrit (« un plugin qui se lie à un autre outil »)
n'est pas un rêve flou : c'est noyau plus MCP.

## La nuance honnête face à la doctrine actuelle

`DOCTRINE.md` argumente explicitement CONTRE un serveur MCP (section « Why hooks, and not a
dedicated MCP server »). Il faut traiter ce point, pas l'ignorer. La contradiction n'est
qu'apparente, parce qu'il s'agit de deux usages distincts de MCP :

- **MCP comme déclencheur de raisonnement** (ce que la doctrine refuse, à raison) : un outil MCP
  « raisonne mieux » est opt-in, l'agent doit penser à l'appeler. C'est le défaut des skills.
  Pour faire réfléchir au bon moment, le réflexe (hook) gagne, toujours.
- **MCP comme prise de portabilité** (ce qu'on propose ici) : MCP n'y déclenche rien, il EXPOSE
  la mémoire et les capacités vers d'autres hôtes. C'est une sortie, pas un réflexe.

Donc la règle de la doctrine tient intacte : le réflexe reste un hook ; MCP sert seulement à
porter le cerveau ailleurs. Pas de reniement, une extension cohérente.

## Ce que ça implique de vérifier avant de s'engager

Un point d'honnêteté : « se lier à tout outil IA » suppose que l'hôte cible parle MCP côté client.
Tous ne le font pas encore au même niveau. Le noyau agnostique reste la bonne décision même si
MCP n'était qu'un adaptateur parmi d'autres : c'est lui qui rend les autres prises possibles sans
réécrire Cortex. À valider hôte par hôte au moment de viser un nouvel hôte, pas par hypothèse.

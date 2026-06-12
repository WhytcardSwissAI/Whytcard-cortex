# 01. Former plutôt qu'interdire : l'argumentaire

> À servir tel quel à quelqu'un qui prend la démarche pour une lubie. Il est honnête : il concède
> au sceptique ce qu'il a de vrai, puis montre où il se trompe. Un argument qui ne concède rien
> ne convainc personne.

## La thèse

On ne pilote pas un agent IA par une liste d'interdits (« ne fais jamais X »). On lui apprend à
bien faire : le pourquoi, les principes, le jugement. L'interdit fige, le principe fait réfléchir.

## Le découpage qui tranche le débat

Couper les actions en deux, parce que la même règle ne vaut pas pour les deux :

- **Réversible (99 % du travail)** : écrire du code, choisir une approche, ranger, rédiger.
  L'interdit y est nuisible. Une blocklist est incomplète par construction (le cas non prévu
  arrive, sans principe pour décider) et bloque du légitime (faux positifs), donc on finit par la
  désactiver. Ici le jugement bat la règle.
- **Irréversible (une poignée d'actes)** : effacer de la prod, exfiltrer un secret, lancer un
  paiement, un push force. « Réduire la fréquence des erreurs » ne suffit pas : une seule est
  définitive. Ici, barrière dure ou confirmation forcée. On ne parie pas sur le jugement.

## Les trois mouvements face au sceptique

1. **Concéder son vrai point** : « Sur l'irréversible, je ne fais pas confiance, je mets une
   barrière. On est d'accord. »
2. **Démonter le reste** : « Un mur d'interdits ne tient pas. Ce qui couvre l'infini des
   situations, c'est le jugement, pas la liste. Et ce n'est pas une lubie : les labos alignent
   les modèles sur des principes et du raisonnement (Constitutional AI), pas sur des blocklists. »
3. **Désamorcer le "tu anthropomorphises"** : « Je ne rends pas l'IA gentille, ça ne veut rien
   dire. Je fais de l'ingénierie de contexte par-dessus un modèle déjà aligné, et je mesure qu'il
   fait bien (trace plus tests). L'éducation sans mesure serait de la foi ; c'est pour ça que je
   trace tout. »

## Le piège à éviter

« Zéro direction, aucune valeur, aucun cadre » n'est pas la bonne version de la thèse, c'est sa
version naïve, celle qui donne raison au sceptique. Former n'est pas l'absence de direction :
c'est une direction plus riche (des principes) au lieu d'une direction pauvre (des interdits).
L'évolution elle-même, qu'on cite comme le modèle du « sans contrôle », est en réalité une
contrainte impitoyable : la sélection. Enlève toute pression, tu n'obtiens pas plus de créativité,
tu obtiens du bruit.

## La formule qui tient

Direction riche (principes plus jugement) plutôt que direction pauvre (interdits), avec une
serrure sur le seul irréversible, et tout tracé pour que l'éducation soit prouvée et non supposée.

## Cortex incarne déjà ça

- le hook `intent` (avant un geste grave) : la serrure sur l'irréversible.
- le `log.jsonl` : la trace, la mesure.
- les capacités testées (la mémoire procédurale) : la preuve que le « bien faire » fait bien.

La réponse au sceptique n'est pas à inventer : elle est déjà dans l'architecture, il suffit de la nommer.

# Audit v62 : identité des clubs promus et relégués (13/11/2026)

- **Source** : `index.html`, commit `937103e` (v62), en lecture seule.
- **Statut** : aucune modification du jeu.

## 1. Ce que fait le code

| Étape | Code (ligne) | Effet |
|---|---|---|
| Équipe de District en Noushi League | `distKey` (1954), `distSpec` (1950) | Chaque district a une clé : `d_bas`, puis `d_bas_2`, `d_bas_3`… `distKey` prend la **première clé qui n'existe pas encore** dans `G.clubs`. Les clés 2 à 7 portent un nom générique fixe (« Racing Club de… », « Union Sportive de… », « Étoile de… »…) et des couleurs inversées. |
| Montée en Ligue 2 | `entrantClub` (1518) | L'équipe devient un vrai club (`G.clubs[k]`), avec stade, effectif et `origin:'district'`. **Elle garde son nom.** Le district reforme une équipe avec la clé suivante (ex. « Racing Club de San-Pédro »). |
| Sortie de Ligue 2 (les 4 derniers) | `promoteRelegate` (1546) | **Un club de District ou d'académie est supprimé** (`delete G.clubs[id]`). Ses joueurs sont archivés, sauf ceux suivis par le registre. Un club pro sorti est conservé (effectif vidé, `c.out`). |
| Saison suivante | `distKey` | La clé libérée est **réutilisée** : le district retrouve une équipe du même nom, mais c'est une nouvelle équipe, sans historique ni effectif. |

## 2. Les défauts constatés

1. **Le club disparaît** quand il quitte la Ligue 2 : historique, palmarès, stade et effectif sont perdus. Ce n'est pas le même club qui revient, c'est une nouvelle équipe qui reprend sa clé.
2. **Confusion d'identité** : l'historique des joueurs garde l'identifiant du club (`hist.club`). Quand la clé est réutilisée, les saisons passées s'affichent sous le nouveau club. Pendant que la clé est libre, le nom n'est plus trouvé (`T(id)` vide).
3. **Bug visible dans les actualités** : la nouvelle « Quittent la division : … » est écrite **après** la suppression. Elle affiche l'identifiant brut (ex. `d_bas`) au lieu du nom.
4. **Les noms génériques** (« Racing Club de… ») ne respectent pas la nouvelle règle des noms crédibles. Ils sont fixes, pas aléatoires.
5. **Rivalités** : en v62, elles ne concernent que les clubs pros (`G.rival`, échangées à la montée et à la descente). Les clubs de District n'ont pas de rivalité. Rien ne casse sur ce point aujourd'hui, mais rien n'existe non plus.
6. **À noter** : le club du joueur est exclu des sorties de Ligue 2 (`x!==G.club`). Il ne peut pas être relégué hors de la division, même s'il finit dernier. À confirmer : voulu ou non.

**Correction de mon message précédent** : j'avais écrit que le club promu « garde son nom et son identité ». C'est vrai tant qu'il est en Ligue 2. Mais quand il en sort, il est supprimé. Le défaut est donc réel.

## 3. Correction proposée (non appliquée)

1. **Ne plus jamais supprimer un club** : le marquer inactif (`c.out = saison`), comme les clubs pros, en gardant nom, couleurs, historique et palmarès.
2. **Retour au District du même club** : quand un club de District sort de la Ligue 2, c'est **lui** qui redevient l'équipe de son district pour la Noushi League (même identifiant). `distKey` réutilise d'abord un club inactif du district avant de créer une nouvelle clé.
3. **Nouvelles sauvegardes et anciennes sauvegardes** : aucune donnée n'est réécrite. Pour les clubs déjà supprimés dans une ancienne partie, l'affichage retrouve le nom grâce à `distSpec` (le nom est déterminé par la clé). Cela corrige les actualités et l'historique des joueurs sans migration risquée. Les saisons déjà mélangées sur une même clé ne peuvent pas être séparées après coup.
4. **Actualités** : écrire la nouvelle avant la suppression, ou utiliser le nom de repli.

## 4. Tests prévus (après accord)

1. Montée d'un club de District en Ligue 2 : nom, couleurs et identifiant conservés ; une nouvelle équipe du district apparaît.
2. Sortie de Ligue 2 puis remontée du même club : même identifiant, historique et palmarès conservés.
3. Sauvegarde, fermeture et reprise après plusieurs saisons : identités intactes ; une ancienne sauvegarde v62 se charge sans erreur et affiche les bons noms.
4. Simulation de 10 saisons : aucun identifiant brut dans les actualités ou les fiches.

## 5. Lien avec la nouvelle conception

Dans la conception du 13/11, la Noushi League ne fait plus monter en Ligue 2. Ce mécanisme sera donc remplacé. La correction ci-dessus ne vaut que si l'on veut garder la v62 jouable en attendant. Les règles 1 et 2 (ne jamais supprimer, même identifiant) s'appliqueront aussi au nouveau système.

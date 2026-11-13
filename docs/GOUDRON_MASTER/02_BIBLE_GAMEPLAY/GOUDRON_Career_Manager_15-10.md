# GOUDRON Career Manager — cahier de direction (proposition v1)

Date : 15/10/2026. Statut : **proposition à valider**. Rien n'est codé.
Base du jeu : v61 (commit 79d9f21).

## 1. Identité (décision de l'utilisateur, 15/10/2026)

> « J'ai déjà joué à FIFA Career Manager. C'est ce que je veux, mais avec l'idée de s'ancrer dans les réalités ivoiriennes. GOUDRON Career Manager. »

- **Le modèle :** le mode Carrière Manager de FIFA / EA FC. Même structure, même rythme.
- **La différence :** tout se passe dans le football ivoirien, avec les quartiers, les académies, la Noushi League, la D2, la Ligue des Pros, les FCFA, le comité et les supporters.
- **Deux départs possibles :**
  - Commencer par le District ;
  - Commencer par la Ligue des Pros.
- **Transferts et détection :** ils ne sont pas un jeu à part. Ils **complètent chaque étape**.

## 2. Le parcours District (décision de l'utilisateur)

| Étape | Quand (calendrier actuel du jeu) | Ce que fait le joueur | Transferts / détection à cette étape |
|---|---|---|---|
| 1. Qualifié d'office pour la Noushi League | 1er mai | Prise de fonction, objectifs du comité | — |
| 2. Préparer la Noushi League | 1er mai → 24 juillet | Former le groupe U20, matchs amicaux, préparation | Recruteurs dans les quartiers et les académies. Liste de 18 à 23 joueurs avant le 30 juin. |
| 3. Jouer la Noushi League | 25 juillet → 26 août | Poules, puis élimination directe | Aucun : la liste est déposée |
| 4. Monter en D2 | fin août | Les 2 meilleurs clubs de district montent | Contrats des joueurs qui montent |
| 5. Jouer la D2 | septembre → avril | Championnat, coupe | Mercato d'été et d'hiver. Effectif de tout âge (canon). |
| 6. Monter en Ligue des Pros, etc. | saisons suivantes | | Réseau de détection plus large, centre de formation |

Le parcours **Ligue des Pros** démarre directement à la case « saison pro » : mercato, U20 en Noushi League, championnat, coupes, Afrique.

## 3. Ce qu'on reprend de FIFA, écran par écran

| FIFA Carrière | GOUDRON | Ancrage ivoirien |
|---|---|---|
| **Central** : calendrier, bouton « Avancer » qui s'arrête aux événements, boîte de réception | **Bureau** | Comité, supporters, presse locale |
| **Effectif** : composition, rôle de chaque joueur (important, rotation, remplaçant, espoir), moral, forme | **Équipe** | Caractères (Pro, Normal, Sensible, Fier, Tête brûlée), jokers |
| **Plan de développement** : entraînement, progression, poste | **Équipe › Progression** | Pépites des quartiers, poussées de croissance |
| **Hub des transferts** + **réseau de détection** : recruteurs avec consignes, rapports, liste de joueurs suivis | **Recrutement** | Quartiers, communes, académies, tournois de vacances (maracanas) |
| **Négociation** : offre au club, puis contrat du joueur ; prêts, clauses | **Recrutement › Négociations** | FCFA, familles, agents locaux |
| **Centre de formation** | **Recrutement › Jeunes** (départ pro) | Centres de formation ivoiriens |
| **Jour de match** : avant-match (adversaire, composition), puis « Jouer », « Simuler » ou « Résultat immédiat » | **Match** | Ambiance du stade, derbys |
| **Objectifs du conseil** (sport, finances, formation, image) et note du manager | **Club › Comité** | Comité de district, investisseurs |
| **Fin de saison** : bilan, contrats, offres d'emploi | **Saison › Bilan** | Carrière de coach (canon : un échec n'est pas une fin de partie) |

**Le match**, comme dans FIFA :
- trois choix : « Jouer » (en direct), « Simuler » (on voit défiler et on peut intervenir), « Résultat immédiat » ;
- une fois lancé, quitter donne le résultat simulé ;
- le mode direct doit avoir une **vraie raison d'être** : les décisions du coach aux moments clés changent le match.

## 4. Ce qui doit changer dans la v61 (constat du 15/10/2026, à valider)

1. **Trop d'informations.** Au début d'une carrière District :
   - Équipe : 81 boutons, 4,8 écrans de haut ;
   - Club : 82 boutons, 7,8 écrans.

   Un écran FIFA montre une liste et une action principale.
2. **Le match n'a pas d'enjeu en direct.** « Simuler la fin » marche dès la 1re minute. Le direct n'apporte rien de plus que le résultat immédiat.
3. **Les éléments ne sont pas reliés entre eux.** Le travail de la semaine (séance, causerie, recrue) se voit peu le jour du match.

## 5. Ordre de travail proposé (chaque lot attend un accord)

1. **Bureau = le « Central » de FIFA** : calendrier, « Avancer » qui s'arrête net (feux rouge / orange / vert), boîte de réception, une seule action principale.
2. **Jour de match** : avant-match clair, les 3 choix de FIFA, des moments clés en direct qui comptent.
3. **Équipe** : rôles des joueurs (comme FIFA), moral et forme lisibles, écran allégé.
4. **Recrutement** : réseau de détection et négociation en deux temps, relié à chaque étape du parcours.
5. **Club** : objectifs du comité et note du coach, finances simples.

Avant le lot 1 : faire la liste « garder / cacher / retirer » de chaque élément des écrans actuels.

## 6. Questions ouvertes

1. **Qualification d'office :** dans la v61, le club est qualifié d'office la **1re** saison. S'il ne monte pas, une qualification régionale a lieu la saison suivante. Qualifié d'office **chaque** saison, ou seulement la première ?
2. **Version FIFA de référence :** EA FC 24, EA FC 25, ou une autre ?
3. **Écart avec la bible actuelle :** elle prévoit aussi le Maracana, le Mondial des clubs, les coupes africaines, la Ligue des Espoirs, les investisseurs. Les garder tous dans le parcours, ou les réserver aux saisons pros ?

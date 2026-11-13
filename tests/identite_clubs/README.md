# Correctif « identité permanente des clubs » : rapport v3

**Statut : v63 candidate. Correctif fonctionnel selon les tests ci-dessous. Publication non autorisée.**

- **Branche** : `fix/identite-clubs` (commits `91a728f` et `2118586`, plus les tests). Elle est conservée sur GitHub, **non fusionnée** et **non publiée**. `main` et le jeu en ligne restent en v62 (`937103e`). Le cache hors ligne n'a pas été modifié.
- **Changement** : `index.html` seul, 34 lignes ajoutées et 22 retirées.
- **Tests** : `tests/identite_clubs/` sur la même branche. Ils se lancent avec Node.js et Playwright ; voir la section 6.

## 1. Modifications

1. Un club n'est **jamais supprimé**. Il n'y a plus aucun `delete G.clubs` dans le code (il y en avait 3 : `promoteRelegate`, `l2Norm`, `takeClub`).
2. Un club de District ou d'académie qui quitte la Ligue 2 garde son identifiant, son nom, son stade et son effectif. Il **redevient l'équipe de son district** (ou retourne au championnat des académies).
3. Quand il remonte, c'est **le même club** qui est repris, avec son effectif complété si besoin.
4. L'ancien club de District de l'entraîneur n'est plus supprimé quand l'entraîneur part.
5. Les joueurs des clubs hors division vieillissent, progressent, voient leur contrat avancer et peuvent partir (fin de contrat, retraite).
6. Les actualités n'affichent plus d'identifiant brut. Les anciennes actualités sont corrigées au chargement.
7. **Nouveau (votre retour)** : statut de division exact.
   - Tableau des académies : la mention « club en Ligue 2 » s'appuie sur la présence réelle dans la division, et non plus sur l'existence du club.
   - Fiche d'un club conservé hors division : « District », « Académie » ou « Hors championnat ».
8. **Inchangés** :
   - la protection du club du joueur ;
   - les règles de qualification de la Noushi League et son accès à la Ligue 2 ;
   - les mécanismes de carrière.

   Le seul ajustement : « ce club n'existe pas » est remplacé par « ce club n'est pas déjà en Ligue 2 ». Sinon, un club redescendu n'aurait plus jamais pu remonter.

## 2. Vos points à revoir : réponses

| Point | Réponse vérifiée |
|---|---|
| `distKey()` et retour au district | Le club redescendu redevient bien l'équipe de son district (scénario forcé : `distKey` renvoie son identifiant). **Avec deux clubs d'un même district hors division**, un seul peut jouer la Noushi League, car il n'y a qu'une place par district dans la v62. Le premier créé (identifiant le plus bas) y joue ; l'autre reste conservé, **hors compétition**. Pas de substitution : chacun garde son nom, son stade et son effectif. À traiter dans la refonte (championnats locaux à 6 clubs). |
| Continuité sportive hors division | Les clubs hors division **ne jouent pas de matchs** dans la v62 (la Noushi League simule les districts par un niveau global). Leurs joueurs vieillissent et évoluent ; leur effectif n'est pas renouvelé (pas de recrutement), il est complété au retour en Ligue 2. Comportement à remplacer par la refonte. |
| `promoteRelegate()` et `l2Norm()` | Ligue 2 à **16 clubs à chaque transition**, Ligue des Pros à 16, **aucun doublon**, aucun club absent (11 transitions vérifiées). Un club qui vient de sortir ne peut pas être repris dans la même transition. |
| Affichage des académies (`vComp`) | Corrigé : une académie sortie de Ligue 2 n'est plus marquée « club en Ligue 2 » (vérifié). |
| Sauvegardes | Aucune réécriture d'historique. Seuls les libellés (actualités, nom manquant dans un parcours) sont complétés à partir de l'identifiant. Pas de promesse de restauration. |

## 3. Tests

| Test demandé | Résultat |
|---|---|
| Montée d'un club territorial : identité, stade, effectif, historique | ✅ même nom, mêmes couleurs, même stade ; le district reforme une équipe |
| Descente puis remontée : même identifiant, aucun palmarès perdu | ✅ (Montagnes Tonkpi FC) même identifiant, nom, stade, date de création ; redevient l'équipe du district ; 15 joueurs d'origine encore là à la remontée |
| Deux clubs d'un même district | ✅ « Montagnes Tonkpi FC » et « Racing Club de Man » relégués la même saison : deux clubs distincts, effectifs disjoints (13/18 et 15/20 joueurs conservés), aucune fusion ; un seul joue pour le district (voir la limite) |
| Dix saisons : aucun identifiant réattribué, aucun historique attribué au mauvais club | ✅ 0 recréation (Pro et District) ; 0 parcours de joueur avec un nom de club différent du club actuel |
| Ligue 2 à 16 clubs à chaque transition, sans doublon | ✅ 11 transitions sur 11 |
| Continuité des joueurs hors division | ✅ 591 suivis d'une saison à l'autre : âge +1 pour 591, 0 match joué, 0 contrat négatif, 591 toujours dans leur club |
| Sauvegarde, fermeture, reprise | ✅ clubs identiques avant et après (Pro et District) |
| Sauvegarde v62 (8 saisons, clubs déjà supprimés) chargée dans le correctif | ✅ aucune erreur ; actualités avec code brut : 2 → 0 ; 3 saisons de plus sans erreur |
| Actualités et tableaux | ✅ 0 code brut ; statut de division exact |
| Référence v62 (même test) | ❌ Pro : 11 identifiants recréés, jusqu'à 4 fois ; District : club de départ supprimé ; codes bruts dans les actualités |
| Non-régression : 12 saisons Pro, 12 saisons avec historiques, une saison jouée dans l'interface | ✅ aucune erreur JavaScript |

## 4. Club du joueur dans les 4 derniers de Ligue 2 (demandé le 13/11)

Le club du joueur a été volontairement affaibli pour finir 16e de Ligue 2 (script `rel2.js`).

| Cas | v62 | Correctif |
|---|---|---|
| Écran de fin de saison | « Le club quitte la Ligue 2 », avec trois choix : prendre l'équipe B d'un club de Ligue des Pros, rejouer la saison, nouvelle carrière | identique |
| Choix « équipe B » : sort de l'ancien club (académie) | **supprimé** ; actualité « Quittent la division : d_mon, …, a_hor » | ✅ conservé : même nom, même stade, 19 joueurs sur 21 encore là ; retourne au championnat des académies ; actualité avec les noms |
| Choix « équipe B » : sort de l'ancien club (club pro de Ligue 2) | — | ✅ conservé, même nom, même stade, 18 joueurs sur 21 ; hors championnat |
| Ligue 2 et Ligue des Pros après la transition | 16 et 16 | ✅ 16 et 16, aucun doublon |
| Choix « rejouer la saison » | — | ✅ retour au début de saison, club intact et toujours en Ligue 2 |
| Erreurs JavaScript | 0 | 0 |

**Ce que fait vraiment la « protection »** : le club du joueur n'est jamais retiré de la Ligue 2 **tant que le joueur en est l'entraîneur**. Mais un club du joueur fini dans les 4 derniers déclenche déjà l'écran « Le club quitte la Ligue 2 ». Le joueur ne peut pas rester : il prend une équipe B, rejoue la saison ou recommence. Dès qu'il part, son ancien club sort normalement de la division, et avec le correctif il garde son identité. La protection ne joue donc que si le joueur rejoue la saison. Elle n'a pas été modifiée.

**Carrière District : club monté avec le joueur, puis relégué** (script `rel2d.js`, ajouté le 13/11). La montée a été forcée à la Noushi League d'ouverture, puis l'équipe a été affaiblie en Ligue 2.

| Cas | v62 | Correctif |
|---|---|---|
| Comoé Indénié FC monte en Ligue 2 avec le joueur, finit 16e, le joueur prend une équipe B | club **supprimé** ; actualité « Quittent la division : …, d_com » | ✅ conservé : même nom, même stade, 18 joueurs sur 18 ; redevient l'équipe du district Comoé ; actualité avec le nom |
| Même scénario avec Bas-Sassandra FC | — | ✅ même résultat (18/18, équipe du district) |
| Ligue 2 et Ligue des Pros | 16 et 16 | ✅ 16 et 16, aucun doublon |
| Devenir de l'entraîneur | écran « Le club quitte la Ligue 2 » : équipe B, rejouer ou nouvelle carrière | identique (non modifié) |

## 5. Limites et régressions possibles

- **Anciennes sauvegardes** : un club déjà supprimé par la v62 réapparaît plus tard sous son propre identifiant et son propre nom (dans le test : 8 clubs). Son ancien historique, son stade et son effectif ne sont pas reconstitués, et rien n'est inventé. Une copie de la sauvegarde d'origine a été conservée pour le test.
- **Deux clubs d'un même district hors division** : un seul joue la Noushi League (une place par district en v62).
- **Clubs hors division** : ils ne jouent pas de matchs, et leur effectif n'est complété qu'au retour en Ligue 2.
- **Clubs pros sortis de Ligue 2** : ils gardent leur effectif, mais restent hors championnat (la v62 n'a pas de division inférieure pour eux). C'est signalé dans leur fiche.
- **Taille de la sauvegarde** : environ +2 à +4 % après 10 saisons.
- **Défaut existant, non corrigé** : deux équipes peuvent s'appeler « Racing Club d'Abidjan » (noms de la Noushi League, hors périmètre).
- Le vieux script de test de carrière District dans l'interface bloque sur l'écran de qualification régionale, **à l'identique en v62** : c'est une limite du script, pas une régression.
- **Avant publication** seulement : changer la version du cache hors ligne (`sw.js`) pour que les téléphones chargent la v63. Ce n'est pas fait, comme demandé.
- **Limites acceptées provisoirement (décision du 13/11)** : clubs hors division sans matchs, et un seul club par district en Noushi League. Elles sont à résoudre lors de la refonte des championnats territoriaux.

## 6. Lancer les tests

Dans `tests/identite_clubs/`, copier la version à tester sous le nom `page.html`, puis :

- `FORCE=1 SEASONS=10 RELOAD=1 node ident.js` : 10 saisons Pro, descente puis remontée forcées, reprise de partie.
- `MODE=district CID=d_com SEASONS=10 RELOAD=1 node ident.js` : 10 saisons en carrière District.
- `node ident2.js` : deux clubs d'un même district, Ligue 2 à 16 clubs, joueurs hors division, affichage.
- `node mig63.js` : ancienne sauvegarde v62 (copier la v62 sous `page62.html`).
- `CID=a_hor node rel2.js` (et `CHOIX=rejouer`) : club du joueur dans les 4 derniers de Ligue 2.
- `CID=d_com node rel2d.js` : carrière District, montée avec le joueur puis relégation.

`auto4g.js` est le script de pilotage déjà existant (tests v46 à v50) ; les autres s'appuient sur lui. Les matchs sont aléatoires : les chiffres varient d'une exécution à l'autre, mais les contrôles d'identité doivent toujours donner 0.

# GOUDRON — Audit des trois chantiers (version 47)

Audit en lecture seule du code de la v47 (commit ad5de9d), le 13/10/2026. Aucune ligne du jeu n'a été modifiée.
Les numéros de ligne renvoient au fichier `index.html` de la v47. Les constats les plus graves ont été revérifiés à la main dans le code.

---

## 1. Les acteurs du jeu (modèle joueur)

### Ce qui fonctionne
- Tous les joueurs pros naissent dans une seule fonction (`newPlayer`), avec un identifiant numérique stable. Un transfert entre clubs garde le même identifiant.
- Les joueurs qui quittent le jeu sont supprimés proprement : retraite, départ à l'étranger, joueurs libres non signés.
- Vieillissement et retraite existent : progression vers le potentiel, déclin après 31 et 33 ans, retraite autour de 33-35 ans, carrière simulée à l'étranger.
- Le parcours des pépites (`G.track`) suit les joueurs formés ou détectés, y compris à l'étranger.
- Depuis la v44, les noms affichés sont reliés automatiquement à leur fiche, U18 compris.

### Ce qui est cassé ou incohérent
1. **Un U18 qui signe pro devient un autre joueur.** La signature (`nouSignU18`, l.2034) recrée un joueur neuf à partir du nom, du poste, de l'âge, de la note et du potentiel seulement. On perd :
   - l'identifiant ;
   - les attributs, régénérés au hasard ;
   - la personnalité, l'endurance, le numéro et l'origine.

   La discipline est retirée au hasard. **L'identité n'est pas permanente.**
2. **Nationalité vide.** `p.nat` n'est jamais rempli. Tout le monde apparaît ivoirien dans les transferts, y compris les joueurs revenus d'Europe.
3. **Pas d'historique saison par saison.** Les statistiques (matchs, buts, passes, notes) sont remises à zéro chaque saison, et seulement pour la Ligue des Pros et la Ligue 2. Le meilleur buteur historique est enregistré par son nom, pas par son identifiant.
4. **Les noms ne sont pas uniques.** Les doublons ne sont évités qu'à l'intérieur d'un même club. Comme les liens vers les fiches passent par le nom, deux homonymes ouvrent la même fiche.
5. **Joueurs orphelins.** Un joueur suivi dont le club sort de la Ligue 2 reste dans la sauvegarde sans club, et ne vieillit plus.
6. **Caractère incomplet.**
   - La personnalité (`pers`) n'existe que pour les jeunes de district. Pour les pros, le caractère de match se déduit seulement de la discipline, de l'âge et de la note.
   - Il n'y a pas de moral individuel : la « forme » est la moyenne des 4 dernières notes, vidée chaque saison.
   - Le champ `mchar` est lu mais jamais écrit.
7. **Données figées.** L'endurance est calculée une seule fois et ne suit pas l'âge. Le numéro de maillot est gardé après un transfert, ce qui peut créer des doublons dans le nouveau club.
8. **Noms affichés sans fiche.**
   - Joueurs dessinés sur le terrain du direct.
   - Joueurs « à surveiller » des adversaires Noushi : générés à chaque affichage, ils ne sont pas enregistrés.
   - Prospects, joueurs libres et vétérans du recrutement de district.
   - Joueurs vendus.
   - Fil des transferts.
9. **Identité visuelle.** Un maillot (nom et numéro) ou des initiales. Aucun lien avec la bibliothèque de visages, ni taille, ni morphologie, ni coiffure.
10. **Sauvegarde.**
    - Le parcours `G.track` n'est jamais purgé.
    - Une copie complète de la partie est écrite à chaque début de saison, ce qui double la place prise dans le navigateur.
    - Code mort : `_oldPromoteRelegate`, `genCoachOld`.

### À consolider avant tout ajout
1. **Une identité unique et permanente du U18 au pro**, puis à l'étranger : même identifiant, mêmes attributs, même personnalité, même origine, même visage.
2. **L'identifiant comme seule clé** : unicité globale des noms à la génération, liens, palmarès, ventes et transferts rattachés à l'identifiant.
3. **Un registre des joueurs sortis** (retraités, vendus, partis) au lieu de les effacer, pour garder les liens et l'historique ; purge des orphelins.
4. **L'historique saison par saison**, archivé avant la remise à zéro et étendu à toutes les catégories.
5. **La nationalité.**
6. **Un caractère et un moral pour tous les joueurs.**
7. Recalcul de l'endurance chaque saison et du numéro à chaque transfert ; nettoyage du code mort et de la sauvegarde.

---

## 2. Le moteur de match

### Ce qui fonctionne
- Les matchs de ton club utilisent un seul moteur, action par action, que ce soit en direct, en « Résultat immédiat » ou en simulation automatique.
- Les attributs des joueurs comptent : tir, passe, dribble, duel, faute, gardien, fatigue, chacun pondéré par la condition et la forme.
- Les 4 blocs (bloc bas, équilibré, pressing haut, tout pour l'attaque) ont des effets réels :
  - position de l'équipe ;
  - densité défensive ;
  - intensité du pressing ;
  - fatigue.
- Consignes collectives et consignes individuelles (v46) ont des effets réels.
- La couche de décisions de la v46 fonctionne : alertes de l'adjoint, concentration, recadrage, causerie, 5 changements. L'interface ne contient plus de reste des anciens panneaux.

### Ce qui est cassé ou incohérent
1. **La force affichée ne décide pas du résultat.** Le moteur n'utilise que les joueurs et leurs attributs. Les éléments suivants **n'ont aucun effet sur les matchs de ton club** :
   - l'entente ;
   - le bonus du système de jeu (rôles, styles) ;
   - le trait tactique du manager ;
   - la pénalité d'endurance ;
   - le bonus de l'adjoint ;
   - la pénalité de formation.

   Ils sont affichés avant le match et ne servent qu'au succès « Tombeur de géant ». (Constat revérifié, l.1323.)
2. **Deux modèles pour un même championnat.** Les matchs entre clubs IA utilisent un autre calcul (loi de Poisson sur la force d'équipe). Rien ne garantit que les deux modèles donnent les mêmes niveaux de jeu. L'avantage du terrain, par exemple, est bien plus fort chez l'IA.
3. **Le coût affiché des tactiques est faux.** Le tableau « buts marqués −30 % / +25 % / +40 % » décrit l'ancien simulateur (`genHalf`), qui n'est plus jamais appelé.
4. **Le direct est plus dur que le résultat immédiat.** C'est voulu en v46 pour que les décisions comptent, mais c'est asymétrique :
   - la concentration de l'IA ne baisse pas comme la tienne ;
   - l'IA ne s'adapte (passer en attaque ou reculer) qu'en direct ;
   - rien de tout cela n'existe en « Résultat immédiat ».

   **À trancher** : rendre ces effets symétriques, ou les garder comme risque propre au direct.
5. **La formation compte peu.**
   - Les lignes sont faites d'après le poste naturel du joueur, pas d'après sa place sur la feuille.
   - Les équipes étrangères jouent toutes en 4-3-3.
   - Le style de construction (court, long, contre) n'est jamais lu par le moteur.
6. **Attributs sous-utilisés.**
   - La vitesse ne sert qu'au dribble.
   - Le placement ne sert qu'au gardien.
   - Les interceptions ne dépendent d'aucun attribut défensif.
   - L'endurance du joueur n'est pas utilisée pendant le match.
7. **Les tactiques ne dépendent pas des capacités.**
   - Le pressing, la fermeture des couloirs et le jeu direct ont le même effet quelle que soit l'équipe.
   - Le hors-jeu est un tirage fixe (15 %), sans ligne défensive ni vitesse.
8. **Arbitrage et discipline.**
   - Le biais d'arbitre est du code mort.
   - Pas de rouge direct.
   - Aucune suspension de joueur ni cumul de cartons.
   - Un gardien expulsé n'est pas remplacé.
9. **Effectifs IA fictifs.**
   - Le « triple changement » de l'IA remet seulement la forme de 3 joueurs à 100, sans remplacement.
   - Seuls tes joueurs se blessent.
   - En direct, un joueur blessé reste sur le terrain sans pénalité.
10. **Statistiques perdues.** Corners et fautes sont comptés puis jetés. Le « corner » n'est pas un coup de pied arrêté.
11. **Noushi en direct (v46).**
    - Les cartons et la suspension du coach ne sont pas appliqués après le match : une suspension peut se reporter sur le prochain match pro.
    - Le plan Noushi (simple, talents, bloc) n'est traduit qu'en bloc.
    - Les tirs au but ne dépendent pas des joueurs.
12. **Détails.**
    - Avant le match, aucun bouton de durée n'est sélectionné si une ancienne préférence est enregistrée.
    - « Simuler la fin » à la mi-temps saute la causerie.
    - Le terrain est redessiné même en pause.

### Mécaniques demandées
- **Absentes** : piège du hors-jeu, agressivité des joueurs, type de tacle, sorties et plongeons du gardien, centres (le mot existe seulement dans les textes), passes en profondeur, frappes puissantes, poussettes.
- **Partielles** :
  - hors-jeu aléatoire ;
  - relance courte ou longue du gardien (v46) ;
  - duel physique : le physique joue sur le dribble et la faute ;
  - causerie de mi-temps (en direct seulement).

### À consolider avant tout ajout
1. **Une seule source de force** : faire entrer entente, système, rôles et bonus dans les attributs utilisés par le moteur, puis calibrer pour qu'un même match donne les mêmes chances en direct et en instantané.
2. **Un seul modèle pour tout le championnat**, ou une calibration vérifiée entre le moteur et le calcul IA.
3. **Supprimer l'ancien simulateur** et réaligner l'affichage du coût des tactiques sur les effets réels.
4. **Trancher la symétrie du direct** (concentration et adaptation de l'IA).
5. **Faire dépendre les tactiques et la formation des joueurs** : place sur la feuille, vitesse, physique, placement et endurance pour le pressing, les couloirs et le hors-jeu.
6. **Discipline et effectifs réels** : suspensions, rouge direct, blessures des deux côtés, vrais remplacements de l'IA, gardien expulsé, coach suspendu en Noushi.
7. Ensuite seulement, les nouvelles mécaniques (centres, profondeur, tacles, gardien, duels).

---

## 3. La Carrière District

### Ce qui fonctionne
- Démarrage cohérent :
  - club existant ;
  - groupe de 16 jeunes de 15 à 18 ans ;
  - investisseurs locaux (27 à 44 M FCFA) ;
  - présentation et parcours régional (v45).
- Calendrier respecté :
  - présentation au 1er mai ;
  - recrutement jusqu'au 30 juin ;
  - préparation en juillet ;
  - Noushi League du 25 juillet au 26 août ;
  - bilan le 28 août.
- Plafond de 23 joueurs appliqué ; minimum 18 joueurs dont un gardien.
- Les 2 meilleurs clubs de district montent en Ligue 2. Gagner la Noushi déclenche en plus une offre en Ligue des Pros.
- Les noms des clubs sont identiques entre le tournoi régional et la Noushi League.

### Ce qui est cassé ou incohérent
1. **Le groupe recruté disparaît à la montée.** Quand le club monte en Ligue 2, l'équipe première est générée de zéro (`genSquad`, l.1866, revérifié).
   - Les joueurs recrutés et payés en mai-juin restent dans le groupe « U18 ».
   - Ils sont ensuite supprimés quand ils dépassent 18 ans.

   **Tout le recrutement est perdu.** C'est le défaut le plus grave de la carrière.
2. **Le groupe « U18 » n'est pas U18.** Après la date limite, on peut y signer des joueurs libres de 19 à 29 ans et d'anciens internationaux de 33 à 37 ans. L'interface parle pourtant de « tes U18 ».
3. **La date limite ne bloque pas tout.** Les joueurs repérés restent négociables après le 30 juin, alors que les textes disent le contraire.
4. **Remplissage automatique gratuit.** Le remplissage automatique ramène le prix d'un joueur à ce qu'il reste en caisse, parfois 0 (l.1836, revérifié).
5. **Blocage possible.** Avant le 30 juin, sans argent pour une semaine de recrutement et avec moins de 23 joueurs, il ne reste qu'un bouton « Continuer à recruter ». Ce cas n'a pas été reproduit.
6. **Pas d'offre d'investisseurs à la montée.** La saison qui suit la montée n'a pas d'étape « investisseurs ».
7. **Tournoi régional (v45, provisoire).**
   - Les forces utilisées sont indépendantes de celles de la Noushi : le champion régional peut être faible en juillet.
   - Seul l'effectif de base a des statistiques régionales.
   - Un buteur libéré disparaît de la page du tournoi.
   - Le tournoi n'est jamais rejoué.
8. **Textes de dates faux.** Certains textes disent « juin et juillet » ou « bilan fin juillet » pour la Noushi League, qui se joue du 25 juillet au 26 août.
9. **Intérim.** Le texte dit « si le club se maintient, le poste est à toi », mais le poste est donné même en cas de relégation.
10. **Code mort.**
    - Anciennes fonctions de recrutement jamais appelées.
    - `distGoalHTML`, le seul texte qui explique l'échec, n'est jamais appelé.
    - Verrouillage de navigation neutralisé.
    - Commentaire périmé « la Noushi League n'est pas encore jouable ».
11. **L'échec n'est pas annoncé.** La présentation ne dit pas ce qui arrive si le club échoue.

### Ce qui se passe aujourd'hui en cas d'échec (hors top 2 des districts)
- Une seule sortie : **l'équipe B d'un club de Ligue des Pros**. Le club de district est supprimé.
- Avec l'équipe B :
  - les matchs de l'équipe première sont joués automatiquement ;
  - tu joues la Ligue des Espoirs ;
  - un intérim peut t'être proposé si l'équipe première est mal classée.
- En fin de saison, selon le classement de l'équipe B : l'équipe première de ce club (top 3) ou un club de Ligue 2 (top 5).
- Pas de fin de partie, pas de « rejouer le district », pas de Ligue 2 immédiate.

### À consolider avant tout ajout
1. **Décider du sort du groupe à la montée** et le coder : le groupe devient l'effectif de Ligue 2, avec contrats et salaires.
2. **Trancher l'architecture de la Noushi League** (question ouverte dans le fichier des décisions). Ensuite, aligner :
   - les âges ;
   - les textes « U18 » ;
   - l'accès aux joueurs libres et aux vétérans.
3. **Faire respecter la date limite partout** ; supprimer la signature gratuite du remplissage automatique.
4. **Écrire le chemin d'échec validé** (après ta décision), l'annoncer dès la présentation, et ajouter les investisseurs à la montée si on les veut.
5. **Figer les données régionales** (buteurs enregistrés avec leurs buts, forces alignées sur la Noushi).
6. Corriger les textes de dates et l'intérim ; supprimer le code mort.

---

## Synthèse : ordre de consolidation proposé
1. **Carrière District · le groupe garde ses joueurs à la montée.** C'est le défaut le plus visible. Il attend ta décision sur l'architecture Noushi.
2. **Modèle joueur · identité permanente.** Même joueur du U18 au pro, identifiant comme seule clé, registre des joueurs sortis.
3. **Moteur · une seule source de force.** Entente, système et bonus doivent compter dans le match ; calibrage direct / instantané / IA.
4. **Modèle joueur · historique saison par saison et nationalité.**
5. **Moteur · tactiques dépendantes des capacités.** Discipline et effectifs réels.
6. **Nettoyage commun** : code mort, textes de dates, sauvegarde.

Aucune de ces corrections n'a été faite. Elles attendent ton accord, point par point ou en bloc.

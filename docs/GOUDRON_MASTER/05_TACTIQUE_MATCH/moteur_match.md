# Moteur de match — état réel du code v43
## Fonctionnement
- Simulation en temps réel, action par action (newEngine, eStep). 22 joueurs placés sur un terrain dessiné (canvas). Vue terrain ou vue texte.
- À chaque action, le porteur choisit : tir, dribble, passe longue ou passe courte. Les probabilités dépendent de sa position, de ses attributs (finition, technique), du pressing adverse et des consignes.
- Fonctions : ePass (passes), eDribble, eShot (tirs, arrêts), eFoul (fautes, cartons), eFatigue (fatigue selon le bloc), eSub (changements), eComplain (réaction du banc).
- La condition et l'endurance réduisent les attributs pendant le match. Bonus domicile.
- Vitesses : Lent (3 min), Normal (90 s), Rapide (45 s). Mi-temps avec écran dédié.
- Ancien simulateur rapide (quickMatch, loi de Poisson) pour « Résultat immédiat » et les autres matchs.
## Ce que le manager peut faire pendant le match
- Choisir le bloc : bloc bas, équilibré, pressing haut, tout pour l'attaque.
- Consignes collectives : Bloquez les couloirs, Sautez les lignes (jeu direct), Posez le ballon (calme).
- Consigne individuelle : provoquer / normal / jouer simple.
- Déplacer un joueur sur le terrain (glisser).
- 3 changements.
- Réagir sur le banc : rester calme ou protester (risque de carton pour le coach).
## Absent (décidé, à ajouter)
Piège du hors-jeu, agressivité, type de tacle, relance et sorties du gardien, centres, passes en profondeur, jeu court/direct détaillé, longs ballons, dribbles et tirs puissants comme consignes, causerie, recadrage ou encouragement individuel, changement de formation en direct.

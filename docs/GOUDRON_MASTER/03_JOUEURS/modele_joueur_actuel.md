# Modèle joueur — état réel du code v43
## Champs existants
- Identité : id, nom (n), surnom (nick), poste (GB/DEF/MIL/ATT), âge, numéro (num), club, origine, date d'arrivée.
- Note (ovr), potentiel (pot), pic (peak).
- 7 attributs : vit = Vitesse, tec = Dribble, fin = Finition, pas = Passe, def = Défense, phy = Physique, men = Placement.
- Contrat : salaire, durée, clause, valeur (calculée), promesses.
- État : condition/endurance, blessure, notes de match, discipline, niveau scolaire.
- Saison : matchs, buts, passes décisives, minutes.
- Jeunes : U18 (18 au maximum : {'GB': 2, 'DEF': 6, 'MIL': 6, 'ATT': 4}), 4 aspirants au maximum, 10 académies, plans de progression pour les moins de 21 ans (libre, muscle, endurance, tactique), mentors.
- Fiche cliquable : carte, radar, traits (pied fort, gestes techniques, travail défensif…), profil, stats de la saison, parcours.
## Absent
- U20 (seulement U18 et aspirants).
- Statistiques historiques : remises à zéro chaque saison (seuls « parcours » et « pic » restent).
- Nationalité (jamais remplie), moral individuel (seul existe un moral collectif en Noushi League).
- Taille, morphologie, coiffure, visage : un joueur est représenté par un maillot (nom + numéro).
## Noms
- Le jeu actuel : 96 prénoms, 50 noms, 5 zones (akan, gur, mandé nord, mandé sud, krou), 26 villes reliées à une zone (voir autres_bases/).
- Prévu (pas encore branché) : Patronymes_CI_GOUDRON.json, 276 noms dont 261 utilisés, chacun avec une probabilité de provenance par région.
## Visages
- Fiches_Visages_GOUDRON : 49 validés, G047 en réserve, G022 et G072 rejetés, N01–N07 à valider. Aucun portrait HD avant validation.

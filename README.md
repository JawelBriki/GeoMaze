## Javascript Project: Simple Web Game

Afin de jouer, vous avez juste à aller à l'URL "jawelbriki.github.io", et le jeu devrait se lancer.  
L'idée était de rester sur des formes géométriques extrêmement simples, donc seulement des rectangles dans notre cas.  
Une grande difficulté rencontrée au début était la collision entre les joueurs, et notamment des joueurs qui se poussent entre eux et ensuite se déplacent à l'infini (jusqu'à rencontrer un mur).  
Je n'ai pu pallier à ce problème qu'à moitié, donc les collisions sont correctement gérées lorsque J1 pousse les autres joueurs, mais pas lorsque J2 pousse J1 par exemple (je n'arrive toujours pas à expliquer pourquoi).  
Je n'ai également pas eu le temps d'implémenter les effets temporaires (boosts, malus...) par manque de temps à essayer de régler les bugs plus importants.  
De même, je n'ai que 10 niveaux de difficulté croissante et propres, mais ils sont bien faits, avec des obstacles inanimés ou animés, et des obstacles qui renvoient le joueur au départ.  
J'ai également différentes musiques de fond en fonction du menu, niveau ou écran de fin.
Globalement, même s'il reste encore beaucoup d'améliorations possibles, je suis assez content du résultat.
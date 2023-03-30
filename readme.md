# Brief Développement d'un Kanban

## Context
Pour ses besoins en gestion de projet votre responsable vous demande de développer un POC de Kanban pour la gestion de tache interne à votre équipe de développement.
Pour ce faire il vous a transmis un wireframe pour exprimer son besoin en terme d'UI/UX (vous êtes libre d'améliorer l'aspect UI/UX mais cela ne sera pas décisif)

Les fonctionnalités seront les suivantes :
- Gérer les colonnes
- Gérer les taches
- Ajout d'une tache
- Ajout d'une colonne
- Éditer le titre de la tache
- Éditer le titre de la colonne

Outre les besoins fonctionnels, votre responsable souhaite pouvoir faire continuer ce POC par un autre collègue par la suite.
En terme de technologie vous êtes libre de choix, il vous conseil la librairie jKanban mais celle-ci n'est pas imposée 

## Start

### Backend
 - cd backend
 - py -m venv .venv
 - (placer user=user database, password=pwd database, database=database) -> backend/.venv/pyvenv.cfg (rajouter en 1er ligne du fichier [venv])
    - pip install:
      - hug
      - psycopg2
      - sqlalchemy
  - (lancer l'environement) -> .venv/Script/Activate.ps1
  - hug -f server

### Frontend
 - cd frontend
 - npm install
 - npm run dev
# 🏅 TéléSport - Olympic Games App

Application Angular affichant les statistiques des Jeux Olympiques par pays : nombre de médailles, de participations, d'athlètes, avec graphiques interactifs (Chart.js).

## 📋 Sommaire

- [Aperçu](#-aperçu)
- [Prérequis techniques](#-prérequis-techniques)
- [Installation](#-installation)
- [Lancement](#-lancement)
- [Scripts disponibles](#-scripts-disponibles)
- [Structure du projet](#-structure-du-projet)
- [Architecture](#-architecture)
- [Fonctionnalités](#-fonctionnalités)
- [Responsive](#-responsive)
- [Captures d'écran](#-captures-décran)

## 🔎 Aperçu

- **Dashboard** : liste des pays participants avec un pie chart du nombre de médailles par pays. Cliquer sur une part du graphique ouvre la page détail du pays.
- **Page détail pays** : indicateurs clés (entrées, médailles, athlètes) et graphique d'évolution des médailles par édition des JO.
- **Gestion des erreurs** : page 404, message d'erreur en cas d'échec de récupération des données, gestion des cas "pays inexistant" et "données manquantes".

## 🛠 Prérequis techniques

- [Node.js](https://nodejs.org/) 18.19+ ou 20.x
- [Angular CLI](https://angular.io/cli) 18.x (`npm install -g @angular/cli`)
- npm 9+ (fourni avec Node.js)

## 📦 Installation

```bash
git clone <url-du-repo>
cd Telesport
npm install
```

## 🚀 Lancement

```bash
npm start
```

Puis ouvrir [http://localhost:4200](http://localhost:4200) dans le navigateur. L'application se recharge automatiquement à chaque modification du code source.

## 📜 Scripts disponibles

| Commande | Description |
|---|---|
| `npm start` | Lance le serveur de développement (`ng serve`) |
| `npm run build` | Build de production dans `dist/` |
| `npm test` | Lance les tests unitaires (Karma/Jasmine) |

## 📁 Structure du projet

```
src/app/
├── models/        # Interfaces TypeScript (Olympic, Participation, Indicator)
├── services/      # DataService : accès aux données + calculs (Singleton)
├── constants/     # URLs, labels, couleurs, breakpoints responsive
├── components/    # Composants réutilisables (HeaderComponent)
├── pages/         # Pages routées : home, country, not-found
├── app.module.ts
└── app-routing.module.ts
```

Détails complets dans [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## 🏗 Architecture

Voir [`ARCHITECTURE.md`](./ARCHITECTURE.md) pour :
- Le détail de chaque composant et son rôle
- Le fonctionnement du `DataService`
- Les design patterns utilisés (Singleton, Smart/Dumb components, Observer)
- La préparation du projet pour une future connexion à une API back-end

L'audit du code de départ et le plan de refactorisation sont disponibles dans [`notes-architecture.md`](./notes-architecture.md).

## ✨ Fonctionnalités

- Dashboard avec pie chart (Chart.js) et navigation par clic vers le détail d'un pays
- Page détail avec graphique d'évolution des médailles par édition
- Composant `HeaderComponent` réutilisable (titre + indicateurs)
- Gestion des états `loading` / `error` / données avec bouton "Réessayer"
- Gestion des erreurs utilisateur : URL invalide, pays inexistant, données manquantes
- Typage strict (aucun `any`)

## 📱 Responsive

- **Desktop** (≥1200px) : mise en page originale
- **Tablette** (768-1199px) : indicateurs sur plusieurs lignes, graphique pleine largeur
- **Mobile** (≤767px) : indicateurs empilés verticalement, graphique adapté au format carré

## 🖼 Captures d'écran

_Voir le dossier `screenshots/` (desktop, tablette, mobile) pour les captures d'écran des différentes pages._


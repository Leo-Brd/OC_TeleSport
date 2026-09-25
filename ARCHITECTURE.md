# Architecture Front-End - TéléSport

**Projet :** TéléSport - Pages Jeux Olympiques
**Stack :** Angular 18 (NgModule), TypeScript, RxJS, Chart.js

---

## 📁 Structure du projet

```
src/app/
├── models/                    # Interfaces TypeScript (typage des données)
│   └── olympic.model.ts       # Olympic, Participation, Indicator
│
├── services/                  # Logique métier centralisée
│   └── data.service.ts        # Fetch + calculs (Singleton, providedIn: 'root')
│
├── constants/                 # Valeurs statiques centralisées
│   └── app.constants.ts       # URL data, labels, couleurs charts, breakpoints responsive
│
├── components/                # Composants réutilisables (dumb components)
│   └── header/                # HeaderComponent : affiche un titre + une liste d'indicateurs
│
├── pages/                     # Pages routées (smart components)
│   ├── home/                  # Dashboard (liste des pays + graphique pie)
│   ├── country/               # Détail d'un pays (indicateurs + graphique line)
│   └── not-found/             # Page 404
│
├── app.module.ts              # Déclarations, imports, providers
└── app-routing.module.ts      # Définition des routes
```

## 🧩 Composants

| Composant | Rôle | Type |
|---|---|---|
| `HeaderComponent` (`app-header`) | Affiche un titre (`@Input title`) et une liste d'indicateurs clé/valeur (`@Input indicators: Indicator[]`) | Dumb / présentationnel, réutilisé par Home et Country |
| `HomeComponent` (`app-home`) | Récupère les données via `DataService`, calcule les indicateurs globaux, construit le graphique pie, navigue vers `/country/:id` au clic | Smart |
| `CountryComponent` (`app-country`) | Récupère le pays via l'`id` de la route, calcule ses indicateurs, construit le graphique line, redirige vers `/not-found` si le pays n'existe pas | Smart |
| `NotFoundComponent` (`app-not-found`) | Page d'erreur 404 | Dumb |

Chaque page gère 3 états d'affichage : `loading`, `error` (avec bouton "Réessayer") et succès (données affichées).

## ⚙️ DataService

Service unique (Singleton via `providedIn: 'root'`) qui centralise :
- **Accès aux données** : `getOlympics()` — un seul point d'appel HTTP, réutilisable dans toute l'app
- **Calculs métier** : `getTotalCountries()`, `getTotalJOs()`, `getCountryById()`, `getTotalMedals()`, `getTotalAthletes()`
- **Préparation des données graphiques** : `getPieChartData()`, `getLineChartData()`

Les composants ne font qu'appeler le service et afficher le résultat — ils ne connaissent ni l'URL des données, ni la logique de calcul.

## 🔄 Flux de données

```
Composant (Home/Country)
    │  appelle
    ▼
DataService.getOlympics()
    │  HttpClient.get()
    ▼
assets/mock/olympic.json
```

Le composant s'abonne à l'Observable retourné, gère le cycle de vie (`OnDestroy` + `takeUntil`) pour éviter les fuites mémoire, puis met à jour son état (`loading` / `error` / données).

## 🎨 Design patterns utilisés

| Pattern | Où | Pourquoi |
|---|---|---|
| Singleton | `DataService` | Une seule instance partagée, un seul point d'accès aux données |
| Smart / Dumb components | Pages = smart, `HeaderComponent` = dumb | Sépare récupération des données et affichage |
| Observer (Observable RxJS) | `DataService` + composants | Gestion asynchrone et réactive des données HTTP |
| Dependency Injection | Constructeurs des composants/services | Angular fournit les instances, facilite les tests |

## 🚀 Préparation pour une future API back-end

Le `DataService` est le seul endroit à modifier pour brancher une vraie API :
- `getOlympics()` retourne déjà un `Observable<Olympic[]>` — remplacer l'URL du mock (`APP_CONSTANTS.OLYMPIC_DATA_URL`) par l'URL de l'API suffit, aucun composant n'a besoin d'être modifié.
- Les interfaces (`Olympic`, `Participation`) définissent déjà le contrat de données attendu.
- Les états `loading`/`error` sont déjà gérés dans les composants, prêts à réagir à la latence réseau ou aux erreurs HTTP d'une vraie API.

## 📱 Responsive Design

Breakpoints définis dans `APP_CONSTANTS.BREAKPOINTS` :
- **Mobile** (≤767px) : indicateurs empilés verticalement, graphiques en ratio carré
- **Tablette** (768–1199px) : indicateurs sur plusieurs lignes si besoin, graphiques pleine largeur
- **Desktop** (≥1200px) : mise en page d'origine inchangée

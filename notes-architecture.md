# Notes d'Architecture - Audit du Starter Code TéléSport

**Date :** 2026-09-18  
**Projet :** TéléSport - Pages Jeux Olympiques  
**Objectif :** Identifier les mauvaises pratiques Angular et les points de dette technique

---

## 📋 Résumé Exécutif

Le starter code fonctionne visuellement mais présente **de nombreuses violations des bonnes pratiques Angular** :
- ❌ Gestion des données directement dans les composants
- ❌ Utilisation massive du type `any`
- ❌ Pas d'abstraction des services
- ❌ Pas de composants réutilisables
- ❌ Gestion d'erreur minimale
- ❌ Documentation technique absente
- ❌ Pas de structure de projet cohérente

**Priorité de refactorisation :** 🔴 **HAUTE** - Le code n'est pas maintenable.

---

## 🔴 Problèmes Critiques (À corriger ABSOLUMENT)

### 1. **Aucun Typage TypeScript (`any` partout)**

**Localisation :** 
- `home.component.ts` : ligne 25 → `this.http.get<any[]>`
- `country.component.ts` : ligne 25 → `this.http.get<any[]>`
- `home.component.ts` : ligne 25 → `.map((i: any) => ...)`

**Problème :** Utilisation de `any` partout → perte du type-checking TypeScript

**Impact :**
- TypeScript ne peut pas vérifier les erreurs à la compilation
- Risque de bugs à runtime (accès à propriétés inexistantes)
- Aucune aide de l'IDE (intellisense cassée)

**À faire :**
- ✅ Créer des interfaces TypeScript (`Olympic`, `Participation`)
- ✅ Typer correctement les réponses HTTP

---

### 2. **Pas de Service de Données (Anti-pattern)**

**Localisation :**
- `home.component.ts` : lignes 23-43 (logique de fetch + transformation)
- `country.component.ts` : lignes 24-48 (même chose)

**Problème :** Le composant récupère, transforme ET affiche les données (3 responsabilités)

**Impact :**
- Impossibilité de réutiliser la logique de récupération de données
- Test unitaire très difficile (dépendance forte à HttpClient)
- Violation du **Single Responsibility Principle**
- Duplication : URL `olympicUrl` répétée dans 2 composants

**À faire :**
- ✅ Créer `DataService` dans `src/app/services/data.service.ts`
- ✅ Déplacer toute logique de fetch/transformation dans le service
- ✅ Les composants n'appelent que le service

---

### 3. **Gestion d'Erreur Absente**

**Localisation :**
- `home.component.ts` : ligne 40 → `console.log(error)` seulement
- `country.component.ts` : ligne 42 → `console.log(error)` seulement
- Aucun message affiché à l'utilisateur

**Problème :** Erreurs loggées en console mais jamais affichées à l'utilisateur

**Impact :**
- Utilisateur ne voit pas les erreurs
- Données vides sans explication
- Page laissée en état de chargement infini

**À faire :**
- ✅ Créer un état `loading` / `error` / `empty` dans chaque composant
- ✅ Afficher un message d'erreur à l'utilisateur
- ✅ Bouton "Réessayer" en cas d'erreur

---

### 4. **Pas de Validation des Paramètres de Route**

**Localisation :**
- `country.component.ts` : ligne 30 → `const selectedCountry = data.find(...)`

**Problème :** L'app crash si on accède à `/country/InvalidCountry` car `selectedCountry` est undefined

**Impact :**
- Si l'URL contient `/country/InvalidCountry`, l'app crash
- Pas de redirection vers 404
- Mauvaise expérience utilisateur

**À faire :**
- ✅ Vérifier que `selectedCountry` existe
- ✅ Rediriger vers `/not-found` si le pays n'existe pas
- ✅ Utiliser des **guards de route** si nécessaire

---

### 5. **Memory Leaks - Pas de Unsubscribe**

**Localisation :**
- `home.component.ts` : ligne 24 → `.subscribe(...)` sans unsubscribe
- `country.component.ts` : lignes 26, 27 → `.subscribe(...)` sans unsubscribe

**Problème :** Les subscriptions ne sont jamais fermées → memory leak quand le composant est détruit

**Impact :**
- Fuite mémoire progressive dans l'application
- Performance dégradée après navigation répétée
- À long terme, l'app ralentit/plante

**À faire :**
- ✅ Utiliser `takeUntilDestroyed()` (Angular 16+) ou `takeUntil()`
- ✅ Implémenter `OnDestroy` pour nettoyer les subscriptions

---

## 🟡 Problèmes Importants (À améliorer)

### 6. **Pas de Composant Réutilisable (HeaderComponent)**

**Spécifications exigent :**
> HeaderComponent affiche un titre et itère sur une liste d'indicateurs

**Réalité :**
- ❌ HeaderComponent n'existe pas
- ❌ HTML dupliqué dans `home.component.html` et `country.component.html`

**À faire :**
- ✅ Créer `HeaderComponent` avec inputs `@Input() title: string` et `@Input() indicators: Indicator[]`
- ✅ Réutiliser dans les deux pages

---

### 7. **Structure de Projet Incohérente**

**Réalité :**
```
src/app/
├── app-routing.module.ts
├── app.component.ts
├── app.module.ts
├── pages/
│   ├── home/
│   ├── country/
│   └── not-found/
```

**Manquant :**
```
src/app/
├── services/           ❌ N'EXISTE PAS
│   └── data.service.ts
├── models/             ❌ N'EXISTE PAS
│   └── olympic.model.ts
├── components/         ❌ N'EXISTE PAS
│   └── header/
└── shared/             ❌ N'EXISTE PAS
```

**À faire :**
- ✅ Créer la structure de dossiers appropriée
- ✅ Respecter la convention Angular `src/app/{services,models,components,pages}`

---

### 8. **Routes avec `:countryName` au lieu de `:id`**

**Localisation :**
- `app-routing.module.ts` : ligne 10 → `path : 'country/:countryName'`

**Problème :** Utiliser le nom du pays dans l'URL encode les espaces (`United%20Kingdom`)

**À faire :**
- ✅ Changer la route en `:id`
- ✅ Chercher le pays par `id` au lieu de `country`

---

### 9. **Logique de Transformation Complexe dans le Composant**

**Localisation :**
- `home.component.ts` : lignes 28-31 (calcul de `totalJOs` et `totalCountries`)

**Problème :** Calculs complexes (totalJOs, totalCountries) directement dans le composant

**Impact :**
- Impossible de tester cette logique isolément
- Difficile à maintenir
- Confusion responsabilités

**À faire :**
- ✅ Déplacer cette logique dans le **DataService**
- ✅ Créer des méthodes bien nommées : `getTotalCountries()`, `getTotalJOs()`

---

### 10. **Chart.js Directement dans le Composant**

**Localisation :**
- `home.component.ts` : lignes 42-56 (création du graphique)
- `country.component.ts` : lignes 41-55 (création du graphique)

**Problème :** Logique Chart.js directement dans les composants → duplication et couplage

**Impact :**
- Impossible de changer Chart.js sans refactoriser les composants
- Code dupliqué (logique de graphique répétée)
- Difficile à tester

**À faire :**
- ✅ Créer un service `ChartService` ou des composants réutilisables pour les graphiques
- ✅ Ou créer un composant `PieChartComponent`, `LineChartComponent`

---

### 11. **Pas de Gestion des États (Loading / Empty / Error)**

**Spécifications exigent :**
> Gestion des états : loading, empty, error (au minimum visuels)

**Réalité :**
- ❌ Pas de loading indicator
- ❌ Pas de message "Aucune donnée"
- ❌ Pas de message d'erreur à l'utilisateur

**À faire :**
- ✅ Créer des états : `loading: boolean`, `error: string | null`, `data: Olympic[] | null`
- ✅ Afficher UI appropriée pour chaque état

---

### 12. **Pas de Responsive Design Implémenté**

**Spécifications exigent :**
> Mobile ≤ 767px : 4 colonnes, pile verticale  
> Tablette ~ 768–1199px : 8 colonnes, graphe pleine largeur  
> Desktop ≥ 1200px : 12 colonnes

**Réalité :**
- ❌ Aucune media query en SCSS
- ❌ Layout apparemment figé
- ❌ Pas de `@media` queries

**À faire :**
- ✅ Implémenter des breakpoints CSS/SCSS
- ✅ Utiliser CSS Grid ou Flexbox responsif

---

### 13. **Pas de Constantes**

**Localisation :**
- `home.component.ts` : ligne 13 → `private olympicUrl = './assets/mock/olympic.json'`
- `country.component.ts` : ligne 12 → `private olympicUrl = './assets/mock/olympic.json'`

**Problème :**
- URL dupliquée dans 2 fichiers
- Labels (`"Number of countries"`, `"Medals per Country"`) en dur

**À faire :**
- ✅ Créer `src/app/constants/app.constants.ts`
- ✅ Centralisez URLs, labels, couleurs, etc.

---

## 🟢 Points Positifs (À Conserver)

✅ **Utilisation de HttpClient** - Bonne pratique (pas de jQuery)  
✅ **Routage en place** - App routing module configuré  
✅ **SCSS utilisé** - Organisation CSS cohérente  
✅ **Angular 18** - Version moderne  
✅ **Chart.js intégré** - Bonne librairie graphique  

---

---

## 🏗️ NOUVELLE ARCHITECTURE PROPOSÉE

### **Structure Optimale des Dossiers**

```
src/app/
├── models/                    # ✨ À CRÉER : Interfaces & Types
│   └── olympic.model.ts       # Olympic, Participation, indicators
│
├── services/                  # ✨ À CRÉER : Logique métier centralisée
│   ├── data.service.ts        # Fetch données + calculs (Singleton)
│   └── chart.service.ts       # Gestion des graphiques (optionnel)
│
├── components/                # ✨ À CRÉER : Composants réutilisables
│   ├── header/                # HeaderComponent (affiche titre + KPIs)
│   │   ├── header.component.ts
│   │   ├── header.component.html
│   │   └── header.component.scss
│   ├── pie-chart/             # PieChartComponent (optionnel)
│   └── line-chart/            # LineChartComponent (optionnel)
│
├── pages/                     # Pages conteneurs (smart components)
│   ├── home/                  # Dashboard page
│   │   ├── home.component.ts  (appelle DataService)
│   │   ├── home.component.html (utilise HeaderComponent)
│   │   └── home.component.scss
│   ├── country/               # Détail pays page
│   │   ├── country.component.ts (appelle DataService)
│   │   ├── country.component.html (utilise HeaderComponent)
│   │   └── country.component.scss
│   └── not-found/
│
├── constants/                 # ✨ À CRÉER : Valeurs statiques
│   └── app.constants.ts       # URLs, labels, couleurs, breakpoints
│
├── app.module.ts              # Déclaration des composants + services
├── app.component.ts           # Racine (vide, juste router-outlet)
└── app-routing.module.ts      # Routes (path: 'country/:id')
```

### **Design Patterns Utilisés**

| Pattern | Où ? | Pourquoi ? |
|---------|------|----------|
| **Singleton** | `DataService` | Une seule instance partagée entre tous les composants |
| **Smart/Dumb Components** | Pages = smart, HeaderComponent = dumb | Séparation fetch/affichage |
| **Dependency Injection** | Dans constructeurs | Services injectés par Angular |
| **Observable Pattern** | DataService avec RxJS | Gestion asynchrone des données |
| **Module Pattern** | app.module.ts | Encapsulation des déclarations |

### **Diagramme des Flux de Données**

```
┌─────────────────────────────────────────────────────────┐
│  USER INTERFACE (Templates)                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ home.html / country.html                         │   │
│  │  ├─ <app-header> ← affiche titre + KPIs         │   │
│  │  └─ <canvas> ← affiche graphiques               │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────┬──────────────────────────────────────────┘
               │
               │ (appelle via injection)
               ↓
┌─────────────────────────────────────────────────────────┐
│  SMART COMPONENTS (Pages)                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │ home.component.ts / country.component.ts         │   │
│  │  - Récupère données via DataService.getData()    │   │
│  │  - Gère états (loading, error, data)             │   │
│  │  - Affiche/cache HeaderComponent                 │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────┬──────────────────────────────────────────┘
               │
               │ (appelle)
               ↓
┌─────────────────────────────────────────────────────────┐
│  DATA SERVICE (Singleton)                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │ data.service.ts                                  │   │
│  │  - getData(): Observable<Olympic[]>             │   │
│  │  - getTotalCountries()                          │   │
│  │  - getTotalJOs()                                │   │
│  │  - getCountryById(id)                           │   │
│  │  - (toute transformation logique)               │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────┬──────────────────────────────────────────┘
               │
               │ (fetch HTTP)
               ↓
┌─────────────────────────────────────────────────────────┐
│  DATA SOURCE (olympic.json)                              │
│  └─ Fichier mock ou API Backend                         │
└─────────────────────────────────────────────────────────┘
```


### **Bénéfices de Cette Architecture**

✅ **Maintenabilité** : Code clair, chaque fichier une responsabilité  
✅ **Testabilité** : Services testables indépendamment des composants  
✅ **Réutilisabilité** : HeaderComponent utilisable partout  
✅ **Scalabilité** : Facile d'ajouter de nouvelles pages/services  
✅ **Performance** : Singleton DataService = une seule requête HTTP  
✅ **Typage** : Interfaces pour chaque entité → zéro `any`  

---

## 📋 Documentation à Créer

### ✅ README.md
- Installation & lancement
- Structure du projet
- Conventions

### ✅ ARCHITECTURE.md
- Diagrammes détaillés
- Patterns utilisés
- Flux de données

---

## 🎯 Plan de Refactorisation (Priorisation)

| Priorité | Tâche | Impact | Effort |
|----------|-------|--------|--------|
| 🔴 HAUTE | Créer DataService | Élimine duplication, améliore testabilité | Moyen |
| 🔴 HAUTE | Ajouter typage (interfaces) | Élimine les `any`, améliore sécurité type | Moyen |
| 🔴 HAUTE | Valider paramètres de route | Empêche crashes | Faible |
| 🟡 MOYEN | Créer HeaderComponent | Élimine duplication HTML | Moyen |
| 🟡 MOYEN | Implémenter gestion états (loading/error) | Améliore UX | Moyen |
| 🟡 MOYEN | Ajouter unsubscribe (OnDestroy) | Élimine memory leaks | Faible |
| 🟢 FAIBLE | Créer constants | Améliore maintenabilité | Faible |
| 🟢 FAIBLE | Responsive design | Spécifications exigent | Moyen |
| 🟢 FAIBLE | Documentation (README, ARCHITECTURE) | Facilite onboarding | Faible |

---


**Conclusion :** Le starter fonctionne mais n'est **PAS PRÊT POUR LA PRODUCTION**. Une refactorisation complète selon les principes SOLID et Angular est obligatoire avant d'ajouter des features.


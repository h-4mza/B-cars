# PROMPT ADDITIONNEL — UI/UX & FONCTIONNALITÉS INSPIRÉES DES RÉFÉRENCES

## CONTEXTE
En te basant sur les screenshots de carjet.com, aircar.ma, europcar.ma et discovercars.com,
implémente les éléments suivants dans le projet existant.

---

## 1. FORMULAIRE DE RECHERCHE HERO (Page d'accueil)

Crée un composant <SearchWidget /> inspiré d'aircar.ma et europcar.ma :

```tsx
// Structure du formulaire
interface SearchFormData {
  vehicleType: 'car' | 'van'          // Switcher Voiture / Utilitaire
  pickupLocation: string               // Dropdown avec aéroports + villes marocaines
  returnLocation: string               // Peut être différent du départ
  sameReturnLocation: boolean          // Checkbox "Retour dans la même agence"
  pickupDate: Date
  pickupTime: string                   // HH:MM (ex: 09:00, 10:00)
  returnDate: Date
  returnTime: string
  driverAge: '18-21' | '22+' | '25+' | '30+'
  driverCountry: string               // Pays de résidence
  promoCode?: string
}
```

**Design du SearchWidget :**
- Switcher en haut : [🚗 Voitures] [🚐 Utilitaires] — style pill/tab
- Fond blanc avec ombre douce, border-radius 16px
- Checkbox "Retour dans la même agence" — si décochée, afficher un 2ème champ lieu de retour
- Picker date avec calendrier visuel (react-day-picker)
- Select heure : dropdown de 00:00 à 23:30 par tranches de 30min
- Dropdown âge conducteur (important pour assurance)
- Dropdown pays de résidence (liste complète des pays, Maroc en premier)
- Champ code promo : caché par défaut, apparaît au clic sur "J'ai un code promo"
- Bouton principal : "Rechercher" avec icône loupe, couleur primaire
- **Ajouter les villes/aéroports marocains dans la DB :**

```sql
-- Seed locations
INSERT INTO locations (id, name, type, city, code) VALUES
('loc_1', 'Casablanca Aéroport (CMN)', 'AIRPORT', 'Casablanca', 'CMN'),
('loc_2', 'Marrakech Aéroport (RAK)', 'AIRPORT', 'Marrakech', 'RAK'),
('loc_3', 'Agadir Aéroport (AGA)', 'AIRPORT', 'Agadir', 'AGA'),
('loc_4', 'Fès Aéroport (FEZ)', 'AIRPORT', 'Fès', 'FEZ'),
('loc_5', 'Rabat Aéroport (RBA)', 'AIRPORT', 'Rabat', 'RBA'),
('loc_6', 'Tanger Aéroport (TNG)', 'AIRPORT', 'Tanger', 'TNG'),
('loc_7', 'Oujda Aéroport (OUD)', 'AIRPORT', 'Oujda', 'OUD'),
('loc_8', 'Centre-ville Casablanca', 'AGENCY', 'Casablanca', NULL),
('loc_9', 'Centre-ville Marrakech', 'AGENCY', 'Marrakech', NULL),
('loc_10', 'Centre-ville Agadir', 'AGENCY', 'Agadir', NULL),
('loc_11', 'Centre-ville Rabat', 'AGENCY', 'Rabat', NULL),
('loc_12', 'Centre-ville Fès', 'AGENCY', 'Fès', NULL),
('loc_13', 'Centre-ville Tanger', 'AGENCY', 'Tanger', NULL);
```

---

## 2. PAGE RÉSULTATS DE RECHERCHE — CARDS VÉHICULES (style carjet.com)

### Layout
- Header sticky avec résumé recherche : "Casablanca Aéroport (CMN) | 14 Jun 10:00 → 26 Jun 10:00"
- Filtres rapides en chips horizontaux scrollables :
  - [⚙️ Filtres] [✈️ Dans l'aéroport] [⚡ Automatique] [🔋 Électrique] [❄️ Climatisation]
- Liste de cards véhicules triées par prix croissant

### VehicleCard Component

```tsx
interface VehicleCardProps {
  vehicle: {
    id: string
    name: string           // "Kia Picanto"
    category: string       // "ou similaire mini"
    image: string
    totalPrice: number     // Prix calculé pour la période complète
    pricePerDay: number
    numberOfDays: number
    currency: 'MAD' | 'EUR'
    seats: number          // 5 places
    transmission: 'MANUAL' | 'AUTOMATIC'
    mileage: 'UNLIMITED' | number
    features: string[]     // ["Navette gratuite", "Climatisation", "GPS inclus"]
    badges: Badge[]        // voir ci-dessous
    rating?: number
    reviewCount?: number
    isAvailable: boolean
    deposit: number
  }
}

type Badge = 
  | { type: 'BEST_PRICE'; label: 'Le plus bas prix' }
  | { type: 'NON_REFUNDABLE'; label: 'Offre Non Remboursable' }
  | { type: 'LIMITED'; label: 'Offre Limitée' }
  | { type: 'EXCELLENT'; label: 'Excellente offre' }
  | { type: 'FREE_CANCELLATION'; label: 'Annulation gratuite' }
```

**Design de la card :**
┌─────────────────────────────────────────┐

│ Kia Picanto          [ℹ️] [👍]          │

│ ou similaire mini                        │

│                       Prix pour 12 jours │

│  [IMAGE VOITURE]         681 MAD         │

│                                          │

│  [LOGO AGENCE]                           │

│  👤 5 places                             │

│  ⚙️ Transmission manuelle    [  →  ]     │

│  ✈️ Navette gratuite                     │

│  🟢 Km: Illimité                         │

├──────────────────────────────────────────┤

│ [🏷️ Le plus bas prix] [ℹ️ Non remboursable]│

│ [🟡 Offre Limitée]                       │

├──────────────────────────────────────────┤

│ 🟢 Excellente offre — voiture la moins  │

│    chère de sa catégorie pour vos dates  │

└──────────────────────────────────────────┘

**Couleurs des badges :**
- BEST_PRICE : fond bleu clair #E3F0FF, texte bleu #1B6FE0, icône 📉
- NON_REFUNDABLE : fond gris clair, texte gris, avec icône ℹ️
- LIMITED : fond jaune #FFF3CD, texte orange #CC8400
- EXCELLENT : fond vert #D4EDDA, texte vert #155724
- FREE_CANCELLATION : fond vert doux, texte vert foncé

**Affichage prix :**
- "Prix pour X jours" en petit texte gris au-dessus
- Prix total en grand (ex: "681 MAD") — jamais le prix/jour en principal
- Prix/jour en petit en dessous : "(57 MAD/jour)"

---

## 3. PAGE DÉTAIL VÉHICULE + OFFRE (style discovercars.com)

### Header Sticky
[IMAGE VOITURE MINIATURE]    Total pour X jours

€89.82 / 681 MAD

[          Continuer          ]

### Section "Inclus dans votre offre"
```tsx
const includedFeatures = [
  { icon: '✅', label: 'Kilométrage illimité' },
  { icon: '✅', label: 'Couverture dommages collision (CDW) — Franchise: 5 000 MAD' },
  { icon: '✅', label: 'Protection vol' },
  { icon: '✅', label: 'Assistance routière 24h/24' },
  { icon: '✅', label: 'Responsabilité civile (RC)' },
]
```
Fond vert très clair #F0FFF4, border vert, checkmarks verts.

### Section "Politique annulation"
```tsx
// Si annulation gratuite
<InfoBox color="green">
  ✅ Remboursement complet si annulation 48h avant la prise en charge
</InfoBox>

// Si non remboursable
<InfoBox color="amber">
  ⚠️ Cette offre n'est pas remboursable
</InfoBox>
```

### Section "Note fournisseur" (ajouter à la DB)
```prisma
// Ajouter au modèle Vehicle dans Prisma
rating         Float?    // ex: 8.2
reviewCount    Int?      // ex: 6519
ratingLabel    String?   // "Très bien", "Bien", "Excellent"

// Et ces champs de détail
ratingValue        Float?   // 8.3
ratingEaseOfFind   Float?   // 8.5
ratingCleanliness  Float?   // 8.7
ratingStaff        Float?   // 8.1
```

Affichage :
Note fournisseur

[8.2 ⭐] [LOGO AGENCE]  Très bien — 6 519 avis
Rapport qualité/prix    8.3 ████████░░

Facilité de récupération 8.5 ████████░░

Propreté                8.7 █████████░

Personnel               8.1 ████████░░

### Section "Que faut-il pour récupérer la voiture ?"
```tsx
const requiredDocuments = [
  {
    icon: '🪪',
    title: 'Permis de conduire',
    description: 'Permis valide au nom du conducteur principal',
    link: { text: 'Quel permis est accepté ?', href: '/faq#permis' }
  },
  {
    icon: '🌐',
    title: 'Pièce d\'identité',
    description: 'Passeport ou autre document d\'identité valide',
    link: { text: 'Puis-je utiliser ma CIN ?', href: '/faq#identite' }
  },
  {
    icon: '💳',
    title: 'Carte bancaire',
    description: 'Carte de crédit au nom du conducteur pour la caution',
    link: { text: 'Je n\'ai pas de carte de crédit', href: '/faq#paiement' }
  },
  {
    icon: '📱',
    title: 'Bon de réservation',
    description: 'Confirmation imprimée ou e-voucher sur smartphone',
    link: { text: 'Qu\'est-ce qu\'un bon de réservation ?', href: '/faq#voucher' }
  },
]
```

Design : fond bleu très clair #EFF6FF, cercles d'icônes bleu pastel, liens en bleu soulignés.

---

## 4. MISES À JOUR BASE DE DONNÉES

### Nouveau modèle Location
```prisma
model Location {
  id          String   @id @default(cuid())
  name        String   // "Casablanca Aéroport (CMN)"
  type        LocationType // AIRPORT, AGENCY, HOTEL
  city        String
  code        String?  // Code IATA ex: CMN
  address     String?
  latitude    Float?
  longitude   Float?
  isActive    Boolean  @default(true)
  hasShuttle  Boolean  @default(false) // Navette gratuite disponible
  
  pickupReservations  Reservation[] @relation("PickupLocation")
  returnReservations  Reservation[] @relation("ReturnLocation")
}

enum LocationType { AIRPORT AGENCY HOTEL CUSTOM }
```

### Mise à jour modèle Reservation
```prisma
// Ajouter ces champs à Reservation
pickupLocationId   String
returnLocationId   String
pickupTime         String    // "10:00"
returnTime         String    // "10:00"
driverAge          String    // "22+"
driverCountry      String
cancellationPolicy CancellationPolicy @default(STANDARD)
voucherCode        String?   // numéro bon de réservation

pickupLocation     Location  @relation("PickupLocation", fields: [pickupLocationId], references: [id])
returnLocation     Location  @relation("ReturnLocation", fields: [returnLocationId], references: [id])

enum CancellationPolicy { FREE_48H FREE_24H NON_REFUNDABLE }
```

### Mise à jour modèle Vehicle
```prisma
// Ajouter ces champs à Vehicle
category           VehicleCategory  // MINI, ECONOMY, COMPACT, SUV, LUXURY, VAN
seats              Int @default(5)
doors              Int @default(4)
hasAC              Boolean @default(true)
hasGPS             Boolean @default(false)
hasBluetooth       Boolean @default(false)
mileagePolicy      MileagePolicy @default(UNLIMITED)
mileageLimit       Int?          // si pas illimité, km inclus/jour
fuelPolicy         FuelPolicy @default(FULL_TO_FULL)
minDriverAge       Int @default(21)
rating             Float?
reviewCount        Int?
ratingLabel        String?
includedFeatures   String[]  // ["CDW", "Theft Protection", "Roadside Assistance", "TPL"]
depositAmount      Decimal @db.Decimal(10, 2)
isAirportPickup    Boolean @default(false)
hasShuttle         Boolean @default(false)
locationId         String?
location           Location? @relation(fields: [locationId], references: [id])

enum VehicleCategory { MINI ECONOMY COMPACT INTERMEDIATE FULLSIZE SUV LUXURY VAN ELECTRIC }
enum MileagePolicy { UNLIMITED LIMITED }
enum FuelPolicy { FULL_TO_FULL FULL_TO_EMPTY PREPAID }
```

---

## 5. SEED DATA — 15 VÉHICULES RÉALISTES

```typescript
// prisma/seed.ts — ajouter ces véhicules
const vehicles = [
  {
    brand: 'Kia', model: 'Picanto', year: 2023,
    category: 'MINI', seats: 5, doors: 4,
    transmission: 'MANUAL', fuel: 'GASOLINE',
    pricePerDay: 120, depositAmount: 3000,
    hasAC: true, mileagePolicy: 'UNLIMITED',
    rating: 8.1, reviewCount: 1243,
    includedFeatures: ['CDW', 'Theft Protection', 'Roadside Assistance', 'TPL'],
    isAirportPickup: true, hasShuttle: true,
  },
  {
    brand: 'Hyundai', model: 'i10', year: 2023,
    category: 'MINI', seats: 5, doors: 4,
    transmission: 'MANUAL', fuel: 'GASOLINE',
    pricePerDay: 125, depositAmount: 3000,
    hasAC: true, mileagePolicy: 'UNLIMITED',
    rating: 7.9, reviewCount: 892,
    includedFeatures: ['CDW', 'Theft Protection', 'Roadside Assistance', 'TPL'],
    isAirportPickup: true, hasShuttle: false,
  },
  {
    brand: 'Dacia', model: 'Logan', year: 2022,
    category: 'ECONOMY', seats: 5, doors: 4,
    transmission: 'MANUAL', fuel: 'DIESEL',
    pricePerDay: 150, depositAmount: 4000,
    hasAC: true, mileagePolicy: 'UNLIMITED',
    rating: 8.3, reviewCount: 3421,
    includedFeatures: ['CDW', 'Theft Protection', 'Roadside Assistance', 'TPL'],
    isAirportPickup: true, hasShuttle: true,
  },
  {
    brand: 'Dacia', model: 'Sandero', year: 2023,
    category: 'ECONOMY', seats: 5, doors: 5,
    transmission: 'MANUAL', fuel: 'GASOLINE',
    pricePerDay: 160, depositAmount: 4000,
    hasAC: true, mileagePolicy: 'UNLIMITED',
    rating: 8.5, reviewCount: 2891,
    includedFeatures: ['CDW', 'Theft Protection', 'Roadside Assistance', 'TPL'],
    isAirportPickup: true, hasShuttle: true,
  },
  {
    brand: 'Renault', model: 'Clio', year: 2023,
    category: 'COMPACT', seats: 5, doors: 5,
    transmission: 'MANUAL', fuel: 'GASOLINE',
    pricePerDay: 180, depositAmount: 4500,
    hasAC: true, mileagePolicy: 'UNLIMITED',
    rating: 8.2, reviewCount: 1567,
    includedFeatures: ['CDW', 'Theft Protection', 'Roadside Assistance', 'TPL'],
    isAirportPickup: true, hasShuttle: false,
  },
  {
    brand: 'Peugeot', model: '208', year: 2023,
    category: 'COMPACT', seats: 5, doors: 5,
    transmission: 'AUTOMATIC', fuel: 'GASOLINE',
    pricePerDay: 220, depositAmount: 5000,
    hasAC: true, mileagePolicy: 'UNLIMITED',
    rating: 8.7, reviewCount: 743,
    includedFeatures: ['CDW', 'Theft Protection', 'Roadside Assistance', 'TPL'],
    isAirportPickup: true, hasShuttle: true,
  },
  {
    brand: 'Volkswagen', model: 'Polo', year: 2023,
    category: 'COMPACT', seats: 5, doors: 5,
    transmission: 'AUTOMATIC', fuel: 'GASOLINE',
    pricePerDay: 240, depositAmount: 5000,
    hasAC: true, hasBluetooth: true, mileagePolicy: 'UNLIMITED',
    rating: 8.9, reviewCount: 512,
    includedFeatures: ['CDW', 'Theft Protection', 'Roadside Assistance', 'TPL'],
    isAirportPickup: true, hasShuttle: true,
  },
  {
    brand: 'Dacia', model: 'Duster', year: 2023,
    category: 'SUV', seats: 5, doors: 5,
    transmission: 'MANUAL', fuel: 'DIESEL',
    pricePerDay: 280, depositAmount: 6000,
    hasAC: true, hasBluetooth: true, mileagePolicy: 'UNLIMITED',
    rating: 8.6, reviewCount: 2134,
    includedFeatures: ['CDW', 'Theft Protection', 'Roadside Assistance', 'TPL'],
    isAirportPickup: true, hasShuttle: true,
  },
  {
    brand: 'Hyundai', model: 'Tucson', year: 2023,
    category: 'SUV', seats: 5, doors: 5,
    transmission: 'AUTOMATIC', fuel: 'GASOLINE',
    pricePerDay: 350, depositAmount: 7000,
    hasAC: true, hasGPS: true, hasBluetooth: true, mileagePolicy: 'UNLIMITED',
    rating: 9.0, reviewCount: 389,
    includedFeatures: ['CDW', 'Theft Protection', 'Roadside Assistance', 'TPL'],
    isAirportPickup: true, hasShuttle: true,
  },
  {
    brand: 'Toyota', model: 'RAV4', year: 2023,
    category: 'SUV', seats: 5, doors: 5,
    transmission: 'AUTOMATIC', fuel: 'HYBRID',
    pricePerDay: 420, depositAmount: 8000,
    hasAC: true, hasGPS: true, hasBluetooth: true, mileagePolicy: 'UNLIMITED',
    rating: 9.2, reviewCount: 234,
    includedFeatures: ['CDW', 'Theft Protection', 'Roadside Assistance', 'TPL'],
    isAirportPickup: true, hasShuttle: false,
  },
  {
    brand: 'Mercedes-Benz', model: 'Classe A', year: 2023,
    category: 'LUXURY', seats: 5, doors: 5,
    transmission: 'AUTOMATIC', fuel: 'GASOLINE',
    pricePerDay: 650, depositAmount: 15000,
    hasAC: true, hasGPS: true, hasBluetooth: true, mileagePolicy: 'LIMITED',
    mileageLimit: 300,
    rating: 9.4, reviewCount: 123,
    includedFeatures: ['CDW', 'Theft Protection', 'Roadside Assistance', 'TPL', 'Super CDW'],
    isAirportPickup: true, hasShuttle: true,
  },
  {
    brand: 'BMW', model: 'Série 3', year: 2023,
    category: 'LUXURY', seats: 5, doors: 4,
    transmission: 'AUTOMATIC', fuel: 'GASOLINE',
    pricePerDay: 750, depositAmount: 18000,
    hasAC: true, hasGPS: true, hasBluetooth: true, mileagePolicy: 'LIMITED',
    mileageLimit: 250,
    rating: 9.5, reviewCount: 98,
    includedFeatures: ['CDW', 'Theft Protection', 'Roadside Assistance', 'TPL', 'Super CDW'],
    isAirportPickup: false, hasShuttle: false,
  },
  {
    brand: 'Renault', model: 'Trafic', year: 2022,
    category: 'VAN', seats: 9, doors: 5,
    transmission: 'MANUAL', fuel: 'DIESEL',
    pricePerDay: 450, depositAmount: 8000,
    hasAC: true, mileagePolicy: 'UNLIMITED',
    rating: 8.0, reviewCount: 321,
    includedFeatures: ['CDW', 'Theft Protection', 'Roadside Assistance', 'TPL'],
    isAirportPickup: false, hasShuttle: false,
  },
  {
    brand: 'Fiat', model: '500e', year: 2024,
    category: 'ELECTRIC', seats: 4, doors: 3,
    transmission: 'AUTOMATIC', fuel: 'ELECTRIC',
    pricePerDay: 300, depositAmount: 6000,
    hasAC: true, hasBluetooth: true, mileagePolicy: 'LIMITED',
    mileageLimit: 200,
    rating: 8.8, reviewCount: 156,
    includedFeatures: ['CDW', 'Theft Protection', 'Roadside Assistance', 'TPL'],
    isAirportPickup: true, hasShuttle: true,
  },
  {
    brand: 'Volkswagen', model: 'Golf', year: 2023,
    category: 'COMPACT', seats: 5, doors: 5,
    transmission: 'AUTOMATIC', fuel: 'DIESEL',
    pricePerDay: 260, depositAmount: 5500,
    hasAC: true, hasGPS: false, hasBluetooth: true, mileagePolicy: 'UNLIMITED',
    rating: 8.8, reviewCount: 678,
    includedFeatures: ['CDW', 'Theft Protection', 'Roadside Assistance', 'TPL'],
    isAirportPickup: true, hasShuttle: true,
  },
]
```

---

## 6. API ENDPOINTS À AJOUTER

### Recherche véhicules (le plus important)
GET /api/vehicles/search?

pickupLocationId=loc_1

&returnLocationId=loc_1

&pickupDate=2025-07-14

&pickupTime=10:00

&returnDate=2025-07-26

&returnTime=10:00

&driverAge=22+

&category=MINI         (optionnel)

&transmission=MANUAL   (optionnel)

&maxPrice=800          (optionnel)

&sortBy=price_asc      (price_asc|price_desc|rating|category)

**La réponse doit inclure :**
```json
{
  "results": [...],
  "meta": {
    "totalDays": 12,
    "pickupLocation": { "name": "Casablanca Aéroport (CMN)", ... },
    "returnLocation": { ... },
    "totalVehicles": 15,
    "availableVehicles": 11
  },
  "filters": {
    "categories": ["MINI", "ECONOMY", "COMPACT", "SUV"],
    "transmissions": ["MANUAL", "AUTOMATIC"],
    "priceRange": { "min": 681, "max": 9000 },
    "features": ["airport_pickup", "shuttle", "unlimited_mileage"]
  }
}
```

### Vérifier disponibilité

GET /api/vehicles/:id/availability?startDate=2025-07-14&endDate=2025-07-26

→ { available: true, totalPrice: 1800, priceBreakdown: {...} }

### Obtenir le bon de réservation (voucher)

GET /api/reservations/:id/voucher

→ Génère et retourne un PDF avec :

Numéro de réservation
QR code de la réservation
Détails véhicule
Lieu et heure de prise en charge
Documents à apporter (permis, passeport, CB)
Conditions d'annulation

---

## 7. LOGIQUE DE BADGES AUTOMATIQUES

```typescript
// Dans VehicleService, calculer automatiquement les badges
function calculateBadges(vehicle: Vehicle, searchParams: SearchParams, allResults: Vehicle[]): Badge[] {
  const badges: Badge[] = []
  
  // BEST_PRICE : si c'est le moins cher de sa catégorie
  const sameCategory = allResults.filter(v => v.category === vehicle.category)
  const isLowestPrice = vehicle.pricePerDay === Math.min(...sameCategory.map(v => v.pricePerDay))
  if (isLowestPrice) badges.push({ type: 'BEST_PRICE', label: 'Le plus bas prix' })
  
  // EXCELLENT : si note >= 8.5 ET moins cher que la moyenne de sa catégorie
  const avgPrice = sameCategory.reduce((sum, v) => sum + v.pricePerDay, 0) / sameCategory.length
  if (vehicle.rating >= 8.5 && vehicle.pricePerDay <= avgPrice) {
    badges.push({ type: 'EXCELLENT', label: 'Excellente offre' })
  }
  
  // LIMITED : si stock <= 2 véhicules disponibles de ce modèle
  if (vehicle.availableCount <= 2) badges.push({ type: 'LIMITED', label: 'Offre Limitée' })
  
  // FREE_CANCELLATION
  if (vehicle.cancellationPolicy === 'FREE_48H') {
    badges.push({ type: 'FREE_CANCELLATION', label: 'Annulation gratuite 48h' })
  }
  
  return badges
}
```

---

## 8. PAGE FAQ (liens depuis la page détail)

Créer `/faq` avec ces sections :
- Quels documents faut-il apporter ?
- Quel permis est accepté ? (international, CIN pour Marocains)
- Puis-je payer en espèces ? (non, carte obligatoire pour caution)
- Comment fonctionne la caution ?
- Que faire en cas d'accident ?
- Puis-je conduire hors du Maroc ?
- Annulation et remboursement

---

## 9. COMPOSANT "CARTE D'IDENTITÉ VÉHICULE" (specs techniques)

Afficher sous la photo dans la page détail :

┌──────────────────────────────────────┐

│ 🚗 MINI         🪪 Manuelle          │

│ 👥 5 places     ⛽ Essence            │

│ 🚪 4 portes     ❄️ Climatisation     │

│ 🛣️ Km illimité  ✅ CDW inclus         │

└──────────────────────────────────────┘


---

## 10. RÈGLES UX IMPORTANTES

- Prix toujours affiché en MAD (et EUR optionnel à côté)
- Ne jamais afficher le prix/jour en premier — toujours le TOTAL pour la période
- Ajouter "ou similaire" sous le nom du véhicule si category match (pas modèle exact garanti)
- Bouton "→" sur les cards → ouvre la page détail (pas directement le paiement)
- Sur mobile : cards en scroll vertical, filtres en scroll horizontal
- Image véhicule : fond blanc/gris très clair, vue 3/4 avant du véhicule
- Skeleton loader animé pendant le chargement des résultats
- Message si aucun résultat : "Aucun véhicule disponible pour ces dates — essayez des dates différentes"

---

## ORDRE D'IMPLÉMENTATION

1. Migrations Prisma (nouveaux champs + table Location)
2. Seed les 15 véhicules + 13 locations
3. SearchWidget (composant frontend)
4. API /vehicles/search avec filtres et calcul badges
5. Page résultats avec VehicleCard
6. Page détail véhicule avec toutes les sections
7. Génération PDF voucher
8. Page FAQ
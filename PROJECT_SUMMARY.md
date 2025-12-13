# Sandėlio Prekių Valdymas - Expo React Native App

## 📱 Projekto aprašymas

Profesionali mobilės programėlė sandėlio prekių valdymui su QR/Barcode skenavimo funkcionalumu, Firebase integracija ir moderniu UX dizainu.

---

## 🎯 Funkcionalumas

### 1. **Autentifikacija** (AuthScreen)

- Firebase Authentication
- Email/Password prisijungimas ir registracija
- Vartotojo vardas (displayName) saugomas ir rodomas visose skiltyse

### 2. **Prekių peržiūra** (ProductsScreen)

- Visos sandėlyje esančios prekės
- Statistika: prekių tipų ir vienetų kiekis
- Refresh-to-reload funkcionalumas
- Animuotos kortelės su fade-in efektu
- Filtravimas pagal produktą, datą, vartotoją

### 3. **Prekių pridėjimas** (AddScreen)

- QR/Barcode skenavimas kamera
- Automatinis kiekio didinimas jei prekė jau egzistuoja
- Naujų prekių pridėjimas su aprašymu
- Pulse animacija scan mygtukui
- Palaikomi kodai: QR, EAN-13, EAN-8, Code128, Code39

### 4. **Prekių išdavimas** (RemoveScreen)

- QR/Barcode skenavimas
- Kiekio pasirinkimas modal'e (+/- mygtukai)
- Automatinis perkėlimas į "Departed" kolekciją
- Prekės šalinimas jei kiekis = 0
- Pulse animacija scan mygtukui

### 5. **Išvykusios prekės** (DepartedScreen)

- Visos išduotos prekės
- Filtravimas: Visos / Siunčiamos / Pristatytos
- Spalvų sistema:
  - 🟨 Geltona - Siunčiamos (nepristatytos)
  - 🟩 Žalia - Pristatytos klientui
- Modal pristatymo patvirtinimui su komentarais
- Legend (spalvų reikšmių paaiškinimas)
- Animuotos kortelės

### 6. **Profilis** (ProfileScreen)

- Vartotojo informacija
- Atsijungimo mygtukas

---

## 🏗️ Technologijų stacks

### Frontend

- **React Native** (Expo)
- **TypeScript**
- **React Navigation** (Bottom Tabs)
- **Expo Camera** (QR/Barcode scanning)
- **Animated API** (animacijos)

### Backend

- **Firebase Authentication**
- **Cloud Firestore** (realtime database)
- **Context API** (būklės valdymas)

### Design

- **Custom SVG icons**
- **Professional UX** (8 mobilaus dizaino taisyklių)
- **WCAG AA/AAA** kontrastai
- **Žalia spalva** (#218838) - brand color

---

## 📂 Projekto struktūra

```
app/
├── components/
│   ├── AnimatedCard.tsx       # Fade-in + slide-up animacija
│   └── PulseButton.tsx        # Press + pulse animacija
├── constants/
│   └── firestore.ts           # Firebase collection names
├── context/
│   └── AuthContext.tsx        # Autentifikacijos Context API
├── navigation/
│   └── BottomTabs.tsx         # Bottom Tab navigacija (70px)
├── screens/
│   ├── WelcomeScreen.tsx      # Pradinis ekranas
│   ├── AuthScreen.tsx         # Prisijungimas/Registracija
│   ├── ProductsScreen.tsx     # Sandėlio prekės
│   ├── AddScreen.tsx          # Pridėti prekę (scan)
│   ├── RemoveScreen.tsx       # Išduoti prekę (scan)
│   ├── DepartedScreen.tsx     # Išvykusios prekės
│   └── ProfileScreen.tsx      # Vartotojo profilis
└── services/
    └── firebase.ts            # Firebase config
```

---

## 🎨 UX Dizainas

### 8 mobilaus dizaino taisyklės ✅

1. **Thumbs-Friendly Design** - Bottom navigation, large touch targets
2. **Simple Navigation** - 5 aiškios skilties, custom icons
3. **Animations & Transitions** - AnimatedCard, PulseButton
4. **Large Touch Targets** - ≥48px visur
5. **Clear Visual Hierarchy** - Header/Stats/Filters/Cards
6. **Readable Typography** - 28/20/16/14/13/11px sizes
7. **Sufficient Contrast** - WCAG AA/AAA standards
8. **Feedback on Interactions** - Alerts, animations, color changes

### Spalvų paletė

```
Primary Green:   #218838 (brand color)
Success Green:   #28A745 (delivered)
Warning Yellow:  #FFC107 (pending)
Danger Red:      #DC3545 (remove icon)
Text Dark:       #333    (main text)
Text Medium:     #666    (labels)
Text Light:      #999    (secondary)
Background:      #F5F5F5 (page bg)
Card:            #FFFFFF (cards)
```

---

## 🗄️ Firebase Collections

### `products`

```typescript
{
  code: string; // Barkodas/QR
  name: string; // Pavadinimas
  description: string; // Aprašymas
  quantity: number; // Kiekis
  createdAt: Timestamp; // Sukūrimo data
  createdBy: {
    uid: string;
    name: string;
  }
}
```

### `departed`

```typescript
{
  productRefId: string; // Reference į products
  code: string; // Produkto kodas
  name: string; // Produkto pavadinimas
  quantity: number; // Išduotas kiekis
  departedAt: Timestamp; // Išdavimo data
  departedBy: {
    uid: string;
    name: string;
  }
}
```

### `deliveries`

```typescript
{
  departedItemId: string; // Reference į departed
  productCode: string; // Produkto kodas
  productName: string; // Produkto pavadinimas
  quantity: number; // Pristatytas kiekis
  comments: string; // Komentarai
  deliveredAt: Timestamp; // Pristatymo data
  confirmedBy: {
    uid: string;
    name: string;
  }
}
```

---

## 🚀 Paleidimas

### 1. Dependencijų įdiegimas

```bash
cd react_work_4
npm install
```

### 2. Firebase konfigūracija

Sukurti `app/services/firebase.ts` su Firebase config:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 3. Paleidimas

```bash
npm start
```

Arba su specifine platforma:

```bash
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

### 4. QR Code scan

- Atsidaryti Expo Go app telefone
- Nuskenuoti QR kodą iš terminalo
- Arba paleisti Android/iOS emuliatoriuje

---

## 📱 Animacijos

### AnimatedCard

- **Fade-in**: 0 → 1 (500ms)
- **Slide-up**: translateY(30) → 0 (spring)
- **Staggered**: delay = index \* 50ms
- **Used in**: ProductsScreen, DepartedScreen

### PulseButton

- **Press scale**: 1 → 0.95 → 1 (spring)
- **Pulse loop**: 1 → 1.05 → 1 (1000ms)
- **Used in**: AddScreen, RemoveScreen

---

## 🔐 Firebase Rules

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document} {
      allow read, write: if request.auth != null;
    }
    match /departed/{document} {
      allow read, write: if request.auth != null;
    }
    match /deliveries/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📸 Screenshots Funkcionalumas

### Welcome Screen

- Minimalus dizainas
- "Pradėti" mygtukas

### Auth Screen

- Login / Register tabs
- Email + Password
- Display Name (registracija)

### Products Screen

- Header su statistika
- Animuotos cards
- Refresh-to-reload
- Empty state

### Add Screen

- Pulse animated button
- Camera view
- Form naujoms prekėms
- Success feedback

### Remove Screen

- Pulse animated button
- Camera view
- Quantity selector modal
- Success feedback

### Departed Screen

- 3 filtrai (Visos/Siunčiamos/Pristatytos)
- Color-coded badges
- Legend (spalvų reikšmės)
- Delivery confirmation modal
- Animuotos cards

### Profile Screen

- Vartotojo info
- Sign out button

---

## ✅ Reikalavimai (atlikta)

1. ✅ Firebase Authentication ir Firestore
2. ✅ Context API būklės valdymui
3. ✅ QR/Barcode skenavimas (expo-camera)
4. ✅ Navigation: Welcome → Auth → Bottom Tabs
5. ✅ Žalia spalva (#218838) dizaine
6. ✅ Profesionalus UX dizainas be komentarų
7. ✅ Pašalinti header'iai ir emoji
8. ✅ Didesni bottom tabs su custom iconais (70px)
9. ✅ "Kodas" → "Produktas"
10. ✅ Remove screen - kiekio pasirinkimas
11. ✅ Departed screen - pristatymo modal
12. ✅ WelcomeScreen be dekoracinių elementų
13. ✅ Spalvų sistema (geltona/žalia)
14. ✅ Vartotojo vardas visose skiltyse
15. ✅ Filtras Departed screen (3 kategorijos)
16. ✅ Pašalinti statistikos laukai iš Departed
17. ✅ Legend (spalvų reikšmės) Departed screen
18. ✅ **Animacijos** (AnimatedCard, PulseButton)
19. ✅ **8 UX taisyklės** pagal mobile design best practices

---

## 🎓 Technologijų panaudojimas

### Context API ✅

```typescript
// AuthContext.tsx
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // ... implementation
}
```

### Firebase Realtime ✅

```typescript
useEffect(() => {
  const unsub = onSnapshot(collection(db, PRODUCTS_COLLECTION), (snap) => {
    const data = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setProducts(data);
  });
  return unsub;
}, []);
```

### Animations ✅

```typescript
// AnimatedCard.tsx
const fadeAnim = useRef(new Animated.Value(0)).current;
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true,
}).start();
```

---

## 📄 License

MIT License - laisvas naudojimas

---

## 👨‍💻 Author

Sandėlio valdymo sistema sukurta pagal visus mobiliojo UX dizaino standartus ir best practices.

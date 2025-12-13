# Sandėlio Prekių Valdymo Sistema

React Native mobilė aplikacija sandėlio prekių valdymui su QR/brūkšninio kodo skenavimu, Firebase autentifikacija ir realtime duomenų baze.

## Technologijos

- React Native (Expo managed workflow)
- Firebase Authentication ir Firestore
- React Navigation (Stack ir Bottom Tabs)
- Expo Camera (QR/Barcode skenavimas)
- Context API (būklės valdymas)
- TypeScript

## Funkcionalumas

### Pagrindinės funkcijos

- Vartotojų autentifikacija (email/password)
- QR ir brūkšninio kodo skenavimas
- Realtime duomenų bazė su Firebase Firestore
- Prekių kiekių valdymas
- Išvykusių prekių sekimas ir filtravimas
- Pristatymo patvirtinimas
- Animacijos ir profesionalus dizainas

### Ekranai

1. Welcome - Pasveikinimo ekranas
2. Auth - Registracija ir prisijungimas
3. Produktai - Sandėlio prekių sąrašas su statistika
4. Pridėti - Naujų prekių pridėjimas per QR skenavimą
5. Išduoti - Prekių išdavimas su kiekio pasirinkimu
6. Išvykę - Išvykusių prekių sąrašas su filtru ir spalvų legenda
7. Profilis - Vartotojo informacija ir atsijungimas

## Projekto struktūra

```
react_work_4/
├── app/
│   ├── components/
│   │   ├── AnimatedCard.tsx
│   │   └── PulseButton.tsx
│   ├── constants/
│   │   └── firestore.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── navigation/
│   │   └── BottomTabs.tsx
│   ├── screens/
│   │   ├── AddScreen.tsx
│   │   ├── AuthScreen.tsx
│   │   ├── DepartedScreen.tsx
│   │   ├── ProductsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── RemoveScreen.tsx
│   │   └── WelcomeScreen.tsx
│   └── services/
│       └── firebase.ts
├── assets/
│   └── images/
│       └── icon.png
├── App.tsx
├── index.js
├── app.json
├── babel.config.js
├── metro.config.js
├── package.json
└── tsconfig.json
```

## Firebase duomenų struktūra

### Kolekcijos

**products** - Sandėlio prekės

```typescript
{
  id: string,
  code: string,
  name: string,
  description: string,
  createdAt: Timestamp,
  quantity: number,
  createdBy: { uid: string, name: string }
}
```

**departed** - Išvykusios prekės

```typescript
{
  id: string,
  productRefId: string,
  code: string,
  name: string,
  quantity: number,
  departedAt: Timestamp,
  departedBy: { uid: string, name: string }
}
```

**deliveries** - Pristatytos prekės

```typescript
{
  departedItemId: string,
  productCode: string,
  productName: string,
  quantity: number,
  comments: string,
  deliveredAt: Timestamp,
  confirmedBy: { uid: string, name: string }
}
```

## Instaliacija

### Reikalavimai

- Node.js v16 ar naujesnė versija
- npm arba yarn
- Expo CLI
- Android Studio arba Xcode (pasirenkama)
- Firebase projektas su Authentication ir Firestore

### Žingsniai

1. Klonuoti projektą

```bash
git clone https://github.com/your-username/react_native_4.git
cd react_work_4
```

2. Įdiegti priklausomybes

```bash
npm install
```

3. Sukonfigūruoti Firebase

Atnaujinkite `app/services/firebase.ts` su savo Firebase konfigūracija:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};
```

4. Paleisti projektą

```bash
npm start
```

arba

```bash
npx expo start
```

5. Pasirinkti platformą

- Paspauskite `a` Android emuliatoriui
- Paspauskite `i` iOS simuliatoriui
- Skenuokite QR kodą su Expo Go app telefone

## Naudojimo instrukcijos

### Registracija ir prisijungimas

1. Atidarykite aplikaciją
2. Paspauskite "Tęsti" pasveikinimo ekrane
3. Pasirinkite "Registruotis" naujam vartotojui
4. Įveskite vardą, el. paštą ir slaptažodį
5. Prisijunkite su sukurtais duomenimis

### Pridėti naują prekę

1. Eikite į "Pridėti" skiltį
2. Paspauskite "Aktyvuoti kamerą"
3. Nuskenuokite prekės QR arba brūkšninį kodą
4. Jei prekė nauja - užpildykite pavadinimą ir aprašymą
5. Jei prekė jau egzistuoja - kiekis automatiškai padidinamas vienetu

### Išduoti prekę

1. Eikite į "Išduoti" skiltį
2. Paspauskite "Aktyvuoti kamerą"
3. Nuskenuokite prekės kodą
4. Pasirinkite norimą kiekį išdavimui (naudokite + ir - mygtukus)
5. Patvirtinkite išdavimą

### Išvykusios prekės ir filtravimas

1. Eikite į "Išvykę" skiltį
2. Naudokite filtrus:
   - Visos - rodyti visas prekes
   - Siunčiamos - tik geltonos (nepristatytos)
   - Pristatytos - tik žalios (pristatytos)
3. Spalvų legenda rodoma ekrano viršuje:
   - Geltona - prekė siunčiama, dar nepristatyta
   - Žalia - prekė pristatyta klientui

### Patvirtinti pristatymą

1. "Išvykę" skiltyje paspauskite ant prekės kortelės
2. Atsiras modalinis langas su prekės informacija
3. Įveskite komentarus jei reikia (neprivaloma)
4. Paspauskite "Patvirtinti pristatymą"
5. Prekė automatiškai pasikeis iš geltonos į žalią spalvą

## Dizaino ypatybės

- Pagrindinė spalva: žalia (#218838)
- Fade in ir scale animacijos kortelėms
- Responsive dizainas visiems ekranų dydžiams
- Šešėliai ir rounded corners
- Profesionalus spacing ir typography
- UX taisyklės pagal mobile design standartus
- Bottom navigation su custom SVG ikonais (70px aukščio)

## Animacijos

### AnimatedCard komponentas

- Fade-in efektas (opacity 0 → 1)
- Slide-up animacija (translateY 30 → 0)
- Staggered animation su 50ms delay
- Spring physics animacija

### PulseButton komponentas

- Press scale efektas (1 → 0.95 → 1)
- Pulse loop animacija (1 → 1.05 → 1)
- Naudojamas "Aktyvuoti kamerą" mygtukuose

## Saugumas

- Firebase Authentication su email/password
- Tik prisijungę vartotojai gali valdyti prekes
- Kiekviena operacija saugo vartotojo UID ir vardą
- Realtime duomenų sinchronizacija tarp įrenginių
- Saugi duomenų bazės prieiga per Firebase Security Rules

## Naudingos komandos

```bash
npm start              # Paleisti development serverį
npm run android        # Paleisti Android emuliatoriuje
npm run ios            # Paleisti iOS simuliatoriuje
npx expo start -c      # Išvalyti cache ir paleisti
```

## Priklausomybės

Pagrindinės bibliotekos:

- expo v52
- react-navigation/native v6
- react-navigation/stack v6
- react-navigation/bottom-tabs v6
- firebase v9
- expo-camera
- react-native-safe-area-context
- react-native-screens

## Firebase Security Rules

Rekomenduojamos Firestore security rules:

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

## Licencija

MIT License

## Autorius

Jūsų Vardas

## Pastabos

- Projektas sukurtas akademiniams tikslams
- Firebase konfigūracija turi būti pakeista į savo
- Reikia sukurti Firebase projektą su Authentication ir Firestore
- Expo Go app reikalinga testavimui telefone
- Palaikomi barcode formatai: QR, EAN-13, EAN-8, Code128, Code39

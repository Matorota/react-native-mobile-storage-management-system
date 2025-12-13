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

## Naudingos komandos

```bash
npm start              # Paleisti development serverį
npm run android        # Paleisti Android emuliatoriuje
npm run ios            # Paleisti iOS simuliatoriuje
npx expo start -c      # Išvalyti cache ir paleisti
```

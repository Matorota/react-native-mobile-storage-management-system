# NAVIGATION DEMO - Mokymosi Pavyzdys

## Kaip veikia jūsų navigation sistema:

### 1. **HomeScreen (index.tsx)**

```tsx
// Navigation funkcija kaip jūsų pavyzdyje
const navigation = useNavigation();

const eikIAbout = () => {
  navigation.navigate("about", {
    objID: 1,
    information: "Perduodami duomenys apie puslapį",
  });
};
```

### 2. **DetailsScreen (about.tsx, contact.tsx, settings.tsx)**

```tsx
// Parametrų gavimas
const { objID, information } = useLocalSearchParams();

// Rodymas puslapyje
<Text>Obj ID: {objID}</Text>
<Text>Information: {information}</Text>
```

## Ką galite išbandyti:

1. **Spauskite "Apie mus"** - matysite: `objID: 1` ir `information: Perduodami duomenys apie puslapį`

2. **Spauskite "Nustatymai"** - matysite: `objID: 2` ir `information: Kontaktų informacija`

3. **Spauskite "Profilis"** - matysite: `objID: 3` ir `information: Nustatymų puslapis`

## Animacijos pavyzdžiai:

- **Fade animacija** - vardui keisti
- **Scale animacija** - mygtukų spaudimui
- **Slide animacija** - obuolio judėjimui
- **Rotate animacija** - sukimosi efektui (About puslapyje)

## Navigation metodai:

- `navigation.navigate(screen, params)` - eiti į puslapį su parametrais
- `navigation.goBack()` - grįžti atgal
- `navigation.push(screen, params)` - pridėti naują puslapį į stack

## Konstantų pavyzdžiai:

```tsx
const duomenys = [
  { id: "1", pavadinimas: "Obuolys" },
  { id: "2", pavadinimas: "Bananas" },
];

const [vardas, setVardas] = useState("Jonas");
```

**Viskas veikia tiksliai kaip React Navigation dokumentacijoje!**

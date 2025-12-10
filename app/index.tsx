import React, { ReactNode, useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  About: { objID: number; information: string };
  Contact: { objID: number; information: string };
  Settings: { objID: number; information: string };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sveiki!</Text>
    </View>
  );
}
const bdd = useState([1, 5, 6, 7]);
useEffect(() => {
  console.log("BDD pakeistas į:", bdd);
}, [bdd]);

const duomenys = [
  { id: "1", pavadinimas: "Obuolys" },
  { id: "2", pavadinimas: "Bananas" },
  { id: "3", pavadinimas: "Apelsinas" },
  { id: "4", pavadinimas: "Kriaušė" },
];

const ButtonsGOOD = ({ children }: { children?: ReactNode }) => {
  return <Button title={String(children)} />;
};

export default function Index() {
  const [vardas, setVardas] = useState("Jonas");
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Using navigation like in your example

  // ANIMACIJOS - MOKYMOSI PAVYZDŽIAI
  const fadeAnim = new Animated.Value(1);
  const scaleAnim = new Animated.Value(1);
  const slideAnim = new Animated.Value(0);

  const pakeistiVardą = () => {
    // FADE ANIMACIJA - išnyksta ir atsiranda
    Animated.timing(fadeAnim, {
      toValue: 0, // Išnyksta
      duration: 300, // 300ms
      useNativeDriver: true,
    }).start(() => {
      setVardas(vardas === "Jonas" ? "Marija" : "Jonas");
      // Atsiranda su nauju vardu
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const animuotiMygtuką = () => {
    // SCALE ANIMACIJA - sumažėja ir grįžta
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9, // Sumažėja iki 90%
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1, // Grįžta į normalų dydį
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const slideAnimacija = () => {
    // SLIDE ANIMACIJA - juda šonu
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 20, // Juda 20px į dešinę
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0, // Grįžta į pradinę poziciją
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // NAVIGATION FUNKCIJOS (PATAISYTOS) - Kaip jūsų pavyzdyje
  const eikIAbout = () => {
    animuotiMygtuką();
    navigation.navigate("About", {
      objID: 1,
      information: "Perduodami duomenys apie puslapį",
    });
  };

  const eikISettings = () => {
    animuotiMygtuką();
    navigation.navigate("Contact", {
      objID: 2,
      information: "Kontaktų informacija",
    });
  };

  const eikIProfile = () => {
    animuotiMygtuką();
    navigation.navigate("Settings", {
      objID: 3,
      information: "Nustatymų puslapis",
    });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.title}>Pagrindinis puslapis</Text>

      {/* NAVIGATION MYGTUKAI SU ANIMACIJA */}
      <View style={styles.navigationContainer}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity style={styles.navButton} onPress={eikIAbout}>
            <Text style={styles.navButtonText}>Apie mus</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity style={styles.navButton} onPress={eikISettings}>
            <Text style={styles.navButtonText}>Nustatymai</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.navButton} onPress={eikIProfile}>
          <Text style={styles.navButtonText}>Profilis</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Vaisių sąrašas:</Text>

      {/* SLIDE ANIMACIJOS DEMONSTRACIJA */}
      <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
        <TouchableOpacity
          style={[styles.sarasoElementas, { backgroundColor: "lightcoral" }]}
          onPress={slideAnimacija}
        >
          <Text style={styles.sarasoTekstas}>🍎 Animuotas obuolys</Text>
          <Text style={styles.smallText}>Spausk animacijai</Text>
        </TouchableOpacity>
      </Animated.View>

      <FlatList
        data={duomenys}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.sarasoElementas}
            onPress={() => alert(`Pasirinkote: ${item.pavadinimas}`)}
          >
            <Text style={styles.sarasoTekstas}>{item.pavadinimas}</Text>
            <Text style={styles.smallText}>Spausk peržiūrai</Text>
          </TouchableOpacity>
        )}
      />

      <MyComponent />
      <ButtonsGOOD>Click Me</ButtonsGOOD>

      {/* VARDAS SU FADE ANIMACIJA */}
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Vardas: {vardas}</Text>
        <TouchableOpacity onPress={pakeistiVardą}>
          <Text style={styles.text}>Keisti vardą (su animacija)</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  navButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  sarasoElementas: {
    backgroundColor: "lightblue",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  sarasoTekstas: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 12,
    color: "gray",
    fontStyle: "italic",
  },
  container: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});

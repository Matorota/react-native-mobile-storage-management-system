import { ReactNode, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sveiki!</Text>
    </View>
  );
}

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
  const [vardas, setVardas] = useState("Jonas"); // DEFAULT BUS JONAS

  const pakeistiVardą = () => {
    setVardas(vardas === "Jonas" ? "Marija" : "Jonas");
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.title}>Vaisių sąrašas:</Text>

      <FlatList
        data={duomenys}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.sarasoElementas}>
            <Text style={styles.sarasoTekstas}>{item.pavadinimas}</Text>
          </View>
        )}
      />

      <MyComponent />
      <ButtonsGOOD>Click Me</ButtonsGOOD>

      {/* VARDAS */}
      <View style={styles.container}>
        <Text style={styles.title}>Vardas: {vardas}</Text>
        <TouchableOpacity onPress={pakeistiVardą}>
          <Text>Keisti vardą</Text>
        </TouchableOpacity>
      </View>
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
  sarasoElementas: {
    backgroundColor: "lightblue",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  sarasoTekstas: {
    fontSize: 18,
    color: "black",
  },
  container: {
    backgroundColor: "blue",
    padding: 20,
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});

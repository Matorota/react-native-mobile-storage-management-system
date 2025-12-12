import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to Store Manager</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Auth")}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#218838",
  },
  button: { backgroundColor: "#218838", padding: 18, borderRadius: 8 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 20 },
});

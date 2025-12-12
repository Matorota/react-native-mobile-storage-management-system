import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Store Manager</Text>
        <Text style={styles.subtitle}>Sandėlio prekių valdymo sistema</Text>
        <Text style={styles.description}>
          Valdykite sandėlio prekes, skenuokite QR kodus ir stebėkite inventorių
          realiu laiku
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Auth")}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Pradėti darbą</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f9f4",
    padding: 32,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#218838",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#218838",
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 35,
    marginBottom: 20,
    shadowColor: "#218838",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    width: "100%",
    maxWidth: 320,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});

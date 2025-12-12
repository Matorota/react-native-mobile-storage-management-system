import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📦</Text>
        </View>
        <Text style={styles.title}>Store Manager</Text>
        <Text style={styles.subtitle}>Sandėlio prekių valdymas</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Auth")}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>Pradėti</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#218838",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#218838",
  },
  subtitle: {
    fontSize: 18,
    color: "#6c757d",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#218838",
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginBottom: 32,
    shadowColor: "#218838",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    width: "90%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});

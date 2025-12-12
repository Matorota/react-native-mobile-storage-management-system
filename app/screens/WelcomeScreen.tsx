import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.decorTop} />
      <View style={styles.decorBottom} />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconInner}>
            <View style={styles.boxIcon} />
          </View>
        </View>
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
    overflow: "hidden",
  },
  decorTop: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(33, 136, 56, 0.1)",
  },
  decorBottom: {
    position: "absolute",
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(33, 136, 56, 0.08)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#218838",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#218838",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  iconInner: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  boxIcon: {
    width: 50,
    height: 50,
    borderWidth: 4,
    borderColor: "#fff",
    borderRadius: 8,
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
    zIndex: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});

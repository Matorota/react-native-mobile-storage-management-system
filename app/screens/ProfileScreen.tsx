import { useAuth } from "../context/AuthContext";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

export default function ProfileScreen() {
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Atsijungti",
      "Ar tikrai norite atsijungti?",
      [
        {
          text: "Atšaukti",
          style: "cancel",
        },
        {
          text: "Atsijungti",
          onPress: async () => {
            await signOut(auth);
            setUser(null);
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>
            {user?.displayName?.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>
        <Text style={styles.title}>Profilis</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Vardas</Text>
            <Text style={styles.value}>{user?.displayName || "Nenurodytas"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>El. paštas</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Vartotojo ID</Text>
            <Text style={styles.valueSmall}>{user?.uid}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Atsijungti</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#218838",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  avatar: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#218838",
    marginBottom: 32,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    paddingVertical: 12,
  },
  label: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  valueSmall: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: "100%",
    shadowColor: "#dc3545",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});

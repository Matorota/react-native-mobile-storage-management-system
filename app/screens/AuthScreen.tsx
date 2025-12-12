import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../services/firebase";

export default function AuthScreen() {
  const { setUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setError("");
    try {
      if (isRegister) {
        if (!name.trim()) {
          setError("Prašome įvesti vardą");
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, { displayName: name });
        setUser(userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setUser(userCredential.user);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🔐</Text>
            </View>
            <Text style={styles.title}>
              {isRegister ? "Sukurti paskyrą" : "Prisijungti"}
            </Text>
            <Text style={styles.subtitle}>
              {isRegister
                ? "Užpildykite duomenis registracijai"
                : "Įveskite savo duomenis"}
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="El. paštas"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Slaptažodis"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {isRegister && (
              <TextInput
                style={styles.input}
                placeholder="Vardas ir pavardė"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />
            )}
            {!!error && (
              <View style={styles.errorContainer}>
                <Text style={styles.error}>{error}</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAuth}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {loading
                  ? "Palaukite..."
                  : isRegister
                    ? "Registruotis"
                    : "Prisijungti"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => {
                setIsRegister((v) => !v);
                setError("");
              }}
            >
              <Text style={styles.switchText}>
                {isRegister
                  ? "Jau turite paskyrą? Prisijunkite"
                  : "Neturite paskyros? Registruokitės"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#218838",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#212529",
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  input: {
    width: "100%",
    padding: 16,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: "#f8d7da",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  error: {
    color: "#721c24",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#218838",
    padding: 18,
    borderRadius: 12,
    marginTop: 8,
    width: "100%",
    shadowColor: "#218838",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  switchButton: {
    marginTop: 24,
    padding: 12,
  },
  switchText: {
    color: "#218838",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});

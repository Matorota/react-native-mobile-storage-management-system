import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { PRODUCTS_COLLECTION } from "../constants/firestore";
import { useAuth } from "../context/AuthContext";

export default function AddScreen() {
  const { user } = useAuth();
  const [scanned, setScanned] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setCode(data);
    setScanned(true);
    checkProduct(data);
  };

  const checkProduct = async (code: string) => {
    const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const found = snap.docs.find((doc) => doc.data().code === code);
    if (found) {
      const ref = doc(db, PRODUCTS_COLLECTION, found.id);
      await updateDoc(ref, { quantity: found.data().quantity + 1 });
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  };

  const handleAdd = async () => {
    await addDoc(collection(db, PRODUCTS_COLLECTION), {
      code,
      name,
      description,
      createdAt: Timestamp.now(),
      quantity,
      createdBy: { uid: user?.uid, name: user?.displayName },
    });
    setShowForm(false);
    setScanned(false);
    setCode("");
    setName("");
    setDescription("");
    setQuantity(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      {!scanned && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {scanned && showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Pavadinimas"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Aprašymas"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Kiekis"
            value={String(quantity)}
            onChangeText={(v) => setQuantity(Number(v))}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>Pridėti prekę</Text>
          </TouchableOpacity>
        </View>
      )}
      {scanned && !showForm && (
        <View style={styles.success}>
          <Text>Prekė atnaujinta!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  form: { width: "100%", padding: 24 },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#218838",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    width: "100%",
  },
  buttonText: { color: "white", fontWeight: "bold", textAlign: "center" },
  success: { padding: 24, backgroundColor: "#d4edda", borderRadius: 8 },
});

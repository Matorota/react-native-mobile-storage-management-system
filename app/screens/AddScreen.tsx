import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
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
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState("");

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setCode(data);
    setScanned(true);
    const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const found = snap.docs.find((doc) => doc.data().code === data);
    if (found) {
      const ref = doc(db, PRODUCTS_COLLECTION, found.id);
      const qty = found.data().quantity;
      await updateDoc(ref, { quantity: qty + 1 });
      setSuccess("Kiekis padidintas");
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
    setSuccess("Prekė pridėta");
    setShowForm(false);
    setTimeout(() => {
      setScanned(false);
      setSuccess("");
      setName("");
      setDescription("");
      setQuantity(1);
    }, 2000);
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!scanned && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "code128", "code39"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
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
            value={quantity.toString()}
            onChangeText={(v) => setQuantity(Number(v))}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>Pridėti</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#666" }]}
            onPress={() => {
              setScanned(false);
              setShowForm(false);
            }}
          >
            <Text style={styles.buttonText}>Atšaukti</Text>
          </TouchableOpacity>
        </View>
      )}
      {scanned && !showForm && !!success && (
        <View style={styles.success}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{success}</Text>
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

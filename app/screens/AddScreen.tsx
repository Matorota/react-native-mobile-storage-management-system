import { useState } from "react";
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
      setTimeout(() => {
        setScanned(false);
        setSuccess("");
      }, 2000);
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
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>📷</Text>
          <Text style={styles.permissionText}>Camera permission required</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
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
          <Text style={styles.formTitle}>Nauja prekė</Text>
          <TextInput
            style={styles.input}
            placeholder="Pavadinimas"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Aprašymas"
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Kiekis"
            placeholderTextColor="#999"
            value={quantity.toString()}
            onChangeText={(v) => setQuantity(Number(v) || 1)}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>✓ Pridėti</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              setScanned(false);
              setShowForm(false);
              setCode("");
            }}
          >
            <Text style={styles.buttonText}>✕ Atšaukti</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {scanned && !showForm && !!success && (
        <View style={styles.success}>
          <Text style={styles.successText}>✓ {success}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  permissionContainer: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 20,
  },
  permissionTitle: {
    fontSize: 64,
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    padding: 24,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#218838",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#218838",
    padding: 18,
    borderRadius: 12,
    marginTop: 8,
    width: "100%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cancelButton: {
    backgroundColor: "#666",
    marginTop: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  success: {
    padding: 32,
    backgroundColor: "#d4edda",
    borderRadius: 16,
    margin: 20,
    elevation: 5,
    position: "absolute",
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#218838",
    textAlign: "center",
  },
});

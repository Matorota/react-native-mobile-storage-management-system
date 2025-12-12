import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import {
  PRODUCTS_COLLECTION,
  DEPARTED_COLLECTION,
} from "../constants/firestore";

export default function RemoveScreen() {
  const { user } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState("");

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setCode(data);
    setScanned(true);
    const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const found = snap.docs.find((doc) => doc.data().code === data);
    if (found) {
      const ref = doc(db, PRODUCTS_COLLECTION, found.id);
      const qty = found.data().quantity;
      if (qty > 1) {
        await updateDoc(ref, { quantity: qty - 1 });
      } else {
        await deleteDoc(ref);
      }
      await addDoc(collection(db, DEPARTED_COLLECTION), {
        productRefId: found.id,
        code: found.data().code,
        name: found.data().name,
        quantity: 1,
        departedAt: Timestamp.now(),
        departedBy: { uid: user?.uid, name: user?.displayName },
      });
      setSuccess("Prekė ištrinta/išduota");
      setTimeout(() => {
        setScanned(false);
        setSuccess("");
      }, 2000);
    } else {
      setSuccess("Prekė nerasta");
      setTimeout(() => {
        setScanned(false);
        setSuccess("");
      }, 2000);
    }
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
      {scanned && (
        <View style={styles.success}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{success}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  success: { padding: 24, backgroundColor: "#f8d7da", borderRadius: 8 },
  button: {
    backgroundColor: "#218838",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: { color: "white", fontWeight: "bold", textAlign: "center" },
});

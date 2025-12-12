import { useAuth } from "../context/AuthContext";
import { useState } from "react";
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
import Animated, { FadeIn } from "react-native-reanimated";

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
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Prašome kameros leidimo...</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Nėra prieigos prie kameros</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Suteikti leidimą</Text>
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
      {scanned && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.success}>
          <Text style={styles.successText}>
            {success.includes("nerasta") ? "✕" : "✓"} {success}
          </Text>
        </Animated.View>
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
    padding: 32,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
  },
  permissionText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  success: {
    padding: 32,
    backgroundColor: "#d4edda",
    borderRadius: 16,
    margin: 20,
    elevation: 5,
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#218838",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#218838",
    padding: 18,
    borderRadius: 12,
    marginTop: 16,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import {
  PRODUCTS_COLLECTION,
  DEPARTED_COLLECTION,
} from "../constants/firestore";
import { useAuth } from "../context/AuthContext";

export default function RemoveScreen() {
  const { user } = useAuth();
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
        setSuccess("Kiekis sumažintas");
      } else {
        await deleteDoc(ref);
        setSuccess("Prekė ištrinta");
      }
      await addDoc(collection(db, DEPARTED_COLLECTION), {
        productRefId: found.id,
        code: found.data().code,
        name: found.data().name,
        quantity: 1,
        departedAt: Timestamp.now(),
        departedBy: { uid: user?.uid, name: user?.displayName },
      });
    } else {
      setSuccess("Prekė nerasta");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {!scanned && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {scanned && (
        <View style={styles.success}>
          <Text>{success}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  success: { padding: 24, backgroundColor: "#f8d7da", borderRadius: 8 },
});

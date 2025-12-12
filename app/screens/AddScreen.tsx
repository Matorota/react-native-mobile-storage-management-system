import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
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
  const [cameraActive, setCameraActive] = useState(false);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setCode(data);
    setScanned(true);

    try {
      const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
      const found = snap.docs.find((doc) => doc.data().code === data);

      if (found) {
        const ref = doc(db, PRODUCTS_COLLECTION, found.id);
        const qty = found.data().quantity;
        await updateDoc(ref, { quantity: qty + 1 });
        setSuccess("Kiekis padidintas!");
        Alert.alert(
          "Sėkmingai",
          `Prekė "${found.data().name}" - kiekis padidintas iki ${qty + 1}`
        );
        setTimeout(() => {
          setScanned(false);
          setSuccess("");
          setCameraActive(false);
        }, 2000);
      } else {
        setShowForm(true);
      }
    } catch (error) {
      Alert.alert("Klaida", "Nepavyko apdoroti prekės");
      setScanned(false);
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      Alert.alert("Klaida", "Įveskite pavadinimą");
      return;
    }

    try {
      await addDoc(collection(db, PRODUCTS_COLLECTION), {
        code,
        name,
        description,
        createdAt: Timestamp.now(),
        quantity,
        createdBy: { uid: user?.uid, name: user?.displayName },
      });
      setSuccess("Prekė pridėta!");
      Alert.alert("Sėkmingai", `Prekė "${name}" pridėta į sandėlį`);
      setShowForm(false);
      setTimeout(() => {
        setScanned(false);
        setSuccess("");
        setName("");
        setDescription("");
        setQuantity(1);
        setCameraActive(false);
      }, 2000);
    } catch (error) {
      Alert.alert("Klaida", "Nepavyko pridėti prekės");
    }
  };

  const startScanning = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (result.granted) {
        setCameraActive(true);
      } else {
        Alert.alert(
          "Leidimas atmestas",
          "Prašome suteikti leidimą naudoti kamerą nustatymuose"
        );
      }
    } else {
      setCameraActive(true);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.permissionText}>
          Requesting camera permission...
        </Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access</Text>
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
      {!cameraActive && !scanned && (
        <View style={styles.welcomeContainer}>
          <View style={styles.iconCircle}>
            <View style={styles.plusIcon}>
              <View style={styles.plusV} />
              <View style={styles.plusH} />
            </View>
          </View>
          <Text style={styles.welcomeTitle}>Pridėti prekę į sandėlį</Text>
          <Text style={styles.welcomeSubtitle}>
            Nuskenuokite prekės QR arba brūkšninį kodą {"\n"}
            Jei prekė jau yra sandėlyje, jos kiekis bus padidintas
          </Text>
          <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
            <Text style={styles.scanButtonText}>Aktyvuoti kamerą</Text>
          </TouchableOpacity>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Palaikomi kodai:</Text>
            <Text style={styles.infoText}>
              QR, EAN-13, EAN-8, Code128, Code39
            </Text>
          </View>
        </View>
      )}

      {cameraActive && !scanned && (
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
            <Text style={styles.buttonText}>Pridėti</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              setScanned(false);
              setShowForm(false);
              setCode("");
              setCameraActive(false);
            }}
          >
            <Text style={styles.buttonText}>Atšaukti</Text>
          </TouchableOpacity>
        </View>
      )}

      {scanned && !showForm && !!success && (
        <View style={styles.success}>
          <Text style={styles.successText}>{success}</Text>
          <TouchableOpacity
            style={[styles.button, { marginTop: 16 }]}
            onPress={() => {
              setScanned(false);
              setSuccess("");
              setCameraActive(false);
            }}
          >
            <Text style={styles.buttonText}>Grįžti</Text>
          </TouchableOpacity>
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
    backgroundColor: "#f8f9fa",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#218838",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#218838",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  plusIcon: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  plusV: {
    width: 4,
    height: 40,
    backgroundColor: "#fff",
    position: "absolute",
  },
  plusH: {
    width: 40,
    height: 4,
    backgroundColor: "#fff",
    position: "absolute",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#218838",
    marginBottom: 16,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 24,
  },
  scanButton: {
    backgroundColor: "#218838",
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 30,
    shadowColor: "#218838",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  infoBox: {
    marginTop: 40,
    backgroundColor: "#f0f9f4",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#218838",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 11,
    color: "#666",
  },
  permissionContainer: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 20,
  },
  permissionTitle: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
    color: "#218838",
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
    alignItems: "center",
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#218838",
    textAlign: "center",
  },
});

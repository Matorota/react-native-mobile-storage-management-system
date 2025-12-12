import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
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

interface FoundProduct {
  id: string;
  code: string;
  name: string;
  quantity: number;
}

export default function RemoveScreen() {
  const { user } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [foundProduct, setFoundProduct] = useState<FoundProduct | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setCode(data);
    setScanned(true);
    setCameraActive(false);

    try {
      const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
      const found = snap.docs.find((doc) => doc.data().code === data);

      if (found) {
        const productData = found.data();
        setFoundProduct({
          id: found.id,
          code: productData.code,
          name: productData.name,
          quantity: productData.quantity,
        });
        setSelectedQuantity(1);
        setShowQuantityModal(true);
      } else {
        Alert.alert("Klaida", "Prekė su tokiu kodu nerasta");
        setScanned(false);
      }
    } catch (error) {
      Alert.alert("Klaida", "Nepavyko apdoroti prekės");
      setScanned(false);
    }
  };

  const confirmRemoval = async () => {
    if (!foundProduct) return;

    try {
      const ref = doc(db, PRODUCTS_COLLECTION, foundProduct.id);
      const remainingQty = foundProduct.quantity - selectedQuantity;

      if (remainingQty > 0) {
        await updateDoc(ref, { quantity: remainingQty });
      } else {
        await deleteDoc(ref);
      }

      await addDoc(collection(db, DEPARTED_COLLECTION), {
        productRefId: foundProduct.id,
        code: foundProduct.code,
        name: foundProduct.name,
        quantity: selectedQuantity,
        departedAt: Timestamp.now(),
        departedBy: { uid: user?.uid, name: user?.displayName },
      });

      setShowQuantityModal(false);
      setSuccess(
        `Išduota ${selectedQuantity} vnt. prekės "${foundProduct.name}"`
      );
      Alert.alert(
        "Sėkmingai",
        `Išduota ${selectedQuantity} vnt. prekės "${foundProduct.name}"`
      );

      setTimeout(() => {
        setScanned(false);
        setSuccess("");
        setFoundProduct(null);
      }, 2000);
    } catch (error) {
      Alert.alert("Klaida", "Nepavyko išduoti prekės");
      setShowQuantityModal(false);
      setScanned(false);
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
            <View style={styles.minusIcon} />
          </View>
          <Text style={styles.welcomeTitle}>Išduoti prekę iš sandėlio</Text>
          <Text style={styles.welcomeSubtitle}>
            Nuskenuokite prekės kodą, kurią norite išduoti {"\n"}
            Prekės kiekis bus sumažintas arba ji bus perkelta į "Išvykę"
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

      {scanned && !!success && (
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

      <Modal
        visible={showQuantityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowQuantityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pasirinkite kiekį</Text>
            <Text style={styles.modalProductName}>{foundProduct?.name}</Text>
            <Text style={styles.modalProductInfo}>
              Kodas: {foundProduct?.code}
            </Text>
            <Text style={styles.modalAvailable}>
              Sandėlyje: {foundProduct?.quantity} vnt.
            </Text>

            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  setSelectedQuantity(Math.max(1, selectedQuantity - 1))
                }
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>

              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityNumber}>{selectedQuantity}</Text>
                <Text style={styles.quantityLabel}>vnt.</Text>
              </View>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  setSelectedQuantity(
                    Math.min(foundProduct?.quantity || 1, selectedQuantity + 1)
                  )
                }
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowQuantityModal(false);
                  setScanned(false);
                  setFoundProduct(null);
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Atšaukti</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmRemoval}
              >
                <Text style={styles.modalButtonText}>Išduoti</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: "#dc3545",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#dc3545",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  minusIcon: {
    width: 40,
    height: 4,
    backgroundColor: "#fff",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#218838",
    marginBottom: 16,
    textAlign: "center",
  },
  modalProductName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  modalProductInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    textAlign: "center",
  },
  modalAvailable: {
    fontSize: 14,
    color: "#218838",
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  quantityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#218838",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  quantityDisplay: {
    marginHorizontal: 32,
    alignItems: "center",
  },
  quantityNumber: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#218838",
  },
  quantityLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
  },
  modalButtonCancel: {
    backgroundColor: "#f0f0f0",
  },
  modalButtonConfirm: {
    backgroundColor: "#218838",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  modalButtonTextCancel: {
    color: "#666",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

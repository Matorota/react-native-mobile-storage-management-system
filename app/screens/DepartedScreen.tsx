import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onSnapshot, collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { DEPARTED_COLLECTION } from "../constants/firestore";
import { useAuth } from "../context/AuthContext";

interface Departed {
  id: string;
  productRefId: string;
  code: string;
  name: string;
  quantity: number;
  departedAt: any;
  departedBy: { uid: string; name: string };
}

export default function DepartedScreen() {
  const { user } = useAuth();
  const [departed, setDeparted] = useState<Departed[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [arrivedQuantity, setArrivedQuantity] = useState("");
  const [orderComments, setOrderComments] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, DEPARTED_COLLECTION), (snap) => {
      const data = snap.docs.map((doc) => {
        const docData = doc.data() as Departed;
        return { ...docData, id: doc.id };
      });
      setDeparted(
        data.sort((a, b) => b.departedAt?.seconds - a.departedAt?.seconds)
      );
    });
    return unsub;
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Nežinoma data";
    const date = timestamp.toDate?.();
    if (!date) return "Nežinoma data";
    return date.toLocaleDateString("lt-LT", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalDeparted = () => {
    return departed.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleOrderComplete = async () => {
    const quantity = parseInt(arrivedQuantity);

    if (!quantity || quantity <= 0) {
      Alert.alert("Klaida", "Prašome įvesti teisingą kiekį");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        arrivedQuantity: quantity,
        comments: orderComments.trim(),
        createdAt: Timestamp.now(),
        createdBy: {
          uid: user?.uid,
          name: user?.displayName,
        },
      });

      Alert.alert(
        "Sėkmingai",
        `Užsakymas patvirtintas! Atvyko ${quantity} vnt.`
      );
      setShowOrderModal(false);
      setArrivedQuantity("");
      setOrderComments("");
    } catch (error) {
      Alert.alert("Klaida", "Nepavyko sukurti užsakymo");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Išvykusios prekės</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{departed.length}</Text>
            <Text style={styles.statLabel}>Išdavimų</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{getTotalDeparted()}</Text>
            <Text style={styles.statLabel}>Vnt. išduota</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => setShowOrderModal(true)}
        >
          <Text style={styles.orderButtonText}>+ Užsakymas padarytas</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={departed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.code}>Kodas: {item.code}</Text>
              </View>
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityLabel}>Kiekis</Text>
                <Text style={styles.quantityText}>{item.quantity}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.footerItem}>
                <Text style={styles.footerLabel}>Išdavė:</Text>
                <Text style={styles.footerValue}>{item.departedBy?.name}</Text>
              </View>
              <View style={styles.footerItem}>
                <Text style={styles.footerLabel}>Data:</Text>
                <Text style={styles.footerValue}>
                  {formatDate(item.departedAt)}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>📦</Text>
            </View>
            <Text style={styles.emptyText}>Nėra išduotų prekių</Text>
            <Text style={styles.emptySubtext}>
              Išduotos prekės bus rodomos čia
            </Text>
          </View>
        }
      />

      <Modal
        visible={showOrderModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOrderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Užsakymas padarytas</Text>
            <Text style={styles.modalSubtitle}>
              Užpildykite informaciją apie gautą užsakymą
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kiekis atvyko (vnt.) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Pvz: 50"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={arrivedQuantity}
                onChangeText={setArrivedQuantity}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Komentarai (neprivaloma)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Papildoma informacija apie užsakymą..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={orderComments}
                onChangeText={setOrderComments}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowOrderModal(false);
                  setArrivedQuantity("");
                  setOrderComments("");
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Atšaukti</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleOrderComplete}
              >
                <Text style={styles.modalButtonText}>Patvirtinti</Text>
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
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#218838",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
    backgroundColor: "#fff3cd",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 6,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#856404",
  },
  statLabel: {
    fontSize: 12,
    color: "#856404",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  code: {
    fontSize: 13,
    color: "#666",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  quantityBadge: {
    backgroundColor: "#ffc107",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    minWidth: 70,
  },
  quantityLabel: {
    color: "#fff",
    fontSize: 10,
    marginBottom: 2,
    opacity: 0.9,
  },
  quantityText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 13,
    color: "#218838",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff3cd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  orderButton: {
    backgroundColor: "#218838",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
    elevation: 3,
    shadowColor: "#218838",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  orderButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
    width: "90%",
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
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
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

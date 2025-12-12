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
  delivered?: boolean;
}

interface Delivery {
  departedItemId: string;
  productCode: string;
  productName: string;
  quantity: number;
  comments: string;
  deliveredAt: any;
  confirmedBy: { uid: string; name: string };
}

export default function DepartedScreen() {
  const { user } = useAuth();
  const [departed, setDeparted] = useState<Departed[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Departed | null>(null);
  const [deliveryComments, setDeliveryComments] = useState("");

  useEffect(() => {
    const unsubDeparted = onSnapshot(
      collection(db, DEPARTED_COLLECTION),
      (snap) => {
        const data = snap.docs.map((doc) => {
          const docData = doc.data() as Departed;
          return { ...docData, id: doc.id };
        });
        setDeparted(
          data.sort((a, b) => b.departedAt?.seconds - a.departedAt?.seconds)
        );
      }
    );

    const unsubDeliveries = onSnapshot(collection(db, "deliveries"), (snap) => {
      const data = snap.docs.map((doc) => {
        const docData = doc.data() as Delivery;
        return { ...docData, id: doc.id };
      });
      setDeliveries(data);
    });

    return () => {
      unsubDeparted();
      unsubDeliveries();
    };
  }, []);

  const isDelivered = (departedItemId: string) => {
    return deliveries.some((d) => d.departedItemId === departedItemId);
  };

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

  const handleItemPress = (item: Departed) => {
    setSelectedItem(item);
    setShowDeliveryModal(true);
  };

  const handleDeliveryConfirm = async () => {
    if (!selectedItem) return;

    try {
      await addDoc(collection(db, "deliveries"), {
        departedItemId: selectedItem.id,
        productCode: selectedItem.code,
        productName: selectedItem.name,
        quantity: selectedItem.quantity,
        comments: deliveryComments.trim(),
        deliveredAt: Timestamp.now(),
        confirmedBy: {
          uid: user?.uid,
          name: user?.displayName,
        },
      });

      Alert.alert(
        "Sėkmingai",
        `Prekė "${selectedItem.name}" (${selectedItem.quantity} vnt.) pristatyta klientui`
      );
      setShowDeliveryModal(false);
      setSelectedItem(null);
      setDeliveryComments("");
    } catch (error) {
      Alert.alert("Klaida", "Nepavyko patvirtinti pristatymo");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Išvykusios prekės</Text>
          <View style={styles.userBadge}>
            <Text style={styles.userBadgeText}>
              {user?.displayName || "Vartotojas"}
            </Text>
          </View>
        </View>
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
      </View>

      <FlatList
        data={departed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const delivered = isDelivered(item.id);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.code}>Produktas: {item.code}</Text>
                </View>
                <View
                  style={[
                    styles.quantityBadge,
                    delivered && styles.quantityBadgeDelivered,
                  ]}
                >
                  <Text style={styles.quantityLabel}>
                    {delivered ? "Pristatyta" : "Kiekis"}
                  </Text>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                  <Text style={styles.footerLabel}>Išdavė:</Text>
                  <Text style={styles.footerValue}>
                    {item.departedBy?.name}
                  </Text>
                </View>
                <View style={styles.footerItem}>
                  <Text style={styles.footerLabel}>Data:</Text>
                  <Text style={styles.footerValue}>
                    {formatDate(item.departedAt)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
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
        visible={showDeliveryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDeliveryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pristatymas klientui</Text>
            <Text style={styles.modalSubtitle}>
              Patvirtinkite, kad prekė pristatyta klientui
            </Text>

            <View style={styles.productInfoBox}>
              <Text style={styles.productInfoLabel}>Prekė:</Text>
              <Text style={styles.productInfoValue}>{selectedItem?.name}</Text>
              <Text style={styles.productInfoLabel}>Kiekis:</Text>
              <Text style={styles.productInfoValue}>
                {selectedItem?.quantity} vnt.
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Komentarai (neprivaloma)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Papildoma informacija apie pristatymą..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={deliveryComments}
                onChangeText={setDeliveryComments}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowDeliveryModal(false);
                  setSelectedItem(null);
                  setDeliveryComments("");
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Atšaukti</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleDeliveryConfirm}
              >
                <Text style={styles.modalButtonText}>
                  Patvirtinti pristatymą
                </Text>
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#218838",
  },
  userBadge: {
    backgroundColor: "#218838",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  userBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
  quantityBadgeDelivered: {
    backgroundColor: "#28a745",
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
  productInfoBox: {
    backgroundColor: "#f0f9f4",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  productInfoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    marginTop: 8,
  },
  productInfoValue: {
    fontSize: 18,
    color: "#218838",
    fontWeight: "bold",
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

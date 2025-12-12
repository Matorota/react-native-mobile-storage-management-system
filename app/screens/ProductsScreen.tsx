import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import { PRODUCTS_COLLECTION } from "../constants/firestore";

interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  createdAt: any;
  quantity: number;
  createdBy: { uid: string; name: string };
}

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, PRODUCTS_COLLECTION), (snap) => {
      const data = snap.docs.map((doc) => {
        const docData = doc.data() as Product;
        return { ...docData, id: doc.id };
      });
      setProducts(data);
    });
    return unsub;
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sandėlio prekės</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#218838"]}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>{item.quantity}</Text>
              </View>
            </View>
            <Text style={styles.code}>Kodas: {item.code}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.createdBy}>
              Pridėjo: {item.createdBy?.name || "Nežinomas"}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Sandėlyje nėra prekių</Text>
            <Text style={styles.emptySubtext}>
              Naudokite "Add" ekraną, kad pridėtumėte naujų prekių
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#218838",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  quantityBadge: {
    backgroundColor: "#218838",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quantityText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  code: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  createdBy: {
    fontSize: 12,
    color: "#218838",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

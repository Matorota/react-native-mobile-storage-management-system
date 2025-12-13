import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import { PRODUCTS_COLLECTION } from "../constants/firestore";
import { useAuth } from "../context/AuthContext";
import AnimatedCard from "../components/AnimatedCard";

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
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, PRODUCTS_COLLECTION), (snap) => {
      const data = snap.docs.map((doc) => {
        const docData = doc.data() as Product;
        return { ...docData, id: doc.id };
      });
      setProducts(
        data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
      );
    });
    return unsub;
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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

  const getTotalItems = () => {
    return products.reduce((sum, product) => sum + product.quantity, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Sandėlio prekės</Text>
          <View style={styles.userBadge}>
            <Text style={styles.userBadgeText}>
              {user?.displayName || "Vartotojas"}
            </Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{products.length}</Text>
            <Text style={styles.statLabel}>Prekių tipų</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{getTotalItems()}</Text>
            <Text style={styles.statLabel}>Vnt. iš viso</Text>
          </View>
        </View>
      </View>

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
        renderItem={({ item, index }) => (
          <AnimatedCard delay={index * 50} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.code}>Produktas: {item.code}</Text>
              </View>
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityLabel}>Kiekis</Text>
                <Text style={styles.quantityText}>{item.quantity}</Text>
              </View>
            </View>

            {item.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>Aprašymas:</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            )}

            <View style={styles.cardFooter}>
              <View style={styles.footerItem}>
                <Text style={styles.footerLabel}>Pridėjo:</Text>
                <Text style={styles.footerValue}>
                  {item.createdBy?.name || "Nežinomas"}
                </Text>
              </View>
              <View style={styles.footerItem}>
                <Text style={styles.footerLabel}>Data:</Text>
                <Text style={styles.footerValue}>
                  {formatDate(item.createdAt)}
                </Text>
              </View>
            </View>
          </AnimatedCard>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>📦</Text>
            </View>
            <Text style={styles.emptyText}>Sandėlyje nėra prekių</Text>
            <Text style={styles.emptySubtext}>
              Naudokite "Pridėti" ekraną, kad pridėtumėte naujų prekių nuskanavę
              jų kodus
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
    backgroundColor: "#f0f9f4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 6,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#218838",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
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
    backgroundColor: "#218838",
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
  descriptionContainer: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  descriptionLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
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
    backgroundColor: "#f0f9f4",
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
    lineHeight: 20,
  },
});

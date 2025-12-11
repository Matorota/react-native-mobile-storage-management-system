import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { PRODUCTS_COLLECTION } from "../constants/firestore";

export default function ProductsScreen() {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, PRODUCTS_COLLECTION), (snap) => {
      setProducts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sandėlio prekės</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.code}>{item.code}</Text>
            <Text style={styles.qty}>Kiekis: {item.quantity}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "bold" },
  code: { fontSize: 14, color: "#555" },
  qty: { fontSize: 16, color: "#218838", fontWeight: "bold" },
});

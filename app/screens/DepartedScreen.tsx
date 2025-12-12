import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import { DEPARTED_COLLECTION } from "../constants/firestore";

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
  const [departed, setDeparted] = useState<Departed[]>([]);
  
  useEffect(() => {
    const unsub = onSnapshot(collection(db, DEPARTED_COLLECTION), (snap) => {
      setDeparted(
        snap.docs.map((doc) => {
          const data = doc.data() as Departed;
          return { ...data, id: doc.id };
        })
      );
    });
    return unsub;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Išvykusios prekės</Text>
      <FlatList
        data={departed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.code}>Kodas: {item.code}</Text>
            <Text style={styles.qty}>Kiekis: {item.quantity}</Text>
            <Text style={styles.date}>
              Išvykimo data: {item.departedAt?.toDate?.().toLocaleString?.()}
            </Text>
            <Text style={styles.by}>Išdavė: {item.departedBy?.name}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#218838",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  code: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  qty: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  by: {
    fontSize: 12,
    color: "#999",
  },
});

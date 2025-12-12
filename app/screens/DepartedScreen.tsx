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
            <Text style={styles.code}>{item.code}</Text>
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
  date: { fontSize: 14, color: "#555" },
  by: { fontSize: 14, color: "#218838" },
});

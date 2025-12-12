import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import { DEPARTED_COLLECTION } from "../constants/firestore";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

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
      <Animated.Text entering={FadeInUp.duration(600)} style={styles.title}>
        Išvykusios prekės
      </Animated.Text>
      <FlatList
        data={departed}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 100).duration(500)}
            style={styles.card}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.code}>Kodas: {item.code}</Text>
            <Text style={styles.qty}>Kiekis: {item.quantity}</Text>
            <Text style={styles.date}>
              Išvykimo data: {item.departedAt?.toDate?.().toLocaleString?.()}
            </Text>
            <Text style={styles.by}>Išdavė: {item.departedBy?.name}</Text>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
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
  name: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 4 },
  code: { fontSize: 14, color: "#666", marginBottom: 4 },
  qty: {
    fontSize: 16,
    color: "#218838",
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: { fontSize: 13, color: "#888", marginBottom: 4 },
  by: { fontSize: 14, color: "#218838", fontWeight: "600" },
});
  },
  name: { fontSize: 18, fontWeight: "bold" },
  code: { fontSize: 14, color: "#555" },
  qty: { fontSize: 16, color: "#218838", fontWeight: "bold" },
  date: { fontSize: 14, color: "#555" },
  by: { fontSize: 14, color: "#218838" },
});

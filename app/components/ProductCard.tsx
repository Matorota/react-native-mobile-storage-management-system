import { View, Text, StyleSheet } from "react-native";
export default function ProductCard({
  name,
  code,
  quantity,
}: {
  name: string;
  code: string;
  quantity: number;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.code}>{code}</Text>
      <Text style={styles.qty}>Kiekis: {quantity}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
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

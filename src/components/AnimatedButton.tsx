import { TouchableOpacity, Text, Animated, StyleSheet } from "react-native";
import { useRef } from "react";

export default function AnimatedButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => onPress());
  };
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#218838",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  text: { color: "white", fontWeight: "bold", textAlign: "center" },
});

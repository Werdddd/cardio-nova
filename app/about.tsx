import { View, Text, StyleSheet } from "react-native";
import BottomNavBar from "../components/BottomNavBar";

export default function About() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Screen</Text>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route

  return (
    <View style={styles.navbar}>
      {/* Vitals (Home) */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/home")}
      >
        <Ionicons
          name="heart"
          size={24}
          color={pathname === "/home" ? "#ff0000" : "#666"}
        />
        <Text style={[styles.navText, pathname === "/home" && styles.activeText]}>
          Vitals
        </Text>
      </TouchableOpacity>

      {/* Records */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/records")}
      >
        <Ionicons
          name="document-text"
          size={24}
          color={pathname === "/records" ? "#ff0000" : "#666"}
        />
        <Text style={[styles.navText, pathname === "/records" && styles.activeText]}>
          Records
        </Text>
      </TouchableOpacity>

      {/* About */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/about")}
      >
        <Ionicons
          name="information-circle"
          size={24}
          color={pathname === "/about" ? "#ff0000" : "#666"}
        />
        <Text style={[styles.navText, pathname === "/about" && styles.activeText]}>
          About
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingBottom: 20,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#666",
  },
  activeText: {
    color: "#ff0000",
    fontWeight: "bold",
  },
});

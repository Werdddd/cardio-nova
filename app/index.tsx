import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/cardioNova-logo.png')} style={styles.logo} />
      <Text style={styles.title}>CARDIO-NOVA</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => {
          try {
            router.push("/home");
          } catch (error) {
            console.error("Navigation Error:", error);
          }
        }}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 250,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#ff0000',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
    width: 280,
    height: 280,
    marginBottom: 30,
    marginTop:30,
  },
});

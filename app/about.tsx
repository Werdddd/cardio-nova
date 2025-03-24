import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import BottomNavBar from "../components/BottomNavBar";

export default function About() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require("../assets/images/cardio-banner.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>About</Text>
        <Text style={styles.paragraph}>
          Cardio-Nova is an innovative health-monitoring device designed to track
          vital signs in real time, providing users with continuous insights into
          their cardiovascular health. Utilizing an ESP8266 microcontroller, a
          pulse/heart rate sensor, and a thermistor temperature sensor, the device
          accurately measures heart rate and body temperature. The collected data
          is transmitted wirelessly to a mobile application, developed using React
          Native and Firebase Realtime Database, where users can monitor their
          vitals, record values, and review past readings. Housed in a custom
          3D-printed casing with an adjustable strap, Cardio-Nova is designed for
          both comfort and efficiency. By integrating IoT and mobile technology,
          the device aims to enhance personal health monitoring, offering a
          convenient and accessible solution for users seeking proactive
          cardiovascular care.
        </Text>
      </ScrollView>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingBottom: 60,
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 0,
    marginBottom: 40,
  },
  paragraph: {
    fontSize: 18,
    fontWeight: "400",
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'justify',
    paddingHorizontal: 40,
  },
  logo: {
    width: "80%",
    height: 35,
    marginBottom: 20,
    marginTop: 60,
  },
});

import { 
    View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, 
    KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard
  } from "react-native";
  import { useEffect, useState } from "react";
  import { ref, push, onValue } from "firebase/database";
  import { database } from "../firebaseConfig";
  import { Ionicons } from "@expo/vector-icons";
  import BottomNavBar from "../components/BottomNavBar";
  
  export default function Home() {
    const [vitals, setVitals] = useState({
      pulseRate: 0,
      bodyTemp: 0,
      oxygenLevel: 0,
    });
  
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
  
    useEffect(() => {
      const vitalsRef = ref(database, "vitals");
  
      const unsubscribe = onValue(vitalsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setVitals({
            pulseRate: data.pulseRate || 0,
            bodyTemp: data.bodyTemp || data.bodyTemperature || 0,
            oxygenLevel: data.oxygenLevel || 0,
          });
        }
      });
  
      return () => unsubscribe(); // Cleanup listener on unmount
    }, []);
  
    const saveVitals = () => {
      if (!name || !age) {
        alert("Please enter name and age.");
        return;
      }
  
      const newRecord = {
        name,
        age,
        pulseRate: vitals.pulseRate,
        bodyTemp: vitals.bodyTemp,
        oxygenLevel: vitals.oxygenLevel,
        timeRecorded: new Date().toISOString(),
      };
  
      push(ref(database, "records"), newRecord)
        .then(() => {
          alert("Vitals saved successfully!");
          setModalVisible(false);
          setName("");
          setAge("");
        })
        .catch((error) => alert("Error saving vitals: " + error.message));
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Vitals</Text>
  
        {/* Vitals Cards */}
        <View style={styles.cardContainer}>
          <View style={styles.row}>
            <View style={[styles.card, styles.pulseRateCard]}>
              <Ionicons name="heart" size={30} color="#ff4757" />
              <Text style={styles.cardTitle}>Pulse Rate</Text>
              <Text style={styles.cardValue}>{vitals.pulseRate} BPM</Text>
            </View>
  
            <View style={[styles.card, styles.bodyTempCard]}>
              <Ionicons name="thermometer" size={30} color="#ffa502" />
              <Text style={styles.cardTitle}>Body Temperature</Text>
              <Text style={styles.cardValue}>{vitals.bodyTemp}°C</Text>
            </View>
          </View>
  
          <View style={styles.centeredRow}>
            <View style={[styles.card, styles.oxygenLevelCard]}>
              <Ionicons name="pulse" size={30} color="#1e90ff" />
              <Text style={styles.cardTitle}>Oxygen Level</Text>
              <Text style={styles.cardValue}>{vitals.oxygenLevel}%</Text>
            </View>
          </View>
        </View>
  
        {/* Record Vitals Button */}
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Record Vitals</Text>
        </TouchableOpacity>
  
        {/* Modal */}
        <Modal visible={modalVisible} animationType="fade" transparent={true}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalContainer}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContent}>
                    {/* Close Icon at Top-Right */}
                        <TouchableOpacity
                        style={styles.closeIcon}
                        onPress={() => setModalVisible(false)}
                        >
                        <Ionicons name="close-outline" size={28} color="#ff4757" />
                        </TouchableOpacity>
                    <Text style={styles.modalTitle}>Record Vitals</Text>

                    <TextInput
                    style={styles.input}
                    placeholder="Enter Name"
                    value={name}
                    onChangeText={setName}
                    />
                    <TextInput
                    style={styles.input}
                    placeholder="Enter Age"
                    value={age}
                    keyboardType="numeric"
                    onChangeText={setAge}
                    />

                    <Text style={styles.modalVitals}>Pulse Rate: {vitals.pulseRate} BPM</Text>
                    <Text style={styles.modalVitals}>Body Temperature: {vitals.bodyTemp}°C</Text>
                    <Text style={styles.modalVitals}>Oxygen Level: {vitals.oxygenLevel}%</Text>

                    <TouchableOpacity style={styles.saveButton} onPress={saveVitals}>
                    <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>

                    
                </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            </Modal>

  
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
    title: {
      fontSize: 26,
      fontWeight: "bold",
      marginTop: 60,
      marginBottom: 40,
    },
    cardContainer: {
      width: "90%",
      justifyContent: "center",
    
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    centeredRow: {
      alignItems: "center",
      marginTop: 15,
    },
    card: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      width: "48%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      alignItems: "center",
      textAlign: "center",
      height: 140,
    },
    pulseRateCard: {
      borderBottomWidth: 5,
      borderBottomColor: "#ff4757",
    },
    bodyTempCard: {
      borderBottomWidth: 5,
      borderBottomColor: "#ffa502",
    },
    oxygenLevelCard: {
      width: "48%",
      borderBottomWidth: 5,
      borderBottomColor: "#1e90ff",
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 5,
      textAlign: "center",
    },
    cardValue: {
      fontSize: 22,
      fontWeight: "400",
      color: "#333",
    },
    button: {
      backgroundColor: "#1e90ff",
      padding: 15,
      borderRadius: 8,
      marginTop: 30,
      width: "90%",
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "600",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingHorizontal: 20, // Ensures no side clipping
      },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "#fff",
      width: "80%",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
    },
    input: {
      width: "100%",
      padding: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      marginBottom: 10,
      fontSize: 16,
    },
    modalVitals: {
      fontSize: 18,
      fontWeight: "500",
      marginTop: 10,
    },
    saveButton: {
      backgroundColor: "#28a745",
      padding: 12,
      borderRadius: 8,
      width: "100%",
      alignItems: "center",
      marginTop: 15,
    },
    closeButton: {
      marginTop: 20,
    },
    closeButtonText: {
      color: "#ff4757",
      fontSize: 16,
      fontWeight: "600",
    },
    closeIcon: {
        position: "absolute",
        top: 18,
        right: 14,
        zIndex: 10,
      },
      
  });
  
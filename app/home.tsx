import { 
    View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, 
    KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Image
  } from "react-native";
  import { useEffect, useState } from "react";
  import { ref, push, onValue } from "firebase/database";
  import { database } from "../firebaseConfig";
  import { Ionicons } from "@expo/vector-icons";
  import BottomNavBar from "../components/BottomNavBar";
  import { LineChart } from "react-native-chart-kit";
  import { Dimensions } from "react-native";

  
  export default function Home() {
    const [vitals, setVitals] = useState({
      pulseRate: 0,
      bodyTemp: 0,
      
    });
  
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [pulseHistory, setPulseHistory] = useState<number[]>([0]);
    const [tempHistory, setTempHistory] = useState<number[]>([0]);
    

    
    useEffect(() => {
      const vitalsRef = ref(database, "vitals");
    
      const unsubscribe = onValue(vitalsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setVitals({
            pulseRate: parseFloat((data.pulseRate || 0).toFixed(2)), 
            bodyTemp: parseFloat((data.bodyTemp || data.bodyTemperature || 0).toFixed(2)),
          });
    
          // Append new data to the history arrays, ensuring numbers
          setPulseHistory((prev) => [...prev.slice(-9), parseFloat((data.pulseRate || 0).toFixed(2))]);
          setTempHistory((prev) => [...prev.slice(-9), parseFloat((data.bodyTemp || 0).toFixed(2))]);
        }
      });
    
      return () => unsubscribe();
    }, []);
    
  
    const saveVitals = () => {
      if (!name || !age) {
        alert("Please enter name and age.");
        return;
      }
  
      const newRecord = {
        name,
        age,
        pulseRate: Number(vitals.pulseRate), // Ensures it's a number
        bodyTemp: Number(vitals.bodyTemp),   // Ensures it's a number
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

    const getHealthLevel = () => {
        const { pulseRate, bodyTemp } = vitals;
      
        if (
          (pulseRate >= 60 && pulseRate <= 100) &&
          (bodyTemp >= 36.1 && bodyTemp <= 37.2)
        ) {
          return { level: "Healthy", color: "#28a745" }; // Green
        } else if (
          (pulseRate >= 50 && pulseRate < 60) || (pulseRate > 100 && pulseRate <= 120) ||
          (bodyTemp >= 37.3 && bodyTemp <= 38) || (bodyTemp >= 35 && bodyTemp < 36)
        ) {
          return { level: "Caution", color: "#ffa502" }; // Yellow
        } else {
          return { level: "Critical", color: "#ff4757" }; // Red
        }
      };
  
    return (
      <View style={styles.container}>
        
        <Image source={require('../assets/images/cardio-banner.png')} style={styles.logo} />
        <Text style={styles.title}>Vitals</Text>
  
        {/* Vitals Cards */}
        <View style={styles.cardContainer}>
          <View style={styles.row}>
            <View style={[styles.card, styles.pulseRateCard]}>
              <Ionicons name="heart" size={30} color="#ff4757" />
              <Text style={styles.cardTitle}>Pulse Rate</Text>
              <Text style={styles.cardValue}>{vitals.pulseRate.toFixed(2)} BPM</Text>
            </View>
  
            <View style={[styles.card, styles.pulseRateCard]}>
                
                <Text style={styles.chartTitle}>Pulse Graph</Text>
                <View style={styles.chartContainer}>
                    <LineChart
                        data={{
                            labels: pulseHistory.map((_, i) => (i + 1).toString()),
                            datasets: [{ data: pulseHistory.length ? pulseHistory : [0] }],

                        }}
                        width={Dimensions.get("window").width * 0.42} // Ensuring dynamic width
                        height={120} // Slightly increasing height for better visibility
                        chartConfig={{
                            backgroundColor: "#fff",
                            backgroundGradientFrom: "#fff",
                            backgroundGradientTo: "#fff",
                            color: (opacity = 1) => `rgba(255, 71, 87, ${opacity})`,
                            strokeWidth: 2,
                        }}
                        bezier
                        style={styles.chartStyle}
                    />
                </View>
            </View>
          </View>
  
          <View style={styles.row}>
            <View style={[styles.card, styles.bodyTempCard]}>
              <Ionicons name="thermometer" size={30} color="#ffa502" />
              <Text style={styles.cardTitle}>Body Temperature</Text>
              <Text style={styles.cardValue}>{vitals.bodyTemp.toFixed(2)}°C</Text>
            </View>

            <View style={[styles.card, styles.bodyTempCard]}>
                
                <Text style={styles.chartTitle}>Temperature Graph</Text>
                <View style={styles.chartContainer}>
                    <LineChart
                        data={{
                            labels: tempHistory.map((_, i) => (i + 1).toString()),
                            datasets: [{ data: tempHistory.length ? tempHistory : [0] }],

                        }}
                        width={Dimensions.get("window").width * 0.42}
                        height={120}
                        chartConfig={{
                            backgroundColor: "#fff",
                            backgroundGradientFrom: "#fff",
                            backgroundGradientTo: "#fff",
                            color: (opacity = 1) => `rgba(255, 165, 2, ${opacity})`,
                            strokeWidth: 2,
                        }}
                        bezier
                        style={styles.chartStyle}
                    />
                </View>
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
                    <Text style={[styles.healthLevel, { color: getHealthLevel().color }]}>
                        Overall Health: {getHealthLevel().level}
                    </Text>


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
      marginTop: 0,
      marginBottom: 40,
    },
    cardContainer: {
      width: "90%",
      justifyContent: "center",
    
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    centeredRow: {
      alignItems: "center",
      marginTop: 15,
    },
    logo: {
        width: "80%",
        height: 35,
        marginBottom: 20,
        marginTop:60,
      },
      card: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal: 5,
        width: Dimensions.get("window").width * 0.45, // Ensuring proper width
    },
    pulseRateCard: {
      borderBottomWidth: 5,
      borderBottomColor: "#ff4757",
    },
    bodyTempCard: {
      borderBottomWidth: 5,
      borderBottomColor: "#ffa502",
    },
    healthLevel: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
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
      backgroundColor: "#ff0000",
      padding: 15,
      borderRadius: 8,
      marginTop: 25,
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
    chartContainer: {
        width: "100%",
        alignItems: "center",
        overflow: "hidden", // Prevents the graph from overflowing
    },
    chartStyle: {
        marginVertical: 8,
        borderRadius: 10,
        paddingRight: 5, // Prevents cropping of labels
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 5,
        marginTop:10,
        textAlign: "center",
      },
  });
  
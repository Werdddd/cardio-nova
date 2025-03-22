import { View, Text, FlatList, StyleSheet } from "react-native";
import { ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import BottomNavBar from "../components/BottomNavBar";

// Define Type for Records
type RecordType = {
  id: string;
  name: string;
  age: string;
  pulseRate: number;
  bodyTemp: number;
  oxygenLevel: number;
  timeRecorded: string;
};

export default function Records() {
  const [records, setRecords] = useState<RecordType[]>([]);

  useEffect(() => {
    const recordsRef = ref(database, "records");

    onValue(recordsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const recordsArray: RecordType[] = Object.entries(data).map(([id, value]) => {
          const record = value as RecordType;
          return record.id ? record : { ...record, id }; // Assign id only if it doesn't exist
        });
        setRecords(recordsArray.reverse()); // Show newest first
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vitals Records</Text>

      {/* FlatList now handles scrolling, no need for ScrollView */}
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordCard}>
            <Text style={styles.recordText}>
              <Text style={styles.label}>Name:</Text> {item.name}
            </Text>
            <Text style={styles.recordText}>
              <Text style={styles.label}>Age:</Text> {item.age}
            </Text>
            <Text style={styles.recordText}>
              <Text style={styles.label}>Pulse Rate:</Text> {item.pulseRate} BPM
            </Text>
            <Text style={styles.recordText}>
              <Text style={styles.label}>Body Temp:</Text> {item.bodyTemp}°C
            </Text>
            <Text style={styles.recordText}>
              <Text style={styles.label}>Oxygen Level:</Text> {item.oxygenLevel}%
            </Text>
            <Text style={styles.recordTime}>
              <Text style={styles.label}>Recorded:</Text>{" "}
              {new Date(item.timeRecorded).toLocaleString()}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.list} // Added padding for better spacing
        showsVerticalScrollIndicator={false}
      />

      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 30,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 80, // Ensures space for the BottomNavBar
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
    marginTop: 30,
  },
  recordCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  recordText: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#444",
  },
  recordTime: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});

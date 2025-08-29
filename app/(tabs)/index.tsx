import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Linking } from "react-native";

export default function App() {
  const [houseNo, setHouseNo] = useState("");
  const [result, setResult] = useState("");
  const [data, setData] = useState<{ [key: string]: { name: string; tel: string } }>({});

  // โหลดข้อมูลจาก Google Sheet API
  useEffect(() => {
    fetch("https://sheetdb.io/api/v1/um08mh5phjlbw") // URL API ของ SheetDB
      .then(res => res.json())
      .then(json => {
        const obj: any = {};
        json.forEach((item: any) => {
          obj[item.บ้านเลขที่] = { name: item.ชื่อผู้ดูแล, tel: item.เบอร์โทร };
        });
        setData(obj);
      });
  }, []);

  const searchHouse = () => {
    if (data[houseNo]) {
      setResult(`${data[houseNo].name}\n${data[houseNo].tel}`);
    } else {
      setResult("ไม่พบข้อมูลบ้านเลขที่นี้");
    }
  };

  const callNumber = (tel: string) => {
    Linking.openURL(`tel:${tel}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ค้นหาผู้ดูแล (อสม.)</Text>
      <TextInput
        style={styles.input}
        placeholder="กรอกบ้านเลขที่"
        value={houseNo}
        onChangeText={setHouseNo}
      />
      <Button title="ค้นหา" onPress={searchHouse} />

      {result ? (
        <TouchableOpacity onPress={() => callNumber(result.split("\n")[1])}>
          <Text style={styles.result}>{result} (แตะเพื่อโทร)</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#ffffff" },
  header: { fontSize: 20, marginBottom: 20, color: "#000000" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, width: "80%", color: "#000000" },
  result: { marginTop: 20, fontSize: 16, color: "#0000ff", textDecorationLine: "underline" }, // สีน้ำเงิน + ขีดเส้นใต้
});

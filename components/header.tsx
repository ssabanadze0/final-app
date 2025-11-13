import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

function SearchBar({ onSubmit }: { onSubmit?: (q: string) => void }) {
  const [q, setQ] = useState("");

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search FakeStore"
          placeholderTextColor="#888"
          returnKeyType="search"
          onSubmitEditing={() => onSubmit?.(q.trim())}
          style={styles.input}
        />
        <Pressable
          onPress={() => onSubmit?.(q.trim())}
          accessibilityRole="button"
          accessibilityLabel="Search"
          style={styles.searchBtn}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingTop: 40,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    zIndex: 10,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  searchBtn: {
    paddingLeft: 8,
    paddingVertical: 4,
  },
  searchIcon: {
    fontSize: 18,
  },
});

export default SearchBar;

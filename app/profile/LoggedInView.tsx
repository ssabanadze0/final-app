import { useAuth } from "@/store/authContext";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

export default function LoggedInView() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Text style={styles.label}>Username</Text>
      <Text style={styles.value}>{user.username}</Text>

      <Text style={styles.label}>Name</Text>
      <Text style={styles.value}>
        {user.name.firstname} {user.name.lastname}
      </Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{user.email}</Text>

      <Text style={styles.label}>Phone</Text>
      <Text style={styles.value}>{user.phone}</Text>

      <Text style={styles.label}>Address</Text>
      <Text style={styles.value}>
        {user.address.street} {user.address.number}, {user.address.city}{" "}
        {user.address.zipcode}
      </Text>

      <Pressable style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    marginBottom: 8,
  },
  logoutBtn: {
    marginTop: 24,
    backgroundColor: "#eee",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#000",
    fontWeight: "600",
  },
});

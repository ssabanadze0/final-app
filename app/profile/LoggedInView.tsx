import { useAuth } from "@/store/authContext";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function LoggedInView() {
  const { user, logout, avatar, setAvatar } = useAuth();

  if (!user) return null;

  async function handlePickAvatar() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need access to your photos to change profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const uri = result.assets[0]?.uri;
    if (!uri) return;

    await setAvatar(uri);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Avatar + button */}
      <View style={styles.avatarSection}>
        <Pressable onPress={handlePickAvatar}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {user.name.firstname.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable style={styles.changePhotoBtn} onPress={handlePickAvatar}>
          <Text style={styles.changePhotoText}>Change photo</Text>
        </Pressable>
      </View>

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
  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: "700",
    color: "#555",
  },
  changePhotoBtn: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#000",
  },
  changePhotoText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
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

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function Footer() {
  return (
    <View style={styles.footer}>
      <NavItem
        label="Home"
        icon={<Ionicons name="home-outline" size={22} color="#fff" />}
        onPress={() => router.push("/")}
      />
      <NavItem
        label="Categories"
        icon={<Ionicons name="grid-outline" size={22} color="#fff" />}
      />
      <NavItem
        label="Cart"
        icon={<Ionicons name="cart-outline" size={22} color="#fff" />}
      />
      <NavItem
        label="Profile"
        icon={<Ionicons name="person-outline" size={22} color="#fff" />}
      />
    </View>
  );
}

function NavItem({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
}) {
  const renderIcon =
    typeof icon === "string" ? (
      <Text style={styles.iconText}>{icon}</Text>
    ) : (
      icon
    );

  return (
    <Pressable onPress={onPress} style={styles.item}>
      {renderIcon}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 12,
  },
  item: {
    alignItems: "center",
  },
  iconText: {
    fontSize: 22,
    color: "#fff",
    lineHeight: 22,
  },
  label: {
    fontSize: 12,
    color: "#fff",
    marginTop: 2,
  },
});

export default Footer;

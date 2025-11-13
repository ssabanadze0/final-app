import { useCart } from "@/store/cartcpntexst";
import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function Footer() {
  const router = useRouter();
  const { totalItems } = useCart();

  return (
    <View style={styles.footer}>
      <NavItem
        label="Home"
        icon={<Ionicons name="home-outline" size={22} color="#fff" />}
        onPress={() => router.push("/")}
      />

      <NavItem
        label="Cart"
        icon={
          <View style={{ position: "relative" }}>
            <Ionicons name="cart-outline" size={22} color="#fff" />
            {totalItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItems}</Text>
              </View>
            )}
          </View>
        }
        onPress={() => router.push("/cart")}
      />

      <NavItem
        label="Profile"
        icon={<Ionicons name="person-outline" size={22} color="#fff" />}
        onPress={() => router.push("/profile/profile")}
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
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  item: { alignItems: "center" },
  iconText: { fontSize: 22, color: "#fff", lineHeight: 22 },
  label: { fontSize: 12, color: "#fff", marginTop: 2 },
});

export default Footer;

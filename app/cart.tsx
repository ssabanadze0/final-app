import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCart } from "../store/cartcpntexst";

export default function Cart() {
  const { items, setQty, remove, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Your cart is empty 🛒</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Cart</Text>

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.info}>
              <Text numberOfLines={1} style={styles.title}>
                {item.title}
              </Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>

              <View style={styles.qtyRow}>
                <Pressable
                  style={styles.qtyBtn}
                  onPress={() => setQty(item.id, item.qty - 1)}
                >
                  <Text style={styles.qtyText}>−</Text>
                </Pressable>

                <Text style={styles.qty}>{item.qty}</Text>

                <Pressable
                  style={styles.qtyBtn}
                  onPress={() => setQty(item.id, item.qty + 1)}
                >
                  <Text style={styles.qtyText}>＋</Text>
                </Pressable>

                <Pressable onPress={() => remove(item.id)}>
                  <Text style={styles.remove}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.summary}>
        <View style={styles.row}>
          <Text style={styles.subLabel}>Subtotal</Text>
          <Text style={styles.subValue}>${subtotal.toFixed(2)}</Text>
        </View>

        <Pressable style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Check Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 100,
  },
  item: {
    flexDirection: "row",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    paddingBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  price: {
    fontSize: 14,
    marginVertical: 4,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { fontSize: 18, fontWeight: "600" },
  qty: { minWidth: 20, textAlign: "center", fontWeight: "600" },
  remove: { color: "#d00", fontSize: 12, marginLeft: 8 },
  summary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fafafa",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  subLabel: { fontSize: 16, fontWeight: "600" },
  subValue: { fontSize: 16, fontWeight: "600" },
  checkoutBtn: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { fontSize: 16, color: "#666" },
});

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { Product } from "../../components/productcards";
import { useCart } from "../../store/cartcpntexst";

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { add } = useCart();

  const [item, setItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!id) return;
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data: Product = await res.json();
        if (alive) setItem(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <View style={styles.imageWrap}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>{item.category}</Text>

      {item.rating && (
        <Text style={styles.rating}>
          {item.rating.rate} ★ ({item.rating.count})
        </Text>
      )}

      <Text style={styles.price}>${item.price.toFixed(2)}</Text>

      <Text style={styles.description}>{item.description}</Text>

      <Pressable
        onPress={() =>
          add({
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image,
          })
        }
        style={styles.addBtn}
      >
        <Text style={styles.addText}>Add to Cart</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { padding: 16, paddingBottom: 40, backgroundColor: "#fff" },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 16 },
  imageWrap: {
    height: 260,
    backgroundColor: "#fafafa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  image: { width: "80%", height: "100%" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  category: {
    alignSelf: "flex-start",
    fontSize: 12,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginBottom: 6,
  },
  rating: { fontSize: 12, color: "#333", marginBottom: 6 },
  price: { fontSize: 20, fontWeight: "800", marginBottom: 8 },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#222",
    marginBottom: 16,
  },
  addBtn: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

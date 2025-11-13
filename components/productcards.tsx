import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useCart } from "../store/cartcpntexst";

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
};

type Props = {
  product: Product;
};

function ProductCard({ product }: Props) {
  const { add } = useCart();
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/product/[id]",
          params: { id: String(product.id) },
        })
      }
      style={styles.card}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {product.title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.category}>{product.category}</Text>
        </View>
        {product.rating && (
          <Text style={styles.rating}>
            Rating: {product.rating.rate} <Text style={styles.star}>★</Text> (
            {product.rating.count})
          </Text>
        )}

        <Text numberOfLines={2} style={styles.description}>
          {product.description}
        </Text>

        <Pressable
          onPress={() =>
            add({
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
            })
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>Add to cart</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    // marginHorizontal: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    minHeight: 280,
  },
  imageWrap: {
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  image: { width: "80%", height: "100%" },
  info: { padding: 12, gap: 6 },
  title: { fontSize: 16, fontWeight: "600" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  price: { fontSize: 16, fontWeight: "700" },
  category: {
    fontSize: 12,
    color: "#666",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#f0f0f0",
  },
  rating: { fontSize: 12, color: "#333" },
  star: { color: "#f5c518" },
  description: { fontSize: 13, lineHeight: 18, color: "#222" },
  button: {
    marginTop: 8,
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});

export default ProductCard;

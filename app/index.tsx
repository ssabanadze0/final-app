import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import ProductCard, { type Product } from "../components/productcards";
import { getProducts } from "../lib/productsCache";

function Index() {
  const [items, setItems] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      setLoading(true);
      (async () => {
        try {
          const data = await getProducts();
          if (alive) setItems(data);
        } catch (e) {
          console.error(e);
        } finally {
          if (alive) setLoading(false);
        }
      })();

      return () => {
        alive = false;
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={items ?? []}
      keyExtractor={(p) => String(p.id)}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent: { paddingVertical: 8 },
});

export default Index;

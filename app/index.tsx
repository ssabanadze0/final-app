import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProductCard, { type Product } from "../components/productcards";
import { getProducts } from "../lib/productsCache";

function Index() {
  const [items, setItems] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isGrid, setIsGrid] = useState(false);

  const listRef = useRef<FlatList<Product> | null>(null);

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

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    setShowTopBtn(y > 200);
  };

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const toggleLayout = () => {
    setIsGrid((prev) => !prev);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        key={isGrid ? "grid" : "list"}
        ref={listRef}
        data={items ?? []}
        numColumns={isGrid ? 2 : 1}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
        keyExtractor={(p) => String(p.id)}
        renderItem={({ item }) => (
          <View style={isGrid ? styles.gridItem : styles.listItem}>
            <ProductCard product={item} />
          </View>
        )}
      />
      <TouchableOpacity style={styles.layoutBtn} onPress={toggleLayout}>
        {isGrid ? (
          <Ionicons name="list-outline" size={20} color="#222" />
        ) : (
          <Ionicons name="grid-outline" size={20} color="#222" />
        )}
      </TouchableOpacity>

      {showTopBtn && (
        <TouchableOpacity style={styles.topBtn} onPress={scrollToTop}>
          <Text style={styles.fabText}>↑ Top</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent: { paddingVertical: 8, paddingHorizontal: 8 },

  listItem: {
    width: "100%",
    paddingVertical: 4,
  },
  gridItem: {
    width: "50%",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },

  fabBase: {
    position: "absolute",
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 7,
  },
  layoutBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: "#ffffffff",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "rgba(255, 255, 255, 1)",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  layoutIcon: {
    fontSize: 20,
    color: "#f2efefff",
    fontWeight: "600",
  },

  topBtn: {
    right: 20,
    bottom: 30,
    position: "absolute",
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 7,
  },
  fabText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});

export default Index;

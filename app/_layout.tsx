import { CartProvider } from "@/store/cartcpntexst";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import Footer from "../components/footer";
import Header from "../components/header";

function RootLayout() {
  return (
    <View style={{ flex: 2 }}>
      <CartProvider>
        <Header />

        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
        <Footer />
      </CartProvider>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
});

export default RootLayout;

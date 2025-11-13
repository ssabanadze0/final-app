import { AuthProvider } from "@/store/authContext";
import { CartProvider } from "@/store/cartcpntexst";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import Footer from "../components/footer";
import Header from "../components/header";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <View style={{ flex: 1 }}>
          <Header />

          <View style={styles.content}>
            <Stack screenOptions={{ headerShown: false }} />
          </View>

          <Footer />
        </View>
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

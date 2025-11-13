// components/FingerprintLoginButton.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  ViewStyle,
} from "react-native";

type Props = {
  loading: boolean;
  onPress: () => void;
  style?: ViewStyle;
  text?: string;
};

const FingerprintLoginButton: React.FC<Props> = ({
  loading,
  onPress,
  style,
  text = "LOGIN",
}) => {
  const width = useRef(new Animated.Value(220)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const fpOpacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (loading) {
      // go to “active” state
      Animated.parallel([
        Animated.timing(width, {
          toValue: 80,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false, // JS-driven
        }),
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false, // JS-driven
        }),
        Animated.timing(fpOpacity, {
          toValue: 1,
          duration: 200,
          delay: 150,
          useNativeDriver: false, // JS-driven
        }),
      ]).start();

      // little bounce
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(scale, {
          toValue: 1.15,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false, // JS-driven
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 180,
          useNativeDriver: false, // JS-driven
        }),
      ]).start();
    } else {
      // back to normal state
      Animated.parallel([
        Animated.timing(fpOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false, // JS-driven
        }),
        Animated.timing(width, {
          toValue: 220,
          duration: 260,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false, // JS-driven
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 220,
          delay: 80,
          useNativeDriver: false, // JS-driven
        }),
      ]).start();
    }
  }, [loading, width, textOpacity, fpOpacity, scale]);

  return (
    <Pressable
      onPress={loading ? undefined : onPress}
      style={({ pressed }) => [
        styles.pressable,
        style,
        pressed && !loading && { transform: [{ scale: 0.97 }] },
      ]}
    >
      <Animated.View
        style={[
          styles.container,
          {
            width,
            transform: [{ scale }],
          },
        ]}
      >
        {/* Text */}
        <Animated.Text style={[styles.text, { opacity: textOpacity }]}>
          {text}
        </Animated.Text>

        {/* Fingerprint icon when loading */}
        <Animated.View
          style={[styles.fingerprintWrapper, { opacity: fpOpacity }]}
        >
          <MaterialCommunityIcons
            name="fingerprint"
            size={30}
            color="#ffffff"
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  container: {
    height: 56,
    borderRadius: 40,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 4,
    fontSize: 16,
  },
  fingerprintWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FingerprintLoginButton;

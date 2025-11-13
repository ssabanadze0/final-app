import React, { useRef } from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";

const LOGO_WIDTH = 140;
const LOGO_HEIGHT = 40;
const SPEED_PX_PER_SEC = 100;

function Header() {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const containerSize = useRef({ width: 0, height: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const started = useRef(false);

  const moveToRandom = () => {
    const { width, height } = containerSize.current;
    if (!width || !height) return;

    const maxX = Math.max(0, width - LOGO_WIDTH);
    const maxY = Math.max(0, height - LOGO_HEIGHT);

    const targetX = Math.random() * maxX;
    const targetY = Math.random() * maxY;

    const dx = targetX - currentPos.current.x;
    const dy = targetY - currentPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const duration = Math.max(150, (distance / SPEED_PX_PER_SEC) * 1000);

    Animated.timing(position, {
      toValue: { x: targetX, y: targetY },
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      currentPos.current = { x: targetX, y: targetY };
      moveToRandom();
    });
  };

  const onContainerLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (!width || !height) return;

    containerSize.current = { width, height };

    if (!started.current) {
      started.current = true;

      const startX = (width - LOGO_WIDTH) / 2;
      const startY = (height - LOGO_HEIGHT) / 2;

      currentPos.current = { x: startX, y: startY };
      position.setValue({ x: startX, y: startY });

      moveToRandom();
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container} onLayout={onContainerLayout}>
        <Animated.View
          style={[
            styles.logoBox,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
              ],
            },
          ]}
        >
          <View>
            <Text style={styles.logoTop}>FAKE</Text>
            <View style={styles.dot} />
            <Text style={styles.logoBottom}>STORE</Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 40,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  container: {
    height: 70,
    width: "100%",
    overflow: "hidden",
  },
  logoBox: {
    position: "absolute",
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,

    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 999,

    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#ffffff22",

    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,

    gap: 8,
  },
  dot: {
    width: 68,
    height: 2,
    borderRadius: 5,
    backgroundColor: "#ffcc00",
  },
  logoTop: {
    color: "#fff",
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "600",
  },
  logoBottom: {
    color: "#fff",
    fontSize: 16,
    letterSpacing: 4,
    fontWeight: "800",
    marginTop: -2,
  },
});

export default Header;

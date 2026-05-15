import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const palette = {
  number: {
    backgroundColor: "#2d2d2d",
    borderColor: "#525252",
    textColor: "#fafafa",
  },
  operator: {
    backgroundColor: "#65a30d",
    borderColor: "#84cc16",
    textColor: "#111111",
  },
  utility: {
    backgroundColor: "#404040",
    borderColor: "#737373",
    textColor: "#f5f5f5",
  },
  equals: {
    backgroundColor: "#f5f5f5",
    borderColor: "#f5f5f5",
    textColor: "#111111",
  },
};

export default function CalculatorButton({
  label,
  onPress,
  type,
  wide,
  active,
  compact,
}) {
  const colors = palette[type];

  return (
    <Pressable
      style={({ hovered, pressed }) => [
        styles.button,
        wide && styles.wide,
        compact && styles.compact,
        {
          backgroundColor: colors.backgroundColor,
          borderColor: active ? "#d9f99d" : colors.borderColor,
        },
        hovered && styles.hovered,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.label,
          compact && styles.labelCompact,
          { color: colors.textColor },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 70,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  wide: {
    flex: 2.18,
    alignItems: "flex-start",
    paddingLeft: 24,
  },
  compact: {
    minHeight: 62,
  },
  hovered: {
    opacity: 0.9,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontSize: 27,
    fontWeight: "800",
  },
  labelCompact: {
    fontSize: 23,
  },
});

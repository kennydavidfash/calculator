import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import CalculatorButton from "./src/components/CalculatorButton";
import {
  applyPercent,
  clearCalculator,
  evaluateExpression,
  inputDecimal,
  inputDigit,
  setOperator,
  toggleSign,
} from "./src/utils/calculatorEngine";

const BUTTONS = [
  [
    { label: "C", type: "utility", action: "clear" },
    { label: "+/-", type: "utility", action: "sign" },
    { label: "%", type: "utility", action: "percent" },
    { label: "\u00f7", type: "operator", action: "operator", value: "/" },
  ],
  [
    { label: "7", type: "number", action: "digit", value: "7" },
    { label: "8", type: "number", action: "digit", value: "8" },
    { label: "9", type: "number", action: "digit", value: "9" },
    { label: "\u00d7", type: "operator", action: "operator", value: "*" },
  ],
  [
    { label: "4", type: "number", action: "digit", value: "4" },
    { label: "5", type: "number", action: "digit", value: "5" },
    { label: "6", type: "number", action: "digit", value: "6" },
    { label: "-", type: "operator", action: "operator", value: "-" },
  ],
  [
    { label: "1", type: "number", action: "digit", value: "1" },
    { label: "2", type: "number", action: "digit", value: "2" },
    { label: "3", type: "number", action: "digit", value: "3" },
    { label: "+", type: "operator", action: "operator", value: "+" },
  ],
  [
    { label: "0", type: "number", action: "digit", value: "0", wide: true },
    { label: ".", type: "number", action: "decimal" },
    { label: "=", type: "equals", action: "equals" },
  ],
];

const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  web: "Consolas",
  default: "monospace",
});

export default function App() {
  const [calculator, setCalculator] = useState(clearCalculator());
  const { width } = useWindowDimensions();
  const isWide = width >= 760;
  const isCompact = width < 420;

  const handlePress = (button) => {
    switch (button.action) {
      case "digit":
        setCalculator((current) => inputDigit(current, button.value));
        break;
      case "decimal":
        setCalculator((current) => inputDecimal(current));
        break;
      case "operator":
        setCalculator((current) => setOperator(current, button.value));
        break;
      case "equals":
        setCalculator((current) => evaluateExpression(current));
        break;
      case "clear":
        setCalculator(clearCalculator());
        break;
      case "sign":
        setCalculator((current) => toggleSign(current));
        break;
      case "percent":
        setCalculator((current) => applyPercent(current));
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={[styles.calculator, isWide && styles.calculatorWide]}>
          <View style={styles.header}>
            <Text style={[styles.kicker, { fontFamily: monoFont }]}>
              Calculator Two
            </Text>
            <Text style={[styles.title, { fontFamily: monoFont }]}>
              Simple Calculator
            </Text>
          </View>

          <View style={styles.display}>
            <Text style={[styles.expression, { fontFamily: monoFont }]}>
              {calculator.expression || "0"}
            </Text>
            <Text
              style={[
                styles.result,
                { fontFamily: monoFont },
                isCompact && styles.resultCompact,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {calculator.displayValue}
            </Text>
          </View>

          <View style={styles.keypad}>
            {BUTTONS.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((button) => (
                  <CalculatorButton
                    key={button.label}
                    label={button.label}
                    type={button.type}
                    wide={button.wide}
                    compact={isCompact}
                    active={
                      button.type === "operator" &&
                      calculator.operator === button.value &&
                      calculator.waitingForOperand
                    }
                    onPress={() => handlePress(button)}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111111",
  },
  page: {
    flexGrow: 1,
    padding: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  calculator: {
    width: "100%",
    maxWidth: 470,
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "#3f3f46",
  },
  calculatorWide: {
    maxWidth: 520,
  },
  header: {
    marginBottom: 16,
    gap: 6,
  },
  kicker: {
    color: "#a3e635",
    fontSize: 13,
    textTransform: "uppercase",
  },
  title: {
    color: "#f5f5f4",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
  },
  display: {
    minHeight: 162,
    borderRadius: 6,
    padding: 18,
    backgroundColor: "#050505",
    borderWidth: 1,
    borderColor: "#52525b",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  expression: {
    color: "#a1a1aa",
    fontSize: 16,
    textAlign: "right",
  },
  result: {
    color: "#a3e635",
    fontSize: 58,
    lineHeight: 66,
    textAlign: "right",
    fontWeight: "800",
  },
  resultCompact: {
    fontSize: 48,
    lineHeight: 54,
  },
  keypad: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
});

const MAX_LENGTH = 12;

export function clearCalculator() {
  return {
    displayValue: "0",
    previousValue: null,
    operator: null,
    waitingForOperand: false,
    expression: "",
  };
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const text = Number(value.toPrecision(MAX_LENGTH)).toString();
  return text.length > MAX_LENGTH ? Number(value).toExponential(6) : text;
}

function calculate(left, right, operator) {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return right === 0 ? Number.NaN : left / right;
    default:
      return right;
  }
}

function getExpression(previousValue, operator, currentValue) {
  if (previousValue === null || !operator) {
    return currentValue;
  }

  const symbolMap = {
    "*": "\u00d7",
    "/": "\u00f7",
    "+": "+",
    "-": "-",
  };

  return `${formatNumber(previousValue)} ${symbolMap[operator]} ${currentValue}`;
}

export function inputDigit(state, digit) {
  if (state.displayValue === "Error") {
    return {
      ...clearCalculator(),
      displayValue: digit,
    };
  }

  if (state.waitingForOperand) {
    return {
      ...state,
      displayValue: digit,
      waitingForOperand: false,
      expression: getExpression(state.previousValue, state.operator, digit),
    };
  }

  const nextValue =
    state.displayValue === "0" ? digit : `${state.displayValue}${digit}`;

  return {
    ...state,
    displayValue: nextValue.slice(0, MAX_LENGTH),
    expression: state.operator
      ? getExpression(state.previousValue, state.operator, nextValue.slice(0, MAX_LENGTH))
      : nextValue.slice(0, MAX_LENGTH),
  };
}

export function inputDecimal(state) {
  if (state.displayValue === "Error") {
    return {
      ...clearCalculator(),
      displayValue: "0.",
      expression: "0.",
    };
  }

  if (state.waitingForOperand) {
    return {
      ...state,
      displayValue: "0.",
      waitingForOperand: false,
      expression: getExpression(state.previousValue, state.operator, "0."),
    };
  }

  if (state.displayValue.includes(".")) {
    return state;
  }

  const nextValue = `${state.displayValue}.`;
  return {
    ...state,
    displayValue: nextValue,
    expression: state.operator
      ? getExpression(state.previousValue, state.operator, nextValue)
      : nextValue,
  };
}

export function toggleSign(state) {
  if (state.displayValue === "0" || state.displayValue === "Error") {
    return state.displayValue === "Error" ? clearCalculator() : state;
  }

  const nextValue = formatNumber(Number(state.displayValue) * -1);
  return {
    ...state,
    displayValue: nextValue,
    expression: state.operator
      ? getExpression(state.previousValue, state.operator, nextValue)
      : nextValue,
  };
}

export function applyPercent(state) {
  if (state.displayValue === "Error") {
    return clearCalculator();
  }

  const nextValue = formatNumber(Number(state.displayValue) / 100);
  return {
    ...state,
    displayValue: nextValue,
    expression: state.operator
      ? getExpression(state.previousValue, state.operator, nextValue)
      : nextValue,
  };
}

export function deleteDigit(state) {
  if (state.waitingForOperand || state.displayValue === "Error") {
    return clearCalculator();
  }

  const shortened = state.displayValue.slice(0, -1) || "0";
  return {
    ...state,
    displayValue: shortened,
    expression: state.operator
      ? getExpression(state.previousValue, state.operator, shortened)
      : shortened,
  };
}

export function setOperator(state, nextOperator) {
  const currentValue = Number(state.displayValue);

  if (state.previousValue === null) {
    return {
      ...state,
      previousValue: currentValue,
      operator: nextOperator,
      waitingForOperand: true,
      expression: `${formatNumber(currentValue)} ${
        nextOperator === "*" ? "\u00d7" : nextOperator === "/" ? "\u00f7" : nextOperator
      }`,
    };
  }

  if (state.waitingForOperand) {
    return {
      ...state,
      operator: nextOperator,
      expression: `${formatNumber(state.previousValue)} ${
        nextOperator === "*" ? "\u00d7" : nextOperator === "/" ? "\u00f7" : nextOperator
      }`,
    };
  }

  const result = calculate(state.previousValue, currentValue, state.operator);
  const formatted = formatNumber(result);

  return {
    ...state,
    displayValue: formatted,
    previousValue: Number.isFinite(result) ? result : null,
    operator: nextOperator,
    waitingForOperand: true,
    expression:
      formatted === "Error"
        ? ""
        : `${formatted} ${
            nextOperator === "*" ? "\u00d7" : nextOperator === "/" ? "\u00f7" : nextOperator
          }`,
  };
}

export function evaluateExpression(state) {
  if (state.operator === null || state.waitingForOperand) {
    return state;
  }

  const currentValue = Number(state.displayValue);
  const result = calculate(state.previousValue, currentValue, state.operator);
  const formatted = formatNumber(result);

  return {
    displayValue: formatted,
    previousValue: null,
    operator: null,
    waitingForOperand: false,
    expression:
      formatted === "Error"
        ? "Cannot divide by zero"
        : `${getExpression(state.previousValue, state.operator, state.displayValue)} =`,
  };
}

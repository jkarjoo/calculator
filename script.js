const calculator = {
    displayValue: "0",
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

function inputNumber(number) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = number;
        calculator.waitingForSecondOperand = false;
    }
    else {
        calculator.displayValue = displayValue === "0" ? number : displayValue + number;
    }
}

function inputDecimal(decimalpt) {
    if (calculator.waitingForSecondOperand === true) return;
    if (!calculator.displayValue.includes(decimalpt)) {
        calculator.displayValue += decimalpt;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        calculator.firstOperand = inputValue;
    }
    if (operator === "/" && inputValue === 0) {
        calculator.displayValue = "Infinity";
        return;
    }
    else if (operator) {
        let result = performCalculation[operator](firstOperand, inputValue);
        if (countDecimals(result) > 6) {
            result = result.toFixed(6);
        }
        calculator.displayValue = result;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

const performCalculation = {
    "/": (firstOperand, secondOperand) => firstOperand / secondOperand,
    "*": (firstOperand, secondOperand) => firstOperand * secondOperand,
    "+": (firstOperand, secondOperand) => firstOperand + secondOperand,
    "-": (firstOperand, secondOperand) => firstOperand - secondOperand,
    "=": (firstOperand, secondOperand) => secondOperand
};

function countDecimals(value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length;
    return 0;
}

function resetCalculator() {
    calculator.displayValue = "0";
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

function backspace() {
    if (calculator.displayValue.length > 1) {
        calculator.displayValue = calculator.displayValue.slice(0, -1);
    }
    else {
        calculator.displayValue = "0";
    }
}

function changeSign() {
    calculator.displayValue = calculator.displayValue * -1;
    if (calculator.waitingForSecondOperand === true) {
        calculator.firstOperand = calculator.displayValue;
    }
}

function updateDisplay() {
    const display = document.querySelector(".display");
    display.textContent = calculator.displayValue;
    document.activeElement.blur();
}

updateDisplay();

const buttons = document.querySelector(".buttons");
buttons.addEventListener("click", (event) => {
    const { target } = event;
    if (target.classList.contains("operator")) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }
    if (target.classList.contains("decimal")) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }
    if (target.classList.contains("ac")) {
        resetCalculator();
        updateDisplay();
        return;
    }
    if (target.classList.contains("backspace")) {
        backspace();
        updateDisplay();
        return;
    }
    if (target.classList.contains("change-sign")) {
        changeSign();
        updateDisplay();
        return;
    }
    inputNumber(target.value);
    updateDisplay();
});

document.addEventListener("keydown", (event) => {
    const { key } = event;
    if (isNaN(key)) {
        if (key === "Enter") {
            handleOperator("=");
            updateDisplay();
            return;
        }
        if (key === "+" || key === "-" || key === "/" || key === "*") {
            handleOperator(key);
            updateDisplay();
            return;
        }  
        if (key === ".") {
            inputDecimal(key);
            updateDisplay();
            return;
        }
        if (key === "Escape") {
            resetCalculator();
            updateDisplay();
            return;
        }     
        if (key === "Backspace") {
            backspace();
            updateDisplay();
            return;
        }
    }
    else {
        inputNumber(key);
        updateDisplay();
    }
})



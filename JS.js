function setTheme(themeName) {
    if (themeName === 'light') {
        document.documentElement.removeAttribute("data-theme");
    } else {
        document.documentElement.setAttribute("data-theme", themeName);
    }
}

const display = document.getElementById("result");

let calculationDone = false;

function appendCharacter(char) {
    const lastChar = display.value.slice(-1);
    const operators = ['+', '-', '*', '/', '%'];

    if (display.value === "Error" || (calculationDone && !operators.includes(char))) {
        display.value = "";
    }
    calculationDone = false;

    if (display.value === "" && operators.includes(char) && char !== '-') {
        return;
    }

    if (operators.includes(char) && operators.includes(lastChar)) {
        display.value = display.value.slice(0, -1) + char;
        return;
    }

    if (char === '.') {
        const currentNumber = display.value.split(/[\+\-\*\/%]/);
        const currentChunk = currentNumber[currentNumber.length - 1];
        if (currentChunk.includes('.')) return;
    }

    if (display.value === "0" && !operators.includes(char) && char !== '.') {
        display.value = char;
    }
    else {
        display.value += char;
    }
}

function clearDisplay() {
    display.value = "";
    calculationDone = false;
}

function deleteLast() {
    if (display.value === "Error") {
        display.value = "";
    } else {
        display.value = display.value.slice(0, -1);
    }
}

function calculator() {
    let expression = display.value;

    if (!expression) return;

    try {
        expression = expression.replace(/%/g, '/100');

        const lastChar = expression.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
            expression = expression.slice(0, -1);
        }

        let result = eval(expression);

        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(8));
        }

        display.value = result;
        calculationDone = true;
    } catch (error) {
        display.value = "Error";
        calculationDone = true;
    }
}

function getButtonByKey(key) {
    if (key === "=") key = "Enter";
    if (key === "Delete") key = "Escape";

    return document.querySelector(`.btn[data-key="${key}"]`);
}

window.addEventListener("keydown", function (event) {
    const key = event.key;

    const btn = getButtonByKey(key);
    if (btn) {
        btn.classList.add("pressed");
    }

    if ((key >= "0" && key <= "9") || ['+', '-', '*', '/', '.', '%'].includes(key)) {
        appendCharacter(key);
    }
    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculator();
    }
    else if (key === "Backspace") {
        deleteLast();
    }
    else if (key === "Escape" || key === "Delete") {
        clearDisplay();
    }
});

window.addEventListener("keyup", function (event) {
    const btn = getButtonByKey(event.key);
    if (btn) {
        btn.classList.remove("pressed");
    }
});
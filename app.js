let display = '0';
let previousValue = null;
let operator = null;
let waitingForOperand = false;
let history = '';

const displayElement = document.getElementById('display');
const historyElement = document.getElementById('history');

function updateDisplay() {
    displayElement.textContent = formatNumber(display);
    historyElement.textContent = history;
}

function formatNumber(num) {
    const value = parseFloat(num);
    if (isNaN(value)) return '0';
    
    if (Math.abs(value) > 999999999) {
        return value.toExponential(4);
    }
    
    if (num.includes('.') && num.endsWith('.')) {
        return value.toLocaleString('en-US') + '.';
    }
    
    if (num.includes('.')) {
        const parts = num.split('.');
        return parseFloat(parts[0]).toLocaleString('en-US') + '.' + parts[1];
    }
    
    return value.toLocaleString('en-US');
}

function calculate(a, b, op) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '×': return a * b;
        case '÷': return b !== 0 ? a / b : 0;
        default: return b;
    }
}

function inputDigit(digit) {
    if (waitingForOperand) {
        display = digit;
        waitingForOperand = false;
    } else {
        display = display === '0' ? digit : display + digit;
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForOperand) {
        display = '0.';
        waitingForOperand = false;
        updateDisplay();
        return;
    }
    if (!display.includes('.')) {
        display += '.';
        updateDisplay();
    }
}

function clear() {
    display = '0';
    previousValue = null;
    operator = null;
    waitingForOperand = false;
    history = '';
    updateDisplay();
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
        previousValue = display;
        history = display + ' ' + nextOperator;
    } else if (operator) {
        const currentValue = parseFloat(previousValue);
        const newValue = calculate(currentValue, inputValue, operator);
        display = String(newValue);
        previousValue = String(newValue);
        history = newValue + ' ' + nextOperator;
    }

    waitingForOperand = true;
    operator = nextOperator;
    updateDisplay();
}

function calculateResult() {
    if (operator && previousValue !== null) {
        const inputValue = parseFloat(display);
        const previous = parseFloat(previousValue);
        const result = calculate(previous, inputValue, operator);
        history = previousValue + ' ' + operator + ' ' + display + ' =';
        display = String(result);
        previousValue = null;
        operator = null;
        waitingForOperand = true;
        updateDisplay();
    }
}

function toggleSign() {
    display = String(-parseFloat(display));
    updateDisplay();
}

function percentage() {
    display = String(parseFloat(display) / 100);
    updateDisplay();
}

function backspace() {
    if (display.length > 1) {
        display = display.slice(0, -1);
    } else {
        display = '0';
    }
    updateDisplay();
}

// Button clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const value = btn.dataset.value;

        switch (action) {
            case 'digit':
                inputDigit(value);
                break;
            case 'operator':
                handleOperator(value);
                break;
            case 'decimal':
                inputDecimal();
                break;
            case 'clear':
                clear();
                break;
            case 'equals':
                calculateResult();
                break;
            case 'toggle':
                toggleSign();
                break;
            case 'percent':
                percentage();
                break;
        }
    });
});

// Backspace button
document.getElementById('backspace').addEventListener('click', backspace);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
    else if (e.key === '.') inputDecimal();
    else if (e.key === '+') handleOperator('+');
    else if (e.key === '-') handleOperator('-');
    else if (e.key === '*') handleOperator('×');
    else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
    }
    else if (e.key === 'Enter' || e.key === '=') calculateResult();
    else if (e.key === 'Escape') clear();
    else if (e.key === 'Backspace') backspace();
});

// Prevent double-tap zoom on mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Initialize
updateDisplay();
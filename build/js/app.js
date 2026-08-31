document.addEventListener('DOMContentLoaded', () => {
    setAtributes();
    loadButtons();
    protectOperatorInput();
    loadKeyEvents();
})

const mediaQuery = matchMedia('(min-width: 768px)');
const leftButtons = ['7', '8', '9', '=', '4', '5', '6', '(', '1', '2', '3', ')', '0', '.', '<', '>', 'Borrar', 'Limpiar'];
const rightButtons = ['+', '-', '*', '/'];
const allButtons = leftButtons.concat(rightButtons);
const allowedChars = /^[0-9+\-*/().]+$/;
const isSymbol = (char) => /^[+\-*/]+$/.test(char);

mediaQuery.addEventListener('change', setAtributes);
function setAtributes() {
    const operationInput = document.getElementById('operation-input');
    // mediaQuery.matches
    //     ? operationInput.removeAttribute('readonly')
    //     : operationInput.setAttribute('readonly', '');

    if (mediaQuery.matches) {
        operationInput.removeEventListener('keydown', filterKeys)
        operationInput.removeAttribute('inputmode');
    } else {
        operationInput.addEventListener('keydown', filterKeys);
        operationInput.setAttribute('inputmode', 'none');
    }
}

function filterKeys(e) {
    const allowedKeys = ['ArrowLeft', 'ArrowRight'];
    if (!allowedKeys.includes(e.key)) {
        e.preventDefault();
    }
}

function loadButtons() {
    const numbersContainer = document.querySelector('.numbers-container');
    const operationsContainer = document.querySelector('.operations-container');

    leftButtons.forEach(value => {
        const calculatorButton = document.createElement('BUTTON');
        calculatorButton.classList.add('calculator-button');
        calculatorButton.textContent = value
        numbersContainer.appendChild(calculatorButton)
        const operationInput = document.getElementById('operation-input');
        const resultInput = document.getElementById('result-input');

        calculatorButton.addEventListener('pointerdown', () => {
            calculatorButton.classList.add('key-active');
            if (value === '=') {
                solve();
                return;
            }
            if (value === 'Borrar') {
                deleteAtCursor(operationInput);
                return;
            }
            if (value === 'Limpiar') {
                if (operationInput.value !== '') {
                    operationInput.value = '';
                } else {
                    resultInput.value = '';
                }
                return;
            }
            if (value === '<') {
                moveCursor(value);
                return;
            }
            if (value === '>') {
                moveCursor(value);
                return;
            }
            if (isValidInput(value, operationInput)) {
                insertAtCursor(value, operationInput);
                return;
            }
        });
        calculatorButton.addEventListener('pointerup', () => {
            calculatorButton.classList.remove('key-active');
            operationInput.focus();
        });
        calculatorButton.addEventListener('pointerleave', () => {
            calculatorButton.classList.remove('key-active');
            operationInput.focus();
        });
    })

    rightButtons.forEach(value => {
        const calculatorButton = document.createElement('BUTTON');
        calculatorButton.classList.add('calculator-button');
        calculatorButton.textContent = value
        operationsContainer.appendChild(calculatorButton)
        const operationInput = document.getElementById('operation-input');

        calculatorButton.addEventListener('pointerdown', () => {
            calculatorButton.classList.add('key-active');
            const insert = isValidInput(value, operationInput);
            if (insert) {
                insertAtCursor(value, operationInput);
            }
        });
        calculatorButton.addEventListener('pointerup', () => {
            calculatorButton.classList.remove('key-active');
            operationInput.focus();
        });
        calculatorButton.addEventListener('pointerleave', () => {
            calculatorButton.classList.remove('key-active');
            operationInput.focus();
        });
    })
}

function protectOperatorInput() {
    const operationInput = document.getElementById('operation-input');

    operationInput.addEventListener('beforeinput', (e) => {
        if (e.data && !isValidInput(e.data, operationInput)) {
            e.preventDefault();
        }
        if (e.data === '(') {
            const cursorStart = operationInput.selectionStart;
            const cursorEnd = operationInput.selectionEnd;
            const text = operationInput.value;
            const frontChar = text.slice(cursorEnd, cursorEnd + 1);
            if (frontChar !== ')') {
                e.preventDefault();
                operationInput.value = text.slice(0, cursorStart) + '()' + text.slice(cursorEnd);
                operationInput.selectionStart = operationInput.selectionEnd = cursorStart + e.data.length;
            }
        }
    });
}

function loadKeyEvents() {
    const calculatorButtons = document.querySelectorAll('.calculator-button');
    const operationInput = document.getElementById('operation-input');
    const resultInput = document.getElementById('result-input');
    window.addEventListener('keydown', (e) => {
        allButtons.forEach(value => {
            if (!['=', '<', '>', 'Borrar', 'Limpiar'].includes(value)) {
                if (e.key === value) {
                    const indexButton = allButtons.indexOf(value);
                    const button = calculatorButtons[indexButton];
                    button.classList.add('key-active');
                }
            }
        })

        switch (e.key) {
            case 'ArrowLeft': {
                const indexButton = allButtons.indexOf('<');
                const button = calculatorButtons[indexButton];
                button.classList.add('key-active');
                break;
            }
            case 'ArrowRight': {
                const indexButton = allButtons.indexOf('>');
                const button = calculatorButtons[indexButton];
                button.classList.add('key-active');
                break;
            }
            // case '=':
            case 'Enter': {
                const indexButton = allButtons.indexOf('=');
                const button = calculatorButtons[indexButton];
                button.classList.add('key-active');
                solve();
                break;
            }
            case 'Backspace': {
                const indexButton = allButtons.indexOf('Borrar');
                const button = calculatorButtons[indexButton];
                button.classList.add('key-active');
                break;
            }
            case 'c':
            case 'C': {
                const indexButton = allButtons.indexOf('Limpiar');
                const button = calculatorButtons[indexButton];
                button.classList.add('key-active');
                if (operationInput.value !== '') {
                    operationInput.value = '';
                } else {
                    resultInput.value = '';
                }
                operationInput.focus();
                break;
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        allButtons.forEach(value => {
            if (!['=', '<', '>', 'Borrar', 'Limpiar'].includes(value)) {
                if (e.key === value) {
                    const indexButton = allButtons.indexOf(value);
                    const button = calculatorButtons[indexButton];
                    button.classList.remove('key-active');
                }
            }
        })

        switch (e.key) {
            case 'ArrowLeft': {
                const indexButton = allButtons.indexOf('<');
                const button = calculatorButtons[indexButton];
                button.classList.remove('key-active');
                break;
            }
            case 'ArrowRight': {
                const indexButton = allButtons.indexOf('>');
                const button = calculatorButtons[indexButton];
                button.classList.remove('key-active');
                break;
            }
            case '=':
            case 'Enter': {
                const indexButton = allButtons.indexOf('=');
                const button = calculatorButtons[indexButton];
                button.classList.remove('key-active');
                break;
            }
            case 'Backspace': {
                const indexButton = allButtons.indexOf('Borrar');
                const button = calculatorButtons[indexButton];
                button.classList.remove('key-active');
                break;
            }
            case 'c':
            case 'C': {
                const indexButton = allButtons.indexOf('Limpiar');
                const button = calculatorButtons[indexButton];
                button.classList.remove('key-active');
                break;
            }
        }
    });
}

// Funciones de utilidad

function insertAtCursor(char, input) {
    const cursorStart = input.selectionStart;
    const cursorEnd = input.selectionEnd;
    const text = input.value;
    const frontChar = text.slice(cursorEnd, cursorEnd + 1);

    if (char === '(' && frontChar !== ')') {
        input.value = text.slice(0, cursorStart) + '()' + text.slice(cursorEnd);
        input.selectionStart = input.selectionEnd = cursorStart + char.length;
        return;
    } else {
        input.value = text.slice(0, cursorStart) + char + text.slice(cursorEnd); // concatenar caracter
        input.selectionStart = input.selectionEnd = cursorStart + char.length; // mover el cursor después del caracter insertado
    }
}

function deleteAtCursor(input) {
    const cursorStart = input.selectionStart;
    const cursorEnd = input.selectionEnd;
    const text = input.value;

    if (cursorStart === 0 && cursorEnd === 0) {
        input.focus();
        return;
    }

    if (cursorStart !== cursorEnd) {
        input.value = text.slice(0, cursorStart) + text.slice(cursorEnd);
        input.selectionStart = input.selectionEnd = cursorStart;
    } else {
        input.value = text.slice(0, cursorStart - 1) + text.slice(cursorEnd);
        input.selectionStart = input.selectionEnd = cursorStart - 1;
    }
}

function moveCursor(direction) {
    const operationInput = document.getElementById('operation-input');
    const cursorStart = operationInput.selectionStart;
    const cursorEnd = operationInput.selectionEnd;

    if (cursorStart === cursorEnd) {
        if (direction === '<') {
            operationInput.selectionStart = operationInput.selectionEnd = cursorStart - 1;
            return;
        } else {
            operationInput.selectionStart = operationInput.selectionEnd = cursorStart + 1;
            return;
        }
    } else {
        if (direction === '<') {
            operationInput.selectionStart = operationInput.selectionEnd = cursorStart;
            return;
        } else {
            operationInput.selectionStart = operationInput.selectionEnd = cursorEnd;
            return;
        }
    }

}

function isValidInput(char, input) {
    const cursorPosition = input.selectionStart;
    const lastChar = input.value.slice(cursorPosition - 1, cursorPosition);
    const frontChar = input.value.slice(cursorPosition, cursorPosition + 1);

    if (!char || !allowedChars.test(char)) return false;
    if (char === '.' && (lastChar === '.' || frontChar === '.')) return false;
    if (isSymbol(char) && (isSymbol(lastChar) || isSymbol(frontChar))) return false;
    return true;
}

function solve() {
    const operationInput = document.getElementById('operation-input');
    const operation = operationInput.value;
    const resultInput = document.getElementById('result-input');

    try {
        const result = evaluateOperation(operation);
        resultInput.value = isFinite(result) ? result : 'Error';
    } catch (error) {
        resultInput.value = 'Error de sintaxis';
        console.error('Operación inválida.')
    }
}

function evaluateOperation(operation) {
    const allowedChars = /^[0-9+\-*/().]+$/;

    if (!allowedChars.test(operation)) {
        throw new Error('Caracteres no permitidos.');
    }

    const operationArray = [];
    let charCounter = 0; // contador de caracteres '*' agregados

    for (let i = 0; i < operation.length; i++) {
        if (i !== 0 && operation[i] === '(' && !['+', '-', '*', '/', '('].includes(operation[i - 1])) {
            operationArray.push('*(');
        } else if (i + 1 !== operation.length && operation[i] === ')' && !['+', '-', '*', '/', ')', '('].includes(operation[i + 1])) {
            operationArray.push(')*');
        } else {
            operationArray.push(operation[i]);
        }
    }

    const newOperation = operationArray.join('');

    const execute = new Function(`return ${newOperation}`);
    return execute();
}
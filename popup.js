let display = document.getElementById('answerbox');

function appendValue(value) {
    if (value === '=') {
        calculate();
    } else {
        display.innerText += value;
    }
}

function clearDisplay() {
    display.innerText = '';
}

function calculate() {
    try {
        const expression = display.innerText;
        
        const tokens = expression.match(/(\d*\.?\d+|[+\-*/^])/g);
        
        if (!tokens) {
            throw new Error('Invalid expression');
        }

        const postfix = infixToPostfix(tokens);
        
        const result = evaluatePostfix(postfix);

        if (isNaN(result)) {
            display.innerText = 'Error! Invalid operation!';
            return;
        }
        
        display.innerText = Number.isInteger(result) ? result : result.toFixed(8).replace(/\.?0+$/, '');
    } catch (error) {
        display.innerText = 'Error, invalid operation';
    }
}

function infixToPostfix(tokens) {
    const output = [];
    const operators = [];
    const precedence = {
        '^': 3,
        '*': 2,
        '/': 2,
        '+': 1,
        '-': 1
    };

    for (let token of tokens) {
        if (!isNaN(token)) {
            output.push(parseFloat(token));
        } else {
            while (
                operators.length > 0 &&
                precedence[operators[operators.length - 1]] >= precedence[token]
            ) {
                output.push(operators.pop());
            }
            operators.push(token);
        }
    }

    while (operators.length > 0) {
        output.push(operators.pop());
    }

    return output;
}

function evaluatePostfix(postfix) {
    const stack = [];

    for (let token of postfix) {
        if (typeof token === 'number') {
            stack.push(token);
        } else {
            const b = stack.pop();
            const a = stack.pop();

            switch (token) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    if (b === 0) throw new Error('Division by zero');
                    stack.push(a / b);
                    break;
                case '^':
                    stack.push(Math.pow(a, b));
                    break;
            }
        }
    }

    return stack[0];
}

document.getElementById('clearButton').addEventListener('click', clearDisplay);

const appendButtons = document.querySelectorAll('.appendButton');
appendButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendValue(button.getAttribute('data-value'));
    });
});
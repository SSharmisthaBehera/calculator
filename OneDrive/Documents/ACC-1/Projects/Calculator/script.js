class Calculator {
    constructor() {
        this.prevEl = document.getElementById('previousOperand');
        this.currEl = document.getElementById('currentOperand');
        this.clear();
        this.bindEvents();
    }

    clear() {
        this.current = '0';
        this.previous = '';
        this.operation = null;
        this.updateDisplay();
    }

    delete() {
        this.current = this.current.slice(0, -1) || '0';
        this.updateDisplay();
    }

    appendNumber(num) {
        if (num === '.' && this.current.includes('.')) return;
        this.current = this.current === '0' && num !== '.' ? num : this.current + num;
        this.updateDisplay();
    }

    chooseOperation(op) {
        if (!this.current) return;
        if (this.previous) this.compute();
        this.operation = op;
        this.previous = this.current;
        this.current = '';
        this.updateDisplay();
    }

    compute() {
        const a = parseFloat(this.previous);
        const b = parseFloat(this.current);
        if (isNaN(a) || isNaN(b)) return;

        const ops = {
            '+': a + b,
            '-': a - b,
            '*': a * b,
            '/': a / b,
            '%': a % b
        };

        this.current = ops[this.operation]?.toString() || '0';
        this.previous = '';
        this.operation = null;
        this.updateDisplay();
    }

    format(num) {
        const [int, dec] = num.toString().split('.');
        const intFormatted = isNaN(parseFloat(int)) ? '' : parseFloat(int).toLocaleString('en');
        return dec ? `${intFormatted}.${dec}` : intFormatted;
    }

    updateDisplay() {
        this.currEl.innerText = this.format(this.current);
        this.prevEl.innerText = this.operation ? `${this.format(this.previous)} ${this.operation}` : '';
    }

    bindEvents() {
        document.querySelectorAll('.btn-number').forEach(btn =>
            btn.addEventListener('click', () => this.appendNumber(btn.dataset.number))
        );

        document.querySelectorAll('.btn-operation').forEach(btn =>
            btn.addEventListener('click', () => this.chooseOperation(btn.dataset.operation))
        );

        document.querySelector('[data-action="equals"]').onclick = () => this.compute();
        document.querySelector('[data-action="clear"]').onclick = () => this.clear();
        document.querySelector('[data-action="delete"]').onclick = () => this.delete();

        document.addEventListener('keydown', e => {
            if (/[0-9]/.test(e.key)) this.appendNumber(e.key);
            else if (e.key === '.') this.appendNumber('.');
            else if (['+', '-', '*', '/'].includes(e.key)) this.chooseOperation(e.key);
            else if (e.key === 'Enter' || e.key === '=') this.compute();
            else if (e.key === 'Escape') this.clear();
            else if (e.key === 'Backspace') this.delete();
        });
    }
}

new Calculator();
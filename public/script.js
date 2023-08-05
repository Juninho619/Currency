const socket = io();

const fromCurrency = document.getElementById('from');
const toCurrency = document.getElementById('to');
const amountInput = document.getElementById('amount');
const convertButton = document.getElementById('convert');
const resultElement = document.getElementById('result');

convertButton.addEventListener('click', () => {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amount = parseFloat(amountInput.value);

    if (!isNaN(amount) && amount > 0 && from !== to) {
        socket.emit('convert', { from, to, amount });
    }
});

socket.on('conversionResult', (result) => {
    if (result.success) {
        resultElement.textContent = `${result.amount.toFixed(2)} ${result.from} = ${result.convertedAmount.toFixed(2)} ${result.to}`;
    } else {
        resultElement.textContent = 'An error occurred during conversion. Please try again later.';
    }
});

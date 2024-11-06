
const API_KEY = "21969b1f749520abc7b7186c";  // Your API Key
const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

const amountInput = document.querySelector('input[type="text"]');
const fromSelect = document.querySelector('select[name="from"]');
const toSelect = document.querySelector('select[name="to"]');
const exchangeRateMsg = document.querySelector('.msg');
// const convertButton = document.querySelector('button');

let currencies = [];
let exchangeRates = {};

window.addEventListener("load", () => {

    fetchCurrencyData();
});

async function fetchCurrencyData() {
    try {

        const res = await fetch(url);
        const data = await res.json();

        if (data.result !== "success") {
            throw new Error("Failed to fetch currency data");
        }


        currencies = Object.keys(data.conversion_rates);
        exchangeRates = data.conversion_rates;


        populateCurrencySelect(fromSelect);
        populateCurrencySelect(toSelect);


        fromSelect.value = 'USD';
        toSelect.value = 'INR';


        updateExchangeRate();
    } catch (error) {
        console.error(error);
        exchangeRateMsg.textContent = "Error fetching data. Please try again later.";
    }
}

function populateCurrencySelect(selectElement) {
    currencies.forEach(currency => {
        const option = document.createElement("option");
        option.value = currency;
        option.textContent = currency;
        selectElement.appendChild(option);
    });
}

async function updateExchangeRate() {
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;
    const amount = parseFloat(amountInput.value) || 1;

    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];


    const convertedAmount = (amount * rate).toFixed(2);


    exchangeRateMsg.innerHTML = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    exchangeRateMsg.style.fontWeight = 'bold';
}


amountInput.addEventListener("input", updateExchangeRate);
fromSelect.addEventListener("change", updateExchangeRate);
toSelect.addEventListener("change", updateExchangeRate);





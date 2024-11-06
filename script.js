
const API_KEY = "21969b1f749520abc7b7186c";  // Your API Key
const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

const amountInput = document.querySelector('input[type="text"]');
const fromSelect = document.querySelector('select[name="from"]');
const toSelect = document.querySelector('select[name="to"]');
const exchangeRateMsg = document.querySelector('.msg');
const convertButton = document.querySelector('button');

// Store currency data
let currencies = [];
let exchangeRates = {};

window.addEventListener("load", () => {
    // Initialize the currency converter
    fetchCurrencyData();
});

async function fetchCurrencyData() {
    try {
        // Fetch exchange rates from the API
        const res = await fetch(url);
        const data = await res.json();

        if (data.result !== "success") {
            throw new Error("Failed to fetch currency data");
        }

        // Save the available currencies and exchange rates
        currencies = Object.keys(data.conversion_rates);
        exchangeRates = data.conversion_rates;

        // Populate the 'from' and 'to' dropdowns with currency options
        populateCurrencySelect(fromSelect);
        populateCurrencySelect(toSelect);

        // Default set to USD and INR
        fromSelect.value = 'USD';
        toSelect.value = 'INR';

        // Set the initial exchange rate
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

    // Get the conversion rate between selected currencies
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];

    // Calculate the converted amount
    const convertedAmount = (amount * rate).toFixed(2);

    // Display the exchange rate and converted amount
    exchangeRateMsg.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
}

// Add event listeners for user inputs
amountInput.addEventListener("input", updateExchangeRate);
fromSelect.addEventListener("change", updateExchangeRate);
toSelect.addEventListener("change", updateExchangeRate);

// Handle the "Get Exchange Rate" button click
convertButton.addEventListener("click", (event) => {
    event.preventDefault();  // Prevent form submission
    updateExchangeRate();    // Update the exchange rate when clicked
});


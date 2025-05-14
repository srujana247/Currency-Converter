document.addEventListener('DOMContentLoaded', () => {
    const amount = document.getElementById('amount');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const result = document.getElementById('result');
    const convertBtn = document.getElementById('convert');
    const swapBtn = document.getElementById('swap');

    // Function to populate currency dropdowns
    async function populateCurrencies() {
        try {
            const response = await fetch('https://api.frankfurter.app/currencies');
            const currencies = await response.json();
            
            // Clear existing options
            fromCurrency.innerHTML = '';
            toCurrency.innerHTML = '';

            // Add all currencies to both dropdowns
            for (const [code, name] of Object.entries(currencies)) {
                const option1 = new Option(`${code} - ${name}`, code);
                const option2 = new Option(`${code} - ${name}`, code);
                
                // Set USD and EUR as defaults
                if (code === 'USD') fromCurrency.add(option1);
                if (code === 'EUR') toCurrency.add(option2);
                
                fromCurrency.add(option1.cloneNode(true));
                toCurrency.add(option2.cloneNode(true));
            }
        } catch (error) {
            console.error("Error loading currencies:", error);
            // Fallback to basic currencies if API fails
            const fallbackCurrencies = {
                "USD": "US Dollar",
                "EUR": "Euro",
                "GBP": "British Pound",
                "JPY": "Japanese Yen"
            };
            
            // Clear existing options
            fromCurrency.innerHTML = '';
            toCurrency.innerHTML = '';
            
            // Add fallback currencies
            for (const [code, name] of Object.entries(fallbackCurrencies)) {
                const option1 = new Option(`${code} - ${name}`, code);
                const option2 = new Option(`${code} - ${name}`, code);
                
                if (code === 'USD') fromCurrency.add(option1);
                if (code === 'EUR') toCurrency.add(option2);
                
                fromCurrency.add(option1.cloneNode(true));
                toCurrency.add(option2.cloneNode(true));
            }
            
            alert("Couldn't load full currency list. Using basic currencies.");
        }
    }

    // Fetch exchange rates from API
    async function fetchRates(base = 'USD') {
        try {
            const response = await fetch(`https://api.frankfurter.app/latest?from=${base}`);
            const data = await response.json();
            return data.rates;
        } catch (error) {
            console.error("Error fetching rates:", error);
            return null;
        }
    }

    // Convert currency
    async function convert() {
        const from = fromCurrency.value;
        const to = toCurrency.value;
        const value = parseFloat(amount.value);

        if (isNaN(value)) {
            alert("Please enter a valid number!");
            return;
        }

        if (from === to) {
            result.value = value;
            return;
        }

        const rates = await fetchRates(from);
        if (!rates) {
            alert("Failed to fetch exchange rates. Try again later.");
            return;
        }

        const rate = rates[to];
        const convertedValue = (value * rate).toFixed(2);
        result.value = convertedValue;
    }

    // Swap currencies
    function swapCurrencies() {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
        convert();
    }

    // Initialize the application
    async function init() {
        await populateCurrencies();
        
        // Set up event listeners
        convertBtn.addEventListener('click', convert);
        swapBtn.addEventListener('click', swapCurrencies);
        amount.addEventListener('input', convert);
        fromCurrency.addEventListener('change', convert);
        toCurrency.addEventListener('change', convert);

        // Perform initial conversion
        convert();
    }

    // Start the application
    init();
});
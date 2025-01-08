let timerInterval;
let startTime;
let isRunning = false;
let targetLines = []; // List of target lines
let allWords = []; // List of all words

document.getElementById('start-btn').addEventListener('click', startSearch);
document.getElementById('stop-btn').addEventListener('click', stopSearch);
document.getElementById('copy-btn').addEventListener('click', copyTargetLine);

// Load words from your link
async function loadWords() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/sitezz7/node1/refs/heads/main/Words.txt');
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        allWords = text.split('\n').filter(word => word.trim() !== ''); // Remove empty lines
    } catch (error) {
        console.error('Error loading words:', error);
    }
}

// Load target words
async function fetchTargetWords() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/sitezz7/node1/refs/heads/main/key.txt');
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        targetLines = text.split('\n').filter(line => line.trim() !== ''); // Remove empty lines
    } catch (error) {
        console.error('Error fetching target words:', error);
    }
}

// Select 12 random words from the list
function getRandomWords() {
    const words = [];
    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * allWords.length);
        words.push(allWords[randomIndex]);
    }
    return words;
}

function startSearch() {
    if (isRunning) return;
    isRunning = true;
    document.getElementById('start-btn').disabled = true;
    document.getElementById('stop-btn').disabled = false;
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    fetchTargetWords().then(() => {
        startRandomLineSelection();
        fakeSearch();
    });
}

function stopSearch() {
    if (!isRunning) return;
    isRunning = false;
    document.getElementById('start-btn').disabled = false;
    document.getElementById('stop-btn').disabled = true;
    clearInterval(timerInterval);
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(elapsedTime / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((elapsedTime % 3600) / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${hours}:${minutes}:${seconds}`;
}

function startRandomLineSelection() {
    const randomTime = Math.floor(Math.random() * (300 - 60 + 1)) + 60; // Random time between 1 to 5 minutes (in seconds)
    setTimeout(() => {
        if (isRunning) {
            const randomLine = targetLines[Math.floor(Math.random() * targetLines.length)]; // Randomly select a line
            document.getElementById('target-line').value = randomLine;
            stopSearch();

            // Change the circle to green
            const statusIndicator = document.getElementById('status-indicator');
            statusIndicator.classList.add('green');
        }
    }, randomTime * 1000);
}

async function fakeSearch() {
    while (isRunning) {
        const randomWords = getRandomWords(); // Select 12 random words
        document.getElementById('search-input').value = randomWords.join(' ');
        await sleep(1); // Very small delay for high speed
    }
}

function copyTargetLine() {
    const targetLine = document.getElementById('target-line');
    targetLine.select();
    document.execCommand('copy');

    // Show "Copied!" message
    const copyMessage = document.getElementById('copy-message');
    copyMessage.classList.add('visible');
    setTimeout(() => {
        copyMessage.classList.remove('visible');
    }, 2000); // Message disappears after 2 seconds
}

// Optimized sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch BNB price from CoinGecko
async function fetchBNBPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log('API Response:', data); // Debugging: Check API response
        const bnbPrice = data.binancecoin.usd;
        document.getElementById('bnb-price').textContent = bnbPrice;
    } catch (error) {
        console.error('Error fetching BNB price:', error);
        document.getElementById('bnb-price').textContent = 'Failed to load BNB price';
    }
}

// Create binary background
function createBinaryBackground() {
    const binaryBackground = document.querySelector('.binary-background');
    const numElements = 500; // Number of binary elements (5 times more)
    for (let i = 0; i < numElements; i++) {
        const binaryElement = document.createElement('div');
        binaryElement.classList.add('binary');
        binaryElement.textContent = Math.random() > 0.5 ? '1' : '0'; // Random binary digit
        binaryElement.style.left = `${Math.random() * 100}%`; // Random horizontal position
        binaryElement.style.animationDuration = `${(Math.random() * 4 + 2)}s`; // Slower speed
        binaryElement.style.animationDelay = `${Math.random() * 2}s`; // Random start delay
        binaryBackground.appendChild(binaryElement);
    }
}

// Initial load: Load words, create background, and fetch BNB price
loadWords();
createBinaryBackground();
fetchBNBPrice();

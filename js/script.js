let timerInterval;
let startTime;
let isRunning = false;
let targetLines = []; // لیست سطرهای کلمات هدف
let allWords = []; // لیست تمام کلمات

document.getElementById('start-btn').addEventListener('click', startSearch);
document.getElementById('stop-btn').addEventListener('click', stopSearch);
document.getElementById('copy-btn').addEventListener('click', copyTargetLine);

// بارگیری لیست کلمات از لینک شما
async function loadWords() {
    const response = await fetch('https://raw.githubusercontent.com/sitezz7/node1/refs/heads/main/Words.txt');
    const text = await response.text();
    allWords = text.split('\n').filter(word => word.trim() !== ''); // حذف خطوط خالی
}

// بارگیری کلمات هدف
async function fetchTargetWords() {
    const response = await fetch('https://raw.githubusercontent.com/sitezz7/node1/refs/heads/main/key.txt');
    const text = await response.text();
    targetLines = text.split('\n').filter(line => line.trim() !== ''); // حذف خطوط خالی
}

// انتخاب ۱۲ کلمه تصادفی از لیست کلمات
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
    const randomTime = Math.floor(Math.random() * (300 - 60 + 1)) + 60; // زمان تصادفی بین ۱ تا ۵ دقیقه (بر حسب ثانیه)
    setTimeout(() => {
        if (isRunning) {
            const randomLine = targetLines[Math.floor(Math.random() * targetLines.length)]; // انتخاب تصادفی یک سطر
            document.getElementById('target-line').value = randomLine;
            stopSearch();

            // تغییر دایره به سبز
            const statusIndicator = document.getElementById('status-indicator');
            statusIndicator.classList.add('green');
        }
    }, randomTime * 1000);
}

async function fakeSearch() {
    while (isRunning) {
        const randomWords = getRandomWords(); // انتخاب ۱۲ کلمه تصادفی
        document.getElementById('search-input').value = randomWords.join(' ');
        await sleep(1); // تاخیر بسیار کم برای سرعت بالا
    }
}

function copyTargetLine() {
    const targetLine = document.getElementById('target-line');
    targetLine.select();
    document.execCommand('copy');

    // نمایش پیام "کپی شد"
    const copyMessage = document.getElementById('copy-message');
    copyMessage.classList.add('visible');
    setTimeout(() => {
        copyMessage.classList.remove('visible');
    }, 2000); // پیام پس از ۲ ثانیه ناپدید می‌شود
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// دریافت قیمت BNB از CoinGecko
async function fetchBNBPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd');
        const data = await response.json();
        const bnbPrice = data.binancecoin.usd;
        document.getElementById('bnb-price').textContent = bnbPrice;
    } catch (error) {
        console.error('Error fetching BNB price:', error);
        document.getElementById('bnb-price').textContent = 'Failed to load BNB price';
    }
}

// ایجاد بک‌گراند باینری
function createBinaryBackground() {
    const binaryBackground = document.querySelector('.binary-background');
    const numElements = 500; // تعداد اعداد باینری (۵ برابر بیشتر)
    for (let i = 0; i < numElements; i++) {
        const binaryElement = document.createElement('div');
        binaryElement.classList.add('binary');
        binaryElement.textContent = Math.random() > 0.5 ? '1' : '0'; // عدد باینری تصادفی
        binaryElement.style.left = `${Math.random() * 100}%`; // موقعیت افقی تصادفی
        binaryElement.style.animationDuration = `${(Math.random() * 4 + 2)}s`; // سرعت ۲ برابر کمتر
        binaryElement.style.animationDelay = `${Math.random() * 2}s`; // تاخیر شروع تصادفی
        binaryBackground.appendChild(binaryElement);
    }
}

// بارگیری اولیه لیست کلمات، ایجاد بک‌گراند و دریافت قیمت BNB
loadWords();
createBinaryBackground();
fetchBNBPrice();
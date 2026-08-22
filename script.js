const matrixLanguages = {
    fa: { warn1: "شما در آستانه یک تحول بزرگ هستید", warn2: "آیا توانایی و شجاعت پذیرش حقیقت را دارید؟", warn3: "انتخاب کنید", red: "ورود", blue: "خروج", nextPage: "fa.home.html", langBtn: "EN 🇺🇸" },
    en: { warn1: "You are on the verge of a great transformation", warn2: "Do you have the ability and courage to accept the truth?", warn3: "Make your choice", red: "Enter", blue: "Exit", nextPage: "en.home.html", langBtn: "FA 🇮🇷" }
};

// تشخیص هوشمند زبان دستگاه کاربر به محض ورود
const userLang = navigator.language || navigator.userLanguage;
let currentLang = userLang.toLowerCase().includes('fa') ? 'fa' : 'en';
let typingTimeoutId = null;
let typingIntervalId = null;

function startTypewriterSequence() {
    clearTimeout(typingTimeoutId); clearInterval(typingIntervalId);
    const langObj = matrixLanguages[currentLang];
    const lines = [{ id: "warn1", text: langObj.warn1 }, { id: "warn2", text: langObj.warn2 }, { id: "warn3", text: langObj.warn3 }];

    lines.forEach(line => { const el = document.getElementById(line.id); if (el) { el.innerText = ""; el.classList.remove("cursor"); } });

    let currentLineIndex = 0;
    function processNextLine() {
        if (currentLineIndex >= lines.length) return;
        const current = lines[currentLineIndex];
        const el = document.getElementById(current.id);
        if (!el) return;

        el.classList.add("cursor");

        typingTimeoutId = setTimeout(() => {
            let charIndex = 0;
            typingIntervalId = setInterval(() => {
                if (charIndex < current.text.length) { el.innerText += current.text.charAt(charIndex); charIndex++; } 
                else { clearInterval(typingIntervalId); el.classList.remove("cursor"); currentLineIndex++; processNextLine(); }
            }, 75);
        }, 1500);
    }
    processNextLine();
}

function updateLanguageUI() {
    const langObj = matrixLanguages[currentLang];
    const redBtn = document.getElementById("red-pill");
    const blueBtn = document.getElementById("blue-pill");
    const langBtn = document.getElementById("lang-btn");

    if (redBtn) { redBtn.innerText = langObj.red; redBtn.href = langObj.nextPage; }
    if (blueBtn) blueBtn.innerText = langObj.blue;
    if (langBtn) langBtn.innerText = langObj.langBtn;
    startTypewriterSequence();
}

document.addEventListener("DOMContentLoaded", () => {
    // اجرا فقط در صفحه دروازه ورود (ایندکس)
    if (document.getElementById("gateway")) {
        updateLanguageUI();
        const langBtn = document.getElementById("lang-btn");
        if (langBtn) {
            langBtn.addEventListener("click", (e) => {
                e.preventDefault();
                currentLang = (currentLang === 'fa') ? 'en' : 'fa';
                updateLanguageUI();
            });
        }

        // ==========================================
        // عملیات پورتال (کلیک روی کپسول قرمز)
        // ==========================================
        const redBtn = document.getElementById("red-pill");
        if (redBtn) {
            redBtn.addEventListener("click", (e) => {
                e.preventDefault(); 
                const targetUrl = redBtn.href;
                
                // اجرای انیمیشن چرخشی سیاه‌چاله
                document.body.classList.add("portal-active");
                
                // مکث 1.2 ثانیه‌ای برای کامل شدن انیمیشن و بعد انتقال
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 1200);
            });
        }
    }
});

// ==========================================
// پردازشگر سایبرتایمر و تاریخ انقضا
// ==========================================
function updateCyberTimer() {
    const timerContainer = document.querySelector('.cyber-container');
    // اگه کاربر تو صفحه‌ای بود که باکس تایمر وجود نداشت، پردازش رو متوقف کن تا سیستم کرش نکنه
    if (!timerContainer) return; 

    // تاریخ انقضای عملیات: 1 سپتامبر ساعت 21:00
    let finalDate = new Date("2026-09-01T21:00:00");
    if (new Date() >= finalDate) {
        timerContainer.style.display = 'none'; // محو شدن خودکار باکس
        return;
    }

    let nowString = new Date().toLocaleString("en-US", {timeZone: "Asia/Tehran"});
    let now = new Date(nowString);
    let target = new Date(now);
    target.setHours(21, 0, 0, 0);

    if (now >= target) {
        target.setDate(target.getDate() + 1);
    }

    let diff = target - now;
    let h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("hours").innerText = h.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = m.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = s.toString().padStart(2, '0');
}

setInterval(updateCyberTimer, 1000);
updateCyberTimer();

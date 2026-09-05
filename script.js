const matrixLanguages = {
    fa: { warn1: "شما در آستانه یک تحول بزرگ هستید", warn2: "آیا توانایی و شجاعت پذیرش حقیقت را دارید؟", warn3: "انتخاب کنید", red: "ورود", blue: "خروج", nextPage: "fa.home.html", langBtn: "EN 🇺🇸" },
    en: { warn1: "You are on the verge of a great transformation", warn2: "Do you have the ability and courage to accept the truth?", warn3: "Make your choice", red: "Enter", blue: "Exit", nextPage: "en.home.html", langBtn: "FA 🇮🇷" }
};

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

        const redBtn = document.getElementById("red-pill");
        if (redBtn) {
            redBtn.addEventListener("click", (e) => {
                e.preventDefault();
                const targetUrl = redBtn.href;
                document.body.classList.add("portal-active");
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 1200);
            });
        }
    }
});

// اتصال دکمه لاگین گوگل با قابلیت تشخیص زبان (چیپ ردیابی مامورهای ماتریکس)
const googleLoginBtn = document.getElementById('google-login-btn');
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
        // کارآگاه بازی: چک می‌کنیم ببینیم کاربر تو صفحه انگلیسیه یا فارسی
        const isEnglish = window.location.pathname.includes('en.home.html');
        const lang = isEnglish ? 'en' : 'fa';
        
        // شلیک کاربر به سرور با چیپ ردیابی زبان
        window.location.href = `https://login.matin-mohammadi.ir/login?lang=${lang}`;
    });
}

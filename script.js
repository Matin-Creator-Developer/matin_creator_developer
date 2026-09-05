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
        const isEnglish = window.location.pathname.includes('en.home.html');
        const lang = isEnglish ? 'en' : 'fa';
        window.location.href = `https://login.matin-mohammadi.ir/login?lang=${lang}`;
    });
}

// عملیات شناسایی کاربر برگشتی از ماتریکس
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('user');
    const userPic = urlParams.get('pic');

    if (userName && userPic) {
        // ۱. آپدیت هولوگرام پروفایل و اسم
        const profileImg = document.getElementById('profile-img');
        const logoName = document.querySelector('.logo');
        if (profileImg) profileImg.src = userPic;
        if (logoName) logoName.innerText = userName;
        // ۵. تبدیل دکمه ثبت سفارش به درگاه زرین‌پال
        const orderBtn = document.getElementById('order-btn');
        if (orderBtn) {
            orderBtn.innerText = 'پرداخت آنلاین (زرین‌پال)';
            orderBtn.style.backgroundColor = '#f3cf14'; // زرد زرین‌پال
            orderBtn.style.color = '#000';
            orderBtn.onclick = () => {
                // شلیک به سمت سرور کلودفلر برای ساخت لینک زرین‌پال
                window.location.href = 'https://login.matin-mohammadi.ir/pay';
            };
        }
// ۶. منطق دکمه برای کاربرِ لاگین‌نکرده
    const orderBtnGuest = document.getElementById('order-btn');
    if (orderBtnGuest && !userName) {
        orderBtnGuest.onclick = () => {
            const isEnglish = window.location.pathname.includes('en.home.html');
            const lang = isEnglish ? 'en' : 'fa';
            window.location.href = `https://login.matin-mohammadi.ir/login?lang=${lang}`;
        };
    }

    // ۷. بررسی بازگشت موفقیت‌آمیز از درگاه پرداخت
    if (urlParams.get('payment') === 'success') {
        const serviceBox = document.getElementById('service-box');
        const successBox = document.getElementById('success-box');
        if (serviceBox) serviceBox.style.display = 'none';
        if (successBox) successBox.style.display = 'block';
        
        // پاک کردن پارامتر پرداخت از لینک مرورگر
        window.history.replaceState({}, document.title, window.location.pathname);
    }
        // ۲. مخفی کردن دکمه لاگین 
        const loginBtn = document.getElementById('google-login-btn');
        if (loginBtn) loginBtn.style.display = 'none';

        // ۳. تغییر بایوگرافی به پیام خوش‌آمدگویی
        const bio = document.querySelector('.badass-bio');
        if (bio) {
            const isEnglish = window.location.pathname.includes('en.home.html');
            bio.innerHTML = isEnglish 
                ? `Congratulations!<br>You have successfully penetrated the Matrix core. Welcome, Agent ${userName}!` 
                : `تبریک می‌گم!<br>شما با موفقیت به هسته مرکزی ماتریکس نفوذ کردی، مامور ${userName} خوش اومدی!`;
            bio.style.color = '#00ff00';
            bio.style.lineHeight = '1.8';
        }

        // ۴. پاک کردن ردپا از لینک مرورگر
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

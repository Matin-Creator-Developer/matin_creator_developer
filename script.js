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

// اتصال دکمه لاگین گوگل
const googleLoginBtn = document.getElementById('google-login-btn');
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
        const isEnglish = window.location.pathname.includes('en.home.html');
        const lang = isEnglish ? 'en' : 'fa';
        window.location.href = `https://login.matin-mohammadi.ir/login?lang=${lang}`;
    });
}

// هسته مرکزی پردازش اطلاعات کاربر و پرداخت
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlUser = urlParams.get('user');
    const urlPic = urlParams.get('pic');
    const urlEmail = urlParams.get('email'); // دریافت ایمیل از ماتریکس

    // ۱. ذخیره اطلاعات تو مرورگر (شامل ایمیل)
    if (urlUser && urlPic && urlEmail) {
        localStorage.setItem('mcd_user', urlUser);
        localStorage.setItem('mcd_pic', urlPic);
        localStorage.setItem('mcd_email', urlEmail);
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // ۲. خوندن اطلاعات از حافظه
    const savedUser = localStorage.getItem('mcd_user');
    const savedPic = localStorage.getItem('mcd_pic');
    const savedEmail = localStorage.getItem('mcd_email'); // ایمیل بازیابی شد

    if (savedUser && savedPic) {
        const profileImg = document.getElementById('profile-img');
        const logoName = document.querySelector('.logo');
        if (profileImg) profileImg.src = savedPic;
        if (logoName) logoName.innerText = savedUser;
        
        const loginBtn = document.getElementById('google-login-btn');
        if (loginBtn) loginBtn.style.display = 'none';

        const bio = document.querySelector('.badass-bio');
        if (bio) {
            const isEnglish = window.location.pathname.includes('en.home.html');
            bio.innerHTML = isEnglish 
                ? `Congratulations!<br>You have successfully penetrated the Matrix core. Welcome, Agent ${savedUser}!` 
                : `تبریک می‌گم!<br>شما با موفقیت به هسته مرکزی ماتریکس نفوذ کردی، مامور ${savedUser} خوش اومدی!`;
            bio.style.color = '#00ff00';
            bio.style.lineHeight = '1.8';
        }

        // تبدیل دکمه و شلیک ایمیل به زرین‌پال
        const orderBtn = document.getElementById('order-btn');
        if (orderBtn) {
            orderBtn.innerText = 'پرداخت آنلاین (زرین‌پال)';
            orderBtn.style.backgroundColor = '#f3cf14';
            orderBtn.style.color = '#000';
            orderBtn.onclick = () => {
                // ایمیل رو تو لینک جاسازی می‌کنیم
                window.location.href = `https://login.matin-mohammadi.ir/pay?email=${savedEmail}`;
            };
        }
    } else {
        const orderBtnGuest = document.getElementById('order-btn');
        if (orderBtnGuest) {
            orderBtnGuest.onclick = () => {
                const isEnglish = window.location.pathname.includes('en.home.html');
                const lang = isEnglish ? 'en' : 'fa';
                window.location.href = `https://login.matin-mohammadi.ir/login?lang=${lang}`;
            };
        }
    }

    if (urlParams.get('payment') === 'success') {
        const serviceBox = document.getElementById('service-box');
        const successBox = document.getElementById('success-box');
        if (serviceBox) serviceBox.style.display = 'none';
        if (successBox) successBox.style.display = 'block';
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

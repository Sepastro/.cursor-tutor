const languageToggleEn = document.getElementById('language-toggle-en');
const languageToggleZh = document.getElementById('language-toggle-zh');

// Supported Languages
const supportedLanguages = ['en', 'zh'];

// Current Language State
let currentLanguage = localStorage.getItem('language') || 'en';

// Function to update language
function updateLanguage() {
    document.querySelectorAll('[data-en][data-zh]').forEach(element => {
        element.textContent = element.getAttribute(`data-${currentLanguage}`);
    });

    // Update toggle buttons' text if necessary
    const languageToggleEn = document.getElementById('language-toggle-en');
    const languageToggleZh = document.getElementById('language-toggle-zh');
    
    if (languageToggleEn && languageToggleZh) {
        languageToggleEn.textContent = 'English';
        languageToggleZh.textContent = '中文';
    }
}

// Initialize Language on Page Load
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();

    const languageToggleEn = document.getElementById('language-toggle-en');
    const languageToggleZh = document.getElementById('language-toggle-zh');
    
    if (languageToggleEn && languageToggleZh) {
        // Event Listeners for Toggle Buttons
        languageToggleEn.addEventListener('click', () => {
            switchLanguage('en');
        });

        languageToggleZh.addEventListener('click', () => {
            switchLanguage('zh');
        });
    }
});

// Function to switch language
function switchLanguage(lang) {
    if (supportedLanguages.includes(lang)) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        updateLanguage();
    }
}

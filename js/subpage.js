// Ensure the script runs only after the entire DOM has loaded
document.addEventListener('DOMContentLoaded', function() {
    // Toggle visibility of English and Pinyin columns
    const toggleButtons = document.querySelectorAll('.toggle-button');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const englishCell = row.querySelector('td:nth-child(3)');
            const pinyinCell = row.querySelector('td:nth-child(2)');
            
            englishCell.classList.toggle('content-hidden');
            pinyinCell.classList.toggle('content-hidden');
        });
    });

    // Pronunciation functionality
    const pronunciationButtons = document.querySelectorAll('.pronunciation-button');
    pronunciationButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const chineseText = this.closest('tr').querySelector('td:first-child').textContent;
            try {
                this.classList.add('playing');
                await speakGoogle(chineseText, 'zh-CN', 0.7); // Adjust the speed here
                this.classList.remove('playing');
            } catch (error) {
                console.error("Error playing pronunciation:", error);
                this.classList.remove('playing');
            }
        });
    });

    // Toggle all English translations
    const toggleAllEnglishButton = document.getElementById('toggleAllEnglishButton');
    if (toggleAllEnglishButton) {
        toggleAllEnglishButton.addEventListener('click', function() {
            const englishCells = document.querySelectorAll('.nouns-table td:nth-child(3)');
            englishCells.forEach(cell => cell.classList.toggle('content-hidden'));
            
            const icon = this.querySelector('i');
            icon.classList.toggle('usa-flag-bright');
            icon.classList.toggle('usa-flag-dimmed');
        });
    }

    // Toggle all Pinyin
    const toggleAllButton = document.getElementById('toggleAllButton');
    if (toggleAllButton) {
        toggleAllButton.addEventListener('click', function() {
            const pinyinCells = document.querySelectorAll('.nouns-table td:nth-child(2)');
            pinyinCells.forEach(cell => cell.classList.toggle('content-hidden'));
            
            const icon = this.querySelector('i');
            icon.classList.toggle('pinyin-icon-bright');
            icon.classList.toggle('pinyin-icon-dimmed');
        });
    }

    // Print functionality
    const printButton = document.querySelector('.print-button');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
});

async function speakGoogle(text, lang, speed = 0.7) {
    if (!('speechSynthesis' in window)) {
        console.error("Speech synthesis not supported");
        return;
    }

    return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = speed;

        // Get available voices and try to find a Chinese voice
        const voices = window.speechSynthesis.getVoices();
        const chineseVoice = voices.find(voice => voice.lang.includes('zh-') && voice.localService);
        
        if (chineseVoice) {
            utterance.voice = chineseVoice;
        } else {
            console.warn("No suitable Chinese voice found. Using default voice.");
        }

        utterance.onend = resolve;
        utterance.onerror = reject;
        window.speechSynthesis.speak(utterance);
    });
}

// Ensure voices are loaded
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
        // Voices are now loaded, you can use them
    };
}

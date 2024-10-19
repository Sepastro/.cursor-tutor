// Ensure the script runs only after the entire DOM has loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");

    try {
        // Toggle visibility of English and Pinyin columns
        const toggleButtons = document.querySelectorAll('.toggle-button');
        console.log("Toggle buttons found:", toggleButtons.length);
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                console.log("Toggle button clicked");
                const row = this.closest('tr');
                const englishCell = row.querySelector('td:nth-child(3)');
                const pinyinCell = row.querySelector('td:nth-child(2)');
                
                englishCell.classList.toggle('content-hidden');
                pinyinCell.classList.toggle('content-hidden');
            });
        });

        // Pronunciation functionality
        const pronunciationButtons = document.querySelectorAll('.pronunciation-button');
        console.log("Pronunciation buttons found:", pronunciationButtons.length);
        pronunciationButtons.forEach(button => {
            button.addEventListener('click', async function() {
                console.log("Pronunciation button clicked");
                const chineseText = this.closest('tr').querySelector('td:first-child').textContent;
                try {
                    this.classList.add('playing');
                    await speakGoogle(chineseText);
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
    } catch (error) {
        console.error("Error in main script:", error);
    }
});

async function speakGoogle(text, lang = 'zh', speed = 1) {
    const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;

    try {
        const audio = new Audio();
        audio.src = googleTTSUrl;
        audio.playbackRate = speed;

        // Preload the audio
        await new Promise((resolve, reject) => {
            audio.oncanplaythrough = resolve;
            audio.onerror = reject;
            audio.load();
        });

        // Play the audio
        await new Promise((resolve, reject) => {
            audio.onended = resolve;
            audio.onerror = reject;
            audio.play().catch(e => {
                console.error("Audio playback failed:", e);
                reject(e);
            });
        });
    } catch (error) {
        console.error("Error playing audio:", error);
        throw error;
    }
}

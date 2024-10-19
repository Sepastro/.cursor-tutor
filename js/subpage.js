// Ensure the script runs only after the entire DOM has loaded
document.addEventListener('DOMContentLoaded', function() {
    // Select the table containing the nouns
    const table = document.querySelector('.nouns-table');
    const toggleAllButton = document.getElementById('toggleAllButton');
    const toggleAllEnglishButton = document.getElementById('toggleAllEnglishButton');

    /**
     * Event Listener for Pronunciation Buttons
     * This handles the functionality when a pronunciation button is clicked.
     * It plays the corresponding audio for the selected Hanzi (Chinese character).
     */
    table.addEventListener('click', function(e) {
        // Check if the clicked element is within a pronunciation button
        if (e.target.closest('.pronunciation-button')) {
            const button = e.target.closest('.pronunciation-button');
            const cell = button.closest('td');
            const hanzi = cell.firstChild.textContent.trim(); // Extract Hanzi text

            // If there's any audio currently playing, pause it
            if (window.currentAudio) {
                window.currentAudio.pause();
                window.currentAudio.currentTime = 0;
            }

            // Play the Hanzi pronunciation using Google Translate TTS
            const audio = speakGoogle(hanzi);

            if (audio) {
                button.classList.add('playing'); // Add a visual indicator (e.g., animation)
                window.currentAudio = audio; // Store the current audio instance

                // When audio ends, remove the playing indicator
                audio.onended = () => {
                    button.classList.remove('playing');
                    window.currentAudio = null;
                };
            }
        }
    });

    /**
     * Event Listener for Toggle Buttons
     * This handles the functionality when a toggle button is clicked.
     * It shows or hides the English translation or Pinyin in the corresponding table cell.
     */
    table.addEventListener('click', function(e) {
        if (e.target.closest('.toggle-button')) {
            const button = e.target.closest('.toggle-button');
            const td = button.closest('td');
            const content = td.querySelector('.english-content, .pinyin-content');
            const icon = button.querySelector('i');
            
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'inline';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                td.classList.remove('content-hidden');
            } else {
                content.style.display = 'none';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                td.classList.add('content-hidden');
            }
        }
    });

    /**
     * Function to Handle Printing of the Table
 */
    function printTable() {
        // Clone the table to prevent modifications to the original table
        const tableToPrint = document.querySelector('.nouns-table').cloneNode(true);
        const rows = tableToPrint.querySelectorAll('tr');

        // Iterate over each row in the cloned table
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) { // Ensure the row has enough cells: Hanzi, Pinyin, English
                // Control visibility of English content based on their current state
                const englishContent = cells[2].querySelector('.english-content');
                if (cells[2].classList.contains('content-hidden')) {
                    if (englishContent) {
                        englishContent.style.display = 'none'; // Hide English content if marked hidden
                    }
                } else {
                    if (englishContent) {
                        englishContent.style.display = 'inline'; // Show English content if not hidden
                    }
                }
            }
        });

        // Remove all toggle and pronunciation buttons from the cloned table for the print view
        tableToPrint.querySelectorAll('.toggle-button, .pronunciation-button').forEach(button => {
            button.remove();
        });

        // Open a new window to display the print view
        const newWin = window.open('', 'Print-Window');
        newWin.document.open();
        newWin.document.write('<html><head><title>Print</title>');

        // Inject CSS styles for the print view to ensure proper formatting
        newWin.document.write('<style>');
        newWin.document.write(`
            table { 
                border-collapse: collapse; 
                width: 100%; 
                table-layout: fixed; 
            }
            th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: left; 
                width: 33.33%; 
                word-wrap: break-word;
            }
            th { background-color: #f2f2f2; }
        `);
        newWin.document.write('</style>');

        newWin.document.write('</head><body>');
        newWin.document.write(tableToPrint.outerHTML); // Insert the cloned and modified table
        newWin.document.write('</body></html>');
        newWin.document.close();

        // Trigger the print dialog and close the print window after a short delay
        setTimeout(function() {
            newWin.print();
            newWin.close();
        }, 250);
    }

    /**
     * Event Listener for "Print Table" Button
     * This button prints the table while respecting the current visibility state of English content.
     * It hides only those English entries that are currently hidden on the webpage.
     */
    const printButton = document.getElementById('printButton');
    printButton.addEventListener('click', function() {
        printTable();
    });

    /**
     * Function to toggle visibility of all content
     */
    function toggleAllContent() {
        const pinyinContent = table.querySelectorAll('.pinyin-content');
        const pinyinButtons = table.querySelectorAll('td:nth-child(2) .toggle-button');
        const toggleAllIcon = toggleAllButton.querySelector('i');
        
        let allVisible = true;

        // Check if all Pinyin content is visible
        pinyinContent.forEach(content => {
            if (content.style.display === 'none' || content.style.display === '') {
                allVisible = false;
            }
        });

        // Toggle visibility
        const newDisplayState = allVisible ? 'none' : 'inline';

        pinyinContent.forEach(content => {
            content.style.display = newDisplayState;
        });

        pinyinButtons.forEach(button => {
            const icon = button.querySelector('i');
            const td = button.closest('td');
            if (newDisplayState === 'inline') {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                td.classList.remove('content-hidden');
            } else {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                td.classList.add('content-hidden');
            }
        });

        // Update the toggle all button icon
        if (newDisplayState === 'inline') {
            toggleAllIcon.classList.remove('pinyin-icon-dimmed');
            toggleAllIcon.classList.add('pinyin-icon-bright');
        } else {
            toggleAllIcon.classList.remove('pinyin-icon-bright');
            toggleAllIcon.classList.add('pinyin-icon-dimmed');
        }
    }

    /**
     * Event Listener for Toggle All Button
     */
    toggleAllButton.addEventListener('click', toggleAllContent);

    /**
     * Function to Play Audio Using Google Translate TTS
     * @param {string} text - The text to be spoken.
     * @param {string} lang - The language code (default is 'zh' for Chinese).
     * @returns {Audio} - The audio object that is playing the speech.
     */
    function speakGoogle(text, lang = 'zh') {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
        const audio = new Audio(url);
        
        // Adjust playback speed for clarity
        audio.playbackRate = 0.8;
        
        // Attempt to play the audio; fallback to another method if there's an error
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
            speak(text, 0.5); // Fallback function (ensure this is defined elsewhere)
        });

        return audio;
    }

    /**
     * Function to toggle all English content
     */
    function toggleAllEnglishContent() {
        const englishContent = table.querySelectorAll('.english-content');
        const englishButtons = table.querySelectorAll('td:nth-child(3) .toggle-button');
        const toggleAllEnglishIcon = toggleAllEnglishButton.querySelector('i');
        
        let allVisible = true;

        // Check if all English content is visible
        englishContent.forEach(content => {
            if (content.style.display === 'none' || content.style.display === '') {
                allVisible = false;
            }
        });

        // Toggle visibility
        const newDisplayState = allVisible ? 'none' : 'inline';

        englishContent.forEach(content => {
            content.style.display = newDisplayState;
        });

        englishButtons.forEach(button => {
            const icon = button.querySelector('i');
            const td = button.closest('td');
            if (newDisplayState === 'inline') {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                td.classList.remove('content-hidden');
            } else {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                td.classList.add('content-hidden');
            }
        });

        // Update the toggle all English button icon
        if (newDisplayState === 'inline') {
            toggleAllEnglishIcon.classList.remove('usa-flag-dimmed');
            toggleAllEnglishIcon.classList.add('usa-flag-bright');
        } else {
            toggleAllEnglishIcon.classList.remove('usa-flag-bright');
            toggleAllEnglishIcon.classList.add('usa-flag-dimmed');
        }
    }

    /**
     * Event Listener for Toggle All English Button
     */
    toggleAllEnglishButton.addEventListener('click', toggleAllEnglishContent);
});

// Tree structure
const sidebarTree = `
───Chinese Learning
    │
    ├───Home
    │
    ├───Grammar
    │   ├───Syntax
    │   └───Tenses
    │
    └───Vocabulary
        ├───Nouns
        ├───Verbs
        ├───Adjectives
        └───Hello Chinese
`;

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar-nav');
    let isOpen = false;
    let mouseInActivationZone = false;

    function showSidebar() {
        sidebar.classList.add('active');
        isOpen = true;
        sessionStorage.setItem('sidebarOpen', 'true');
    }

    function hideSidebar() {
        sidebar.classList.remove('active');
        isOpen = false;
        sessionStorage.setItem('sidebarOpen', 'false');
    }

    // Function to reset sidebar state
    function resetSidebarState() {
        hideSidebar();
        mouseInActivationZone = false;
    }

    // Check sessionStorage on page load
    if (sessionStorage.getItem('sidebarOpen') !== 'true') {
        resetSidebarState();
    } else {
        showSidebar();
    }

    document.addEventListener('mousemove', function(e) {
        const activationThreshold = window.innerHeight * 0.35;
        if (e.clientX <= 1 && e.clientY > activationThreshold) {
            mouseInActivationZone = true;
            if (!isOpen) {
                showSidebar();
            }
        } else {
            mouseInActivationZone = false;
            if (isOpen && e.clientX > 250 && !sidebar.matches(':hover')) {
                hideSidebar();
            }
        }
    });

    sidebar.addEventListener('mouseenter', function() {
        if (!isOpen) {
            showSidebar();
        }
    });

    sidebar.addEventListener('mouseleave', function() {
        if (isOpen && !mouseInActivationZone) {
            hideSidebar();
        }
    });

    // Render the tree structure
    const treeContent = document.createElement('pre');
    treeContent.textContent = sidebarTree;
    sidebar.appendChild(treeContent);

    // Add interactivity to the tree structure
    const lines = treeContent.textContent.split('\n');
    const interactiveTree = lines.map(line => {
        if (line.includes('├───') || line.includes('└───')) {
            const pageName = line.trim().split('───')[1];
            if (pageName === 'Home') {
                return line.replace(pageName, `<a href="index.html" data-page="home">${pageName}</a>`);
            } else if (pageName === 'Grammar' || pageName === 'Vocabulary') {
                return line.replace(pageName, `<span style="margin-left: 4px;">${pageName}</span>`);
            } else {
                const fileName = pageName.toLowerCase().replace(' ', '');
                return line.replace(pageName, `<a href="${fileName}.html" data-page="${fileName}">${pageName}</a>`);
            }
        }
        return line;
    }).join('\n');

    treeContent.innerHTML = interactiveTree;

    // Function to highlight the current page
    function highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop().replace('.html', '').toLowerCase();
        
        let pageToHighlight = currentPage === '' || currentPage === 'index' ? 'home' : currentPage;

        const currentPageLink = sidebar.querySelector(`a[data-page="${pageToHighlight}"]`);
        if (currentPageLink) {
            currentPageLink.classList.add('active');
        }
    }

    // Call the function to highlight the current page
    highlightCurrentPage();

    // Add click event listener to all links in the sidebar
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            resetSidebarState();
        });
    });
});

// Add an unload event listener to reset the sidebar state
window.addEventListener('unload', function() {
    sessionStorage.setItem('sidebarOpen', 'false');
});

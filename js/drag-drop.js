class DragDropHandler {
    constructor(tableElement) {
        this.table = tableElement;
        this.tbody = this.table.querySelector('tbody');
        this.rows = Array.from(this.tbody.querySelectorAll('tr'));
        this.isEnabled = false;
        this.draggedRow = null;

        // Bind event handlers
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    enableDragAndDrop() {
        this.isEnabled = true;
        this.rows.forEach(row => {
            row.setAttribute('draggable', 'true');
            row.addEventListener('dragstart', this.onDragStart);
            row.addEventListener('dragover', this.onDragOver);
            row.addEventListener('drop', this.onDrop);
            row.addEventListener('dragend', this.onDragEnd);
        });
        console.log('Drag and Drop Enabled');
    }

    disableDragAndDrop() {
        this.isEnabled = false;
        this.rows.forEach(row => {
            row.setAttribute('draggable', 'false');
            row.removeEventListener('dragstart', this.onDragStart);
            row.removeEventListener('dragover', this.onDragOver);
            row.removeEventListener('drop', this.onDrop);
            row.removeEventListener('dragend', this.onDragEnd);
        });
        console.log('Drag and Drop Disabled');
    }

    toggleDragAndDrop() {
        if (this.isEnabled) {
            this.disableDragAndDrop();
        } else {
            this.enableDragAndDrop();
        }
    }

    onDragStart(e) {
        this.draggedRow = e.currentTarget;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.draggedRow.innerHTML);
        this.draggedRow.classList.add('dragging');
    }

    onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const targetRow = e.currentTarget;
        if (this.draggedRow === targetRow) return;
        this.tbody.insertBefore(this.draggedRow, targetRow.nextSibling);
    }

    onDrop(e) {
        e.stopPropagation();
        if (this.draggedRow !== e.currentTarget) {
            this.draggedRow.innerHTML = e.currentTarget.innerHTML;
            e.currentTarget.innerHTML = e.dataTransfer.getData('text/html');
        }
        return false;
    }

    onDragEnd(e) {
        this.draggedRow.classList.remove('dragging');
        this.draggedRow = null;
    }
}

// Initialize DragDropHandler for desired tables after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const tables = document.querySelectorAll('.nouns-table');
    const dragDropHandlers = Array.from(tables).map(table => new DragDropHandler(table));

    // Initialize all tables with drag-and-drop disabled
    dragDropHandlers.forEach(handler => handler.disableDragAndDrop());

    // Add event listeners for Toggle Drag & Drop buttons
    const toggleButtons = document.querySelectorAll('#toggleDragDropButton');

    toggleButtons.forEach(button => {
        // Set initial button state to locked
        button.innerHTML = '<i class="fas fa-lock"></i>';
        button.setAttribute('aria-label', 'Enable Drag and Drop');

        button.addEventListener('click', () => {
            dragDropHandlers.forEach(handler => handler.toggleDragAndDrop());

            // Update button icons based on the current state
            if (dragDropHandlers[0].isEnabled) {
                // If enabled, show lock-open icon
                button.innerHTML = '<i class="fas fa-lock-open"></i>';
                button.setAttribute('aria-label', 'Disable Drag and Drop');
            } else {
                // If disabled, show lock icon
                button.innerHTML = '<i class="fas fa-lock"></i>';
                button.setAttribute('aria-label', 'Enable Drag and Drop');
            }
        });
    });

    // Optional: Add styles for dragging (if not already in CSS)
    const style = document.createElement('style');
    style.innerHTML = `
        .dragging {
            opacity: 0.5;
        }
    `;
    document.head.appendChild(style);
});

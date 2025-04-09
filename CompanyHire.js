// You can add any interactive functionality here if needed
// For example, handling button clicks or form submissions

document.addEventListener('DOMContentLoaded', function() {
    // Example: Add event listeners to buttons
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            alert('Button clicked: ' + this.textContent);
        });
    });
});
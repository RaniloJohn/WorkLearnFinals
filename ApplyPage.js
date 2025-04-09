document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('jobForm');
    const salaryTypeRadios = document.getElementsByName('salary-type');
    const hourlyRateContainer = document.getElementById('hourly-rate-container');
    const sections = document.querySelectorAll('.form-section');
    const navItems = document.querySelectorAll('aside ul li');

    // Toggle hourly rate input visibility based on salary type selection
    salaryTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            hourlyRateContainer.style.display = this.value === 'hourly' ? 'block' : 'none';
        });
    });

    // Handle section switching
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            sections.forEach(section => {
                section.style.display = section.id === sectionId ? 'block' : 'none';
            });
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(form);
        const data = {
            employmentTypes: formData.getAll('employment'),
            workingSchedule: document.getElementById('schedule').value,
            salaryType: formData.get('salary-type'),
            hourlyRate: document.getElementById('hourly-rate').value,
            isNegotiable: document.getElementById('negotiable').checked,
            hiringMultipleCandidates: document.getElementById('multiple-candidates').checked
        };

        // Here you would typically send this data to a server
        console.log('Form data:', data);
        alert('Form submitted successfully!');
    });
});
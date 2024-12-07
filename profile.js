const calendarGrid = document.getElementById('calendar-grid');
const monthYearDisplay = document.getElementById('month-year');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const addEventButton = document.getElementById('add-event-button');
const modal = document.getElementById('event-modal');
const closeButton = document.querySelector('.close-button');
const eventForm = document.getElementById('event-form');
const eventDateInput = document.getElementById('event-date');
const eventTitleInput = document.getElementById('event-title');

let currentDate = new Date();
let events = [];

function renderCalendar(date) {
  calendarGrid.innerHTML = '';
  const month = date.getMonth();
  const year = date.getFullYear();

  monthYearDisplay.textContent = `${date.toLocaleString('default', { month: 'long' })}, ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement('div');
    cell.classList.add('calendar-cell', 'empty');
    calendarGrid.appendChild(cell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    cell.classList.add('calendar-cell');
    cell.innerHTML = `<div class="day-number">${day}</div>`;

    const cellDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const eventForDay = events.filter(event => event.date === cellDate);
    eventForDay.forEach(event => {
      const eventMarker = document.createElement('div');
      eventMarker.classList.add('event-marker');
      eventMarker.textContent = event.title;
      cell.appendChild(eventMarker);
    });

    calendarGrid.appendChild(cell);
  }
}

function openModal() {
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
}

addEventButton.addEventListener('click', openModal);
closeButton.addEventListener('click', closeModal);

eventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const eventDate = eventDateInput.value;
  const eventTitle = eventTitleInput.value;

  events.push({ date: eventDate, title: eventTitle });
  closeModal();
  renderCalendar(currentDate);
});

prevMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

renderCalendar(currentDate);


// Sidebar hovering active class
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".sidebar nav ul li a");

  links.forEach(link => {
    link.addEventListener("click", () => {
      // Remove active class from all links
      links.forEach(link => link.classList.remove("active"));
      
      // Add active class to clicked link
      link.classList.add("active");
    });
  });
});


//Certifications Upload style JS
const fileInput = document.getElementById("cert-upload");
const label = document.querySelector(".file-upload-label");

fileInput.addEventListener("change", function() {
  const fileName = fileInput.files[0] ? fileInput.files[0].name : "No file selected";
  label.setAttribute("data-file-name", fileName);
});


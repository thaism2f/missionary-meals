
const calendarEl = document.getElementById('calendar');
const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const selectedDateLabel = document.getElementById('selected-date-label');
const monthTitle = document.getElementById('month-title');

let currentMonth = 7;  // August = 7
let currentYear = 2025;
const signUps = {};

function renderCalendar(month, year) {
  calendarEl.innerHTML = '';
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
  monthTitle.textContent = `${monthNames[month]} ${year}`;

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    calendarEl.appendChild(empty);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.className = 'day';
    const key = `${year}-${month + 1}-${i}`;
    day.dataset.date = key;
    day.innerHTML = `<div>${i}</div><div class="signup-name" id="name-${key}">${signUps[key] || ''}</div>`;
    day.onclick = () => showForm(i, month, year);
    calendarEl.appendChild(day);
  }
}

function showForm(day, month, year) {
  const key = `${year}-${month + 1}-${day}`;
  selectedDateLabel.textContent = `Sign up for ${key}`;
  form.style.display = 'block';
  nameInput.dataset.date = key;
  nameInput.focus();
}

function submitForm() {
  const name = nameInput.value.trim();
  const key = nameInput.dataset.date;
  if (!name) return alert("Please enter your name");
  signUps[key] = name;
  document.getElementById(`name-${key}`).textContent = name;
  nameInput.value = '';
  form.style.display = 'none';
}

function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
}

function goHome() {
  window.location.href = "index.html";
}

renderCalendar(currentMonth, currentYear);

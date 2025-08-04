
const calendarEl = document.getElementById('calendar');
const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const selectedDateLabel = document.getElementById('selected-date-label');
let selectedDate = '';
const signUps = {};

for (let i = 1; i <= 31; i++) {
  const day = document.createElement('div');
  day.className = 'day';
  day.dataset.date = `August ${i}, 2025`;
  day.innerHTML = `<div>${i}</div><div class="signup-name" id="name-${i}"></div>`;
  day.onclick = () => showForm(i);
  calendarEl.appendChild(day);
}

function showForm(dayNum) {
  selectedDate = `August ${dayNum}, 2025`;
  selectedDateLabel.textContent = `Sign up for ${selectedDate}`;
  form.style.display = 'block';
  nameInput.focus();
}

function submitForm() {
  const name = nameInput.value.trim();
  if (!name) return alert("Please enter your name");
  const dayNum = selectedDate.split(" ")[1].replace(",", "");
  signUps[dayNum] = name;
  document.getElementById(`name-${dayNum}`).textContent = name;
  nameInput.value = '';
  form.style.display = 'none';
}
